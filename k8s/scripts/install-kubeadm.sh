#!/bin/bash -x

# ─── ESPERA DO APT NO PRIMEIRO BOOT (27/11/2026) ─────────────────────────────
# Na VM recém-criada, o cloud-init e o unattended-upgrades do Ubuntu rodam o apt
# sozinhos. Sem esperar, os apt-get deste script falham com "Could not get lock
# /var/lib/dpkg/lock-frontend" e o containerd/conntrack/kubelet não são instalados
# (aconteceu no worker-0 da conta CSLAB). Espera o cloud-init terminar e faz todo
# apt/apt-get aguardar o lock (até 15 min) em vez de falhar.
cloud-init status --wait > /dev/null 2>&1 || true
echo 'DPkg::Lock::Timeout "900";' | sudo tee /etc/apt/apt.conf.d/99-espera-lock-dpkg > /dev/null
# Nunca parar em pergunta do dpkg (ex.: "config.toml ... (Y/I/N/O/D/Z)" quando o arquivo já
# existe de uma execução anterior): fica a escolha padrão sem perguntar. O containerd tem o
# config.toml regerado logo depois, então a versão mantida aqui não importa.
export DEBIAN_FRONTEND=noninteractive
printf 'Dpkg::Options {\n  "--force-confdef";\n  "--force-confold";\n};\n' | sudo tee /etc/apt/apt.conf.d/99-sem-perguntas-dpkg > /dev/null

# https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/

# 1. Install container runtime - containerd

# 1.1. containerd prerequisites
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system

# 1.2. Add Docker apt repository
sudo DEBIAN_FRONTEND=noninteractive apt-get install --yes \
  ca-certificates \
  apt-transport-https \
  curl \
  gnupg \
  lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --yes --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo DEBIAN_FRONTEND=noninteractive apt-get -y remove needrestart

sudo DEBIAN_FRONTEND=noninteractive apt-get clean
sudo DEBIAN_FRONTEND=noninteractive apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade --yes
sudo DEBIAN_FRONTEND=noninteractive apt-get autoremove --yes
sudo DEBIAN_FRONTEND=noninteractive apt-get autoclean --yes

sudo systemctl daemon-reload

# 1.3. Install containerd
sudo DEBIAN_FRONTEND=noninteractive apt-get install --yes containerd.io

# 1.4. Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
sudo systemctl restart containerd

# 1.5. Enable systemd cgroup driver in containerd
# (it must mutch cgroup driver of kubelet, which is systemd by default)
if ! grep -q 'SystemdCgroup = true' /etc/containerd/config.toml; then
  if grep -q 'SystemdCgroup = false' /etc/containerd/config.toml; then
    sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
  else
    sudo sed -i 's/\[plugins\."io\.containerd\.grpc\.v1\.cri"\.containerd\.runtimes\.runc\.options\]/&\n SystemdCgroup = true/' /etc/containerd/config.toml
  fi
fi

sudo systemctl restart containerd

# 2. Install kubeadm
sudo DEBIAN_FRONTEND=noninteractive apt-get --yes install curl gnupg2 software-properties-common apt-transport-https ca-certificates

sudo systemctl daemon-reload

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --batch --yes --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo DEBIAN_FRONTEND=noninteractive apt-get clean
sudo DEBIAN_FRONTEND=noninteractive apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade --yes
sudo DEBIAN_FRONTEND=noninteractive apt-get autoremove --yes
sudo DEBIAN_FRONTEND=noninteractive apt-get autoclean --yes

# 2.1. Kubernetes pre-reqs (kubeadm preflight)
# conntrack é obrigatório para kubeadm init/join em praticamente todos os cenários
sudo DEBIAN_FRONTEND=noninteractive apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install --yes \
  conntrack \
  socat \
  ebtables \
  iptables

# 2.2. Install kubelet/kubeadm/kubectl
sudo DEBIAN_FRONTEND=noninteractive apt install --yes kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# 3. Conferência final: sem isto o kubeadm join falharia mais à frente com um erro
# que não aponta a causa. Sai com erro aqui, com a lista do que faltou.
FALTOU=""
command -v conntrack > /dev/null || FALTOU="$FALTOU conntrack"
command -v kubeadm   > /dev/null || FALTOU="$FALTOU kubeadm"
command -v kubelet   > /dev/null || FALTOU="$FALTOU kubelet"
systemctl is-active --quiet containerd || FALTOU="$FALTOU containerd(serviço)"
if [ -n "$FALTOU" ]; then
  echo "ERRO: instalação incompleta neste nó. Faltando:$FALTOU"
  exit 1
fi
echo "install-kubeadm: containerd, conntrack, kubelet e kubeadm OK"
