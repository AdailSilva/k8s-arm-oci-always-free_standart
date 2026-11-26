#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# import_existing_repositories.sh
#
# Importa no state do OpenTofu/Terraform os repositórios OCIR declarados em
# oci_artifacts_container_repository.tf que JÁ EXISTEM na OCI (criados pelo push
# dos pipelines antes do "tofu apply"). Sem o import, o apply tentaria
# criá-los de novo e falharia com "already exists".
#
# Arquivo idêntico nos 6 repositórios (Terraform compartilhado).
#
# Uso (na raiz do repositório, com o OCI CLI configurado):
#   bash oci_artifacts_container_repository/import_existing_repositories.sh
#   tofu plan          # deve mostrar só os repositórios que ainda não existem
#
# Usa o tofu (OpenTofu) e, na falta dele, o terraform. No dia a dia, prefira
# ./sync_terraform_state.sh importar|plan|apply|copiar|conferir|tudo, que também
# mantém o state igual nos 6 repositórios.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."

TF_FILE="oci_artifacts_container_repository/oci_artifacts_container_repository.tf"
MODULE="module.oci-infra_ci_cd"
OCI="${OCI_CLI:-oci}"

# tofu ou terraform (mesma escolha do sync_terraform_state.sh)
if command -v tofu >/dev/null 2>&1; then TF=tofu
elif command -v terraform >/dev/null 2>&1; then TF=terraform
else echo "ERRO: nem tofu nem terraform no PATH." >&2; exit 1; fi

TENANCY=$(sed -n 's/^tenancy[[:space:]]*=[[:space:]]*//p' ~/.oci/config | head -1)
if [ -z "$TENANCY" ]; then
  echo "ERRO: não achei 'tenancy=' em ~/.oci/config." >&2
  exit 1
fi

# Recursos já presentes no state
NO_STATE=$("$TF" state list 2>/dev/null | grep "^${MODULE}.oci_artifacts_container_repository\." || true)

# Somente recursos ativos (linhas que começam com 'resource', não comentadas)
for NOME in $(sed -n 's/^resource "oci_artifacts_container_repository" "\([^"]*\)".*/\1/p' "$TF_FILE"); do
  ENDERECO="${MODULE}.oci_artifacts_container_repository.${NOME}"

  if echo "$NO_STATE" | grep -qx "$ENDERECO"; then
    echo "ok        ${NOME} (já está no state)"
    continue
  fi

  OCID=$($OCI artifacts container repository list --compartment-id "$TENANCY" \
          --compartment-id-in-subtree true --display-name "$NOME" --all \
          --query 'data.items[0].id' --raw-output 2>/dev/null || true)

  if [ -z "$OCID" ] || [ "$OCID" = "null" ]; then
    echo "criar     ${NOME} (não existe na OCI — o apply cria)"
    continue
  fi

  echo "importar  ${NOME} -> ${OCID}"
  "$TF" import "$ENDERECO" "$OCID"
done

echo
echo "Pronto. Rode '$TF plan' e confira antes do apply."
