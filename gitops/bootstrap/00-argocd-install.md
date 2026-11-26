# ArgoCD — instalação (uma vez por cluster) e ligação deste repositório

Os 6 repositórios (Standart, ChirpStack, CSLab, 3T Sensors, ASE Soluções e PF Gráfica) rodam **no mesmo cluster**.
O ArgoCD é instalado **uma única vez** (passos 1 e 2, por qualquer um dos repositórios). Cada
repositório só acrescenta a **sua** credencial (passo 3) e o **seu** app-of-apps (passo 4), que cria
apenas as Applications dele — os nomes têm o prefixo do projeto (`adailsilva-*`) e não colidem com os dos outros repositórios. Cada repositório tem o seu AppProject (`00-plataforma`, `01-adailsilva` neste), conforme [../PADRAO-ARGOCD.md](../PADRAO-ARGOCD.md).

## 1. Instalar (só se o namespace `argocd` ainda não existir)

```bash
kubectl get namespace argocd || {
  kubectl create namespace argocd
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
  kubectl -n argocd rollout status deploy/argocd-server --timeout=300s
}
```

## 2. Senha inicial (admin)

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

Troque a senha no primeiro acesso.

## 3. Registro do repositório no ArgoCD (obrigatório, um por repositório)

O monorepo `k8s-arm-oci-always-free_standart` é **público**: o ArgoCD lê sem credencial. Mesmo assim, registre-o com um Secret de repositório — o `01-aplicar-padrao-argocd.sh` (passo 4) confere que ele existe. Bastam `type` e `url`; `username`/`password` só seriam necessários se o repositório voltasse a ser privado (nesse caso, use um Personal Access Token **fine-grained só de leitura**: *Resource owner* `AdailSilva`, *Only select repositories* → `k8s-arm-oci-always-free_standart`, *Contents: Read-only*).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: repo-adailsilva-monorepo
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  type: git
  url: https://github.com/AdailSilva/k8s-arm-oci-always-free_standart.git     # mesma URL usada nas Applications
  # Opcional (repositório público): só se ele voltar a ser privado.
  # username: AdailSilva
  # password: <SEU_GH_PAT>
```

```bash
kubectl apply -f esse-secret.yaml   # não versione este arquivo
```

## 4. Ligar este repositório (AppProject + App-of-Apps)

Com o `gitops/` já no GitHub (commit + push — o ArgoCD lê o `master`):

```bash
bash gitops/bootstrap/01-aplicar-padrao-argocd.sh
```

O script é idempotente: aplica o(s) AppProject(s) e o app-of-apps, espera cada Application chegar ao AppProject certo, adota os recursos já existentes de bancos/brokers/stacks (só a marca de rastreamento, sem reiniciar nada) e roda a auditoria do cluster. Equivalente manual:

```bash
kubectl apply -f gitops/apps/appproject-00-plataforma.yaml
kubectl apply -f gitops/apps/appproject-01-adailsilva.yaml
kubectl apply -f gitops/apps/app-of-apps.yaml
kubectl -n argocd get applications -l adailsilva.com.br/repositorio=k8s-arm-oci-always-free_standart
# adailsilva-app-of-apps, plataforma-metrics-server, plataforma-udp-health-check, plataforma-portainer, adailsilva-site-frontend
```

> Aplique **depois** do primeiro deploy de cada app pelo pipeline: as `kustomization.yaml` nascem com `newTag: "latest"` (ou com a última versão publicada), que o pipeline troca pela versão `X.Y`. Se aplicar antes, os pods podem ficar em `ImagePullBackOff` ou `Pending` (Secrets/PVC ainda inexistentes) até o primeiro build.

## 5. UI

```bash
kubectl -n argocd port-forward svc/argocd-server 8080:443   # → https://localhost:8080
```

Ou crie um Ingress para `argocd.<seu-domínio>` → Service `argocd-server` (443), com a anotação `nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"` (e o registro DNS correspondente).

## 6. Economia (opcional, cluster apertado)

```bash
kubectl -n argocd scale deploy argocd-dex-server --replicas=0
kubectl -n argocd scale deploy argocd-notifications-controller --replicas=0
```

## 7. Sem tela de Releases

Este repositório não tem tela de Releases: as versões são trocadas pelo pipeline ou por commit no `newTag` ([../ROLLBACK.md](../ROLLBACK.md)), sem conta adicional no ArgoCD.
