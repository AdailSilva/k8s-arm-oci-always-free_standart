# Namespace: oci-devops applications
# resource "oci_artifacts_container_repository" "udp-health-check-server-1700_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "udp-health-check-server-1700_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "udp-health-check-server-1700_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "udp-health-check-server-1700_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# resource "oci_artifacts_container_repository" "udp-health-check-server-1710_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "udp-health-check-server-1710_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "udp-health-check-server-1710_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "udp-health-check-server-1710_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# Namespace: adailsilva-apps applications
# resource "oci_artifacts_container_repository" "app-springboot-now-frontend_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "app-springboot-now-frontend_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "app-springboot-now-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-springboot-now-frontend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# resource "oci_artifacts_container_repository" "api-cardscontrol-backend_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "api-cardscontrol-backend_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "api-cslab-cardscontrol-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-cslab-cardscontrol-backend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# resource "oci_artifacts_container_repository" "app-cslab-cardscontrol-frontend_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "app-cslab-cardscontrol-frontend_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "app-cslab-cardscontrol-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-cslab-cardscontrol-frontend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# resource "oci_artifacts_container_repository" "api-cslab-web-backend_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "api-cslab-web-backend_platform_linux-x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "api-cslab-web-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-cslab-web-backend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# resource "oci_artifacts_container_repository" "app-cslab-web-frontend_platform_linux-x86_64" {
#   # Required
#   compartment_id = var.compartment_id
#   display_name   = "app-cslab-web-frontend_platform_linux--x86_64"

#   # Optional
#   # defined_tags  = { "K8S.Apps" = "Free" }
#   # freeform_tags = { "K8S" = "Free Apps" }
#   is_immutable = false
#   is_public    = false
#   readme {
#     # Required
#     content = "Image repository with _**x86_64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
#     format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
#   }

# }

resource "oci_artifacts_container_repository" "app-cslab-web-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-cslab-web-frontend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# Namespace: cslab-backoffice applications (CSLab - BackOffice -- autoridade de licenca)
# Os nomes seguem o padrao <imagem>_platform_linux-arm64 e
# precisam bater com as tags -t do .github/workflows/main.yml e com o newName
# das kustomizations de 05.cslab_backoffice/*/kubernetes/.
resource "oci_artifacts_container_repository" "api-cslab-backoffice-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-cslab-backoffice-backend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

resource "oci_artifacts_container_repository" "app-cslab-backoffice-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-cslab-backoffice-frontend_platform_linux-arm64"

  # Optional
  # defined_tags  = { "K8S.Apps" = "Free" }
  # freeform_tags = { "K8S" = "Free Apps" }
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown" #"text/plain" # Supported formats are text/plain and text/markdown.
  }

}

# Namespace: cslab-site (Site institucional do CS Óptico Laboratório -- cslaboptico.adailsilva.com.br)
# o recurso acima foi mantido para não apagar as imagens publicadas).
# Se o pipeline criar este repositório antes do "terraform apply", importe-o em vez de recriar:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-cslab-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-cslab-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-cslab-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}


# ═════════════════════════════════════════════════════════════════════════════
# REPOSITÓRIOS OCIR DOS 6 PROJETOS
# Este arquivo é IDÊNTICO nos 6 repositórios (Standart, ChirpStack, CSLab, 3T Sensors,
# ASE Soluções e PF Gráfica): todos aplicam o mesmo Terraform no mesmo cluster/tenancy. Ao alterar,
# copie para os outros 5 (ver README, seção "Terraform compartilhado entre repositórios").
#
# Convenção de nomes das imagens:
#   Site institucional : app-<projeto>-site-frontend_platform_linux-arm64
#   Sistemas           : api-<projeto>-<sistema>-backend_platform_linux-arm64
#                        app-<projeto>-<sistema>-frontend_platform_linux-arm64
# ═════════════════════════════════════════════════════════════════════════════

# ── Sites institucionais (namespace <projeto>-site) ──────────────────────────

# Namespace: adailsilva-site (Site k8s.adailsilva.com.br — repositório Standart, 04.homepage/app_adailsilva_site_frontend). Substitui o homepage-80.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-adailsilva-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-adailsilva-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-adailsilva-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: chirpstack-site (Site chirpstack.adailsilva.com.br — repositório ChirpStack, 04.homepage/app_chirpstack_site_frontend). Substitui o app-chirpstack-homepage-frontend.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-chirpstack-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-chirpstack-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-chirpstack-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: 3tsensors-site (Site da 3T Sensors — repositório 3T Sensors, 04.homepage/app_3tsensors_site_frontend). Substitui o app-3t-sensors-homepage-frontend.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-3tsensors-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-3tsensors-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-3tsensors-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: asesolucoes-site (Site da ASE Soluções — repositório ASE Soluções, 04.homepage/app_asesolucoes_site_frontend). Substitui o app-ase-solucoes-homepage-frontend.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-asesolucoes-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-asesolucoes-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-asesolucoes-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: pfgrafica-site (Site da PF Gráfica — repositório PF Gráfica, 04.homepage/app_pfgrafica_site_frontend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-pfgrafica-site-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-pfgrafica-site-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-pfgrafica-site-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# ── Sistemas ─────────────────────────────────────────────────────────────────

