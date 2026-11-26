variable "compartment_id" { type = string }

variable "region" { type = string }

variable "vcn_dns_label" {
  type    = string
  default = "vcn"
}

variable "public_subnet_dns_label" {
  type    = string
  default = "public"
}

variable "provision_private_subnet" { type = bool }

variable "private_subnet_dns_label" {
  type    = string
  default = "private"
}

# Portas abertas para a internet na subnet pública (lista definida na raiz, inputs.tf).
variable "portas_publicas" {
  type = list(object({
    protocolo = string # "TCP" ou "UDP"
    porta     = number
    origem    = string
    descricao = string
  }))
}

# Origens (CIDR) autorizadas a abrir SSH (porta 22) de fora da VCN.
variable "ssh_origens" {
  type = list(string)
}
