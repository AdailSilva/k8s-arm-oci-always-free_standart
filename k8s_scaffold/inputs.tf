variable "ssh_key_path" { type = string }

variable "cluster_public_ip" { type = string }

variable "cluster_public_dns_name" { type = string }

variable "letsencrypt_registration_email" { type = string }

variable "load_balancer_id" { type = string }

variable "leader" {
  type = object({
    vm_user = string
  })
}

variable "workers" {
  type = list(object({
    id = string
  }))
}

# Serviços publicados no NLB (definidos e documentados no inputs.tf da raiz).
variable "servicos_nlb" {
  type = list(object({
    protocolo = string
    porta     = number
    node_port = number
    descricao = string
    health_check = object({
      protocolo = string
      porta     = number
      envio     = optional(string)
      resposta  = optional(string)
    })
  }))
}

variable "debug_create_cluster_admin" {
  type    = bool
  default = false
}
