#!/usr/bin/env bash
# =============================================================================
# Aplica o padrão ArgoCD deste repositório no cluster (idempotente)
#
#   git push                                              # o ArgoCD lê do GitHub (master)
#   bash gitops/bootstrap/01-aplicar-padrao-argocd.sh
#
# O que faz:
#   1. Aplica o(s) AppProject(s) deste repositório: 00-plataforma 01-adailsilva
#   2. (este repositório não tem conta extra no RBAC do ArgoCD)
#   3. Aplica o app-of-apps (adailsilva-app-of-apps), que move as Applications existentes para o
#      AppProject e cria as que faltavam. NENHUMA Application é recriada (mesmo nome) e
#      nenhum pod reinicia: muda só spec.project, labels e anotações.
#   4. "Adota" os recursos JÁ EXISTENTES das Applications de dados/stack (sem sync automático):
#      grava só a marca de rastreamento do ArgoCD (anotação tracking-id e/ou label instance)
#      nos objetos vivos. Não altera spec — Postgres, Mosquitto e stacks não reiniciam.
#   5. Mostra o resultado e roda a auditoria do cluster.
#
# Padrão completo: gitops/PADRAO-ARGOCD.md
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")/../.."

REPO_URL=https://github.com/AdailSilva/k8s-arm-oci-always-free_standart.git
PROJETOS=(00-plataforma 01-adailsilva)
ROOT=adailsilva-app-of-apps
ESPERADAS=(
  adailsilva-app-of-apps=01-adailsilva
  plataforma-metrics-server=00-plataforma
  plataforma-udp-health-check=00-plataforma
  plataforma-portainer=00-plataforma
  adailsilva-site-frontend=01-adailsilva
)
ADOTAR=()

for c in kubectl jq; do
  command -v "$c" >/dev/null || { echo "ERRO: '$c' não encontrado no PATH."; exit 2; }
done
kubectl get namespace argocd >/dev/null 2>&1 || {
  echo "ERRO: ArgoCD não instalado. Siga gitops/bootstrap/00-argocd-install.md (passos 1 a 3)."; exit 2; }

# --- credencial do repositório (passo 3 do 00-argocd-install.md) -------------
if ! kubectl -n argocd get secret -l argocd.argoproj.io/secret-type=repository -o json \
     | jq -e --arg u "$REPO_URL" '.items[] | select((.data.url // "" | @base64d) == $u)' >/dev/null; then
  echo "ERRO: não há Secret de repositório para $REPO_URL no namespace argocd."
  echo "      Crie-o antes (gitops/bootstrap/00-argocd-install.md, passo 3)."
  exit 2
fi

# --- aviso de push ------------------------------------------------------------
if git rev-parse --git-dir >/dev/null 2>&1; then
  git fetch -q origin master 2>/dev/null || true
  if ! git diff --quiet origin/master -- gitops/ 2>/dev/null; then
    echo "AVISO: gitops/ local difere de origin/master. O ArgoCD lê o GitHub:"
    echo "       faça commit + push antes, senão o app-of-apps volta ao estado antigo."
    read -r -p "Continuar mesmo assim? [s/N] " R; [[ ${R,,} == s* ]] || exit 1
  fi
fi

echo ">> 1. AppProjects: ${PROJETOS[*]}"
for P in "${PROJETOS[@]}"; do
  kubectl apply -f "gitops/apps/appproject-$P.yaml"
done

echo ">> 3. App-of-apps: $ROOT"
kubectl apply -f gitops/apps/app-of-apps.yaml
kubectl -n argocd annotate application "$ROOT" argocd.argoproj.io/refresh=hard --overwrite >/dev/null

