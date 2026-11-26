# Padrão ArgoCD — cluster OCI ARM64 compartilhado

Um único ArgoCD (namespace `argocd`) atende os 6 repositórios do cluster. Cada repositório tem o seu `gitops/apps/app-of-apps.yaml`, que cria o(s) **AppProject(s)** e as **Applications** dele. Este documento é **idêntico nos 6 repositórios** — ao mudar o padrão, copie-o para todos.

| Repositório | Pasta local | App-of-apps | AppProject(s) |
|---|---|---|---|
| `AdailSilva/k8s-arm-oci-always-free_standart` | `01.…Adail Silva (Standart)` | `adailsilva-app-of-apps` | `00-plataforma`, `01-adailsilva` |
| `AdailSilva/k8s-arm-oci-always-free_chirpstack` | `02.…ChirpStack` | `chirpstack-app-of-apps` | `02-chirpstack` |
| `AdailSilva/k8s-arm-oci-always-free_cslab` | `03.…CSLab` | `cslab-app-of-apps` | `03-cslab` |
| `AdailSilva/k8s-arm-oci-always-free_3tsensors` | `04.…3T Sensors` | `3tsensors-app-of-apps` | `04-3tsensors` |
| `AdailSilva/k8s-arm-oci-always-free_asesolucoes` | `05.…ASE Soluções` | `asesolucoes-app-of-apps` | `05-asesolucoes` |
| `AdailSilva/k8s-arm-oci-always-free_pfgrafica` | `06.…PF Gráfica` | `pfgrafica-app-of-apps` | `06-pfgrafica` |

## 1. Nome das Applications

```
<projeto>-<sistema>-<componente>
```

| Parte | O que é | Valores em uso |
|---|---|---|
| `projeto` | Prefixo do repositório (igual ao das imagens, namespaces e tags Git) | `plataforma`, `adailsilva`, `chirpstack`, `cslab`, `3tsensors`, `asesolucoes`, `pfgrafica` |
| `sistema` | Pasta do sistema **sem** o número e sem o prefixo (`07.cslab_web` → `web`, `04.homepage` → `site`) | `site`, `web`, `cardscontrol`, `backoffice`, `manager`, `v3`, `v4`, `vibratrack`, `rastrel`, `gestao` |
| `componente` | Peça do sistema | `frontend`, `backend`, `postgresql`, `mosquitto`, `meshcentral`, `stack` |

Regras:

- Só minúsculas, números e `-`. Sem número de pasta no nome (a ordem vem do AppProject).
- O nome é o do Deployment sem `api-`/`app-` e sem `-deployment`: `api-minhaempresa-web-backend-deployment` → `minhaempresa-web-backend`. A tag Git (`api-minhaempresa-web-backend-X.Y`), a imagem e a tela de Releases (nos sistemas que a têm) usam o mesmo radical.
- `stack` = sistema de terceiros inteiro numa Application só (ChirpStack v3/v4).
- Raiz de cada repositório: `<projeto>-app-of-apps`.
- Plataforma (o próprio cluster não tem `sistema`): `plataforma-<componente>`.
- Arquivo em `gitops/apps/`: `<nome-da-application>.yaml`; AppProject: `appproject-<NN>-<projeto>.yaml`.

## 2. AppProjects

O nome do AppProject começa pelo número do repositório, então a lista de projetos da UI do ArgoCD fica na ordem `00 → 06`. Cada AppProject só aceita o **seu** repositório como origem e os **seus** namespaces como destino — uma Application de um repositório não consegue implantar no namespace de outro.

