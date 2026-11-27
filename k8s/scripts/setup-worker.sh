#!/bin/bash -x

# k8s requires 2 CPUs. We override this requirement (to better use resources from the Always Free tier).
# We also ignore memory requirement, as for testing we deploy cluster to micro shapes.
# Currently we don't pass control plane's CA public key.
sudo kubeadm join \
  --ignore-preflight-errors=NumCPU,Mem \
  --node-name=${node_name} \
  --token=$(< .kube/join-token) \
  --discovery-token-unsafe-skip-ca-verification \
  ${leader_url}:6443
  
# --overwrite: numa reexecução (taint do worker_setup) o label já existe e, sem ele, o
# kubectl sai com erro -> o provisioner do Terraform falha no último passo.
kubectl label node ${node_name} node-role.kubernetes.io/worker=worker --overwrite
