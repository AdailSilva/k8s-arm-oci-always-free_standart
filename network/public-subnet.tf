resource "oci_core_subnet" "public" {
  compartment_id    = var.compartment_id
  vcn_id            = oci_core_vcn.vcn.id
  cidr_block        = "10.0.0.0/24"
  route_table_id    = oci_core_route_table.ig.id
  security_list_ids = [oci_core_security_list.public.id]
  display_name      = "public-subnet"
  dns_label         = var.public_subnet_dns_label
}

resource "oci_core_security_list" "public" {

  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.vcn.id
  display_name   = "Security List for Public subnet"

  # ── Regras fixas: saída, ICMP e tráfego interno da VCN (10.0.0.0/16) ──────────
  egress_security_rules {
    stateless        = false
    destination      = "0.0.0.0/0" # Internet.
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    description      = "ALL Protocol - Default egress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.ICMP

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 3 # Destination Unreachable.
      code = 4
    }
    description = "ICMP Protocol - ingress_security_rules - Type = 3, Code = 4."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.ICMP

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 3 # Destination Unreachable.
    }
    description = "ICMP Protocol - ingress_security_rules - Type = 3."
  }

  ingress_security_rules {
    protocol    = "1" # ICMP Protocol.
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 8 # Echo.
      code = 0
    }
    description = "ICMP Protocol - ICMP Echo Request ingress_security_rules (Allow ICMP Ping Requests - OCI)."
  }

  egress_security_rules {
    protocol         = "1"         # ICMP Protocol.
    destination      = "0.0.0.0/0" # Or specific destination IP.
    destination_type = "CIDR_BLOCK"

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 0 # Echo Reply.
      code = 0
    }
    description = "ICMP Protocol - ICMP Echo Reply egress_security_rules (Allow ICMP Ping Replies - OCI)."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.TCP
    tcp_options {
      min = 10250
      max = 10250
    }
    description = "TCP Protocol - Kubelet API ingress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.UDP
    udp_options {
      min = 8472
      max = 8472
    }
    description = "UDP Protocol - Flannel ingress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.TCP
    tcp_options {
      min = 111
      max = 111
    }
    description = "TCP Protocol - File Storage ingress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.TCP
    tcp_options {
      min = 2048
      max = 2050
    }
    description = "TCP Protocol - File Storage ingress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.UDP
    udp_options {
      min = 111
      max = 111
    }
    description = "UDP Protocol - File Storage ingress_security_rules."
  }

  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.UDP
    udp_options {
      min = 2048
      max = 2048
    }
    description = "UDP Protocol - File Storage ingress_security_rules."
  }


  # SSH vindo da própria VCN: os health checks do NLB testam a porta 22 de cada nó.
  ingress_security_rules {
    stateless   = false
    source      = "10.0.0.0/16" # Virtual Cloud Networks - VCN.
    source_type = "CIDR_BLOCK"
    protocol    = local.protocol.TCP
    tcp_options {
      min = 22
      max = 22
    }
    description = "TCP Protocol - SSH da VCN (health checks do NLB)."
  }

  # ── SSH de fora: só as origens de var.ssh_origens (variables.auto.tfvars, fora do Git) ──
  dynamic "ingress_security_rules" {
    for_each = toset(var.ssh_origens)
    content {
      stateless   = false
      source      = ingress_security_rules.value
      source_type = "CIDR_BLOCK"
      protocol    = local.protocol.TCP
      tcp_options {
        min = 22
        max = 22
      }
      description = "TCP Protocol - SSH (origem autorizada)."
    }
  }

  # ── Portas públicas: var.portas_publicas (inputs.tf da raiz) ─────────────────
  # Única fonte das portas abertas para a internet. Para liberar ou fechar uma porta,
  # edite a lista e rode: tofu apply -parallelism=1  (depois ./sync_terraform_state.sh copiar).
  # O iptables dos nós fica zerado (k8s/scripts/reset-iptables.sh): a barreira é esta lista.
  dynamic "ingress_security_rules" {
    for_each = { for r in var.portas_publicas : "${r.protocolo}-${r.porta}" => r }
    content {
      stateless   = false
      source      = ingress_security_rules.value.origem
      source_type = "CIDR_BLOCK"
      protocol    = ingress_security_rules.value.protocolo == "UDP" ? local.protocol.UDP : local.protocol.TCP
      description = ingress_security_rules.value.descricao

      dynamic "tcp_options" {
        for_each = ingress_security_rules.value.protocolo == "TCP" ? [1] : []
        content {
          min = ingress_security_rules.value.porta
          max = ingress_security_rules.value.porta
        }
      }
      dynamic "udp_options" {
        for_each = ingress_security_rules.value.protocolo == "UDP" ? [1] : []
        content {
          min = ingress_security_rules.value.porta
          max = ingress_security_rules.value.porta
        }
      }
    }
  }
}
