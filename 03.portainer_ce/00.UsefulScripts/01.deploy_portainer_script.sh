#!/bin/bash

# Caminho relativo a este script: funciona em qualquer repositório que tenha a pasta 03.portainer_ce.
K8S="$(cd "$(dirname "${BASH_SOURCE[0]}")/../kubernetes" && pwd)"

echo "Start deploying the Portainer pod/service."

kubectl apply -f "$K8S"/01.portainer-ce__Namespace.yaml && \

kubectl apply -f "$K8S"/02.portainer-ce__ServiceAccount.yaml && \
kubectl apply -f "$K8S"/03.portainer-ce__ClusterRoleBinding.yaml && \

#kubectl apply -f "$K8S"/04.portainer-ce__PersistentVolumeClaim__Detached.yaml && \
#kubectl wait --namespace portainer --for=jsonpath='{.status.phase}'=Bound pvc/portainer-ce-pvc --timeout=300s && \

# Parametros de StorageClass sao imutaveis: se ela ja existe, aplica so o PV e o PVC do arquivo.
if kubectl get storageclass oci-fss-portainer-data-portainer > /dev/null 2>&1; then
  python3 -c 'import sys;print("\n---\n".join(d for d in open(sys.argv[1]).read().split("\n---") if d.strip() and "kind: StorageClass" not in d))' \
    "$K8S"/05.portainer-ce__StorageClass-PersistenVolume-PersistentVolumeClaim__Attached-with-OCI.yaml | kubectl apply -f -
else
  kubectl apply -f "$K8S"/05.portainer-ce__StorageClass-PersistenVolume-PersistentVolumeClaim__Attached-with-OCI.yaml
fi && \
kubectl wait --namespace portainer --for=jsonpath='{.status.phase}'=Bound pvc/oci-fss-pvc-portainer-data-portainer --timeout=300s && \

kubectl apply -f "$K8S"/06.portainer-ce__Deployment.yaml && \
kubectl wait --namespace portainer --for=condition=ready pod --selector=app.kubernetes.io/name=portainer-deployment --timeout=300s && \
kubectl apply -f "$K8S"/07.portainer-ce__Service.yaml && \

#kubectl apply -f "$K8S"/08.portainer-ce-cert-manager__v1.12.3__Components_Full.yaml && \
# Wait...
#kubectl apply -f "$K8S"/09.portainer-ce-letsencrypt-issuer_with_e-mail_ACME_registration__ClusterIssuer.yaml && \
kubectl apply -f "$K8S"/10.portainer-ce__Ingress.yaml && \

echo "Portainer pod/service deployment completed successfully."
