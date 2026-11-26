# ☸️ Kubernetes on ARM — OCI Always Free · Adail Silva

> Implantação **totalmente automatizada** de um cluster Kubernetes em arquitetura **ARM (AArch64)** na Oracle Cloud Infrastructure, utilizando exclusivamente os recursos **Always Free** — sem nenhum custo.
> A infraestrutura é provisionada como código via **Terraform** / **OpenTofu**, e as aplicações são gerenciadas com manifests Kubernetes organizados por módulo.
> Repositório **`AdailSilva/k8s-arm-oci-always-free_standart`** (pasta local `01.k8s-on-arm-oci-always-free_standart`) — a **base** do cluster compartilhado pelos 6 repositórios (ver [Padrão dos Repositórios](#padrão-dos-repositórios)) e o **site institucional `k8s.adailsilva.com.br`** (*Da Sua Ideia ao Kubernetes*). Identidade visual em [`brand/BRAND.md`](brand/BRAND.md).

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Módulos de Infraestrutura](#módulos-de-infraestrutura)
- [Aplicações Padrão do Cluster](#aplicações-padrão-do-cluster)
  - [01. Metrics Server](#01-metrics-server)
  - [02. UDP Health Check — NLB OCI](#02-udp-health-check--nlb-oci)
  - [03. Portainer CE](#03-portainer-ce)
  - [04. Site Adail Silva (Angular + nginx)](#04-site-adail-silva-angular--nginx)
- [Sistemas Adail Silva](#sistemas-adail-silva)
- [Pré-requisitos](#pré-requisitos)
- [Recursos Always Free Utilizados](#recursos-always-free-utilizados)
- [Tecnologias e Componentes](#tecnologias-e-componentes)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Padrão dos Repositórios](#padrão-dos-repositórios)
  - [Estrutura comum](#estrutura-comum)
  - [Convenções de nomes](#convenções-de-nomes)
  - [Terraform compartilhado entre repositórios](#terraform-compartilhado-entre-repositórios)
  - [Checklist para um sistema novo](#checklist-para-um-sistema-novo)
- [Configuração de DNS — Subdomínios Obrigatórios](#configuração-de-dns--subdomínios-obrigatórios)
  - [Por que o registro DNS é obrigatório](#por-que-o-registro-dns-é-obrigatório)
  - [Quando cadastrar os subdomínios](#quando-cadastrar-os-subdomínios)
  - [Subdomínios necessários neste projeto](#subdomínios-necessários-neste-projeto)
  - [Como obter o IP do Load Balancer](#como-obter-o-ip-do-load-balancer)
  - [Exemplo prático — Registro `.com.br` (Registro.br)](#exemplo-prático--registro-combr-registrobr)
  - [Verificar a propagação do DNS](#verificar-a-propagação-do-dns)
  - [Outros provedores de DNS](#outros-provedores-de-dns)
  - [Atualizar os subdomínios nos manifestos antes do deploy](#atualizar-os-subdomínios-nos-manifestos-antes-do-deploy)
- [Configuração Inicial](#configuração-inicial)
- [Implantação da Infraestrutura](#implantação-da-infraestrutura)
- [Implantando as Aplicações Padrão](#implantando-as-aplicações-padrão)
- [GitOps com ArgoCD](#gitops-com-argocd)
- [Acesso ao Cluster](#acesso-ao-cluster)
- [CI/CD com GitHub Actions](#cicd-com-github-actions)
  - [Workflow main.yml](#workflow-mainyml)
  - [Versionamento por tags](#versionamento-por-tags)
  - [Forçar um deploy (force_deploy.sh)](#forçar-um-deploy-force_deploysh)
  - [Secrets do repositório GitHub](#secrets-do-repositório-github)
  - [Verificar a execução do pipeline](#verificar-a-execução-do-pipeline)
- [Self-Hosted Runner OCI ARM64](#self-hosted-runner-oci-arm64)
  - [Por que usar self-hosted runner](#por-que-usar-self-hosted-runner)
  - [Pré-requisitos do runner](#pré-requisitos-do-runner)
  - [0. Instalar o Docker no Ubuntu ARM64](#0-instalar-o-docker-no-ubuntu-arm64)
  - [0.7 Instalar o OCI CLI na instância](#07-instalar-o-oci-cli-na-instância)
  - [1. Gerar o token do runner no GitHub](#1-gerar-o-token-do-runner-no-github)
  - [2. Instalar o runner na instância OCI](#2-instalar-o-runner-na-instância-oci)
  - [3. Instalar como serviço systemd](#3-instalar-como-serviço-systemd)
  - [4. Atualizar o workflow do repositório](#4-atualizar-o-workflow-do-repositório)
  - [5. Dois runners por worker](#5-dois-runners-por-worker)
  - [6. Qual instância do cluster usar](#6-qual-instância-do-cluster-usar)
  - [7. Verificar o runner no GitHub](#7-verificar-o-runner-no-github)
- [OCI Container Registry](#oci-container-registry)
- [Destruindo a Infraestrutura](#destruindo-a-infraestrutura)
- [Troubleshooting](#troubleshooting)
  - [❌ `Out of capacity for shape VM.Standard.A1.Flex`](#-out-of-capacity-for-shape-vmstandarda1flex)
  - [❌ `NotAuthenticated` — Falha na autenticação OCI](#-notauthenticated--falha-na-autenticação-oci)
  - [❌ Nós em estado `NotReady`](#-nós-em-estado-notready)
  - [❌ Preflight errors no `kubeadm init` (NumCPU / Mem)](#-preflight-errors-no-kubeadm-init-numcpu--mem)
  - [❌ Let's Encrypt não emite certificado](#-lets-encrypt-não-emite-certificado)
  - [❌ Let's Encrypt — `429 rateLimited`: limite de 5 certificados por semana atingido](#-lets-encrypt--429-ratelimited-limite-de-5-certificados-por-semana-atingido)
  - [❌ Pods com `ImagePullBackOff` no namespace `oci-devops`](#-pods-com-imagepullbackoff-no-namespace-oci-devops)
  - [❌ NLB Overall Health: Critical — portas UDP 1700 ou 1710](#-nlb-overall-health-critical--portas-udp-1700-ou-1710)
  - [❌ Timeout de SSH durante o `tofu apply`](#-timeout-de-ssh-durante-o-tofu-apply)
  - [❌ GitHub Actions — `Input required and not supplied: token`](#-github-actions--input-required-and-not-supplied-token)
  - [❌ GitHub Actions — `refusing to allow a Personal Access Token to create or update workflow`](#-github-actions--refusing-to-allow-a-personal-access-token-to-create-or-update-workflow)
  - [❌ `409-NAMESPACE_CONFLICT` ao criar repositório no OCI Container Registry via Terraform](#-409-namespace_conflict-ao-criar-repositório-no-oci-container-registry-via-terraform)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão Geral

Este projeto provisiona um cluster Kubernetes completo e funcional na **Oracle Cloud Infrastructure (OCI)** sem nenhum custo, aproveitando o plano **Always Free** da Oracle — que inclui instâncias ARM Ampere A1 com até 4 OCPUs e 24 GB de RAM por conta.

A infraestrutura é composta por 1 nó Control Plane e 3 nós Worker em arquitetura **ARM (AArch64)**, gerenciada inteiramente como código via **Terraform** / **OpenTofu**, e inclui quatro aplicações de infraestrutura base que compõem o ambiente operacional mínimo do cluster:

- **Site Adail Silva** — `k8s.adailsilva.com.br` (Angular 21 + PrimeNG 21/Avalon 21 + NGINX), namespace `adailsilva-site`, deploy pelo pipeline + ArgoCD, TLS automático pelo cert-manager e Let's Encrypt
- **Metrics Server** — coleta de métricas de CPU e memória dos nós e pods, necessário para o Kubernetes Dashboard e para o `kubectl top`
- **UDP Health Check** — servidor UDP em Java que responde a requisições `PING/PONG`, necessário para liberar as verificações de saúde UDP no Network Load Balancer da OCI e manter o Overall Health `OK`
- **Portainer CE** — interface web de administração do cluster em `portainer.adailsilva.com.br`, namespace `portainer`

---

## Arquitetura

```
Internet
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│              IP Público Reservado (OCI)                      │
│                                                              │
│          Network Load Balancer (Always Free)                 │
│   ┌──────────────────────────────────────────────────────┐   │
│   │  TCP :22    → leader        (SSH)                    │   │
│   │  TCP :6443  → leader        (kubectl / API Server)   │   │
│   │  TCP :80    → workers       (NodePort 30080 - HTTP)  │   │
│   │  TCP :443   → workers       (NodePort 30443 - HTTPS) │   │
│   │  UDP :1700  → workers       (NodePort 30700 - LoRa)  │   │
│   │  UDP :1710  → workers       (NodePort 30710 - LoRa)  │   │
│   │  TCP :1888  → workers       (NodePort 30888 - MQTT)  │   │
│   │  TCP :8883  → workers       (NodePort 30883 - MQTTS) │   │
│   │  TCP :1883  → workers       (NodePort 31883 - MQTT)  │   │
│   │  TCP :1884  → workers       (NodePort 31884 - MQTT)  │   │
│   │  30xxx: ingress-nginx · 3188x: Mosquitto (NodePort)  │   │
│   │  Health check UDP 1700/1710: DaemonSet               │   │
│   │  udp-health-check (PING/PONG) em cada nó             │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   Virtual Cloud Network (VCN) — 10.0.0.0/16                 │
│   ┌──────────────────────────────────────────────────────┐   │
│   │  Subnet Pública — 10.0.0.0/24                       │   │
│   │                                                      │   │
│   │  ┌──────────────────────────────────────────────┐   │   │
│   │  │  leader (Control Plane)                      │   │   │
│   │  │  VM.Standard.A1.Flex · Ubuntu 24.04 ARM64    │   │   │
│   │  │  1 OCPU · 3 GB RAM · 50 GB Boot Volume       │   │   │
│   │  └──────────────────────────────────────────────┘   │   │
│   │                                                      │   │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│   │  │  worker-0  │  │  worker-1  │  │  worker-2  │    │   │
│   │  │  A1.Flex   │  │  A1.Flex   │  │  A1.Flex   │    │   │
│   │  │  1 OCPU    │  │  1 OCPU    │  │  1 OCPU    │    │   │
│   │  │  7 GB RAM  │  │  7 GB RAM  │  │  7 GB RAM  │    │   │
│   │  │  50 GB     │  │  50 GB     │  │  50 GB     │    │   │
│   │  └────────────┘  └────────────┘  └────────────┘    │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

Total ARM: 4 OCPUs + 24 GB RAM → exatamente no limite Always Free

Namespace adailsilva-site
└── Site (app-adailsilva-site-frontend-deployment) → k8s.seudominio.com.br/

Namespace oci-devops
├── UDP Health Check :1700 (DaemonSet)  → Health check UDP 1700 do NLB
└── UDP Health Check :1710 (DaemonSet)  → Health check UDP 1710 do NLB

Namespace kube-system
└── Metrics Server                      → kubectl top / Kubernetes Dashboard
```

> O acesso SSH aos workers é feito via **SSH jump** através do `leader`, que serve como bastion host. O Load Balancer roteia a porta 22 diretamente ao `leader`.

---

## Módulos de Infraestrutura

O código Terraform é organizado em módulos executados sequencialmente:

| Módulo | Diretório | Responsabilidade |
|---|---|---|
| `compartment` | `./compartment` | Cria o compartimento OCI `k8s-on-arm-oci-always-free` |
| `network` | `./network` | VCN, subnet pública, Security Lists, Load Balancer, IP reservado |
| `compute` | `./compute` | Instâncias ARM: 1 leader + 3 workers (Ubuntu 24.04 AArch64) |
| `k8s` | `./k8s` | Bootstrap via kubeadm, join dos workers, CNI Flannel, kubeconfig |
| `k8s_scaffold` | `./k8s_scaffold` | Apps de scaffolding: Ingress NGINX, cert-manager, Dashboard, LetsEncrypt |
| `oci-infra_ci_cd` | `./oci_artifacts_container_repository` | Repositórios ARM64 no OCI Container Registry |

---

## Aplicações Padrão do Cluster

Após a infraestrutura estar de pé, o site (`04.homepage/`, namespace **`adailsilva-site`**) é implantado pelo pipeline + ArgoCD; `01.metrics_server/`, `02.udp_health_check-nlb_oci/` e `03.portainer_ce/` são implantados pelo ArgoCD (Applications `plataforma-metrics-server` e `plataforma-udp-health-check`, AppProject `00-plataforma`) (namespaces `kube-system`, **`oci-devops`** e **`portainer`**).

### 01. Metrics Server

Instala o **Metrics Server** no cluster, habilitando a coleta de métricas de uso de CPU e memória de nós e pods. É um pré-requisito para o funcionamento pleno do **Kubernetes Dashboard** e do comando `kubectl top`.

> O Metrics Server é configurado com `--kubelet-insecure-tls` e `--kubelet-preferred-address-types=InternalIP` para funcionar corretamente com as instâncias ARM da OCI, onde os certificados do kubelet não possuem SAN validável externamente.

**Kubernetes resources (namespace `kube-system`):**

| Kind | Nome | Versão da imagem |
|---|---|---|
| `ServiceAccount` | `metrics-server` | — |
| `ClusterRole` | `system:aggregated-metrics-reader` + `metrics-server` | — |
| `ClusterRoleBinding` | `metrics-server` | — |
| `RoleBinding` | `metrics-server-auth-reader` | — |
| `Deployment` | `metrics-server` | `registry.k8s.io/metrics-server/metrics-server:v0.7.2` |
| `Service` | `metrics-server` | ClusterIP :443 |
| `APIService` | `v1beta1.metrics.k8s.io` | Registra a API de métricas no cluster |

**Deploy / Destroy:**
```bash
cd 01.metrics_server/00.UsefulScripts/

chmod +x 01.deploy_metrics_server_script.sh
bash 01.deploy_metrics_server_script.sh

# Para remover:
chmod +x 02.destroy_metrics_server_script.sh
bash 02.destroy_metrics_server_script.sh
```

**Verificar funcionamento:**
```bash
kubectl top nodes
kubectl top pods -A
```

---

### 02. UDP Health Check — NLB OCI

#### Por que este serviço é necessário

O **Network Load Balancer (NLB) da Oracle Cloud** monitora continuamente a saúde de cada listener configurado. Para cada porta — incluindo portas UDP — o NLB executa verificações de saúde periódicas nos backends (os nós workers). Enquanto essas verificações não passarem, o status do NLB fica em **`Overall Health: Critical`** no console da OCI, e o tráfego destinado àquelas portas não é roteado.

O problema com UDP é que, ao contrário do TCP, não há handshake — o NLB precisa que a aplicação escutando na porta responda ativamente a um pacote de verificação. Sem uma resposta, o backend é marcado como **unhealthy** e a porta permanece bloqueada, mantendo o Overall Health em estado crítico mesmo com o cluster e as outras portas TCP funcionando perfeitamente.

```
Estado sem o UDP Health Check:
┌─────────────────────────────────────────────┐
│  NLB Overall Health: ⚠️  CRITICAL            │
│                                             │
│  Listener TCP  :22   → ✅ Healthy           │
│  Listener TCP  :6443 → ✅ Healthy           │
│  Listener TCP  :80   → ✅ Healthy           │
│  Listener TCP  :443  → ✅ Healthy           │
│  Listener UDP  :1700 → ❌ Critical          │  ← sem resposta UDP
│  Listener UDP  :1710 → ❌ Critical          │  ← sem resposta UDP
└─────────────────────────────────────────────┘

Estado com o UDP Health Check implantado:
┌─────────────────────────────────────────────┐
│  NLB Overall Health: ✅ OK                  │
│                                             │
│  Listener TCP  :22   → ✅ Healthy           │
│  Listener TCP  :6443 → ✅ Healthy           │
│  Listener TCP  :80   → ✅ Healthy           │
│  Listener TCP  :443  → ✅ Healthy           │
│  Listener UDP  :1700 → ✅ Healthy           │  ← PONG recebido
│  Listener UDP  :1710 → ✅ Healthy           │  ← PONG recebido
└─────────────────────────────────────────────┘
```

> ⚠️ **O Overall Health do NLB só fica `OK` quando todos os listeners estão saudáveis.** Enquanto as portas UDP 1700 e 1710 estiverem sem resposta, o status permanece `Critical` — mesmo que todo o tráfego TCP esteja fluindo normalmente. Este serviço é, portanto, **obrigatório** para um ambiente operacional limpo na OCI.

#### Como funciona

O `UdpHealthCheckServer.java` é um servidor UDP minimalista em Java que:
1. Abre um socket UDP na porta configurada
2. Aguarda um pacote com a mensagem `PING`
3. Responde imediatamente com `PONG` ao remetente
4. Repete o ciclo indefinidamente

```
Ciclo de verificação do NLB (a cada ~10 segundos):

NLB OCI
 ├── Listener UDP :1700
 │     ├── Health Check → envia "PING" UDP para worker-0 :1700
 │     │                       └── UdpHealthCheckServer (hostNetwork: true)
 │     │                               └── recebe "PING" → responde "PONG"
 │     │                                       └── ✅ worker-0 marcado como Healthy
 │     ├── Health Check → envia "PING" UDP para worker-1 :1700
 │     │                       └── UdpHealthCheckServer (hostNetwork: true)
 │     │                               └── recebe "PING" → responde "PONG"
 │     │                                       └── ✅ worker-1 marcado como Healthy
 │     └── Health Check → envia "PING" UDP para worker-2 :1700
 │                             └── UdpHealthCheckServer (hostNetwork: true)
 │                                     └── recebe "PING" → responde "PONG"
 │                                             └── ✅ worker-2 marcado como Healthy
 │
 └── Listener UDP :1710
       ├── Health Check → envia "PING" UDP para worker-0 :1710  → ✅ Healthy
       ├── Health Check → envia "PING" UDP para worker-1 :1710  → ✅ Healthy
       └── Health Check → envia "PING" UDP para worker-2 :1710  → ✅ Healthy

Resultado: todos os 6 backends (3 workers × 2 portas) Healthy → Overall Health: ✅ OK
```

O uso de `hostNetwork: true` nos pods é intencional e essencial: faz com que o servidor UDP escute diretamente no IP da interface de rede do nó worker, tornando-o alcançável pelo NLB sem intermediação do kube-proxy — que não funciona com UDP da mesma forma que com TCP.

#### Kubernetes resources (namespace `oci-devops`)

| Kind | Nome | Porta | Réplicas / Escopo | Descrição |
|---|---|---|---|---|
| `DaemonSet` | `udp-app-with-healthcheck-1700-daemon-set` | UDP 1700 | Todos os workers | Garante presença em cada nó |
| `DaemonSet` | `udp-app-with-healthcheck-1710-daemon-set` | UDP 1710 | Todos os workers | Garante presença em cada nó |

#### Imagens no OCI Container Registry

```
gru.ocir.io/<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/udp-health-check-server-1700_platform_linux-arm64:latest
gru.ocir.io/<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/udp-health-check-server-1710_platform_linux-arm64:latest
```

#### Passo 1 — Build das imagens ARM64

Antes de implantar, as imagens precisam existir no OCI Container Registry.

```bash
# Habilitar suporte a ARM64 no Docker (apenas uma vez por máquina)
docker run --privileged --rm tonistiigi/binfmt --install all

# Autenticar no OCI Container Registry
docker login -u '<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/<seu_email>' \
             -p '<auth_token>' \
             gru.ocir.io

# Entrar na pasta da aplicação UDP
cd 02.udp_health_check-nlb_oci/

# Build e push — imagem para a porta 1700
docker buildx build \
  --platform linux/arm64 \
  -t gru.ocir.io/<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/udp-health-check-server-1700_platform_linux-arm64:latest \
  --no-cache --push .

# Build e push — imagem para a porta 1710
docker buildx build \
  --platform linux/arm64 \
  -t gru.ocir.io/<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/udp-health-check-server-1710_platform_linux-arm64:latest \
  --no-cache --push .
```

#### Passo 2 — Criar o Secret de acesso ao OCI Registry

O Kubernetes precisa de credenciais para fazer pull das imagens privadas do OCI Registry:

```bash
# Criar o namespace se ainda não existir
kubectl create namespace oci-devops --dry-run=client -o yaml | kubectl apply -f -

# Criar o Secret de autenticação no namespace oci-devops
kubectl create secret docker-registry oci-registry-secret \
  --docker-server=gru.ocir.io \
  --docker-username='<OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE>/<seu_email>' \
  --docker-password='<auth_token>' \
  --docker-email='<seu_email>' \
  -n oci-devops

# Confirmar a criação
kubectl get secret oci-registry-secret -n oci-devops
```

#### Passo 3 — Implantar os serviços UDP

```bash
cd 02.udp_health_check-nlb_oci/00.UsefulScripts/

chmod +x 01.deploy_udp_health_check_server_nlb_oci_script.sh
bash 01.deploy_udp_health_check_server_nlb_oci_script.sh
```

Ou aplicar os manifests manualmente na ordem correta:

```bash
cd 02.udp_health_check-nlb_oci/kubernetes/

kubectl apply -f 01.create__Namespace.yaml
kubectl apply -f 02.udp-health-check-server-1700__DaemonSet.yaml      -n oci-devops
kubectl apply -f 03.udp-health-check-server-1710__DaemonSet.yaml      -n oci-devops
```

#### Passo 4 — Verificar o estado dos pods

```bash
# Listar todos os pods do namespace oci-devops
kubectl get pods -n oci-devops -o wide

# Verificar os DaemonSets (deve haver 1 pod por worker = 3 pods por DaemonSet)
kubectl get daemonset -n oci-devops

# Saída esperada:
# NAME                                      DESIRED   CURRENT   READY   NODE SELECTOR
# udp-app-with-healthcheck-1700-daemon-set  3         3         3       <none>
# udp-app-with-healthcheck-1710-daemon-set  3         3         3       <none>

# Descrever um pod para confirmar hostNetwork: true
kubectl describe pod -l app=udp-1700 -n oci-devops | grep -A2 "Host Network"
```

#### Passo 5 — Testar o PING/PONG manualmente

Para confirmar que o servidor está respondendo antes de aguardar o NLB:

```bash
# A partir de qualquer máquina com acesso à rede (substituir pelo IP de um worker)
echo "PING" | nc -u -w2 <IP_DO_WORKER> 1700
# Resposta esperada: PONG

echo "PING" | nc -u -w2 <IP_DO_WORKER> 1710
# Resposta esperada: PONG

# Ou a partir de dentro do cluster (em um pod de debug)
kubectl run debug --image=busybox --restart=Never -it --rm -- \
  sh -c 'echo "PING" | nc -u -w2 <IP_DO_WORKER> 1700'
```

#### Passo 6 — Confirmar o Overall Health no console da OCI

Após implantar os serviços e aguardar de 1 a 2 minutos para o NLB executar as verificações:

1. Acesse o **Console OCI** → **Networking → Load Balancers → Network Load Balancers**
2. Selecione o NLB do cluster (`k8s-arm-oci-always-free_standart` ou o nome configurado)
3. Verifique o campo **Overall Health** — deve exibir `OK` (verde)
4. Em **Backend Sets**, confirme que todos os backends nas portas 1700 e 1710 estão com status `Healthy`

#### Remover os serviços UDP

```bash
cd 02.udp_health_check-nlb_oci/00.UsefulScripts/

chmod +x 02.destroy_udp_health_check_server_nlb_oci_script.sh
bash 02.destroy_udp_health_check_server_nlb_oci_script.sh
```

> ⚠️ Remover estes serviços sem antes remover os listeners UDP do NLB fará o **Overall Health voltar para `Critical`** imediatamente.

---

### 03. Portainer CE

Interface web de administração do cluster em `https://portainer.adailsilva.com.br` (namespace **`portainer`**), com a imagem oficial `portainer/portainer-ce` (2.39.1). Os dados ficam no OCI FSS (`/FileSystem-K8S/portainer-data`, PV `Retain`).

Como `01.metrics_server/` e `02.udp_health_check-nlb_oci/`, a pasta `03.portainer_ce/` existe nos seis repositórios, mas a Application **`plataforma-portainer`** (AppProject `00-plataforma`) pertence ao repositório `k8s-arm-oci-always-free_standart`:

| Quem | O quê |
|---|---|
| **Pipeline** (`main.yml`, job `plataforma_portainer`) | Namespace (`01`) e StorageClass/PV/PVC (`05`); valida os manifestos, pede o Sync no ArgoCD e testa o HTTPS |
| **ArgoCD** (`plataforma-portainer`, automático, `selfHeal`) | ServiceAccount (`02`), ClusterRoleBinding `cluster-admin` (`03`), Deployment (`06`), Service (`07`) e Ingress (`10`) |

O job roda quando muda algo em `03.portainer_ce/kubernetes/` (ou no `.force-deploy`), ou pelo *Run workflow* com `target=portainer`. Os arquivos `04` (PVC sem FSS), `08` e `09` (cert-manager e ClusterIssuer) são referência: o scaffold do cluster já instala o cert-manager.

Deploy à mão (mesma ordem; os scripts usam caminho relativo à própria pasta):

```bash
bash 03.portainer_ce/00.UsefulScripts/01.deploy_portainer_script.sh
```

### 04. Site Adail Silva (Angular + nginx)

Site institucional de **Adail Silva** (`k8s.adailsilva.com.br`) — *Da Sua Ideia ao Kubernetes*: criação de sistemas para empresas, redes LoRaWAN para IoT e a infraestrutura Kubernetes onde tudo roda. Feito em **Angular 21 + PrimeNG 21 (template Avalon 21)** com a identidade de `brand/` (azul, monograma "A"), servido por NGINX, com HTTPS emitido automaticamente pelo **cert-manager + Let's Encrypt**. O host também atende o **Kubernetes Dashboard** (`/dashboard`).

**Fluxo de acesso:**
```
https://k8s.adailsilva.com.br
    → NLB :443
    → NodePort 30443 (workers)
    → Ingress NGINX (app-adailsilva-site-frontend-ingress)
    → Service app-adailsilva-site-frontend-service :80 (ClusterIP)
    → Pod app-adailsilva-site-frontend-deployment (imagem ARM64 do OCI Container Registry)
```

**Código:** `04.homepage/app_adailsilva_site_frontend/` (textos, contatos e números em `src/app/core/site.config.ts`; páginas `/` (início), `/iot` e `/infraestrutura`) — documentação em [`04.homepage/app_adailsilva_site_frontend/README.md`](04.homepage/app_adailsilva_site_frontend/README.md)

**Imagem:** `gru.ocir.io/<namespace>/app-adailsilva-site-frontend_platform_linux-arm64:<versão>`

**Kubernetes resources (namespace `adailsilva-site`):**

| Kind | Nome | Quem aplica |
|---|---|---|
| `Namespace` | `adailsilva-site` | Pipeline (`01.create__Namespace.yaml`) |
| `Deployment` | `app-adailsilva-site-frontend-deployment` | **ArgoCD** (`kustomization.yaml`, `newTag` fixado pelo pipeline) |
| `Service` | `app-adailsilva-site-frontend-service` | Pipeline |
| `Ingress` | `app-adailsilva-site-frontend-ingress` | Pipeline — TLS via `letsencrypt-prod` |
| `ClusterIssuer` | `letsencrypt-prod` / `letsencrypt-staging` | Scaffold (cópia de referência em `05.*__ClusterIssuer.yaml`) |

**Deploy:** automático pelo job `app_adailsilva_site_frontend` do `.github/workflows/main.yml` a cada push em `04.homepage/app_adailsilva_site_frontend/**` (ou `workflow_dispatch` com `target=app-adailsilva-site-frontend`, ou `./force_deploy.sh site`): build ARM64 → OCIR → Namespace/Service/Ingress → `newTag` no GitOps → ArgoCD sincroniza (Application `adailsilva-site-frontend`).

**Rodar localmente:**
```bash
cd 04.homepage/app_adailsilva_site_frontend/
npm ci
npm start          # http://localhost:4401 (perfil development; staging 4402, production 4403)
```

---

## Sistemas Adail Silva

Este repositório é a **base** dos outros cinco: guarda a infraestrutura do cluster, as aplicações padrão (`01.metrics_server`, `02.udp_health_check-nlb_oci`, `03.portainer_ce`, `04.homepage`) e o site institucional `k8s.adailsilva.com.br`. Ainda não há sistemas próprios aqui. Um sistema novo deste projeto entra como `05.adailsilva_<sistema>/`, seguindo o [Padrão dos Repositórios](#padrão-dos-repositórios) (namespace `adailsilva-<sistema>`, imagens `api-/app-adailsilva-<sistema>-*`, Applications `adailsilva-<sistema>-*`).

Sistemas de clientes e projetos ficam nos repositórios próprios:

| Projeto | Repositório | Sistemas |
|---|---|---|
| ChirpStack (LoRaWAN) | `AdailSilva/k8s-arm-oci-always-free_chirpstack` | ChirpStack v3/v4, Manager e MeshCentral |
| CS Óptico Laboratório | `AdailSilva/k8s-arm-oci-always-free_cslab` | CSLab BackOffice, CardsControl, WEB e MeshCentral |
| 3T Sensors | `AdailSilva/k8s-arm-oci-always-free_3tsensors` | BackOffice, VibraTrack e MeshCentral |
| ASE Soluções | `AdailSilva/k8s-arm-oci-always-free_asesolucoes` | BackOffice, Rastrel e MeshCentral |
| PF Gráfica | `AdailSilva/k8s-arm-oci-always-free_pfgrafica` | BackOffice, PF Gráfica · Gestão (OS, estoque, vendas externas) e MeshCentral |

---

## Pré-requisitos

### Conta Oracle Cloud

- Conta ativa na [Oracle Cloud](https://cloud.oracle.com) com o plano **Always Free** disponível
- Tenancy OCID, User OCID, API Key Fingerprint e chave privada configurados
- Verifique os limites da sua região em **Governance → Limits, Quotas and Usage** — o limite de 4 OCPUs ARM é compartilhado por toda a conta

### Ferramentas Locais

| Ferramenta | Versão Mínima | Descrição |
|---|---|---|
| [Terraform](https://developer.hashicorp.com/terraform/install) | `>= 1.3` | Provisionamento IaC (ou use OpenTofu) |
| [OpenTofu](https://opentofu.org/docs/intro/install/) | `>= 1.6` | Fork open-source do Terraform |
| [OCI CLI](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm) | `>= 3.x` | Interação com a OCI via terminal |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | `>= 1.31` | Gerenciamento do cluster |
| [Docker](https://docs.docker.com/engine/install/) com Buildx | `>= 24.x` | Build de imagens ARM64 via `docker buildx` |
| [Git](https://git-scm.com/) | `>= 2.x` | Controle de versão |

> O projeto usa o **provider OCI** `>= 6.35.0` e o **provider null** `3.1.0`.

### Chave SSH (Ed25519)

```bash
ssh-keygen -o -a 100 -t ed25519 -f ~/.ssh/id_ed25519 -C "seu_email@seudominio.com"
```

Caminhos esperados:
- **Linux/macOS:** `~/.ssh/id_ed25519` e `~/.ssh/id_ed25519.pub`
- **Windows:** `C:\Users\..\.ssh\id_ed25519` e `C:\Users\..\.ssh\id_ed25519.pub`

### Chave de API OCI

```bash
mkdir -p ~/.oci
openssl genrsa -out ~/.oci/oci_api_key.pem 2048
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem
```

Adicione `oci_api_key_public.pem` em **Identity → Users → (seu usuário) → API Keys → Add API Key** e copie o fingerprint exibido.

---

## Recursos Always Free Utilizados

| Recurso OCI | Shape / Tipo | Configuração | Qtd |
|---|---|---|---|
| **Instância ARM (leader)** | `VM.Standard.A1.Flex` | 1 OCPU · 3 GB RAM · 50 GB Boot Volume | 1 |
| **Instância ARM (workers)** | `VM.Standard.A1.Flex` | 1 OCPU · 7 GB RAM · 50 GB Boot Volume | 3 |
| **Network Load Balancer** | Always Free NLB | 10 Mbps | 1 |
| **IP Público Reservado** | `RESERVED` | Fixo, persistente mesmo após destroy | 1 |
| **Virtual Cloud Network** | VCN + Subnet Pública | CIDR `10.0.0.0/16` / `10.0.0.0/24` | 1 |
| **OCI Container Registry** | Always Free | Repositórios de imagens ARM64 | Ilimitado* |

**Total ARM:** 4 OCPUs + 24 GB RAM — exatamente no limite Always Free.

> ⚠️ O **IP Público Reservado** e as **instâncias de compute** possuem `prevent_destroy = true` no código Terraform, protegendo contra destruição acidental. Para removê-los é necessário editar os arquivos `.tf` antes de executar o `destroy`.

---

## Tecnologias e Componentes

### Infraestrutura

| Tecnologia | Detalhe | Função |
|---|---|---|
| **Terraform / OpenTofu** | OCI Provider `>= 6.35.0`, null `3.1.0` | IaC — provisionamento completo |
| **Oracle Cloud (OCI)** | Ampere A1 ARM | Plataforma de nuvem |
| **Ubuntu Server** | `24.04 LTS (AArch64)` | SO das instâncias |
| **Image OCI** | `Canonical-Ubuntu-24.04-aarch64-2026.02.28-0` | Imagem base utilizada |

### Kubernetes (Bootstrap)

| Componente | Versão | Função |
|---|---|---|
| **kubeadm** | `v1.31` (canal estável) | Bootstrap do cluster |
| **kubelet** | `v1.31` | Agente em cada nó |
| **kubectl** | `v1.31` | CLI de gerenciamento |
| **containerd** | Via Docker APT | Container runtime (CRI) |
| **Flannel** | Última estável | CNI — rede dos Pods (`10.244.0.0/16`) |

> O `kubeadm init` usa `--ignore-preflight-errors=NumCPU,Mem` para contornar os requisitos mínimos padrão, viabilizando o uso das shapes Always Free.

### Aplicações do Scaffold (Terraform)

| Aplicação | Namespace | Função |
|---|---|---|
| **NGINX Ingress Controller** | `ingress-nginx` | Ingress HTTP/HTTPS (NodePort 30080/30443) |
| **cert-manager** | `cert-manager` | Gerenciamento automático de certificados TLS |
| **Let's Encrypt Issuer** | `cert-manager` | Certificados HTTPS gratuitos via ACME |
| **Kubernetes Dashboard** | `kubernetes-dashboard` | Interface Web do cluster |

### Aplicações Padrão (Manifests)

| Aplicação | Namespace | Versão / Imagem | Função |
|---|---|---|---|
| **Site Adail Silva** | `adailsilva-site` | `app-adailsilva-site-frontend` (ARM64, OCI Registry) | Site institucional (Angular + NGINX) |
| **Metrics Server** | `kube-system` | `metrics-server:v0.7.2` | Métricas de CPU/RAM para Dashboard e `kubectl top` |
| **UDP Health Check :1700** | `oci-devops` | Java (ARM64, OCI Registry) | Libera porta UDP 1700 no NLB (PING/PONG) |
| **UDP Health Check :1710** | `oci-devops` | Java (ARM64, OCI Registry) | Libera porta UDP 1710 no NLB (PING/PONG) |

---

## Estrutura do Repositório

```
.
├── README.md
├── LICENSE
│
├── main.tf                          # Orquestra todos os módulos Terraform
├── inputs.tf                        # Variáveis globais
├── providers.tf                     # Providers OCI (>= 6.35.0) e null (3.1.0)
├── variables.auto.tfvars            # Suas credenciais reais (não versionar!)
├── variables.auto.tfvars.example    # Template para novos usuários
│
├── compartment/                     # Módulo: Compartimento OCI
├── network/                         # Módulo: VCN, Subnet, LB, IP
├── compute/                         # Módulo: VMs ARM leader + workers
├── k8s/                             # Módulo: Bootstrap Kubernetes
│   └── scripts/                     # Scripts de init/join/reset/network
├── k8s_scaffold/                    # Módulo: Apps de scaffolding
│   └── apps/                        # YAMLs: Ingress, cert-manager, Dashboard
├── oci_artifacts_container_repository/  # Módulo: OCI Container Registry
│
├── .github/workflows/main.yml       # CI/CD: detect + aprovacao + app_adailsilva_site_frontend
│                                    #   + plataforma_metrics_server/udp_health_check/portainer
├── gitops/                          # ArgoCD: app-of-apps, AppProjects 00-plataforma e 01-adailsilva,
│                                    #   Applications adailsilva-site-frontend e plataforma-*
│                                    #   (metrics-server, udp-health-check, portainer)
├── brand/                           # Identidade visual (BRAND.md + logos/ícones adailsilva-*)
├── force_deploy.sh                  # Força build/deploy sem alterar código
│
├── 01.metrics_server/               # App: Metrics Server
│   ├── 00.UsefulScripts/
│   │   ├── 01.deploy_metrics_server_script.sh
│   │   └── 02.destroy_metrics_server_script.sh
│   └── kubernetes/
│       ├── 00.metrics-server__Full.yaml               # Manifesto único completo
│       ├── 01.metrics-server__Namespace.yaml
│       ├── 02.metrics-server__ServiceAccount.yaml
│       ├── 03.metrics-server__ClusterRole.yaml
│       ├── 04.metrics-server__RoleBinding.yaml
│       ├── 05.metrics-server__ClusterRoleBinding.yaml
│       ├── 06.metrics-server__Deployment.yaml         # metrics-server:v0.7.2
│       ├── 07.metrics-server__Service.yaml
│       └── 08.metrics-server__ApiService.yaml         # v1beta1.metrics.k8s.io
│
├── 02.udp_health_check-nlb_oci/     # App: UDP Health Check para NLB OCI
│   ├── 00.UsefulScripts/
│   │   ├── 01.deploy_udp_health_check_server_nlb_oci_script.sh
│   │   └── 02.destroy_udp_health_check_server_nlb_oci_script.sh
│   ├── Dockerfile                                    # Build da imagem Java ARM64
│   ├── UdpHealthCheckServer.java                     # Servidor UDP PING/PONG em Java
│   └── kubernetes/
│       ├── 01.create__Namespace.yaml
│       ├── 02.udp-health-check-server-1700__DaemonSet.yaml    # 1 pod por worker
│       ├── 03.udp-health-check-server-1710__DaemonSet.yaml    # 1 pod por worker
│       └── kustomization.yaml
├── 03.portainer_ce/                 # App: Portainer CE (administração do cluster, namespace portainer)
├── 04.homepage/
│   └── app_adailsilva_site_frontend/   # Site institucional (Angular 21 + Avalon 21 + NGINX)
│       ├── src/                     # app/core/site.config.ts = textos, contatos e números
│       ├── Dockerfile · nginx.conf · mime.types
│       └── kubernetes/
│           ├── 01.create__Namespace.yaml                             # Namespace adailsilva-site
│           ├── 02.app-adailsilva-site-frontend__Deployment.yaml      # Deployment (ArgoCD)
│           ├── 03.app-adailsilva-site-frontend__Service.yaml         # Service ClusterIP :80
│           ├── 04.app-adailsilva-site-cert-manager__...yaml          # referência (scaffold)
│           ├── 05.app-adailsilva-site-letsencrypt-issuer__...yaml    # referência (scaffold)
│           ├── 06.app-adailsilva-site__Ingress.yaml                  # Ingress TLS letsencrypt-prod
│           └── kustomization.yaml                                    # newTag fixado pelo pipeline
│
```

---

## Padrão dos Repositórios

> Seção **idêntica nos 6 repositórios**. Ao mudar o padrão, atualize-a em todos.

Os seis repositórios rodam **no mesmo cluster** Kubernetes ARM64 da OCI Always Free. Cada um guarda os sistemas de um projeto/empresa, mas todos seguem a **mesma organização**. Qualquer sistema novo começa por essa estrutura.

| # | Repositório GitHub | Pasta local | Projeto (`<projeto>`) | Site institucional |
|---|---|---|---|---|
| 01 | `AdailSilva/k8s-arm-oci-always-free_standart` | `01.k8s-on-arm-oci-always-free_standart` | `adailsilva` | `k8s.adailsilva.com.br` |
| 02 | `AdailSilva/k8s-arm-oci-always-free_chirpstack` | `02.k8s-on-arm-oci-always-free_chirpstack` | `chirpstack` | `chirpstack.adailsilva.com.br` |
| 03 | `AdailSilva/k8s-arm-oci-always-free_cslab` | `03.k8s-on-arm-oci-always-free_cslab` | `cslab` | `cslaboptico.adailsilva.com.br` |
| 04 | `AdailSilva/k8s-arm-oci-always-free_3tsensors` | `04.k8s-on-arm-oci-always-free_3t-sensors` | `3tsensors` | `3tsensors.adailsilva.com.br` |
| 05 | `AdailSilva/k8s-arm-oci-always-free_asesolucoes` | `05.k8s-on-arm-oci-always-free_ase-solucoes` | `asesolucoes` | `asesolucoes.adailsilva.com.br` |
| 06 | `AdailSilva/k8s-arm-oci-always-free_pfgrafica` | `06.k8s-on-arm-oci-always-free_pfgrafica` | `pfgrafica` | `pfgrafica.adailsilva.com.br` |

### Estrutura comum

```
<repositório>/
├── .github/workflows/main.yml            # detect + 1 job por app: build → OCIR → infra base → newTag no GitOps
├── .github/workflows/mobile.yml          # (se houver app Flutter) APK/AAB no GitHub Releases
├── 01.metrics_server/                    # aplicação padrão do cluster
├── 02.udp_health_check-nlb_oci/          # aplicação padrão do cluster
├── 03.portainer_ce/                      # Portainer CE (namespace portainer) — aplicação padrão do cluster
├── 04.homepage/app_<projeto>_site_frontend/   # site institucional (Angular 21 + Avalon) — namespace <projeto>-site
├── 0N.<projeto>_<sistema>/               # um diretório por sistema (03, 04, 05...)
│   ├── api_<projeto>_<sistema>_backend/  #   Spring Boot + kubernetes/ (NN.<componente>__<Kind>.yaml + kustomization.yaml)
│   ├── app_<projeto>_<sistema>_frontend/ #   Angular + kubernetes/
│   ├── app_<projeto>_<sistema>_mobile/   #   Flutter (quando houver)
│   ├── backups/ deploy/ planos_implantacao/ postman_collection/ scripts_back-up/
│   ├── stack_<projeto>-<sistema>/ stack_postgresql_pgAdmin_4/
│   ├── useful_commands_backup_and_restore/ useful_commands_local_deploy/
│   └── README.md (+ SETUP.md)           # pastas de apoio: cada sistema tem só as que usa
├── brand/                                # BRAND.md + logotipos/ícones <projeto>-*.svg/png
├── gitops/                               # apps/ (app-of-apps + 1 Application por app), bootstrap/, README, ROLLBACK
├── compartment/ compute/ k8s/ k8s_scaffold/ network/ oci_artifacts_container_repository/
├── main.tf providers.tf inputs.tf variables.auto.tfvars.example .terraform.lock.hcl
├── force_deploy.sh                       # força o build/deploy sem alterar código
└── README.md                             # documentação DESTE repositório
```

### Convenções de nomes

| Item | Padrão | Exemplo (fictício) |
|---|---|---|
| Pasta do sistema | `0N.<projeto>_<sistema>` | `03.minhaempresa_web` |
| Pastas das aplicações | `api_<projeto>_<sistema>_backend`, `app_<projeto>_<sistema>_frontend`, `app_<projeto>_<sistema>_mobile` | `api_minhaempresa_web_backend` |
| Namespace do sistema | `<projeto>-<sistema>` | `minhaempresa-web` |
| Site institucional | pasta `04.homepage/app_<projeto>_site_frontend`, namespace **próprio** `<projeto>-site` | `minhaempresa-site` |
| Imagem OCIR | `api-/app-<projeto>-<sistema>-backend/frontend_platform_linux-arm64`, `app-<projeto>-site-frontend_platform_linux-arm64` | `app-minhaempresa-web-frontend_platform_linux-arm64` |
| Deployment / Service | `<imagem sem sufixo>-deployment` / `-service`; MeshCentral (imagem oficial, sem imagem própria): `<projeto>-meshcentral-deployment` / `app-<projeto>-meshcentral-service` | `app-minhaempresa-web-frontend-deployment` |
| Tag Git (versão) | `<imagem sem sufixo>-X.Y` | `api-minhaempresa-web-backend-0.7` (exemplo) |
| Job do pipeline | `<pasta da aplicação>` | `api_minhaempresa_web_backend` |
| Application ArgoCD | `<projeto>-<sistema>-<componente>` (`frontend`, `backend`, `postgresql`, `mosquitto`, `stack`…), raiz `<projeto>-app-of-apps`, AppProject `<NN>-<projeto>` — ver [`gitops/PADRAO-ARGOCD.md`](gitops/PADRAO-ARGOCD.md) | `minhaempresa-web-backend` (AppProject `08-minhaempresa`) |
| Manifestos | `NN.<componente>__<Kind>.yaml`, na ordem de aplicação; `kustomization.yaml` só com o Deployment | `12.api-minhaempresa-web-backend__Deployment.yaml` |
| Marca | `brand/<projeto>-<peça>[-variação][-tamanho].ext` | `brand/minhaempresa-icone-512.png` |

> Onde o identificador não pode começar com dígito (pacote Java/Dart, banco, CSS), um `<projeto>` iniciado por dígito ganha uma forma alternativa iniciada por letra, usada também nos arquivos de marca.

### Terraform compartilhado entre repositórios

Os arquivos de infraestrutura são **cópias idênticas** nos 6 repositórios — todos descrevem o mesmo cluster:
`main.tf`, `providers.tf`, `inputs.tf`, `variables.auto.tfvars(.example)`, `.terraform.lock.hcl`, `compartment/`, `compute/`, `k8s/`, `k8s_scaffold/`, `network/`, `oci_artifacts_container_repository/` e o state local (`terraform.tfstate`, `terraform.tfstate.backup`, fora do Git).

O cluster é operado com **OpenTofu** (`tofu`). O `sync_terraform_state.sh` (na raiz, idêntico nos 6 repositórios) mantém os 6 states iguais:

1. Altere os `.tf` em **um** repositório e copie-os para os outros 5.
2. Repositório de imagem novo: declare em `oci_artifacts_container_repository/oci_artifacts_container_repository.tf` (bloco único para os 6 repositórios). Se o pipeline já o criou no primeiro push, `./sync_terraform_state.sh importar` traz o repositório para o state.
3. Rode, nesse repositório, `./sync_terraform_state.sh plan` e depois `./sync_terraform_state.sh apply` (pede confirmação).
4. `./sync_terraform_state.sh copiar` copia o state para os outros 5 e `./sync_terraform_state.sh conferir` roda o plan sem refresh nos 6 (todos devem dar "No changes").

`./sync_terraform_state.sh tudo` faz importar + apply + copiar + conferir de uma vez.

> O state é local: nunca rode `apply` em dois repositórios ao mesmo tempo nem com um state desatualizado.

### Checklist para um sistema novo

1. Criar `0N.<projeto>_<sistema>/` seguindo a estrutura comum acima e as convenções de nomes.
2. Manifestos em `api_.../kubernetes/` e `app_.../kubernetes/` com a numeração `NN.` e `kustomization.yaml` (só o Deployment).
3. Repositórios de imagem no `oci_artifacts_container_repository.tf` (e copiar para os outros 5 repositórios).
4. Jobs no `.github/workflows/main.yml` (mesmo modelo do job do site) e entradas no `force_deploy.sh`.
5. Applications em `gitops/apps/` (backend, frontend e, se houver, `-postgresql`/`-mosquitto`), no `include` do `app-of-apps.yaml` e no catálogo de [`gitops/PADRAO-ARGOCD.md`](gitops/PADRAO-ARGOCD.md) (checklist na seção 7).
6. Subdomínios no DNS, seção no README deste repositório e, se for produto novo, ícones em `brand/`.

---

## Configuração de DNS — Subdomínios Obrigatórios

### Por que o registro DNS é obrigatório

Todos os serviços expostos via HTTPS neste cluster dependem do **cert-manager + Let's Encrypt** para emissão automática de certificados TLS. O Let's Encrypt usa o desafio **ACME HTTP-01**: ele acessa uma URL específica no seu domínio para provar que você é o dono antes de emitir o certificado.

Isso significa que **cada subdomínio precisa existir no seu DNS público e apontar para o IP do Load Balancer antes do deploy dos serviços**. Se o registro não existir ou ainda não propagou, o cert-manager ficará em loop tentando emitir o certificado e o Ingress não servirá HTTPS.

```
Let's Encrypt (ACME HTTP-01)
    │
    ├── Acessa http://k8s.seudominio.com.br/.well-known/acme-challenge/...
    │         └── Resolve DNS → deve apontar para o IP do Load Balancer OCI
    │                  └── NLB :80 → worker NodePort 30080 → Ingress NGINX → cert-manager
    │                          └── ✅ Desafio aprovado → certificado emitido
    │
    └── Se o DNS não existir ou não apontar para o NLB → ❌ timeout → certificado não emitido
```



### Quando cadastrar os subdomínios

O momento ideal é **durante a execução do `tofu apply`**, não depois. O módulo `network` — segundo a ser executado — provisiona o IP Público Reservado e o Load Balancer em poucos segundos após o início do apply. Assim que o IP aparecer no console OCI, você já pode cadastrar os registros DNS, e a propagação ocorrerá em paralelo ao restante do provisionamento do cluster.

```
tofu apply -parallelism=1
     │
     ├── ~30s → NLB + IP criados  ← 📌 CADASTRE OS REGISTROS DNS AQUI
     │                                  (propagação TTL=300 leva ~5 minutos)
     ├── ~5min  → VMs provisionadas
     ├── ~10min → cluster Kubernetes operacional
     ├── ~15min → cert-manager tenta emitir certificados
     │               └── ✅ DNS já propagado → certificados emitidos
     └── ~20-30min → apply concluído com tudo pronto
```

> Veja como obter o IP durante o apply na seção [Como obter o IP durante o apply](#como-obter-o-ip-durante-o-apply), dentro de **Implantação da Infraestrutura → Terraform → Passo 6**.

---

### Subdomínios necessários neste projeto

Abaixo estão todos os subdomínios que precisam ser cadastrados no seu provedor DNS, apontando para o **IP Público Reservado** do Load Balancer OCI:

| Subdomínio | Serviço | Tipo de registro | TTL sugerido |
|---|---|---|---|
| `k8s.seudominio.com.br` | Site Adail Silva + Kubernetes Dashboard | `A` | 300 |
| `portainer.seudominio.com.br` | Portainer CE (administração do cluster) | `A` | 300 |

> Todos os registros são do tipo `A` apontando para o mesmo IP — o IP Público Reservado do NLB, obtido com `tofu output -raw cluster_public_ip`.

---

### Como obter o IP do Load Balancer

```bash
# Via output do OpenTofu
tofu output -raw cluster_public_ip

# Via kubectl (após o cluster estar de pé)
kubectl get service -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Também disponível no console OCI:
# Networking → Load Balancers → Network Load Balancers → (seu NLB) → IP Address
```

---

### Exemplo prático — Registro `.com.br` (Registro.br)

No Registro.br, o gerenciamento de DNS é feito em **registro.br → Domínios → (seu domínio) → Editar zona DNS**.

> ⚠️ **Atenção — Modo Avançado obrigatório:** por padrão, o painel do Registro.br opera no **modo básico**, que não permite cadastrar subdomínios personalizados. Para adicionar os registros `A` necessários para este cluster, é preciso ativar o **Modo Avançado** na seção de zona DNS.
>
> Acesse: [registro.br → Painel → Domínios → (seu domínio) → DNS → Configurar zona DNS](https://registro.br/painel/dominios/) e procure pela opção **"Modo Avançado"** ou **"Edição avançada de zona"**.
>
> **A ativação do modo avançado pode levar em média 2 horas para ser processada pelo Registro.br** — portanto, ative-o com antecedência, idealmente antes mesmo de iniciar o provisionamento do cluster, para que quando o IP do NLB estiver disponível o painel já esteja liberado para edição.

```
Fluxo recomendado de tempo:

Dia anterior (ou horas antes):
└── Ativar Modo Avançado no Registro.br  ← aguardar ~2 horas para processar

Durante o tofu apply (~30 segundos após iniciar):
└── NLB + IP criados → cadastrar os registros A na zona DNS
        └── propagação TTL=300 (~5 minutos)

Ao final do apply (~20-30 min):
└── Cluster pronto + DNS propagado + certificados TLS emitidos ✅
```

Para cada subdomínio, adicione uma entrada do tipo `A`:

```
Registro.br — Zona DNS de seudominio.com.br
┌──────────────────────────────────────────┬──────┬───────────────────┬─────┐
│ Nome                                     │ Tipo │ Valor             │ TTL │
├──────────────────────────────────────────┼──────┼───────────────────┼─────┤
│ k8s                                      │  A   │ <IP_DO_NLB>       │ 300 │
│ portainer                                │  A   │ <IP_DO_NLB>       │ 300 │
└──────────────────────────────────────────┴──────┴───────────────────┴─────┘
```

> No Registro.br, o campo "Nome" aceita apenas o prefixo do subdomínio — sem o domínio raiz. Ou seja, para criar `k8s.seudominio.com.br`, preencha o campo Nome com `k8s` apenas.

**Passo a passo no painel do Registro.br:**

1. Acesse [registro.br](https://registro.br) e faça login
2. Clique em **Domínios** e selecione o seu domínio
3. Acesse **DNS → Configurar zona DNS**
4. Ative o **Modo Avançado** (se ainda não estiver ativo) — aguarde até 2 horas para o processamento
5. Com o modo avançado ativo, clique em **Adicionar entrada** para cada subdomínio
6. Selecione o tipo `A`, preencha o **Nome** (ex: `k8s`) e o **Valor** com o IP do NLB
7. Clique em **Salvar**
8. Aguarde a propagação (TTL de 300 segundos = 5 minutos para a maioria dos resolvedores)

---

### Verificar a propagação do DNS

Antes de fazer o deploy dos serviços, confirme que os registros propagaram:

```bash
# Verificar cada subdomínio — todos devem retornar o IP do NLB
dig +short k8s.seudominio.com.br
dig +short portainer.seudominio.com.br

# Verificar de um servidor DNS público (confirma propagação global)
dig +short k8s.seudominio.com.br @8.8.8.8    # Google DNS
dig +short k8s.seudominio.com.br @1.1.1.1    # Cloudflare DNS

# Verificar propagação completa via ferramenta online:
# https://dnschecker.org
```

**Resultado esperado:** todos os subdomínios devem retornar o mesmo IP do Load Balancer OCI.

---

### Outros provedores de DNS

A lógica é a mesma independente do provedor. A única diferença é a interface:

| Provedor | Onde acessar |
|---|---|
| **Registro.br** | registro.br → Domínios → Editar zona DNS |
| **Cloudflare** | dash.cloudflare.com → DNS → Records → Add record |
| **GoDaddy** | godaddy.com → Meus Domínios → DNS → Adicionar registro |
| **AWS Route 53** | console.aws.amazon.com → Route 53 → Hosted zones → Create record |
| **Google Domains** | domains.google → DNS → Gerenciar registros personalizados |

> Se estiver usando o **OCI DNS** (Oracle Cloud Infrastructure DNS), os registros podem ser criados diretamente no console em **Networking → DNS Management → Zones → (sua zona) → Add Record**.

---

### Atualizar os subdomínios nos manifestos antes do deploy

Os arquivos Ingress do projeto precisam ser editados com seus subdomínios reais **antes** de aplicar os manifests. Localize e substitua em cada arquivo:

**Site:**
```bash
# Arquivo: 04.homepage/app_adailsilva_site_frontend/kubernetes/06.app-adailsilva-site__Ingress.yaml
# Substituir: k8s.adailsilva.com.br → k8s.seudominio.com.br
sed -i 's/k8s.adailsilva.com.br/k8s.seudominio.com.br/g' \
  04.homepage/app_adailsilva_site_frontend/kubernetes/06.app-adailsilva-site__Ingress.yaml
```

**Portainer CE:**
```bash
sed -i 's/portainer.adailsilva.com.br/portainer.seudominio.com.br/g' \
  03.portainer_ce/kubernetes/10.portainer-ce__Ingress.yaml
```

**Variável do Terraform (cluster principal):**
```hcl
# variables.auto.tfvars
cluster_public_dns_name = "k8s.seudominio.com.br"
```

---

## Configuração Inicial

### 1. Clone o repositório

```bash
git clone https://github.com/AdailSilva/Kubernetes_at_Oracle_Cloud_Always_Free.git
cd Kubernetes_at_Oracle_Cloud_Always_Free
```

### 2. Configure as variáveis

```bash
cp variables.auto.tfvars.example variables.auto.tfvars
```

Edite `variables.auto.tfvars`:

```hcl
# ─── OCI API ───────────────────────────────────────────────────────────────
tenancy_ocid     = "ocid1.tenancy.oc1..xxxxxxxxxx"
user_ocid        = "ocid1.user.oc1..xxxxxxxxxx"
fingerprint      = "xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx"
private_key_path = "/home/seu_usuario/.oci/oci_api_key.pem"
# Windows: private_key_path = "C:\\Users\\...\\.oci\\oci-tf.pem"
# private_key_password = ""   # descomente se a chave tiver senha
region           = "sa-saopaulo-1"

# ─── SSH ───────────────────────────────────────────────────────────────────
# Gerado com: ssh-keygen -o -a 100 -t ed25519 -f ~/.ssh/id_ed25519
ssh_key_path     = "/home/seu_usuario/.ssh/id_ed25519"
ssh_key_pub_path = "/home/seu_usuario/.ssh/id_ed25519.pub"
# Windows:
# ssh_key_path     = "C:\\Users\\...\\.ssh\\id_ed25519"
# ssh_key_pub_path = "C:\\Users\\...\\.ssh\\id_ed25519.pub"

# ─── Cluster ───────────────────────────────────────────────────────────────
# Necessário para TLS com Let's Encrypt. Mudanças causam recriação do cluster.
cluster_public_dns_name = "k8s.seudominio.com.br"

# E-mail para registro no Let's Encrypt
letsencrypt_registration_email = "seu_email@seudominio.com"

# ─── Debug / Configurações locais ──────────────────────────────────────────
# Cria admin-user no Dashboard e exibe o token no output do Terraform
debug_create_cluster_admin = true

# Sobrescreve ~/.kube/config local com o kubeconfig do cluster
linux_overwrite_local_kube_config = true
# Windows: windows_overwrite_local_kube_config = true
```

### Referência completa de variáveis

| Variável | Tipo | Obrigatória | Default | Descrição |
|---|---|---|---|---|
| `tenancy_ocid` | string | ✅ | — | OCID da tenancy OCI |
| `user_ocid` | string | ✅ | — | OCID do usuário OCI |
| `fingerprint` | string | ✅ | — | Fingerprint da API Key |
| `private_key_path` | string | ✅ | — | Caminho da chave privada OCI |
| `private_key_password` | string | — | `""` | Senha da chave privada OCI |
| `region` | string | ✅ | — | Região OCI (ex: `sa-saopaulo-1`) |
| `ssh_key_path` | string | ✅ | — | Chave privada SSH para as VMs |
| `ssh_key_pub_path` | string | ✅ | — | Chave pública SSH para as VMs |
| `cluster_public_dns_name` | string | — | `null` | DNS público do cluster |
| `letsencrypt_registration_email` | string | ✅ | — | E-mail para certificados TLS |
| `debug_create_cluster_admin` | bool | — | `false` | Cria admin-user e exibe token |
| `linux_overwrite_local_kube_config` | bool | — | `false` | Sobrescreve `~/.kube/config` |

---

## Implantação da Infraestrutura

> **Neste cluster usamos o OpenTofu (`tofu`)**: os comandos são os mesmos, trocando `terraform` por `tofu`. No dia a dia, prefira o `./sync_terraform_state.sh` (ver [Terraform compartilhado entre repositórios](#terraform-compartilhado-entre-repositórios)), que roda o `tofu` e mantém os 6 states iguais.
>
> Todos os comandos abaixo funcionam tanto com **Terraform** quanto com **OpenTofu**. Escolha a ferramenta de sua preferência — a sintaxe e o comportamento são equivalentes. OpenTofu é o fork open-source mantido pela comunidade; Terraform é mantido pela HashiCorp sob licença BSL.

---

### Terraform

#### 1. Instalar o Terraform

```bash
# Linux (Ubuntu/Debian)
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# macOS (Homebrew)
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verificar instalação
terraform version
```

#### 2. Inicializar o projeto

Baixa os providers declarados (`oci >= 6.35.0`, `null 3.1.0`) e prepara o diretório de trabalho:

```bash
terraform init
```

#### 3. Formatar o código (opcional)

Aplica formatação padrão em todos os arquivos `.tf`:

```bash
terraform fmt -recursive
```

#### 4. Validar a configuração

Verifica erros de sintaxe e configuração sem acessar a API da OCI:

```bash
terraform validate
```

#### 5. Visualizar o plano de execução

Exibe todos os recursos que serão criados, modificados ou destruídos:

```bash
terraform plan
```

Para salvar o plano em arquivo (útil para revisão antes de aplicar em produção):

```bash
terraform plan -out=tfplan
```

#### 6. Aplicar a infraestrutura

```bash
terraform apply
```

Aplicar sem confirmação interativa (use com cuidado):

```bash
terraform apply -auto-approve
```

Aplicar a partir de um plano salvo anteriormente:

```bash
terraform apply tfplan
```

Aplicar com paralelismo limitado a **1 operação por vez**:

```bash
terraform apply -parallelism=1
```

> Por padrão, o Terraform (e o OpenTofu) executam até **10 operações em paralelo**. O flag `-parallelism=1` força a criação dos recursos de forma **estritamente sequencial**, um por vez. Isso é especialmente útil neste projeto porque a API do Network Load Balancer da OCI é suscetível a race conditions ao criar múltiplos listeners, backend sets e backends simultaneamente — o que pode causar erros intermitentes do tipo `409-Conflict` ou `412-PreconditionFailed`. Usar `-parallelism=1` resolve esses conflitos ao garantir que cada recurso do NLB seja criado e confirmado antes do próximo iniciar. A desvantagem é que o tempo total de provisionamento aumenta; use esta opção apenas quando o `apply` padrão falhar com erros de concorrência na OCI.

> 💡 **Momento ideal para cadastrar os subdomínios no DNS:** o módulo `network` é o segundo a ser executado e provisiona o IP Público Reservado e o Load Balancer em poucos segundos após o início do `apply`. Você **não precisa aguardar os 15–30 minutos** do provisionamento completo — assim que a criação do NLB aparecer nos logs do Terraform/OpenTofu, o IP já estará disponível no console OCI e pode ser copiado para cadastrar os registros DNS. Dessa forma, quando o cluster terminar de subir, os subdomínios já estarão propagados e o cert-manager conseguirá emitir os certificados TLS imediatamente. Veja a seção [Como obter o IP durante o apply](#como-obter-o-ip-durante-o-apply) logo abaixo.

#### Como obter o IP durante o apply

Enquanto o `terraform apply` ou `tofu apply` ainda está em execução, abra um **segundo terminal** e use qualquer uma das opções abaixo para obter o IP imediatamente após os recursos de rede serem criados:

**Opção 1 — Console OCI (mais rápido, sem dependências):**
1. Acesse **OCI Console → Networking → Load Balancers → Network Load Balancers**
2. O NLB `k8s-arm-oci-always-free_standart` (ou o nome configurado) aparecerá com status `Creating` em segundos
3. Clique nele — o **IP Address** já estará preenchido mesmo com o NLB ainda provisionando
4. Copie o IP e vá direto ao painel do seu provedor DNS para criar os registros

**Opção 2 — OCI CLI (no segundo terminal):**
```bash
# Listar os IPs públicos reservados da sua tenancy
oci network public-ip list \
  --compartment-id <COMPARTMENT_OCID> \
  --scope REGION \
  --query 'data[?"lifecycle-state"==`AVAILABLE`].{"IP": "ip-address", "Nome": "display-name"}' \
  --output table

# Ou buscar diretamente o IP do NLB pelo nome
oci nlb network-load-balancer list \
  --compartment-id <COMPARTMENT_OCID> \
  --query 'data.items[0]."ip-addresses"[0]."ip-address"' \
  --raw-output
```

**Opção 3 — Terraform/OpenTofu state (após o módulo network concluir):**
```bash
# Enquanto o apply ainda corre, em outro terminal, dentro do diretório do projeto:
terraform output cluster_public_ip 2>/dev/null || \
  terraform state show module.network.oci_core_public_ip.cluster_public_ip \
  | grep "ip_address"

# OpenTofu:
tofu output cluster_public_ip 2>/dev/null || \
  tofu state show module.network.oci_core_public_ip.cluster_public_ip \
  | grep "ip_address"
```

**Fluxo recomendado:**

```
tofu apply -parallelism=1  (Terminal 1 — deixa rodando)
     │
     ├── ~30s → módulo network concluído → NLB + IP criados
     │               └── Terminal 2: copie o IP do console OCI
     │                       └── Cadastre os registros DNS no Registro.br
     │                               (propagação leva ~5 minutos com TTL=300)
     │
     ├── ~5min → módulo compute concluído → VMs provisionadas
     ├── ~10min → módulo k8s concluído → cluster Kubernetes operacional
     ├── ~15min → módulo k8s_scaffold → cert-manager tenta emitir certificados
     │               └── ✅ DNS já propagado → certificados emitidos com sucesso
     └── ~20-30min → apply concluído
```

> Cadastrar os registros DNS **durante o apply** — e não depois — é a forma mais eficiente de garantir que os certificados TLS estejam prontos assim que o cluster terminar de subir, sem precisar aguardar propagação adicional.

#### 7. Consultar os outputs após a implantação

```bash
# Todos os outputs de uma vez
terraform output

# Outputs específicos
terraform output cluster_public_ip       # IP público do Load Balancer
terraform output cluster_public_address  # DNS do cluster
terraform output admin_token             # Token do Dashboard (se debug_create_cluster_admin = true)
```

Para extrair um valor em texto puro (útil em scripts):

```bash
terraform output -raw cluster_public_ip
terraform output -raw admin_token
```

#### 8. Consultar o estado atual

Listar todos os recursos gerenciados:

```bash
terraform state list
```

Inspecionar um recurso específico:

```bash
terraform state show <resource_address>
# Exemplo:
terraform state show module.compute.oci_core_instance.leader
```

#### 9. Destruir a infraestrutura

```bash
terraform destroy
```

Destruir sem confirmação interativa:

```bash
terraform destroy -auto-approve
```

---

### OpenTofu

#### 1. Instalar o OpenTofu

```bash
# Linux (Ubuntu/Debian) — via repositório oficial
curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh | bash -s -- --install-method deb

# macOS (Homebrew)
brew install opentofu

# Windows (Winget)
winget install OpenTofu.OpenTofu

# Verificar instalação
tofu version
```

#### 2. Inicializar o projeto

Baixa os providers declarados e prepara o diretório de trabalho:

```bash
tofu init
```

Forçar o re-download dos providers (útil após atualização de versão):

```bash
tofu init -upgrade
```

#### 3. Formatar o código (opcional)

```bash
tofu fmt -recursive
```

#### 4. Validar a configuração

```bash
tofu validate
```

#### 5. Visualizar o plano de execução

```bash
tofu plan
```

Salvar o plano em arquivo:

```bash
tofu plan -out=tfplan
```

#### 6. Aplicar a infraestrutura

```bash
tofu apply
```

Aplicar sem confirmação interativa:

```bash
tofu apply -auto-approve
```

Aplicar a partir de um plano salvo:

```bash
tofu apply tfplan
```

Aplicar com paralelismo limitado a **1 operação por vez**:

```bash
tofu apply -parallelism=1
```

> Por padrão, o OpenTofu (e o Terraform) executam até **10 operações em paralelo**. O flag `-parallelism=1` força a criação dos recursos de forma **estritamente sequencial**, um por vez. Isso é especialmente útil neste projeto porque a API do Network Load Balancer da OCI é suscetível a race conditions ao criar múltiplos listeners, backend sets e backends simultaneamente — o que pode causar erros intermitentes do tipo `409-Conflict` ou `412-PreconditionFailed`. Usar `-parallelism=1` resolve esses conflitos ao garantir que cada recurso do NLB seja criado e confirmado antes do próximo iniciar. A desvantagem é que o tempo total de provisionamento aumenta; use esta opção apenas quando o `apply` padrão falhar com erros de concorrência na OCI.

> 💡 **Momento ideal para cadastrar os subdomínios no DNS:** o módulo `network` conclui em poucos segundos após o início do `apply` e o IP do Load Balancer já está disponível no console OCI antes do cluster terminar de subir. Cadastre os registros DNS nesse intervalo para que a propagação ocorra em paralelo ao provisionamento. Veja o fluxo detalhado na seção [Como obter o IP durante o apply](#como-obter-o-ip-durante-o-apply) acima (seção Terraform — o procedimento é idêntico para OpenTofu).

#### 7. Consultar os outputs após a implantação

```bash
# Todos os outputs de uma vez
tofu output

# Outputs específicos
tofu output cluster_public_ip
tofu output cluster_public_address
tofu output admin_token
```

Extrair valor em texto puro:

```bash
tofu output -raw cluster_public_ip
tofu output -raw admin_token
```

#### 8. Consultar o estado atual

```bash
tofu state list
tofu state show <resource_address>
```

#### 9. Destruir a infraestrutura

```bash
tofu destroy
```

Destruir sem confirmação interativa:

```bash
tofu destroy -auto-approve
```

---

### Comandos adicionais úteis (ambas as ferramentas)

Estes comandos têm sintaxe idêntica no Terraform e no OpenTofu, bastando trocar `terraform` por `tofu`:

```bash
# Limitar o paralelismo a 1 operação por vez (evita race conditions no NLB da OCI)
terraform apply -parallelism=1
tofu apply -parallelism=1

# Combinar com -target para recriar um módulo de forma segura e sequencial
terraform apply -parallelism=1 -target=module.k8s_scaffold
tofu apply -parallelism=1 -target=module.k8s_scaffold

# Recarregar apenas um módulo específico (útil para recriar recursos isolados)
terraform apply -target=module.k8s
tofu apply -target=module.k8s

# Recarregar apenas um recurso específico
terraform apply -target=module.compute.oci_core_instance.leader
tofu apply -target=module.compute.oci_core_instance.leader

# Importar um recurso existente na OCI para o estado do Terraform/OpenTofu
terraform import <resource_address> <resource_ocid>
tofu import <resource_address> <resource_ocid>

# Remover um recurso do estado sem destruí-lo na OCI
terraform state rm <resource_address>
tofu state rm <resource_address>

# Verificar diferenças entre o estado e a infraestrutura real
terraform refresh
tofu refresh

# Exibir o grafo de dependências entre módulos (requer graphviz)
terraform graph | dot -Tsvg > grafo.svg
tofu graph | dot -Tsvg > grafo.svg
```

---

### Sequência de execução dos módulos

Independente da ferramenta, a ordem de provisionamento é sempre:

```
compartment → network → compute → k8s → k8s_scaffold → oci-infra_ci_cd
```

Cada módulo depende do anterior via `depends_on`. O Terraform e o OpenTofu gerenciam essa ordem automaticamente.

> ⏱️ O processo completo leva entre **15 e 30 minutos**:
> - Recursos OCI (compartimento, rede, VMs): ~5 min
> - Bootstrap do Control Plane (kubeadm init): ~5 min
> - Join dos 3 Workers (paralelo): ~10 min
> - Instalação das aplicações scaffold: ~5 min

---

## Implantando as Aplicações Padrão

Após a infraestrutura estar operacional, execute as aplicações na seguinte ordem recomendada:

### 1. Metrics Server

```bash
cd 01.metrics_server/00.UsefulScripts/
bash 01.deploy_metrics_server_script.sh

# Verificar:
kubectl top nodes
kubectl get pods -n kube-system | grep metrics
```

### 2. UDP Health Check

> Necessário antes de adicionar listeners UDP no NLB para que o health check passe.

```bash
# Criar o Secret de acesso ao OCI Registry
kubectl create secret docker-registry oci-registry-secret \
  --docker-server=gru.ocir.io \
  --docker-username='<namespace>/<seu_email>' \
  --docker-password='<auth_token>' \
  --docker-email='<seu_email>' \
  -n oci-devops

cd 02.udp_health_check-nlb_oci/00.UsefulScripts/
bash 01.deploy_udp_health_check_server_nlb_oci_script.sh

# Verificar:
kubectl get pods -n oci-devops
kubectl get daemonset -n oci-devops
```

### 3. Site Adail Silva

O site é implantado pelo pipeline (job `app_adailsilva_site_frontend`) e pelo ArgoCD — ver [00. Site Adail Silva](#04-site-adail-silva-angular--nginx):

```bash
./force_deploy.sh site      # dispara o build/deploy sem alterar código

# Verificar:
kubectl get pods,svc,ingress,certificate -n adailsilva-site
kubectl -n argocd get application adailsilva-site-frontend
```

---

## GitOps com ArgoCD

O ArgoCD **aplica automaticamente** os Deployments** deste repositório (o site `k8s.adailsilva.com.br`). A versão em produção de cada um é o `newTag` do respectivo `kubernetes/kustomization.yaml`. Namespace, Secrets, ConfigMaps, bancos, PVs/PVCs, Services e Ingress continuam sendo aplicados pelo pipeline — por isso as Applications usam `prune: false`.

**Padrão do cluster:** todas as Applications deste repositório ficam no AppProject `00-plataforma` / `01-adailsilva` (a UI do ArgoCD lista os projetos na ordem 00 → 06), seguem `<projeto>-<sistema>-<componente>`, têm os labels `adailsilva.com.br/{repositorio,projeto,sistema,componente,implantacao}` e cobrem todos os sistemas do repositório: plataforma (`plataforma-metrics-server`, `plataforma-udp-health-check`, AppProject `00-plataforma`) e o site. Detalhes e catálogo dos 6 repositórios em [`gitops/PADRAO-ARGOCD.md`](gitops/PADRAO-ARGOCD.md); aplicar com `bash gitops/bootstrap/01-aplicar-padrao-argocd.sh` e auditar o cluster com `bash gitops/bootstrap/09-auditar-cluster-argocd.sh`.

O ArgoCD é **um só para o cluster** (compartilhado pelos 6 repositórios); este repositório só registra a sua credencial e o seu app-of-apps (`adailsilva-app-of-apps`), com Applications de prefixo `adailsilva-`.

```
push em master ─► main.yml ─► build ARM64 ─► OCIR (tag X.Y + latest)
                               │
                               ├─► kubectl apply: Namespace, Service, Ingress (e infraestrutura do sistema)
                               │
                               └─► commit "[skip ci]": newTag "X.Y" na kustomization.yaml
                                         │
                       ArgoCD (auto-sync, selfHeal) ◄─┘
                                         │
                                         ▼
                                  Deployment atualizado
```

| Arquivo | Conteúdo |
|---|---|
| [`gitops/README.md`](gitops/README.md) | Layout, o que o pipeline faz e particularidades |
| [`gitops/bootstrap/00-argocd-install.md`](gitops/bootstrap/00-argocd-install.md) | ArgoCD (uma vez por cluster) e registro deste repositório (público) no ArgoCD |
| [`gitops/ROLLBACK.md`](gitops/ROLLBACK.md) | Como voltar versão pelo Git |
| `gitops/apps/` | AppProject (00-plataforma, 01-adailsilva) + `app-of-apps.yaml` + 4 Applications (site, metrics-server, UDP health check e Portainer), todas com `targetRevision: master` |
| [`gitops/PADRAO-ARGOCD.md`](gitops/PADRAO-ARGOCD.md) | Padrão de nomes, AppProjects, labels, modos e catálogo do cluster |
| `gitops/bootstrap/01-aplicar-padrao-argocd.sh` / `09-auditar-cluster-argocd.sh` | Aplicar o padrão neste repositório / auditar o cluster |

Pontos importantes:

- **Congelar um app:** a linha `# adailsilva-release-congelado: <motivo>` na `kustomization.yaml` faz o pipeline publicar a imagem sem trocar o `newTag`.
- **Não use o rollback nativo do ArgoCD** com auto-sync ligado: o `selfHeal` volta ao que está no Git. Faça rollback pelo Git ([`gitops/ROLLBACK.md`](gitops/ROLLBACK.md)).
- **Tags imutáveis:** o pipeline publica cada versão com tag `X.Y` no OCIR; mantenha as versões antigas para permitir rollback.

---

## Acesso ao Cluster

O `kubeconfig` externo é salvo em `.terraform/.kube/config-external`. Se `linux_overwrite_local_kube_config = true`, é copiado automaticamente para `~/.kube/config`.

```bash
# Verificar todos os nós
kubectl get nodes -o wide

# Saída esperada:
# NAME       STATUS   ROLES           AGE   VERSION   OS-IMAGE
# leader     Ready    control-plane   10m   v1.31.x   Ubuntu 24.04 LTS
# worker-0   Ready    worker          8m    v1.31.x   Ubuntu 24.04 LTS
# worker-1   Ready    worker          8m    v1.31.x   Ubuntu 24.04 LTS
# worker-2   Ready    worker          8m    v1.31.x   Ubuntu 24.04 LTS

# Verificar pods de todos os namespaces relevantes
kubectl get pods -n kube-system        # Sistema + Metrics Server
kubectl get pods -n ingress-nginx      # Ingress Controller
kubectl get pods -n cert-manager       # Gerenciador de certificados TLS
kubectl get pods -n oci-devops         # UDP Health Check
kubectl get pods -n adailsilva-site    # Site


# Verificar certificados TLS em todos os namespaces
kubectl get certificate -A

# Verificar Ingress em todos os namespaces
kubectl get ingress -A
```

### Acesso SSH

```bash
# Acesso direto ao leader (porta 22 do Load Balancer)
ssh -i ~/.ssh/id_ed25519 ubuntu@<IP_PUBLICO_RESERVADO>

# Acesso a um worker (via jump através do leader)
ssh -i ~/.ssh/id_ed25519 \
    -J ubuntu@<IP_PUBLICO_RESERVADO> \
    ubuntu@<IP_PRIVADO_WORKER>
```

### Kubernetes Dashboard

Acessível em `https://<cluster_public_dns_name>/dashboard`.

```bash
# Obter o token de acesso
tofu output admin_token
```

---

## CI/CD com GitHub Actions

O pipeline segue o **padrão comum aos repositórios do cluster**: um job `detect` descobre o que mudou (`dorny/paths-filter`) e cada aplicação tem o seu job, todos no runner self-hosted ARM64 (`runs-on: [self-hosted, Linux, ARM64]`).

### Workflow main.yml

| Job | Dispara com | Namespace | Imagem OCIR | Application ArgoCD |
|---|---|---|---|---|
| `app_adailsilva_site_frontend` | `04.homepage/app_adailsilva_site_frontend/**` | `adailsilva-site` | `app-adailsilva-site-frontend_platform_linux-arm64` | `adailsilva-site-frontend` |
| `plataforma_metrics_server` | `01.metrics_server/kubernetes/**` | `kube-system` | — (imagem pública) | `plataforma-metrics-server` |
| `plataforma_udp_health_check` | `02.udp_health_check-nlb_oci/**` | `oci-devops` | `udp-health-check-server-{1700,1710}_platform_linux-arm64` | `plataforma-udp-health-check` |
| `plataforma_portainer` | `03.portainer_ce/kubernetes/**` | `portainer` | — (imagem pública) | `plataforma-portainer` |

Um **único workflow** (`CI/CD with GitHub Actions`) para todas as aplicações: o `detect` decide e só roda o job de quem mudou. Ordem: **detect → aprovação (job `aprovacao`, environment `producao` com revisor obrigatório: *Review deployments* na execução) → metrics-server (01), UDP health check (02), Portainer CE (03) e site (04) em paralelo → demais sistemas**. `workflow_dispatch` → `target`: `todos`, `app-adailsilva-site-frontend`, `metrics-server`, `udp-health-check`, `portainer` ou `plataforma`. Os jobs da plataforma do cluster (`plataforma_*`, idênticos nos 6 repositórios) seguem o modelo dono × cópia descrito em [gitops/README.md](gitops/README.md#jobs-da-plataforma-plataforma_-no-mainyml).

Passos de cada job de sistema (iguais em todos os repositórios):

1. Calcula a próxima versão `X.Y` pelas tags Git do componente (`workflow_dispatch` com `version_type=major` sobe o major) e cria a tag.
2. Instala/valida OCI CLI e kubectl; garante o namespace (espera sair de `Terminating`, se for o caso).
3. **Garante o repositório no OCIR** (cria se faltar; depois traga-o para o state com `./sync_terraform_state.sh importar`).
4. Build `linux/arm64` com cache no registry, `--provenance=false --sbom=false`, tags `X.Y` e `latest`.
5. Aplica a infraestrutura base (Namespace, Service, Ingress e o que o sistema precisar) e o `oci-registry-secret`.
6. **Fixar versão no GitOps:** troca o `newTag` da `kustomization.yaml` num worktree de `origin/master`, comita `deploy: <componente> X.Y [skip ci]` e faz push (até 5 tentativas). O ArgoCD aplica o Deployment.

`concurrency` com `cancel-in-progress: false`: execuções do workflow não disputam o push do GitOps.

### Versionamento por tags

```bash
git fetch --tags
git tag --list 'app-adailsilva-site-frontend-*' | sort -V | tail -5
```

### Forçar um deploy (force_deploy.sh)

Grava/atualiza o arquivo `.force-deploy` (data/hora + ID) nos projetos selecionados, comita só esses arquivos e faz push com `pull --rebase`. Como o arquivo muda, o `paths-filter` dispara o job correspondente.

```bash
./force_deploy.sh                 # todos os projetos
./force_deploy.sh site            # apenas os que contêm o(s) termo(s)
./force_deploy.sh --dry-run       # só mostra o que seria feito
./force_deploy.sh --no-push       # cria o commit, sem push
```

### Secrets do repositório GitHub

Cadastre em **Settings → Secrets and variables → Actions → New repository secret** (mesmos valores nos 6 repositórios, exceto o que for próprio de mobile):

| Secret | Valor esperado | Como obter |
|---|---|---|
| `OCI_CONFIG` | Conteúdo completo do arquivo `~/.oci/config` | `oci setup config` (o pipeline corrige o `key_file` para o home do runner) |
| `OCI_KEY_FILE` | Conteúdo da chave privada OCI (`oci_api_key.pem`) | `~/.oci/oci_api_key.pem` |
| `KUBECONFIG` | Kubeconfig externo do cluster | Gerado pelo Terraform em `.terraform/.kube/config-external` |
| `OCI_REGISTRY_URL` | URL do OCI Container Registry | Ex.: `gru.ocir.io` |
| `OCI_REGISTRY_USERNAME` | Usuário do OCI Registry | `<namespace>/<seu_email>` |
| `OCI_REGISTRY_PASSWORD` | Auth token do OCI Registry | **OCI Console → Identity → Users → Auth Tokens** |
| `OCI_REGISTRY_EMAIL` | E-mail da conta OCI | O mesmo do `OCI_REGISTRY_USERNAME` |
| `OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE` | Namespace do Object Storage | `oci os ns get` |
| `GH_PAT` | Personal Access Token com escopos `repo` e `workflow` | **GitHub → Settings → Developer settings → Personal access tokens** — checkout, tags e commit do GitOps |

### Verificar a execução do pipeline

```bash
gh run list --repo AdailSilva/k8s-arm-oci-always-free_standart --limit 5
gh run watch --repo AdailSilva/k8s-arm-oci-always-free_standart
kubectl -n argocd get applications | grep -E '^NAME|^adailsilva-'
```

---

## Self-Hosted Runner OCI ARM64

### Por que usar self-hosted runner

Repositórios que geram imagens Docker para arquitetura `linux/arm64` incorrem em custo no GitHub Actions porque runners ARM64 hospedados pelo GitHub são sempre cobrados (2× o preço do Linux x64, sem minutos gratuitos).

Como a infraestrutura já roda em instâncias ARM64 da Oracle Cloud (OCI), o runner pode ser instalado diretamente nessas máquinas, eliminando o custo de build no GitHub Actions.

| Situação | Custo mensal estimado |
|---|---|
| Runners ARM64 hospedados pelo GitHub | ~$25 |
| Self-hosted runner na instância OCI | $0 |

---

### Pré-requisitos do runner

- Instância OCI com arquitetura ARM64 (Ampere A1) acessível via SSH
- Usuário com permissão `sudo`
- Docker instalado na instância (veja seção abaixo)
- OCI CLI instalado na instância (veja seção abaixo)
- Acesso de administrador ao repositório GitHub

---

### 0. Instalar o Docker no Ubuntu ARM64

Execute os comandos abaixo na instância OCI antes de qualquer outra etapa.

#### 0.1 Remover versões antigas (se houver)

```bash
sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
```

#### 0.2 Instalar dependências e adicionar o repositório oficial

```bash
sudo apt-get update

sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# Adicionar a chave GPG oficial do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Adicionar o repositório
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### 0.3 Instalar o Docker Engine

```bash
sudo apt-get update

sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

#### 0.4 Habilitar e iniciar o serviço

```bash
sudo systemctl enable docker
sudo systemctl start docker

# Verificar status
sudo systemctl status docker
```

#### 0.5 Permitir uso sem `sudo` (opcional, mas recomendado para o runner)

```bash
sudo usermod -aG docker $USER

# Aplicar o grupo sem precisar de logout/login
newgrp docker
```

#### 0.6 Verificar a instalação

```bash
docker --version
docker run hello-world
```

A saída esperada do `hello-world` confirma que o Docker está funcionando corretamente.

---

### 0.7 Instalar o OCI CLI na instância

O OCI CLI é necessário para operações que interagem diretamente com a Oracle Cloud (listagem de recursos, autenticação, etc.). Instale-o antes de configurar o runner.

#### 0.7.1 Preparar dependências Python

O instalador do OCI CLI cria um virtualenv internamente. Sem essas dependências o processo falha com `FileNotFoundError: pip` ou erros de lock do apt:

```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv python3-dev
```

> ⚠️ **Atenção — lock do apt:** Se o comando `apt-get update` falhar com `Could not get lock /var/lib/apt/lists/lock`, outro processo está usando o apt (atualizações automáticas do Ubuntu). Aguarde alguns minutos e tente novamente, ou force a liberação:
>
> ```bash
> sudo rm -f /var/lib/apt/lists/lock
> sudo rm -f /var/cache/apt/archives/lock
> sudo rm -f /var/lib/dpkg/lock-frontend
> sudo apt-get update
> ```

#### 0.7.2 Instalar o OCI CLI

```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" -- --accept-all-defaults
```

O instalador cria o ambiente em `~/lib/oracle-cli` e o binário em `~/bin/oci`.

#### 0.7.3 Adicionar ao PATH

```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### 0.7.4 Verificar a instalação

```bash
oci --version
```

#### 0.7.5 Limpar instalação anterior quebrada (se necessário)

Se uma tentativa anterior falhou (por exemplo, por lock do apt ou pip ausente), limpe os artefatos antes de reinstalar:

```bash
rm -rf ~/lib/oracle-cli
rm -rf ~/bin/oci-cli-scripts
rm -f ~/bin/oci
```

Em seguida, repita os passos 0.7.1 e 0.7.2.

---

### 1. Gerar o token do runner no GitHub

Acesse a página de novo runner do repositório:

```
https://github.com/<USER>/<REPO>/settings/actions/runners/new
```

Selecione:
- **Sistema operacional:** Linux
- **Arquitetura:** ARM64

O GitHub exibirá os comandos com o token já preenchido. Copie-os para usar nos passos seguintes.

> ⚠️ **Atenção — validade do token:** O token de registro gerado pelo GitHub expira em **1 hora**. Todos os comandos do passo 2 (`curl`, `tar` e `./config.sh`) devem ser executados dentro desse prazo. O sintoma de token expirado é um erro `404 Not Found` ao rodar o `./config.sh` — nesse caso, retorne a esta página, gere um novo token e execute o `./config.sh` novamente.

---

### 2. Instalar o runner na instância OCI

Conecte-se à instância via SSH e execute:

```bash
# Criar diretório do runner
mkdir ~/actions-runner && cd ~/actions-runner

# Baixar o pacote (use a URL gerada pelo GitHub no passo anterior)
curl -o actions-runner-linux-arm64.tar.gz -L \
  https://github.com/actions/runner/releases/download/vX.X.X/actions-runner-linux-arm64-X.X.X.tar.gz

# Extrair
tar xzf actions-runner-linux-arm64.tar.gz

# Configurar (use a URL e o token gerados pelo GitHub)
./config.sh \
  --url https://github.com/<USER>/<REPO> \
  --token <TOKEN_GERADO_PELO_GITHUB>
```

Durante a configuração serão feitas perguntas interativas (nome do runner, labels etc.). Os valores padrão funcionam bem — basta pressionar Enter.

---

### 3. Instalar como serviço systemd

Para que o runner inicie automaticamente e sobreviva a reboots:

```bash
sudo ./svc.sh install
sudo ./svc.sh start

# Verificar status
sudo ./svc.sh status
```

---

### 4. Atualizar o workflow do repositório

São três mudanças por job de build no arquivo `.github/workflows/main.yml`:

#### 4.1 Trocar o `runs-on`

```yaml
# Antes — runner ARM64 pago no GitHub
runs-on: ubuntu-latest

# Depois — runner self-hosted na instância OCI (gratuito)
runs-on: self-hosted
```

Se houver múltiplos runners self-hosted com finalidades diferentes, use labels para direcionar o job ao runner correto:

```yaml
runs-on: [self-hosted, linux, arm64]
```

#### 4.2 Remover o step do QEMU

O QEMU é necessário apenas para emular ARM64 em máquinas x86. Na instância OCI ARM64 o build já é nativo, então o step pode ser removido inteiramente:

```yaml
# Remover este step — não é mais necessário
- name: Set up QEMU
  uses: docker/setup-qemu-action@v4
```

#### 4.3 Ajustar o `--platform` no buildx

Como o Kubernetes do projeto roda inteiramente em ARM64, basta gerar a imagem para `linux/arm64`. Manter `linux/amd64` exigiria emulação (QEMU) e voltaria a gerar custo.

```yaml
# Antes — multi-arch via emulação QEMU
--platform linux/amd64,linux/arm64

# Depois — nativo ARM64, sem emulação
--platform linux/arm64
```

#### 4.4 Jobs que precisam das mudanças

O job `detect` não faz build Docker — pode permanecer em `ubuntu-latest` sem custo. Os demais devem ser atualizados:

| Job | Trocar `runs-on` | Remover QEMU | Ajustar `--platform` |
|---|:---:|:---:|:---:|
| `detect` | ✗ (manter) | ✗ | ✗ |
| `app_adailsilva_site_frontend` | ✓ | ✓ | ✓ |

#### 4.5 Exemplo completo — job antes e depois

**Antes (pago, com emulação):**

```yaml
app_adailsilva_site_frontend:
  name: Adail Silva - Site – Frontend (Angular)
  runs-on: ubuntu-latest          # <- runner pago
  timeout-minutes: 45
  needs: detect

  steps:
    - name: Checkout
      uses: actions/checkout@v5

    - name: Set up QEMU              # <- remover
      uses: docker/setup-qemu-action@v4

    - name: Set up Docker Buildx
      id: buildx
      uses: docker/setup-buildx-action@v4
      with:
        driver: docker-container

    - name: Build & Push – Adail Silva - Site – Frontend
      run: |
        docker buildx build \
          --platform linux/amd64,linux/arm64 \   # <- remover amd64
          ...
```

**Depois (gratuito, build nativo):**

```yaml
app_adailsilva_site_frontend:
  name: Adail Silva - Site – Frontend (Angular)
  runs-on: self-hosted             # <- instância OCI ARM64
  timeout-minutes: 45
  needs: detect

  steps:
    - name: Checkout
      uses: actions/checkout@v5

    # Set up QEMU removido

    - name: Set up Docker Buildx
      id: buildx
      uses: docker/setup-buildx-action@v4
      with:
        driver: docker-container

    - name: Build & Push – Adail Silva - Site – Frontend
      run: |
        docker buildx build \
          --platform linux/arm64 \               # <- apenas ARM64 nativo
          ...
```

---

### 5. Dois runners por worker

Os runners são registrados **por repositório**: cada um dos 6 repositórios tem o seu runner, e cada worker ARM64 hospeda **dois** deles, cada um na sua pasta e com o seu serviço systemd:

| Worker | Runners (`<projeto>`) |
|---|---|
| `worker-0` | standart · chirpstack |
| `worker-1` | cslab · 3tsensors |
| `worker-2` | asesolucoes · pfgrafica |

Padrão de nomes: runner `worker-N-<projeto>-runner` (label `worker-N`), pasta `~/<repositório>-actions-runner` e serviço `actions.runner.AdailSilva-<repositório>.worker-N-<projeto>-runner.service`.

Os jobs usam `runs-on: [self-hosted, Linux, ARM64]`: como o runner é do repositório, só ele recebe os jobs deste repositório, e o label `worker-N` não precisa aparecer no `runs-on`.

#### 5.1 Runner deste repositório

| Item | Valor |
|---|---|
| Worker | `worker-0` (`ssh ubuntu@147.15.55.142`) |
| Runner / label | `worker-0-standart-runner` / `worker-0` |
| Pasta | `~/k8s-arm-oci-always-free_standart-actions-runner` |
| Serviço | `actions.runner.AdailSilva-k8s-arm-oci-always-free_standart.worker-0-standart-runner.service` |

#### 5.2 Criar ou recriar os runners

Não registre à mão: a fase `runners` do `~/Apps/OracleCloud/criar_repositorios_github.sh` gera o token de registro, baixa o runner, roda o `config.sh --replace` por SSH no worker certo e instala o serviço systemd:

```bash
bash ~/Apps/OracleCloud/criar_repositorios_github.sh runners
```

Os passos 1–3 acima mostram o que o script faz, caso seja preciso registrar um runner manualmente.

#### 5.3 Verificar o serviço

```bash
ssh ubuntu@147.15.55.142

cd ~/k8s-arm-oci-always-free_standart-actions-runner && sudo ./svc.sh status
sudo systemctl status actions.runner.AdailSilva-k8s-arm-oci-always-free_standart.worker-0-standart-runner.service

# Logs em tempo real (troque -f por -n 100 para ver só as últimas linhas)
journalctl -u actions.runner.AdailSilva-k8s-arm-oci-always-free_standart.worker-0-standart-runner.service -f

# Os dois runners deste worker
sudo systemctl list-units 'actions.runner.*' --no-pager
```

O runner aparece em **Settings → Actions → Runners** do repositório com status **Idle** (aguardando jobs).

---

### 6. Qual instância do cluster usar

**Uma instância por repositório** basta: cada repositório tem um único runner, num dos workers (ver seção 5).

O runner realiza duas operações principais:

```
[Runner — instância escolhida]
        |
        |-- docker build + push --> OCI Registry
        |
        `-- kubectl apply --------> API Server K8s --> todos os nós do cluster
```

O `kubectl` se comunica com o **API Server do Kubernetes pela rede**, portanto não importa em qual nó físico o runner está instalado — ele enxerga e controla o cluster inteiro da mesma forma.

#### Qual instância escolher

A escolha depende dos recursos disponíveis em cada nó. Builds Docker de imagens Angular e Spring Boot são pesados — consomem bastante RAM e CPU durante a compilação.

**Neste projeto:**

| Nó | RAM | Recomendação |
|---|---|---|
| control plane | 3 GB | ✗ Não usar — RAM disputada com etcd, kube-apiserver etc. |
| worker nodes | 7 GB cada | ✓ Instalar aqui |

Usar o control plane com apenas 3 GB é arriscado por dois motivos: o build pode sofrer OOM (Out of Memory) e ser cancelado, e os processos do Kubernetes no control plane (etcd, kube-apiserver, kube-scheduler, kube-controller-manager) podem ser prejudicados, desestabilizando o cluster inteiro.

O acesso ao cluster continua funcionando normalmente a partir de um worker — o `kubectl` se comunica com o API Server do control plane pela rede, sem nenhuma diferença.

Instale o runner em um dos workers e copie o `kubeconfig` do control plane para ele:

```bash
# No control plane: exibir o kubeconfig
cat ~/.kube/config

# No worker escolhido para o runner: criar o arquivo
mkdir -p ~/.kube
vi ~/.kube/config   # colar o conteúdo copiado do control plane

# Testar — deve listar todos os nós do cluster
kubectl get nodes
```

#### Por que não instalar em todos os nós

Mais de um runner por repositório só faria sentido para **balancear carga de builds** com muitos jobs em paralelo. Em vez disso, os 6 runners são distribuídos em dois por worker, o que divide a carga dos builds entre os três workers.

---

### 7. Verificar o runner no GitHub

Acesse:

```
https://github.com/<USER>/<REPO>/settings/actions/runners
```

O runner deve aparecer com o status **Idle** (aguardando jobs).

#### Comandos úteis de manutenção

```bash
# Ver status do serviço
sudo ./svc.sh status

# Parar o runner
sudo ./svc.sh stop

# Remover o runner (desregistra do GitHub também)
./config.sh remove --token <TOKEN>
```

#### Troubleshooting do runner

**Erro: `no such file or directory` ao rodar o buildx**

```
ERROR: failed to initialize builder builder-XXXX: failed to connect to the docker API
at unix:///var/run/docker.sock; check if the path is correct and if the daemon is running:
dial unix /var/run/docker.sock: connect: no such file or directory
```

Causa: o Docker daemon não está rodando ou não foi instalado.

```bash
docker --version
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker
ls -la /var/run/docker.sock
```

Se o Docker não estiver instalado, siga a **seção 0** acima.

---

**Erro: `permission denied` ao rodar o buildx**

```
ERROR: failed to initialize builder builder-XXXX: permission denied while trying to
connect to the docker API at unix:///var/run/docker.sock
```

Causa: o usuário que executa o runner não tem permissão para acessar o socket do Docker.

```bash
# Adicionar o usuário ubuntu ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar os runners do worker para aplicar a nova permissão de grupo
sudo systemctl restart 'actions.runner.*'

# Confirmar que os dois estão ativos
sudo systemctl list-units 'actions.runner.*' --no-pager
```

> ⚠️ **Por que reiniciar é obrigatório:** A adição ao grupo docker só é aplicada em novas sessões. O `newgrp docker` funciona para sessões interativas do terminal, mas **não afeta serviços systemd já em execução** — apenas o restart do serviço força o processo a herdar o novo grupo.

---

## OCI Container Registry

O módulo `oci-infra_ci_cd` cria repositórios privados no **OCI Container Registry** para armazenar imagens Docker **ARM64** do cluster:

| Repositório | Arquitetura | Aplicação |
|---|---|---|
| `app-adailsilva-site-frontend_platform_linux-arm64` | ARM64 | Site Adail Silva (`k8s.adailsilva.com.br`) |
| `udp-health-check-server-1700_platform_linux-arm64` | ARM64 | UDP Health Check porta 1700 |
| `udp-health-check-server-1710_platform_linux-arm64` | ARM64 | UDP Health Check porta 1710 |

Novos repositórios podem ser adicionados em `oci_artifacts_container_repository/oci_artifacts_container_repository.tf`.

---

## Destruindo a Infraestrutura

> ⚠️ As instâncias de compute e o IP reservado possuem `prevent_destroy = true`. Edite os respectivos arquivos `.tf` antes de executar o destroy se quiser remover todos os recursos.

```bash
tofu destroy
```

O script `reset.sh` é executado automaticamente em cada nó antes da destruição, realizando uma limpeza ordenada do cluster Kubernetes.

---

## Troubleshooting

### ❌ `Out of capacity for shape VM.Standard.A1.Flex`

A região está sem capacidade ARM disponível.

**Solução:** Mude a variável `region` para `us-ashburn-1` ou `us-phoenix-1` e execute `tofu apply` novamente.

---

### ❌ `NotAuthenticated` — Falha na autenticação OCI

**Solução:** Confirme que o `fingerprint` no `.tfvars` é idêntico ao exibido no console OCI após o upload da API Key. Verifique também o caminho correto da chave privada.

---

### ❌ Nós em estado `NotReady`

O CNI (Flannel) pode não ter inicializado ainda.

```bash
kubectl describe node <nome-do-no>
kubectl get pods -n kube-flannel -o wide

# Ver logs de inicialização na VM
ssh -i ~/.ssh/id_ed25519 ubuntu@<IP_PUBLICO> \
  "sudo tail -100 /var/log/cloud-init-output.log"
```

---

### ❌ Preflight errors no `kubeadm init` (NumCPU / Mem)

Já contornado automaticamente com `--ignore-preflight-errors=NumCPU,Mem` no script `setup-control-plane.sh`.

---

### ❌ Let's Encrypt não emite certificado

A causa mais comum é que o registro DNS do subdomínio ainda não existe ou ainda não propagou. O cert-manager usa o desafio **ACME HTTP-01**, que exige que o subdomínio resolva para o IP do NLB no momento da verificação.

**1. Confirmar que o DNS está propagado e aponta para o IP correto:**

```bash
# Obter o IP do NLB
tofu output -raw cluster_public_ip

# Verificar cada subdomínio — deve retornar o IP do NLB
dig +short k8s.seudominio.com.br

# Confirmar propagação via DNS público
dig +short k8s.seudominio.com.br @8.8.8.8
dig +short k8s.seudominio.com.br @1.1.1.1
```

> Se o DNS não retornar o IP correto, cadastre ou corrija o registro no seu provedor (ex: Registro.br) e aguarde a propagação. Consulte a seção [Configuração de DNS — Subdomínios Obrigatórios](#configuração-de-dns--subdomínios-obrigatórios).

**2. Verificar o status do certificado e do desafio ACME:**

```bash
# Status geral dos certificados em todos os namespaces
kubectl get certificate -A

# Detalhes do certificado — procure por "Message" e "Reason"


# Detalhes do desafio HTTP-01 — procure pelo campo "Presented" e "Reason"
kubectl describe challenges -A

# Verificar o CertificateRequest
kubectl describe certificaterequest -A
```

**3. Verificar se o Ingress NGINX está roteando o desafio corretamente:**

```bash
# O cert-manager cria um Ingress temporário durante o desafio
kubectl get ingress -A | grep cm-acme

# Os pods do Ingress devem estar Running
kubectl get pods -n ingress-nginx
```

**4. Verificar se o subdomínio está correto no manifesto Ingress:**

```bash
# O host no Ingress deve bater exatamente com o registro DNS

```

---

### ❌ Let's Encrypt — `429 rateLimited`: limite de 5 certificados por semana atingido

Este é um dos erros mais frustrantes no ciclo de desenvolvimento com cert-manager, pois **bloqueia completamente a emissão de novos certificados por até 7 dias** para um domínio específico. Ocorre quando o mesmo conjunto exato de nomes de domínio (identifiers) é usado para solicitar certificados repetidamente — algo comum durante reinstalações de cluster, ajustes de Ingress, ou deleção acidental de Secrets TLS.

#### Como se manifesta

O certificado fica com `READY = False` indefinidamente. Ao descrever o objeto `Certificate`:

```bash
kubectl describe certificate <nome-do-certificado> -n <namespace>
```

A saída mostra um evento de falha como este:

```
Warning  Failed  cert-manager-certificates-issuing
  The certificate request has failed to complete and will be retried:
  Failed to wait for order resource "<nome>-<hash>" to become ready:
  order is in "errored" state: Failed to create Order: 429
  urn:ietf:params:acme:error:rateLimited: too many certificates (5) already
  issued for this exact set of identifiers in the last 168h0m0s,
  retry after 2026-05-24 13:14:58 UTC:
  see https://letsencrypt.org/docs/rate-limits/#new-certificates-per-exact-set-of-identifiers
```

O campo-chave é `retry after <data e hora UTC>` — é exatamente quando o bloqueio expira.

#### Causa raiz

O Let's Encrypt impõe um limite de **5 certificados por semana (168 horas) para um conjunto exato de domínios**. Cada vez que o cert-manager solicita um certificado — seja por reinstalação do cluster, deleção manual do Secret TLS, reaplicação do Ingress, ou qualquer motivo que faça o objeto `Certificate` ser recriado — uma nova emissão é contabilizada. Ao atingir 5, a API retorna HTTP 429 e rejeita todas as tentativas subsequentes até o janela de 7 dias zerar.

> ⚠️ O limite é por **conjunto exato de identifiers** (nomes de domínio). `api.meudominio.com.br` e `api.meudominio.com.br` + `www.meudominio.com.br` são contados separadamente — mas a mesma combinação repetida 5 vezes ativa o bloqueio.

#### Diagnóstico completo

```bash
# 1. Ver o status de todos os certificados do namespace
kubectl get certificate -n <namespace>
# Procure por READY = False

# 2. Descrever o certificado afetado para ver a mensagem de rate limit
kubectl describe certificate <nome-do-cert> -n <namespace>

# 3. Ver os CertificateRequests (tentativas de emissão)
kubectl get certificaterequest -n <namespace>
kubectl describe certificaterequest <nome-do-cr> -n <namespace>

# 4. Ver os Orders (pedidos à API ACME do Let's Encrypt)
kubectl get order -n <namespace>
kubectl describe order <nome-do-order> -n <namespace>
# Procure por: order is in "errored" state

# 5. Ver os Challenges (se existirem — geralmente não chegam a ser criados quando há rate limit)
kubectl get challenge -n <namespace>

# 6. Confirmar que o Secret TLS não existe (causa que disparou a reemissão)
kubectl get secret -n <namespace> | grep tls
```

**Saída esperada que confirma o cenário** (exemplo com dois serviços, um afetado e outro não):

```
NAME                        READY   SECRET                      AGE
meu-servico-backend-tls     False   meu-servico-backend-tls     30m
meu-servico-frontend-tls    True    meu-servico-frontend-tls    28m
```

Neste exemplo, um dos certificados foi emitido com sucesso porque havia disponibilidade no rate limit. O outro falhou porque o limite já havia sido atingido naquela janela de 7 dias — situação comum quando dois ou mais subdomínios de um mesmo projeto são registrados em sequência durante reinstalações ou ajustes de manifesto.

#### O que fazer enquanto aguarda o desbloqueio

O bloqueio é automático — não há como solicitar remoção. A única saída limpa é esperar. Enquanto isso, há três abordagens:

---

**Opção A — Usar `letsencrypt-staging` para validar o fluxo (recomendada)**

O ambiente de staging do Let's Encrypt tem limites muito mais altos (não bloqueia em situações normais de desenvolvimento) e permite validar toda a cadeia cert-manager → Ingress → ACME → HTTPS **sem consumir quota do ambiente de produção**. O certificado emitido não é confiável pelos browsers, mas a API responde via HTTPS e os testes funcionam.

Se ainda não tiver o ClusterIssuer de staging, crie-o:

```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: seu-email@dominio.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

Em seguida, troque a anotação do Ingress afetado para apontar para o staging:

```bash
kubectl annotate ingress <nome-do-ingress> \
  -n <namespace> \
  cert-manager.io/cluster-issuer=letsencrypt-staging \
  --overwrite
```

Acompanhe a emissão:

```bash
kubectl get certificate -n <namespace> -w
# Aguarde READY = True
```

Com isso o Ingress volta a funcionar via HTTPS (com aviso de certificado não confiável no browser) e você pode continuar o desenvolvimento.

---

**Opção B — Aguardar e reemitir após o desbloqueio**

A mensagem de erro indica exatamente quando o bloqueio expira:

```
retry after <data e hora UTC — indicada na mensagem de erro>
```

Após esse horário, delete o objeto `Certificate` para forçar uma nova tentativa de emissão:

```bash
# Deletar o Certificate faz o cert-manager recriar tudo do zero
kubectl delete certificate <nome-do-cert> -n <namespace>

# Certificar que o Ingress ainda tem a anotação correta apontando para prod
kubectl describe ingress <nome-do-ingress> -n <namespace> | grep cluster-issuer

# Reaplicar o Ingress se necessário
kubectl apply -f <arquivo-ingress>.yaml

# Acompanhar a emissão
kubectl get certificate -n <namespace> -w
```

---

**Opção C — Certificado wildcard com DNS-01 (solução definitiva para múltiplos subdomínios)**

Se o projeto tem vários subdomínios sob o mesmo domínio raiz (como `api.meudominio.com.br`, `app.meudominio.com.br`, `dashboard.meudominio.com.br` etc.), a melhor estratégia de longo prazo é emitir **um único certificado wildcard** `*.meudominio.com.br` que cobre todos eles com uma única emissão — eliminando o risco de atingir rate limit por subdomínio.

Requer validação DNS-01 (não HTTP-01), que exige integração com o provedor de DNS. Exemplo para Cloudflare:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard-meudominio
  namespace: <namespace>
spec:
  secretName: wildcard-meudominio-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - "*.meudominio.com.br"
    - "meudominio.com.br"
```

Consulte a documentação do cert-manager para configurar o solver DNS-01 com seu provedor: https://cert-manager.io/docs/configuration/acme/dns01/

---

#### Anotações conflitantes no Ingress que agravam o problema

Um ponto importante que pode ter contribuído para o acúmulo de tentativas de emissão: **anotações duplicadas com valores conflitantes** no manifesto do Ingress. O Kubernetes aplica a última ocorrência de uma chave duplicada no YAML, mas o comportamento pode ser inconsistente dependendo da versão da ferramenta aplicando o manifesto.

Exemplo de conflito comum em manifestos copiados ou gerados incrementalmente:

```yaml
# ❌ Conflito — mesma chave com valores opostos
nginx.ingress.kubernetes.io/ssl-redirect: "true"   # linha 1 — ignorada
# ... outras anotações ...
nginx.ingress.kubernetes.io/ssl-redirect: "true"    # linha 2 — vence, mas causa confusão
```

**Corrija removendo a duplicata e mantenha apenas:**

```yaml
nginx.ingress.kubernetes.io/ssl-redirect: "true"
nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
```

Além disso, o `pathType: Prefix` **não processa expressões regulares** — ele usa correspondência de prefixo literal. Para usar padrões como `/?(.*)` no path, o tipo correto é `ImplementationSpecific`:

```yaml
# ❌ Errado — ignora o regex, comportamento inesperado
- path: /?(.*)
  pathType: Prefix

# ✅ Correto — processa o regex via Ingress NGINX
- path: /?(.*)
  pathType: ImplementationSpecific
```

#### Manifesto Ingress corrigido (referência genérica)

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <nome-do-servico>-ingress
  namespace: <namespace>
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "63072000"
    nginx.ingress.kubernetes.io/hsts-include-subdomains: "true"
  labels:
    app: <nome-do-servico>-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - <subdominio>.seudominio.com.br
      secretName: <nome-do-servico>-tls
  rules:
    - host: <subdominio>.seudominio.com.br
      http:
        paths:
          - path: /?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: <nome-do-servico>-service
                port:
                  number: 8080
```

> ⚠️ Quando um Ingress concentra múltiplos serviços no mesmo host, sempre coloque paths mais específicos (como `/api/?(.*)`) **antes** do path coringa (`/?(.*)`) — o Ingress NGINX avalia as regras na ordem em que aparecem no manifesto e a primeira correspondência vence.

#### Resumo do cenário e resolução

| Elemento | Status | Detalhe |
|---|---|---|
| Certificado do serviço A | ✅ `READY=True` | Emitido com sucesso antes de atingir o limite |
| Certificado do serviço B | ❌ `READY=False` | Rate limit atingido — 5 emissões em 7 dias |
| Secret TLS do serviço B | ❌ Não existe | Ausente ou deletado, disparou nova tentativa de emissão |
| Desbloqueio | ⏳ Automático | Após `retry after` indicado na mensagem de erro |
| Ação imediata | 🔧 Usar staging | Trocar `cluster-issuer` para `letsencrypt-staging` |
| Ação pós-desbloqueio | 🔁 Deletar Certificate | `kubectl delete certificate <nome> -n <namespace>` e reaplicar |

> 💡 **Boas práticas para evitar o rate limit:** nunca delete o Secret TLS manualmente sem necessidade; use `letsencrypt-staging` durante o desenvolvimento e testes de Ingress; consolide subdomínios em um certificado wildcard se o projeto crescer; monitore o status dos certificados com `kubectl get certificate -A` antes de reinstalar ou recriar recursos.

---

### ❌ Pods com `ImagePullBackOff` no namespace `oci-devops`

O Secret de acesso ao OCI Registry pode estar faltando ou incorreto.

```bash
# Verificar se o Secret existe
kubectl get secret oci-registry-secret -n oci-devops

# Recriar o Secret
kubectl delete secret oci-registry-secret -n oci-devops
kubectl create secret docker-registry oci-registry-secret \
  --docker-server=gru.ocir.io \
  --docker-username='<namespace>/<seu_email>' \
  --docker-password='<auth_token>' \
  --docker-email='<seu_email>' \
  -n oci-devops
```

---

### ❌ NLB Overall Health: Critical — portas UDP 1700 ou 1710

O **Overall Health do NLB fica `Critical`** enquanto qualquer listener não tiver backends saudáveis. Para as portas UDP, a causa mais comum é que o `UdpHealthCheckServer` não está rodando ou não está acessível diretamente no IP do nó.

**1. Verificar se os pods estão Running:**

```bash
kubectl get pods -n oci-devops -o wide
kubectl get daemonset -n oci-devops

# Todos os DaemonSets devem ter DESIRED = CURRENT = READY = 3
```

**2. Confirmar que `hostNetwork: true` está ativo:**

```bash
kubectl get pod <nome-do-pod-udp-1700> -n oci-devops -o jsonpath='{.spec.hostNetwork}'
# Saída esperada: true
```

**3. Testar o PING/PONG diretamente nos workers:**

```bash
# Obter os IPs dos workers
kubectl get nodes -o wide | grep worker

# Testar porta 1700
echo "PING" | nc -u -w2 <IP_DO_WORKER> 1700
# Resposta esperada: PONG

# Testar porta 1710
echo "PING" | nc -u -w2 <IP_DO_WORKER> 1710
# Resposta esperada: PONG
```

**4. Verificar as Security Lists da subnet no console OCI:**

As portas UDP 1700 e 1710 precisam estar liberadas nas **Ingress Rules** da Security List da subnet pública:

- Protocolo: `UDP`
- Porta de destino: `1700` e `1710`
- Origem: `0.0.0.0/0` (ou o CIDR do NLB)

**5. Verificar os logs do pod:**

```bash
kubectl logs -l app=udp-1700 -n oci-devops --tail=50
# Log esperado: "UDP Health Check Server listening on port 1700..."
```

**6. Reimplantar se necessário:**

```bash
kubectl rollout restart daemonset udp-app-with-healthcheck-1700-daemon-set -n oci-devops
kubectl rollout restart daemonset udp-app-with-healthcheck-1710-daemon-set -n oci-devops
```

**7. Confirmar a recuperação no console OCI:**

Após corrigir o problema, aguarde 1 a 2 minutos e acesse **Networking → Load Balancers → Network Load Balancers → (seu NLB) → Overall Health**. O status deve mudar de `Critical` para `OK`.

---

### ❌ Timeout de SSH durante o `tofu apply`

O Load Balancer pode levar alguns minutos para propagar os listeners. O OpenTofu aguarda automaticamente (timeout de 5 minutos). Se persistir, re-execute `tofu apply` — o processo é idempotente.

---

---

### ❌ GitHub Actions — `Input required and not supplied: token`

O workflow falha imediatamente no step de `Checkout` com esse erro quando `token:` recebe um valor vazio — por exemplo `token: ${{ secrets.GH_PAT }}` sem o secret `GH_PAT` cadastrado.

Este repositório é **público**, então o checkout funciona com o `GITHUB_TOKEN` padrão. Os steps de checkout usam o `GH_PAT` quando ele existe (é ele que cria as tags e faz o push do commit de GitOps) e caem no `github.token` quando não existe — por isso o erro não deve aparecer com o `main.yml` atual.

**Solução:** se algum step de checkout novo ou alterado estiver sem o fallback, use o mesmo padrão dos demais:

```yaml
- name: Checkout
  uses: actions/checkout@v5
  with:
    fetch-depth: 0
    token: ${{ secrets.GH_PAT || github.token }}
```

> ⚠️ O `fetch-depth: 0` é obrigatório junto com o token nos jobs que usam `dorny/paths-filter` ou que criam tags Git — sem ele o histórico de commits fica truncado e a detecção de paths alterados falha.

Verifique também que o secret `GH_PAT` está cadastrado no repositório em **Settings → Secrets and variables → Actions → Repository secrets** — criá-lo apenas em **Developer settings → Personal access tokens** não é suficiente, pois o runner não tem acesso automático a tokens pessoais.

---

### ❌ GitHub Actions — `refusing to allow a Personal Access Token to create or update workflow`

O pipeline falha no step **Criar tag Git** com o erro:

```
! [remote rejected] <tag> -> <tag> (refusing to allow a Personal Access Token
to create or update workflow `.github/workflows/main.yml` without `workflow` scope)
```

Isso acontece porque o repositório contém arquivos em `.github/workflows/` e o GitHub bloqueia qualquer push de tag que referencie commits com arquivos de workflow quando o PAT não tem o scope `workflow` — mesmo que a intenção seja apenas criar uma tag de versão, não modificar o workflow.

**Solução:** adicionar o scope `workflow` ao token existente:

1. Acesse **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Clique no token `GH_PAT` → **Edit**
3. Marque ✅ `workflow` (além do `repo` que já deve estar marcado)
4. Clique em **Regenerate token** e **copie o novo valor** (exibido apenas uma vez)
5. Atualize o secret no repositório: **Settings → Secrets and variables → Actions → `GH_PAT` → Update**

> O PAT precisa ter obrigatoriamente os scopes `repo` **e** `workflow` para funcionar corretamente neste pipeline.

---

### ❌ `409-NAMESPACE_CONFLICT` ao criar repositório no OCI Container Registry via Terraform

O `tofu apply` falha após ~2 minutos com o erro abaixo ao tentar criar repositórios no OCI Container Registry:

```
Error: 409-NAMESPACE_CONFLICT, Repository already exists.
```

**Causa:** o OCI Container Registry agrupa repositórios por namespace baseado no prefixo do nome. Quando dois repositórios compartilham o mesmo prefixo — como `minhaempresa-backend_platform_linux-arm64` e `minhaempresa-frontend_platform_linux-arm64` — o OCI os trata como pertencentes ao mesmo namespace e rejeita a criação do segundo com `NAMESPACE_CONFLICT`, mesmo que o repositório não exista ainda. O Terraform não salva o recurso no state porque a API retornou erro, mas a OCI pode ter criado o repositório parcialmente.

**Solução — usar namespace hierárquico com barra `/`:**

O padrão correto do OCI Registry para separar repositórios com prefixo comum é usar `/` como separador de namespace no `display_name`:

```hcl
# ❌ Errado — causa NAMESPACE_CONFLICT quando há dois repositórios com mesmo prefixo
display_name = "minhaempresa-backend_platform_linux-arm64"
display_name = "minhaempresa-frontend_platform_linux-arm64"

# ✅ Correto — namespace hierárquico, sem conflito
display_name = "minhaempresa/backend_platform_linux-arm64"
display_name = "minhaempresa/frontend_platform_linux-arm64"
```

**Passo a passo para corrigir:**

**1.** Delete os repositórios criados parcialmente na OCI (se existirem):

```bash
# Listar repositórios com o prefixo afetado
oci artifacts container repository list \
  --compartment-id <SEU_COMPARTMENT_OCID> \
  --all \
  --query 'data.items[*].{"nome":"display-name","ocid":id}' \
  --output table

# Deletar cada um que precisar ser recriado com o nome correto
oci artifacts container repository delete \
  --repository-id <OCID_DO_REPOSITORIO> \
  --force
```

**2.** Atualize o `display_name` no arquivo `.tf` para usar `/`:

```hcl
resource "oci_artifacts_container_repository" "minhaempresa-backend_platform_linux-arm64" {
  compartment_id = var.compartment_id
  display_name   = "minhaempresa/backend_platform_linux-arm64"
  is_immutable   = false
  is_public      = false
  readme {
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }
}

resource "oci_artifacts_container_repository" "minhaempresa-frontend_platform_linux-arm64" {
  compartment_id = var.compartment_id
  display_name   = "minhaempresa/frontend_platform_linux-arm64"
  is_immutable   = false
  is_public      = false
  readme {
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }
}
```

**3.** Atualize as referências no `main.yml` do workflow:

```yaml
# Backend
-t ${{ secrets.OCI_REGISTRY_URL }}/${{ secrets.OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE }}/minhaempresa/backend_platform_linux-arm64:${{ steps.version.outputs.VERSION }}
-t ${{ secrets.OCI_REGISTRY_URL }}/${{ secrets.OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE }}/minhaempresa/backend_platform_linux-arm64:latest

# Frontend
-t ${{ secrets.OCI_REGISTRY_URL }}/${{ secrets.OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE }}/minhaempresa/frontend_platform_linux-arm64:${{ steps.version.outputs.VERSION }}
-t ${{ secrets.OCI_REGISTRY_URL }}/${{ secrets.OCI_REGISTRY_OBJECT_STORAGE_NAMESPACE }}/minhaempresa/frontend_platform_linux-arm64:latest
```

**4.** Se outros repositórios já existem na OCI mas não estão no state do Terraform (criados em runs anteriores com falha), importe-os antes do próximo apply:

```bash
# Gerar automaticamente todos os comandos de import
oci artifacts container repository list \
  --compartment-id <SEU_COMPARTMENT_OCID> \
  --all \
  --query 'data.items[*].{"nome":"display-name","ocid":id}' \
  --raw-output | \
jq -r '.[] | "tofu import \x27module.oci-infra_ci_cd.oci_artifacts_container_repository.\(.nome)\x27 \(.ocid)"'
```

**5.** Rode o apply com paralelismo 1 para evitar race conditions na API do OCI:

```bash
tofu apply -parallelism=1
```

> 💡 **Regra geral:** sempre que dois ou mais repositórios no OCI Container Registry compartilharem o mesmo prefixo antes do primeiro hífen, use o padrão `prefixo/nome_repositorio` com barra no `display_name` para evitar conflitos de namespace.

---

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um **fork** do repositório
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Faça commits claros seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
4. Faça push: `git push origin feat/minha-melhoria`
5. Abra um **Pull Request** descrevendo a mudança e a motivação

---

## Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para os termos completos.

---

<div align="center">

**☸️ Kubernetes · 🦾 ARM · ☁️ Oracle Cloud · 🆓 Always Free**

Feito para a comunidade brasileira de Cloud e DevOps.

</div>