| AppProject | Repositório | Destinos permitidos | Recursos de cluster | Janela de sync |
|---|---|---|---|---|
| `00-plataforma` | `k8s-arm-oci-always-free_standart` | `kube-system`, `oci-devops`, `portainer` | Namespace, ClusterRole, ClusterRoleBinding, APIService | — |
| `01-adailsilva` | `k8s-arm-oci-always-free_standart` | `adailsilva-*`, `argocd` | Namespace | — |
| `02-chirpstack` | `k8s-arm-oci-always-free_chirpstack` | `chirpstack-*`, `argocd` | Namespace | `deny` permanente para `*-postgresql` e `*-mosquitto` |
| `03-cslab` | `k8s-arm-oci-always-free_cslab` | `cslab-*`, `argocd` | Namespace | `deny` permanente para `*-postgresql` e `*-mosquitto` |
| `04-3tsensors` | `k8s-arm-oci-always-free_3tsensors` | `3tsensors-*`, `argocd` | Namespace | `deny` permanente para `*-postgresql` e `*-mosquitto` |
| `05-asesolucoes` | `k8s-arm-oci-always-free_asesolucoes` | `asesolucoes-*`, `argocd` | Namespace | `deny` permanente para `*-postgresql` e `*-mosquitto` |
| `06-pfgrafica` | `k8s-arm-oci-always-free_pfgrafica` | `pfgrafica-*`, `argocd` | Namespace | `deny` permanente para `*-postgresql` (sistema sem broker MQTT) |

`argocd` aparece nos destinos porque o app-of-apps (que pertence ao AppProject do repositório) cria objetos `Application`/`AppProject` nesse namespace. O `00-plataforma` é criado pelo app-of-apps do repositório 01.

## 3. Modos de implantação (label `adailsilva.com.br/implantacao`)

| Label | Componentes | Quem aplica | Sync | Finalizer | Observação |
|---|---|---|---|---|---|
| `argocd` | `frontend`, `backend`, `site`, `meshcentral` | ArgoCD | automático, `selfHeal`, `prune: false` | sim | O pipeline publica a imagem e grava o `newTag` da `kustomization.yaml`. Rollback = trocar o `newTag` (ROLLBACK.md). |
| `argocd` | `plataforma-*` | ArgoCD | automático, `selfHeal`, `prune: false` | **não** | Apagar a Application não remove o metrics-server nem o health check. |
| `pipeline` | `postgresql`, `mosquitto` | Pipeline | **bloqueado** (janela `deny`) | **não** | O pipeline faz CHECKPOINT, espera o Postgres ficar estável e só então roda o Job de migração; o ArgoCD mostra estado, saúde e diff. |
| `manual` | `stack` | Você (botão **Sync** ou scripts de `00.UsefulScripts`) | manual | **não** | PV/PVC/StorageClass, Namespace, cert-manager e ClusterIssuer ficam de fora. |

Todas usam `targetRevision: master`, `ApplyOutOfSyncOnly=true`, `CreateNamespace=true` e `revisionHistoryLimit: 20`. As de modo `pipeline`/`manual` ignoram a anotação `kubectl.kubernetes.io/restartedAt` (gravada por `kubectl rollout restart`) e as de `pipeline` usam `ServerSideApply=true`, como o `kubectl apply --server-side` do pipeline.

## 4. Labels e anotações

| Chave | Exemplo | Uso |
|---|---|---|
| `adailsilva.com.br/repositorio` | `k8s-arm-oci-always-free_cslab` | Filtrar por repositório |
| `adailsilva.com.br/projeto` | `cslab` | Prefixo do nome |
| `adailsilva.com.br/sistema` | `web` | Todas as peças de um sistema |
| `adailsilva.com.br/componente` | `backend` | Todos os backends, todos os bancos… |
| `adailsilva.com.br/implantacao` | `argocd` / `pipeline` / `manual` | Quem aplica (seção 3) |
| `link.argocd.argoproj.io/external-link` | `https://api-cslab-web.adailsilva.com.br` | Botão de link na UI |
| `spec.info` (Pasta, Implantação) | — | Aparece no painel *Summary* da Application |

