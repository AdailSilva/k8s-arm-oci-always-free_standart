#!/bin/bash

echo "Start destroying the UDP Health Check Server DaemonSets."

kubectl delete -f ~/Apps/OracleCloud/01.k8s-on-arm-oci-always-free_standart/02.udp_health_check-nlb_oci/kubernetes/03.udp-health-check-server-1710__DaemonSet.yaml && \
kubectl delete -f ~/Apps/OracleCloud/01.k8s-on-arm-oci-always-free_standart/02.udp_health_check-nlb_oci/kubernetes/02.udp-health-check-server-1700__DaemonSet.yaml && \
kubectl delete -f ~/Apps/OracleCloud/01.k8s-on-arm-oci-always-free_standart/02.udp_health_check-nlb_oci/kubernetes/01.create__Namespace.yaml && \
echo "Successfully completed destruction of UDP Health Check Server DaemonSets."
