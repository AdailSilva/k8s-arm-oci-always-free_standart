variable "tenancy_ocid" { type = string }

variable "region" { type = string }

variable "user_ocid" { type = string }

variable "fingerprint" { type = string }

variable "private_key_path" { type = string }

variable "private_key_password" {
  type    = string
  default = ""
}

variable "ssh_key_path" { type = string }

variable "ssh_key_pub_path" { type = string }

variable "cluster_public_dns_name" {
  type    = string
  default = null
}

variable "letsencrypt_registration_email" { type = string }

variable "linux_overwrite_local_kube_config" {
  type    = bool
  default = false
}

# variable "windows_overwrite_local_kube_config" {
#   type    = bool
#   default = false
# }

variable "debug_create_cluster_admin" {
  type    = bool
  default = false
}

# =============================================================================
# Portas expostas na internet: NLB + Security List da OCI
# -----------------------------------------------------------------------------
# O iptables dos nós fica zerado (k8s/scripts/reset-iptables.sh): a barreira é a
# Security List, montada a partir das variáveis abaixo. Para abrir ou fechar uma
# porta, edite a lista e rode:  tofu apply -parallelism=1
# Depois: ./sync_terraform_state.sh copiar  (mantém o state igual nos 6 repositórios).
#
# As regras internas da VCN (kubelet 10250, Flannel 8472/udp, File Storage/NFS dos
# volumes, SSH dos health checks do NLB) ficam fixas em network/public-subnet.tf.
# =============================================================================

# Serviços publicados no NLB (k8s_scaffold/load-balancing.tf). Cada item cria um
# listener (porta), um backend set e um backend por worker (node_port), e abre na
# Security List a porta do listener E a NodePort: o NLB preserva o IP de origem,
# então a NodePort também recebe tráfego da internet.
#   health_check: padrão TCP 22 (o nó está no ar). Use a própria NodePort quando o
#   NLB deve tirar o nó se o serviço cair; UDP precisa de envio/resposta (base64).
# Quem atende cada NodePort:
#   30080/30443/30700/30710/30888/30883 -> Service do ingress-nginx
#     (k8s_scaffold/apps/ingress-controller.yaml; TCP/UDP via tcp-services/udp-services)
#   31883/31884 -> Service NodePort do Mosquitto de cada sistema
variable "servicos_nlb" {
  type = list(object({
    protocolo = string # "TCP" ou "UDP"
    porta     = number # Listener do NLB (porta pública).
    node_port = number # Destino nos workers.
    descricao = string
    health_check = optional(object({
      protocolo = string
      porta     = number
      envio     = optional(string) # UDP: dados enviados (base64).
      resposta  = optional(string) # UDP: resposta esperada (base64).
    }), { protocolo = "TCP", porta = 22 })
  }))
  default = [
    { protocolo = "TCP", porta = 80, node_port = 30080, descricao = "HTTP (ingress-nginx)" },
    { protocolo = "TCP", porta = 443, node_port = 30443, descricao = "HTTPS (ingress-nginx)" },
    {
      protocolo = "UDP", porta = 1700, node_port = 30700, descricao = "LoRaWAN gateways ChirpStack v3 (ingress-nginx)",
      # Respondido pelo DaemonSet udp-health-check (hostNetwork) em cada nó.
      health_check = { protocolo = "UDP", porta = 1700, envio = "UElORw==", resposta = "UE9ORw==" } # PING / PONG
    },
    {
      protocolo = "UDP", porta = 1710, node_port = 30710, descricao = "LoRaWAN gateways ChirpStack v4 (ingress-nginx)",
      health_check = { protocolo = "UDP", porta = 1710, envio = "UElORw==", resposta = "UE9ORw==" } # PING / PONG
    },
    { protocolo = "TCP", porta = 1888, node_port = 30888, descricao = "MQTT ChirpStack v3 (ingress-nginx; usuário e senha)" },
    { protocolo = "TCP", porta = 8883, node_port = 30883, descricao = "MQTT TLS ChirpStack v4 (ingress-nginx)" },
    {
      protocolo = "TCP", porta = 1883, node_port = 31883, descricao = "MQTT do Rastrel (NodePort do Mosquitto)",
      # Checa o próprio broker: com o Mosquitto fora do ar o NLB para de mandar conexões.
      health_check = { protocolo = "TCP", porta = 31883 }
    },
    {
      protocolo = "TCP", porta = 1884, node_port = 31884, descricao = "MQTT do VibraTrack (NodePort do Mosquitto)",
      health_check = { protocolo = "TCP", porta = 31884 }
    },
  ]
}

# Outras portas públicas, fora dos serviços do NLB acima (abertas só na Security List).
variable "portas_publicas" {
  type = list(object({
    protocolo = string # "TCP" ou "UDP"
    porta     = number
    origem    = optional(string, "0.0.0.0/0")
    descricao = string
  }))
  default = [
    # Listener próprio do NLB para o leader (k8s/control-plane.tf).
    { protocolo = "TCP", porta = 6443, descricao = "Kubernetes API (kubectl e runners; autenticada por certificado)" },
  ]
}

# Quem pode abrir SSH (porta 22) de fora: o IP de SAÍDA do notebook do administrador
# em CIDR (ex.: ["203.0.113.10/32"]; descubra com: curl -4 -s https://api.ipify.org).
# Fica SÓ no variables.auto.tfvars (fora do Git, dois repositórios são públicos).
# Atenção: o plan/apply completo usa SSH (lê o kubeconfig do leader pelo NLB). Se o
# IP mudar e o SSH cair, atualize ssh_origens e aplique só a Security List:
#   tofu apply -parallelism=1 -target=module.network.oci_core_security_list.public
# Depois volte ao apply normal. Sem SSH, o console da OCI tem o Cloud Shell.
variable "ssh_origens" {
  type = list(string)
}