```bash
kubectl -n argocd get applications -l adailsilva.com.br/sistema=web,adailsilva.com.br/projeto=cslab
kubectl -n argocd get applications -l adailsilva.com.br/componente=postgresql
argocd app list -p 03-cslab
argocd app list -l adailsilva.com.br/implantacao=argocd
```

Na UI: filtro **Projects** (00 → 06) e filtro **Labels** com as chaves acima.

## 5. Catálogo (48 Applications + 6 app-of-apps)

### `00-plataforma` — `k8s-arm-oci-always-free_standart`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `plataforma-metrics-server` | `01.metrics_server/kubernetes` | `kube-system` | ArgoCD (auto) |
| `plataforma-udp-health-check` | `02.udp_health_check-nlb_oci/kubernetes` | `oci-devops` | ArgoCD (auto) |
| `plataforma-portainer` | `03.portainer_ce/kubernetes` | `portainer` | ArgoCD (auto) · base (Namespace, PV/PVC) pelo pipeline |

### `01-adailsilva` — `k8s-arm-oci-always-free_standart`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `adailsilva-site-frontend` | `04.homepage/app_adailsilva_site_frontend/kubernetes` | `adailsilva-site` | ArgoCD (auto) |
| `adailsilva-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

### `02-chirpstack` — `k8s-arm-oci-always-free_chirpstack`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `chirpstack-site-frontend` | `04.homepage/app_chirpstack_site_frontend/kubernetes` | `chirpstack-site` | ArgoCD (auto) |
| `chirpstack-v3-stack` | `05.chirpstack_v3/kubernetes` | `chirpstack-v3` | Manual (Sync) |
| `chirpstack-v4-stack` | `06.chirpstack_v4/kubernetes` | `chirpstack-v4` | Manual (Sync) |
| `chirpstack-manager-backend` | `07.chirpstack_manager/api_chirpstack_manager_backend/kubernetes` | `chirpstack-manager` | ArgoCD (auto) |
| `chirpstack-manager-frontend` | `07.chirpstack_manager/app_chirpstack_manager_frontend/kubernetes` | `chirpstack-manager` | ArgoCD (auto) |
| `chirpstack-manager-postgresql` | `07.chirpstack_manager/api_chirpstack_manager_backend/kubernetes` | `chirpstack-manager` | Pipeline · ArgoCD monitora |
| `chirpstack-meshcentral` | `08.chirpstack_meshcentral/kubernetes` | `chirpstack-meshcentral` | ArgoCD (auto) |
| `chirpstack-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

