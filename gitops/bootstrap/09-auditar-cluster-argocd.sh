#!/usr/bin/env bash
# =============================================================================
# Auditoria do ArgoCD no cluster compartilhado (idêntico nos 6 repositórios)
#
#   bash gitops/bootstrap/09-auditar-cluster-argocd.sh
#
# Confere, no cluster INTEIRO (não só neste repositório):
#   1. Applications fora do padrão de nome  <projeto>-<sistema>-<componente>
#   2. Applications no AppProject errado (ou ainda no 'default')
#   3. Applications sem os labels adailsilva.com.br/*
#   4. Deployments/StatefulSets/DaemonSets/CronJobs que NENHUMA Application vincula
#      (fora da base do cluster mantida pelo Terraform: ingress-nginx, cert-manager,
#      kubernetes-dashboard, flannel, coredns, kube-proxy e o próprio ArgoCD)
#
# Só lê; não altera nada. Sai com código 1 se encontrar algum problema.
# Padrão completo: gitops/PADRAO-ARGOCD.md
# =============================================================================
set -uo pipefail

for c in kubectl jq; do
  command -v "$c" >/dev/null || { echo "ERRO: '$c' não encontrado no PATH."; exit 2; }
done
kubectl get namespace argocd >/dev/null 2>&1 || { echo "ERRO: namespace argocd não existe (ArgoCD não instalado?)."; exit 2; }

# prefixo do nome -> AppProject
declare -A PROJETO=(
  [plataforma]=00-plataforma
  [adailsilva]=01-adailsilva
  [chirpstack]=02-chirpstack
  [cslab]=03-cslab
  [3tsensors]=04-3tsensors
  [asesolucoes]=05-asesolucoes
  [pfgrafica]=06-pfgrafica
)
# Namespaces da base do cluster (Terraform k8s_scaffold / kubeadm / ArgoCD): fora da auditoria de workloads.
# (O Portainer É auditado: plataforma-portainer.)
NS_BASE='^(argocd|ingress-nginx|cert-manager|kubernetes-dashboard|kube-flannel|kube-public|kube-node-lease)$'
# Workloads do kube-system que são do kubeadm (o metrics-server É auditado: plataforma-metrics-server).
KS_BASE='^(coredns|kube-proxy)$'
RE_NOME='^[a-z0-9]+(-[a-z0-9]+)+$'

PROBLEMAS=0
erro() { echo "  ✗ $*"; PROBLEMAS=$((PROBLEMAS + 1)); }
tabela() { if command -v column >/dev/null; then column -t -s $'\t'; else tr '\t' ' '; fi; }

APPS_JSON=$(kubectl -n argocd get applications.argoproj.io -o json)

echo "=============================================================================="
echo " Applications no ArgoCD"
echo "=============================================================================="
echo "$APPS_JSON" | jq -r '
  ["PROJETO","APPLICATION","IMPLANTACAO","SYNC","SAUDE"],
  (.items | sort_by(.spec.project, .metadata.name)[] |
    [.spec.project, .metadata.name,
     (.metadata.labels["adailsilva.com.br/implantacao"] // "-"),
     (.status.sync.status // "-"), (.status.health.status // "-")])
  | @tsv' | tabela

echo
echo "=============================================================================="
echo " 1-3. Nome, AppProject e labels"
echo "=============================================================================="
while IFS=$'\t' read -r NOME PROJ L_PROJ L_SIS L_COMP; do
  PREFIXO=${NOME%%-*}
  if [[ ! $NOME =~ $RE_NOME ]]; then
    erro "$NOME: nome fora do padrão <projeto>-<sistema>-<componente> (minúsculas, números e '-')"
  fi
  ESPERADO=${PROJETO[$PREFIXO]:-}
  if [ -z "$ESPERADO" ]; then
    erro "$NOME: prefixo '$PREFIXO' desconhecido (válidos: ${!PROJETO[*]})"
  elif [ "$PROJ" != "$ESPERADO" ]; then
    erro "$NOME: está no AppProject '$PROJ' — o padrão é '$ESPERADO'"
  fi
  if [ "$L_PROJ" = "-" ] || [ "$L_SIS" = "-" ] || [ "$L_COMP" = "-" ]; then
    erro "$NOME: faltam labels adailsilva.com.br/{projeto,sistema,componente}"
  fi
done < <(echo "$APPS_JSON" | jq -r '.items[] | [.metadata.name, .spec.project,
           (.metadata.labels["adailsilva.com.br/projeto"] // "-"),
           (.metadata.labels["adailsilva.com.br/sistema"] // "-"),
           (.metadata.labels["adailsilva.com.br/componente"] // "-")] | @tsv')

# Applications antigas conhecidas (removidas dos repositórios, podem ter ficado no cluster)
LEGADAS=(homepage-frontend)
for LEGADO in "${LEGADAS[@]}"; do
  if echo "$APPS_JSON" | jq -e --arg n "$LEGADO" '.items[] | select(.metadata.name == $n)' >/dev/null; then
    erro "$LEGADO: Application legada. Remova SEM apagar recursos:"
    echo "      kubectl -n argocd patch application $LEGADO --type json -p '[{\"op\":\"remove\",\"path\":\"/metadata/finalizers\"}]'"
    echo "      kubectl -n argocd delete application $LEGADO"
  fi
done
[ "$PROBLEMAS" -eq 0 ] && echo "  ✓ todas as Applications seguem o padrão"

echo
echo "=============================================================================="
echo " 4. Workloads sem Application (sistemas não vinculados ao ArgoCD)"
echo "=============================================================================="
VINCULADOS=$(echo "$APPS_JSON" | jq -r '.items[].status.resources[]? |
  select(.kind == "Deployment" or .kind == "StatefulSet" or .kind == "DaemonSet" or .kind == "CronJob") |
  "\(.kind)/\(.namespace)/\(.name)"' | sort -u)
ANTES=$PROBLEMAS
while IFS=$'\t' read -r KIND NS NOME; do
  [[ $NS =~ $NS_BASE ]] && continue
  [[ $NS == kube-system && $NOME =~ $KS_BASE ]] && continue
  if ! grep -qxF "$KIND/$NS/$NOME" <<<"$VINCULADOS"; then
    erro "$KIND $NS/$NOME não pertence a nenhuma Application"
  fi
done < <(kubectl get deployments,statefulsets,daemonsets,cronjobs -A -o json \
          | jq -r '.items[] | select((.metadata.ownerReferences // []) | length == 0) |
                   [.kind, .metadata.namespace, .metadata.name] | @tsv')
[ "$PROBLEMAS" -eq "$ANTES" ] && echo "  ✓ todo workload fora da base do cluster tem Application"

echo
if [ "$PROBLEMAS" -gt 0 ]; then
  echo ">> $PROBLEMAS problema(s). Padrão e correções: gitops/PADRAO-ARGOCD.md"
  exit 1
fi
echo ">> Cluster no padrão."