# Namespace: chirpstack-manager (ChirpStack Manager — Backend). Substitui a imagem manual chirpstack-manager-api.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-chirpstack-manager-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-chirpstack-manager-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-chirpstack-manager-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: chirpstack-manager (ChirpStack Manager — Frontend). Substitui a imagem manual chirpstack-manager-web.
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-chirpstack-manager-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-chirpstack-manager-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-chirpstack-manager-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: 3tsensors-vibratrack (3T Sensors · VibraTrack — Backend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-3tsensors-vibratrack-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-3tsensors-vibratrack-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-3tsensors-vibratrack-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: 3tsensors-vibratrack (3T Sensors · VibraTrack — Frontend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-3tsensors-vibratrack-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-3tsensors-vibratrack-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-3tsensors-vibratrack-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: asesolucoes-rastrel (ASE Soluções · Rastrel — Backend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-asesolucoes-rastrel-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-asesolucoes-rastrel-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-asesolucoes-rastrel-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: asesolucoes-rastrel (ASE Soluções · Rastrel — Frontend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-asesolucoes-rastrel-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-asesolucoes-rastrel-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-asesolucoes-rastrel-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: pfgrafica-gestao (PF Gráfica · Gestão — Backend: OS, estoque, vendas externas e financeiro).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-pfgrafica-gestao-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-pfgrafica-gestao-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-pfgrafica-gestao-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: pfgrafica-gestao (PF Gráfica · Gestão — Frontend).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-pfgrafica-gestao-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-pfgrafica-gestao-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-pfgrafica-gestao-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: 3tsensors-backoffice (3T Sensors · BackOffice — Backend: autoridade de licença do sistema
# do repositório 04 · k8s-arm-oci-always-free_3tsensors).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-3tsensors-backoffice-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-3tsensors-backoffice-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-3tsensors-backoffice-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: 3tsensors-backoffice (3T Sensors · BackOffice — Frontend: autoridade de licença do sistema
# do repositório 04 · k8s-arm-oci-always-free_3tsensors).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-3tsensors-backoffice-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-3tsensors-backoffice-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-3tsensors-backoffice-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: asesolucoes-backoffice (Ase Soluções · BackOffice — Backend: autoridade de licença do sistema
# do repositório 05 · k8s-arm-oci-always-free_asesolucoes).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-asesolucoes-backoffice-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-asesolucoes-backoffice-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-asesolucoes-backoffice-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: asesolucoes-backoffice (Ase Soluções · BackOffice — Frontend: autoridade de licença do sistema
# do repositório 05 · k8s-arm-oci-always-free_asesolucoes).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-asesolucoes-backoffice-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-asesolucoes-backoffice-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-asesolucoes-backoffice-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: pfgrafica-backoffice (PF Gráfica · BackOffice — Backend: autoridade de licença do sistema
# do repositório 06 · k8s-arm-oci-always-free_pfgrafica).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.api-pfgrafica-backoffice-backend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "api-pfgrafica-backoffice-backend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "api-pfgrafica-backoffice-backend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}

# Namespace: pfgrafica-backoffice (PF Gráfica · BackOffice — Frontend: autoridade de licença do sistema
# do repositório 06 · k8s-arm-oci-always-free_pfgrafica).
# Se o repositório já existir na OCI (criado no push do pipeline antes do "terraform apply"),
# importe em vez de recriar — ver oci_artifacts_container_repository/import_existing_repositories.sh:
#   terraform import 'module.oci-infra_ci_cd.oci_artifacts_container_repository.app-pfgrafica-backoffice-frontend_platform_linux-arm64' <OCID-do-repositório>
resource "oci_artifacts_container_repository" "app-pfgrafica-backoffice-frontend_platform_linux-arm64" {
  # Required
  compartment_id = var.compartment_id
  display_name   = "app-pfgrafica-backoffice-frontend_platform_linux-arm64"

  # Optional
  is_immutable = false
  is_public    = false
  readme {
    # Required
    content = "Image repository with _**arm64 architecture**_ for k8s-on-arm-oci-always-free Cluster."
    format  = "text/markdown"
  }

}