### `03-cslab` — `k8s-arm-oci-always-free_cslab`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `cslab-site-frontend` | `04.homepage/app_cslab_site_frontend/kubernetes` | `cslab-site` | ArgoCD (auto) |
| `cslab-backoffice-backend` | `05.cslab_backoffice/api_cslab_backoffice_backend/kubernetes` | `cslab-backoffice` | ArgoCD (auto) |
| `cslab-backoffice-frontend` | `05.cslab_backoffice/app_cslab_backoffice_frontend/kubernetes` | `cslab-backoffice` | ArgoCD (auto) |
| `cslab-backoffice-postgresql` | `05.cslab_backoffice/api_cslab_backoffice_backend/kubernetes` | `cslab-backoffice` | Pipeline · ArgoCD monitora |
| `cslab-cardscontrol-backend` | `06.cslab_cardscontrol/api_cslab_cardscontrol_backend/kubernetes` | `cslab-cardscontrol` | ArgoCD (auto) |
| `cslab-cardscontrol-frontend` | `06.cslab_cardscontrol/app_cslab_cardscontrol_frontend/kubernetes` | `cslab-cardscontrol` | ArgoCD (auto) |
| `cslab-cardscontrol-postgresql` | `06.cslab_cardscontrol/api_cslab_cardscontrol_backend/kubernetes` | `cslab-cardscontrol` | Pipeline · ArgoCD monitora |
| `cslab-web-backend` | `07.cslab_web/api_cslab_web_backend/kubernetes` | `cslab-web` | ArgoCD (auto) |
| `cslab-web-frontend` | `07.cslab_web/app_cslab_web_frontend/kubernetes` | `cslab-web` | ArgoCD (auto) |
| `cslab-web-postgresql` | `07.cslab_web/api_cslab_web_backend/kubernetes` | `cslab-web` | Pipeline · ArgoCD monitora |
| `cslab-meshcentral` | `08.cslab_meshcentral/kubernetes` | `cslab-meshcentral` | ArgoCD (auto) |
| `cslab-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

### `04-3tsensors` — `k8s-arm-oci-always-free_3tsensors`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `3tsensors-site-frontend` | `04.homepage/app_3tsensors_site_frontend/kubernetes` | `3tsensors-site` | ArgoCD (auto) |
| `3tsensors-backoffice-backend` | `05.3tsensors_backoffice/api_3tsensors_backoffice_backend/kubernetes` | `3tsensors-backoffice` | ArgoCD (auto) |
| `3tsensors-backoffice-frontend` | `05.3tsensors_backoffice/app_3tsensors_backoffice_frontend/kubernetes` | `3tsensors-backoffice` | ArgoCD (auto) |
| `3tsensors-backoffice-postgresql` | `05.3tsensors_backoffice/api_3tsensors_backoffice_backend/kubernetes` | `3tsensors-backoffice` | Pipeline · ArgoCD monitora |
| `3tsensors-vibratrack-backend` | `06.3tsensors_vibratrack/api_3tsensors_vibratrack_backend/kubernetes` | `3tsensors-vibratrack` | ArgoCD (auto) |
| `3tsensors-vibratrack-frontend` | `06.3tsensors_vibratrack/app_3tsensors_vibratrack_frontend/kubernetes` | `3tsensors-vibratrack` | ArgoCD (auto) |
| `3tsensors-vibratrack-postgresql` | `06.3tsensors_vibratrack/api_3tsensors_vibratrack_backend/kubernetes` | `3tsensors-vibratrack` | Pipeline · ArgoCD monitora |
| `3tsensors-vibratrack-mosquitto` | `06.3tsensors_vibratrack/api_3tsensors_vibratrack_backend/kubernetes` | `3tsensors-vibratrack` | Pipeline · ArgoCD monitora |
| `3tsensors-meshcentral` | `07.3tsensors_meshcentral/kubernetes` | `3tsensors-meshcentral` | ArgoCD (auto) |
| `3tsensors-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

