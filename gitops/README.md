# GitOps Adail Silva (Standart) (ArgoCD) — monorepo

Padrão do cluster — nomes, AppProjects, labels, modos de implantação e o catálogo dos 6 repositórios: **[PADRAO-ARGOCD.md](PADRAO-ARGOCD.md)**.

Todas as Applications deste repositório seguem `<projeto>-<sistema>-<componente>` e ficam no(s) AppProject(s) **`00-plataforma`** e **`01-adailsilva`**. Frontends, backends e site são **aplicados pelo ArgoCD**: o pipeline só grava o `newTag` da `kustomization.yaml` (voltar versão = trocar o `newTag`, ver [ROLLBACK.md](ROLLBACK.md)). 

Este repositório também vincula a **infraestrutura compartilhada do cluster** (AppProject `00-plataforma`): `plataforma-metrics-server`, `plataforma-udp-health-check` e `plataforma-portainer`. As cópias de `01.metrics_server/`, `02.udp_health_check-nlb_oci/` e `03.portainer_ce/` nos outros 5 repositórios são só modelo — mas os jobs `plataforma_metrics_server`, `plataforma_udp_health_check` e `plataforma_portainer` do `.github/workflows/main.yml` (idênticos nos 6) rodam em todos: veja [Jobs da plataforma](#jobs-da-plataforma-plataforma_-no-mainyml).

## Applications

| Application | AppProject | Pasta | Namespace | Implantação |
|---|---|---|---|---|
| `plataforma-metrics-server` | `00-plataforma` | `01.metrics_server/kubernetes` | `kube-system` | ArgoCD (automático, sem finalizer) |
| `plataforma-udp-health-check` | `00-plataforma` | `02.udp_health_check-nlb_oci/kubernetes` (kustomize) | `oci-devops` | ArgoCD (automático, sem finalizer) · newTag pelo `main.yml` (job `plataforma_udp_health_check`) |
| `plataforma-portainer` | `00-plataforma` | `03.portainer_ce/kubernetes` | `portainer` | ArgoCD (automático) · Namespace e StorageClass/PV/PVC pelo `main.yml` (job `plataforma_portainer`) |
| `adailsilva-site-frontend` | `01-adailsilva` | `04.homepage/app_adailsilva_site_frontend/kubernetes` | `adailsilva-site` | ArgoCD (automático) |
| `adailsilva-app-of-apps` | `01-adailsilva` | `gitops/apps` | `argocd` | Raiz: cria o(s) AppProject(s) e as Applications acima |

## Layout (dentro do próprio monorepo)

| Caminho | Conteúdo |
|---|---|
| `gitops/apps/appproject-00-plataforma.yaml` | AppProject `00-plataforma` (origem: só este repositório; destinos: `kube-system`, `oci-devops`, `portainer`) |
| `gitops/apps/appproject-01-adailsilva.yaml` | AppProject `01-adailsilva` (origem: só este repositório; destinos: `adailsilva-*`) |
| `gitops/apps/app-of-apps.yaml` | Raiz `adailsilva-app-of-apps` (o `include` lista todos os arquivos acima e abaixo) |
| `gitops/apps/<application>.yaml` | Uma Application por arquivo, com o mesmo nome |
| `gitops/bootstrap/00-argocd-install.md` | Instalação do ArgoCD (uma vez por cluster) e credencial deste repositório |
| `gitops/bootstrap/01-aplicar-padrao-argocd.sh` | Aplica AppProject + app-of-apps e adota os recursos já existentes (idempotente) |
| `gitops/bootstrap/09-auditar-cluster-argocd.sh` | Audita o cluster inteiro: nomes, AppProjects, labels e workloads sem Application |
| `gitops/PADRAO-ARGOCD.md` | Padrão e catálogo (idêntico nos 6 repositórios) |

Cada `kustomization.yaml` referencia **só o Deployment** daquele app (nos backends, também o RBAC de backup, quando existe). As Applications de banco, broker e stack usam `directory.include` com a lista exata de manifestos: PV/PVC/StorageClass, Namespace, Secrets do pipeline, Jobs de migração, cert-manager e ClusterIssuer ficam de fora. Service e Ingress dos frontends/backends continuam com o pipeline.

## Colocar de pé

1. Rode o pipeline ao menos uma vez por app (`./force_deploy.sh` ou `workflow_dispatch`): ele publica a imagem `X.Y`, grava o `newTag` e aplica a infraestrutura base (Namespace, Secrets, banco, Service, Ingress).
2. ArgoCD e credencial do repositório: [bootstrap/00-argocd-install.md](bootstrap/00-argocd-install.md) (passos 1 a 3).
3. Commit + push de `gitops/` e `bash gitops/bootstrap/01-aplicar-padrao-argocd.sh`.
4. Conferir o cluster inteiro: `bash gitops/bootstrap/09-auditar-cluster-argocd.sh`.

## O que o `main.yml` faz

Workflow **único** do repositório: um job `detect` (limpeza de disco do runner, papel dono × cópia e `dorny/paths-filter`) e **um job por aplicação** — `app_adailsilva_site_frontend`, `metrics_server` e `udp_health_check`. Só roda o job da aplicação alterada; no `workflow_dispatch` o `target` escolhe: `todos`, `app-adailsilva-site-frontend`, `plataforma`, `metrics-server` ou `udp-health-check`.

Jobs dos sistemas (site):

- Build com `--provenance=false --sbom=false`, tags `X.Y` e `latest` (tag Git `<componente>-X.Y`).
- Garante o repositório no OCIR (cria se faltar; depois traga-o para o state com `./sync_terraform_state.sh importar`).
- Aplica a infraestrutura base (Namespace, Service, Ingress e, quando houver, ConfigMap/PostgreSQL/PVC) e o `oci-registry-secret`.
- Em vez de `kubectl apply`/`rollout restart` do Deployment, o passo **"Fixar versão no GitOps"** troca o `newTag` num worktree criado a partir de `origin/master`, comita `deploy: <componente> <versão> [skip ci]` e faz push (até 5 tentativas, espera aleatória). O ArgoCD sincroniza.
- Congelar um app: acrescente na `kustomization.yaml` a linha `# adailsilva-release-congelado: <motivo>` — a imagem é publicada, mas o `newTag` não muda.
- `concurrency` com `cancel-in-progress: false`: duas execuções não disputam o mesmo push. Cada deploy avança o `origin/master`; faça `git pull --rebase` antes do próximo push (o `force_deploy.sh` já faz).

## Jobs da plataforma (`plataforma_*` no `main.yml`)

Jobs **idênticos nos 6 repositórios** (`plataforma_metrics_server`, `plataforma_udp_health_check` e `plataforma_portainer`, dentro do `.github/workflows/main.yml`) para a infraestrutura compartilhada do cluster. Ordem de deploy no `main.yml`: **detect → aprovação (environment `producao`) → metrics-server (01), UDP health check (02), Portainer CE (03) e site (04) em paralelo → demais sistemas**; etapa sem alteração fica *skipped* e libera a seguinte, etapa que falha bloqueia as seguintes. Disparam por alteração em `01.metrics_server/kubernetes/**`, `02.udp_health_check-nlb_oci/{Dockerfile,UdpHealthCheckServer.java,kubernetes/**}`, `.force-deploy` dessas pastas ou `gitops/apps/plataforma-*.yaml`; também pelo Run workflow do `main.yml` (`target`: `metrics-server`, `udp-health-check`, `portainer`, `plataforma` ou `todos`/`ambos`) ou `./force_deploy.sh udp`.

**Todo deploy passa pelo ArgoCD**: o pipeline nunca aplica o metrics-server nem os DaemonSets com `kubectl`. Ele pede *refresh* da Application, espera `Synced + Healthy` e, se depois de ~60 s ela continuar `OutOfSync` sem operação em andamento, solicita o Sync (igual ao botão **Sync**). Sem a Application no cluster o job falha e aponta o bootstrap. O pipeline só cria o que não vai para o Git: `oci-registry-secret` em `oci-devops` (e o namespace, se faltar).

| | Repositório 01 (dono) | Repositórios 02 a 06 (cópias) |
|---|---|---|
| metrics-server | dry-run=server → Sync no ArgoCD do commit da execução → rollout, APIService `Available`, `kubectl top nodes` | dry-run=server → Sync/espera no ArgoCD → mesma verificação |
| UDP health check | build ARM64 das imagens 1700 e 1710 (`--build-arg UDP_PORT`, tags `X.Y` + `latest`, tag Git `udp-health-check-server-X.Y`) → `newTag` na `kustomization.yaml` (`deploy: udp-health-check-server X.Y [skip ci]`) → ArgoCD faz o rollout | sem build e sem `newTag` → Sync/espera no ArgoCD |
| Verificação UDP | 1 pod por worker em cada DaemonSet (3 workers → 3 na 1700 + 3 na 1710) e `PING`→`PONG` em cada pod (`kubectl exec`, 127.0.0.1); `PONG` do runner para o IP de cada nó é só aviso (depende da security list) | igual |

- Congelar o rollout do UDP: linha `# plataforma-release-congelado: <motivo>` na `02.udp_health_check-nlb_oci/kubernetes/kustomization.yaml` (a imagem é publicada, o `newTag` não muda).
- Rollback do UDP: trocar o `newTag` das duas imagens na mesma `kustomization.yaml` (as duas portas usam sempre a mesma versão).
- Requisito: o `KUBECONFIG` do pipeline precisa de `patch` em `applications.argoproj.io` no namespace `argocd` (sem ele o pipeline só espera o polling do ArgoCD, até 3 min) e de `pods/exec` em `oci-devops`.
