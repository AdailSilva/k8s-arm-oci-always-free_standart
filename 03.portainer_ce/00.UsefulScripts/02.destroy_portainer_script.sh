#!/bin/bash

# Caminho relativo a este script: funciona em qualquer repositório que tenha a pasta 03.portainer_ce.
K8S="$(cd "$(dirname "${BASH_SOURCE[0]}")/../kubernetes" && pwd)"

echo "Start destroying the Portainer pod/service."

kubectl delete -f "$K8S"/10.portainer-ce__Ingress.yaml && \
#kubectl delete -f "$K8S"/09.portainer-ce-letsencrypt-issuer_with_e-mail_ACME_registration__ClusterIssuer.yaml && \
#kubectl delete -f "$K8S"/08.portainer-ce-cert-manager__v1.12.3__Components_Full.yaml && \

kubectl delete -f "$K8S"/07.portainer-ce__Service.yaml && \
kubectl delete -f "$K8S"/06.portainer-ce__Deployment.yaml && \

kubectl delete -f "$K8S"/05.portainer-ce__StorageClass-PersistenVolume-PersistentVolumeClaim__Attached-with-OCI.yaml && \

#kubectl delete -f "$K8S"/04.portainer-ce__PersistentVolumeClaim__Detached.yaml && \

kubectl delete -f "$K8S"/03.portainer-ce__ClusterRoleBinding.yaml && \
kubectl delete -f "$K8S"/02.portainer-ce__ServiceAccount.yaml && \

kubectl delete -f "$K8S"/01.portainer-ce__Namespace.yaml && \

echo "Successfully completed destruction of Portainer pod/service."