### `05-asesolucoes` — `k8s-arm-oci-always-free_asesolucoes`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `asesolucoes-site-frontend` | `04.homepage/app_asesolucoes_site_frontend/kubernetes` | `asesolucoes-site` | ArgoCD (auto) |
| `asesolucoes-backoffice-backend` | `05.asesolucoes_backoffice/api_asesolucoes_backoffice_backend/kubernetes` | `asesolucoes-backoffice` | ArgoCD (auto) |
| `asesolucoes-backoffice-frontend` | `05.asesolucoes_backoffice/app_asesolucoes_backoffice_frontend/kubernetes` | `asesolucoes-backoffice` | ArgoCD (auto) |
| `asesolucoes-backoffice-postgresql` | `05.asesolucoes_backoffice/api_asesolucoes_backoffice_backend/kubernetes` | `asesolucoes-backoffice` | Pipeline · ArgoCD monitora |
| `asesolucoes-rastrel-backend` | `06.asesolucoes_rastrel/api_asesolucoes_rastrel_backend/kubernetes` | `asesolucoes-rastrel` | ArgoCD (auto) |
| `asesolucoes-rastrel-frontend` | `06.asesolucoes_rastrel/app_asesolucoes_rastrel_frontend/kubernetes` | `asesolucoes-rastrel` | ArgoCD (auto) |
| `asesolucoes-rastrel-postgresql` | `06.asesolucoes_rastrel/api_asesolucoes_rastrel_backend/kubernetes` | `asesolucoes-rastrel` | Pipeline · ArgoCD monitora |
| `asesolucoes-rastrel-mosquitto` | `06.asesolucoes_rastrel/api_asesolucoes_rastrel_backend/kubernetes` | `asesolucoes-rastrel` | Pipeline · ArgoCD monitora |
| `asesolucoes-meshcentral` | `07.asesolucoes_meshcentral/kubernetes` | `asesolucoes-meshcentral` | ArgoCD (auto) |
| `asesolucoes-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

### `06-pfgrafica` — `k8s-arm-oci-always-free_pfgrafica`

| Application | Pasta | Namespace | Implantação |
|---|---|---|---|
| `pfgrafica-site-frontend` | `04.homepage/app_pfgrafica_site_frontend/kubernetes` | `pfgrafica-site` | ArgoCD (auto) |
| `pfgrafica-backoffice-backend` | `05.pfgrafica_backoffice/api_pfgrafica_backoffice_backend/kubernetes` | `pfgrafica-backoffice` | ArgoCD (auto) |
| `pfgrafica-backoffice-frontend` | `05.pfgrafica_backoffice/app_pfgrafica_backoffice_frontend/kubernetes` | `pfgrafica-backoffice` | ArgoCD (auto) |
| `pfgrafica-backoffice-postgresql` | `05.pfgrafica_backoffice/api_pfgrafica_backoffice_backend/kubernetes` | `pfgrafica-backoffice` | Pipeline · ArgoCD monitora |
| `pfgrafica-gestao-backend` | `06.pfgrafica_gestao/api_pfgrafica_gestao_backend/kubernetes` | `pfgrafica-gestao` | ArgoCD (auto) |
| `pfgrafica-gestao-frontend` | `06.pfgrafica_gestao/app_pfgrafica_gestao_frontend/kubernetes` | `pfgrafica-gestao` | ArgoCD (auto) |
| `pfgrafica-gestao-postgresql` | `06.pfgrafica_gestao/api_pfgrafica_gestao_backend/kubernetes` | `pfgrafica-gestao` | Pipeline · ArgoCD monitora |
| `pfgrafica-meshcentral` | `07.pfgrafica_meshcentral/kubernetes` | `pfgrafica-meshcentral` | ArgoCD (auto) |
| `pfgrafica-app-of-apps` | `gitops/apps` | `argocd` | ArgoCD (auto, `prune: true`) |

## 6. O que fica fora do ArgoCD (de propósito)

| O quê | Quem mantém | Por quê |
|---|---|---|
| ingress-nginx, cert-manager, ClusterIssuers `letsencrypt-*`, kubernetes-dashboard, admin-user | Terraform (`k8s_scaffold/`) | Base do cluster: existe antes do ArgoCD |
| kubeadm, Flannel, CoreDNS, kube-proxy | Terraform (`k8s/`) + kubeadm | Idem |
| O próprio ArgoCD | `gitops/bootstrap/00-argocd-install.md` | Instalado uma vez por cluster |
| Namespace, Secrets, PV/PVC/StorageClass, Service, Ingress, Jobs de migração | Pipeline (passo de infraestrutura base) | Secrets não vão para o Git; PV/PVC e Jobs nunca devem ser recriados por sync |
| `*__cert-manager__*Components_Full.yaml` e `*ClusterIssuer.yaml` nas pastas dos sistemas | Referência (o scaffold já instalou) | Aplicar de novo por sistema duplicaria a instalação |
| `01.metrics_server/` e `02.udp_health_check-nlb_oci/` nos repositórios 02–06 | Cópia-modelo | Só o repositório 01 vincula ao ArgoCD — duas Applications sobre os mesmos objetos brigariam |

`bootstrap/09-auditar-cluster-argocd.sh` lista qualquer Deployment/StatefulSet/DaemonSet/CronJob fora dessa base que nenhuma Application vincula.

## 7. Sistema novo — checklist

1. Pastas `NN.<projeto>_<sistema>/api_<projeto>_<sistema>_backend` e `app_<projeto>_<sistema>_frontend`, namespace `<projeto>-<sistema>`.
2. `kubernetes/kustomization.yaml` com **só** o Deployment (e, no backend, o RBAC de backup).
3. `gitops/apps/<projeto>-<sistema>-backend.yaml` e `-frontend.yaml` (copie uma existente do mesmo modo; troque nome, labels, `info`, `path`, namespace e link).
4. Banco/broker: `gitops/apps/<projeto>-<sistema>-postgresql.yaml` / `-mosquitto.yaml` (modo `pipeline`, `directory.include` com ConfigMap + Deployment + Service).
5. Acrescente os arquivos no `include` do `app-of-apps.yaml` e, no `00-argocd-install.md`, na lista esperada; no `01-aplicar-padrao-argocd.sh`, em `ESPERADAS` (e `ADOTAR` para banco/broker/stack).
6. Namespace novo fora de `<projeto>-*`? Acrescente em `destinations` do AppProject.
7. Atualize o catálogo (seção 5) **nos 6 repositórios**. Commit + push; o app-of-apps cria a Application.
8. `bash gitops/bootstrap/09-auditar-cluster-argocd.sh` deve terminar em "Cluster no padrão".

## 8. Operação

**Sync pontual de um banco/broker** (raro — normalmente quem aplica é o pipeline). A janela `deny` é a de índice 0 do AppProject:

```bash
argocd proj windows list 03-cslab
argocd proj windows enable-manual-sync 03-cslab 0     # libera o botão Sync
argocd app sync cslab-web-postgresql
argocd proj windows disable-manual-sync 03-cslab 0    # bloqueia de novo
```

> Depois de um sync pelo ArgoCD, o `kubectl apply --server-side` do pipeline pode acusar conflito de *field manager* se o Git e o cluster divergirem; por isso o padrão é deixar o banco com o pipeline.

**Remover uma Application sem apagar o que ela implantou** (renomear, mover de repositório, limpar legado):

```bash
kubectl -n argocd patch application <nome> --type json -p '[{"op":"remove","path":"/metadata/finalizers"}]'
kubectl -n argocd delete application <nome>
```

As Applications de modo `argocd` (frontends/backends/sites) têm `resources-finalizer`: tirar o arquivo do `include` do app-of-apps (que tem `prune: true`) **apaga o Deployment**. Tire o finalizer antes, como acima.

**Rollback**: sempre pelo Git (`newTag`) ou pela tela de Releases do BackOffice — ver `ROLLBACK.md`.

## 9. Aplicar o padrão num repositório

1. Faça commit e **push** (o ArgoCD lê o GitHub).
2. `bash gitops/bootstrap/01-aplicar-padrao-argocd.sh` — aplica o(s) AppProject(s) e o app-of-apps, espera as Applications chegarem ao AppProject certo, adota os recursos já existentes de bancos/brokers/stacks (só a marca de rastreamento, sem tocar no spec) e roda a auditoria. Nos repositórios com BackOffice, também garante no RBAC da conta do BackOffice (tela de Releases) as linhas `<AppProject>/<projeto>-*` (`cslab-backoffice` → `03-cslab/cslab-*`, `3tsensors-backoffice` → `04-3tsensors/3tsensors-*`, `asesolucoes-backoffice` → `05-asesolucoes/asesolucoes-*`, `pfgrafica-backoffice` → `06-pfgrafica/pfgrafica-*`), quando a conta já existe (`gitops/bootstrap/02-argocd-conta-backoffice.md`).
3. Repita nos 6 repositórios (a ordem não importa; o 01 cria o `00-plataforma`).
4. No fim, `bash gitops/bootstrap/09-auditar-cluster-argocd.sh` de qualquer um deles.
