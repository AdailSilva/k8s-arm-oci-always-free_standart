# =============================================================================
# NLB: serviços publicados nos workers
# -----------------------------------------------------------------------------
# Tudo sai da lista var.servicos_nlb (inputs.tf da raiz). Para cada serviço:
#   backend set "worker_<proto>_<porta>"         health check do serviço
#   backend     "worker-<n>_<proto>_<porta>"     um por worker, na node_port
#   listener    "worker_<proto>_<porta>"         porta pública do NLB
# A Security List abre a porta e a node_port de cada item (main.tf, locals).
# Os listeners do SSH (22 -> leader) e da API (6443 -> leader) ficam em
# compute/leader.tf e k8s/control-plane.tf.
# =============================================================================

locals {
  servicos_nlb = { for s in var.servicos_nlb : "${lower(s.protocolo)}_${s.porta}" => s }

  # Um backend por (serviço, worker). Chave: "<proto>_<porta>-<índice do worker>".
  backends_nlb = merge([
    for chave, s in local.servicos_nlb : {
      for idx, worker in var.workers : "${chave}-${idx}" => {
        servico   = chave
        indice    = idx
        node_port = s.node_port
        target_id = worker.id
      }
    }
  ]...)
}

resource "oci_network_load_balancer_backend_set" "worker" {
  for_each                 = local.servicos_nlb
  network_load_balancer_id = var.load_balancer_id
  name                     = "worker_${each.key}"
  policy                   = "FIVE_TUPLE"
  is_preserve_source       = true # Sem SNAT: a Security List precisa liberar a node_port.

  health_checker {
    protocol      = each.value.health_check.protocolo
    port          = each.value.health_check.porta
    request_data  = each.value.health_check.envio
    response_data = each.value.health_check.resposta
  }

  lifecycle {
    create_before_destroy = true
  }

  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }
}

resource "oci_network_load_balancer_backend" "worker" {
  for_each                 = local.backends_nlb
  backend_set_name         = oci_network_load_balancer_backend_set.worker[each.value.servico].name
  network_load_balancer_id = var.load_balancer_id
  name                     = "worker-${each.value.indice}_${each.value.servico}"
  port                     = each.value.node_port
  target_id                = each.value.target_id
}

resource "oci_network_load_balancer_listener" "worker" {
  for_each                 = local.servicos_nlb
  default_backend_set_name = oci_network_load_balancer_backend_set.worker[each.key].name
  name                     = "worker_${each.key}"
  network_load_balancer_id = var.load_balancer_id
  port                     = each.value.porta
  protocol                 = each.value.protocolo

  depends_on = [oci_network_load_balancer_backend.worker]
}
