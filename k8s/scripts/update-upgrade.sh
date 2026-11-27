#!/bin/bash -x

# ─── ESPERA DO APT NO PRIMEIRO BOOT (27/11/2026) ─────────────────────────────
# Na VM recém-criada, o cloud-init e o unattended-upgrades do Ubuntu rodam o apt
# sozinhos. Sem esperar, os apt-get deste script falham com "Could not get lock
# /var/lib/dpkg/lock-frontend" e o containerd/conntrack/kubelet não são instalados
# (aconteceu no worker-0 da conta CSLAB). Espera o cloud-init terminar e faz todo
# apt/apt-get aguardar o lock (até 15 min) em vez de falhar.
cloud-init status --wait > /dev/null 2>&1 || true
echo 'DPkg::Lock::Timeout "900";' | sudo tee /etc/apt/apt.conf.d/99-espera-lock-dpkg > /dev/null

# To make iptables upgrade/installation silent
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections

sudo apt-get --yes remove needrestart

sudo apt-get clean
sudo apt-get update --yes
sudo apt-get upgrade --yes