echo ">> Aguardando as ${#ESPERADAS[@]} Applications no AppProject certo (até 5 min)..."
FIM=$((SECONDS + 300))
while :; do
  FALTAM=()
  for E in "${ESPERADAS[@]}"; do
    NOME=${E%%=*}; PROJ=${E#*=}
    ATUAL=$(kubectl -n argocd get application "$NOME" -o jsonpath='{.spec.project}' 2>/dev/null || true)
    [ "$ATUAL" = "$PROJ" ] || FALTAM+=("$NOME")
  done
  [ ${#FALTAM[@]} -eq 0 ] && break
  if [ $SECONDS -ge $FIM ]; then
    echo "ERRO: ainda fora do padrão: ${FALTAM[*]}"
    kubectl -n argocd get application "$ROOT" -o jsonpath='{range .status.conditions[*]}{.type}: {.message}{"\n"}{end}' || true
    exit 1
  fi
  sleep 5
done
echo "   ok"

# --- 4. adoção dos recursos existentes (dados/stack) ---------------------------
if [ ${#ADOTAR[@]} -gt 0 ]; then
  METODO=$(kubectl -n argocd get configmap argocd-cm -o jsonpath='{.data.application\.resourceTrackingMethod}' 2>/dev/null || true)
  if [ -z "$METODO" ]; then
    VER=$(kubectl -n argocd get deploy argocd-server -o jsonpath='{.spec.template.spec.containers[0].image}' | sed -E 's/.*:v?([0-9]+).*/\1/')
    if [[ $VER =~ ^[0-9]+$ ]] && [ "$VER" -ge 3 ]; then METODO=annotation; else METODO=label; fi
  fi
  CHAVE_LABEL=$(kubectl -n argocd get configmap argocd-cm -o jsonpath='{.data.application\.instanceLabelKey}' 2>/dev/null || true)
  CHAVE_LABEL=${CHAVE_LABEL:-app.kubernetes.io/instance}
  echo ">> 4. Adoção sem sync (rastreamento do ArgoCD: $METODO)"

  for APP in "${ADOTAR[@]}"; do
    kubectl -n argocd annotate application "$APP" argocd.argoproj.io/refresh=normal --overwrite >/dev/null
    RES=""
    for _ in $(seq 1 24); do
      RES=$(kubectl -n argocd get application "$APP" -o json | jq -r '.status.resources[]? | [(.group // ""), .kind, (.namespace // ""), .name] | join("|")')
      [ -n "$RES" ] && break
      sleep 5
    done
    if [ -z "$RES" ]; then echo "   $APP: sem recursos no status (repo-server não renderizou?) — pulando"; continue; fi
    N=0; AUS=0
    # '|' e nao TAB: o grupo do core ("") e vazio e o read juntaria TABs seguidos.
    while IFS='|' read -r GRUPO KIND NS NOME; do
      TIPO=${KIND,,}${GRUPO:+.$GRUPO}
      ARGS=(-n "$NS"); [ -z "$NS" ] && ARGS=()
      if ! kubectl get "$TIPO" "$NOME" "${ARGS[@]}" >/dev/null 2>&1; then AUS=$((AUS + 1)); continue; fi
      if [[ $METODO == annotation* ]]; then
        kubectl annotate "$TIPO" "$NOME" "${ARGS[@]}" --overwrite \
          "argocd.argoproj.io/tracking-id=$APP:$GRUPO/$KIND:$NS/$NOME" >/dev/null
      fi
      if [[ $METODO == label || $METODO == *+label ]]; then
        kubectl label "$TIPO" "$NOME" "${ARGS[@]}" --overwrite "$CHAVE_LABEL=$APP" >/dev/null
      fi
      N=$((N + 1))
    done <<<"$RES"
    echo "   $APP: $N recurso(s) adotado(s)$([ $AUS -gt 0 ] && echo ", $AUS ainda não existe(m) no cluster")"
    kubectl -n argocd annotate application "$APP" argocd.argoproj.io/refresh=normal --overwrite >/dev/null
  done
fi

echo
echo ">> Applications deste repositório:"
sleep 5
kubectl -n argocd get applications -l "adailsilva.com.br/repositorio=k8s-arm-oci-always-free_standart" \
  -o custom-columns='PROJETO:.spec.project,APPLICATION:.metadata.name,IMPLANTACAO:.metadata.labels.adailsilva\.com\.br/implantacao,SYNC:.status.sync.status,SAUDE:.status.health.status' \
  --sort-by=.metadata.name

echo
echo ">> Auditoria do cluster (todos os repositórios):"
bash gitops/bootstrap/09-auditar-cluster-argocd.sh || true
