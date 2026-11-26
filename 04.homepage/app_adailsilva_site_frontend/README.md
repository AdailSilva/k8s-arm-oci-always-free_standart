# Site Adail Silva — k8s.adailsilva.com.br

Site institucional do domínio principal do cluster: apresenta o trabalho de criação de sistemas web para empresas (WEB, CardsControl e BackOffice como casos), os serviços de IoT/LoRaWAN e a arquitetura do cluster Kubernetes.

| Item | Valor |
|---|---|
| Stack | Angular 21 · PrimeNG 21 · template Avalon 21 (standalone components) |
| Servidor | nginx (`nginx:alpine`) servindo o build estático |
| URL | `https://k8s.adailsilva.com.br` |
| Namespace | `adailsilva-site` |
| Imagem | `gru.ocir.io/<namespace>/app-adailsilva-site-frontend_platform_linux-arm64:<versão>` |

## Páginas

| Rota | Conteúdo | Componente |
|---|---|---|
| `/` | Início: soluções, números, projetos, contato | `src/app/pages/home/` |
| `/iot` | IoT e LoRaWAN: gateways, placas e ChirpStack em Kubernetes | `src/app/pages/iot/` |
| `/infraestrutura` | Arquitetura do cluster | `src/app/pages/infraestrutura/` |

Qualquer outra rota redireciona para `/`.

## Onde editar o conteúdo

Os componentes só leem dados; os textos ficam em `src/app/core/`:

| Arquivo | Conteúdo |
|---|---|
| `site.config.ts` | Contatos (WhatsApp, e-mail, LinkedIn, GitHub, Instagram), perfil, números, soluções, projetos (`web`, `cardscontrol`, `backoffice`) e dados do cluster |
| `iot.config.ts` | Serviços de IoT e os 4 projetos LoRaWAN (gateways SX1301 e SX1302, nós ESP32 e Radioenge): textos, funcionalidades e telas reais da página web e do app Flutter (imagens em `public/iot/`) |
| `contato.util.ts` | Montagem dos links de contato |
| `theme.service.ts` | Tema claro/escuro |

Componentes visuais reutilizáveis (mockups, fluxo LoRaWAN, logo, animações) estão em `src/app/shared/`.

## Rodar localmente

```bash
npm ci
npm start                    # perfil development → http://localhost:4401
npm run start:staging        # http://localhost:4402
npm run start:production     # http://localhost:4403
```

## Build

```bash
npm run build:production     # saída em dist/app-adailsilva-site-frontend/browser
npm run format               # Prettier
```

Imagem Docker (a mesma que o pipeline gera), a partir desta pasta:

```bash
docker buildx build --platform linux/arm64 -t app-adailsilva-site-frontend:local --load .
docker run --rm -p 8080:80 app-adailsilva-site-frontend:local      # http://localhost:8080
```

O `Dockerfile` é multi-stage (`node:22-alpine` → `nginx:alpine`) e roda `npm run build:production`. O `nginx.conf` faz o fallback da SPA (`try_files ... /index.html`), expõe `/healthz`, define cache longo para os assets e cabeçalhos de segurança.

## Deploy

Automático pelo job `app_adailsilva_site_frontend` do `.github/workflows/main.yml` a cada push nesta pasta (ou `workflow_dispatch` com `target=app-adailsilva-site-frontend`, ou `./force_deploy.sh site` na raiz do repositório) — mesmo job dos outros 4 repositórios:

1. Tag Git `app-adailsilva-site-frontend-X.Y`.
2. Garante o repositório OCIR `app-adailsilva-site-frontend_platform_linux-arm64` (cria se ainda não existir; depois rode `./sync_terraform_state.sh importar` antes do próximo `apply`).
3. Build ARM64 → OCIR (`X.Y` e `latest`).
4. Aplica `kubernetes/01` (Namespace `adailsilva-site`), `03` (Service), `06` (Ingress) e o `oci-registry-secret`.
5. Troca o `newTag` em `kubernetes/kustomization.yaml` (commit `[skip ci]`); o ArgoCD (Application `adailsilva-site-frontend`) aplica o `02` (Deployment).

Os manifestos `04` (cert-manager) e `05` (ClusterIssuer) são cópias de referência — o scaffold do Terraform já instala ambos. Rollback e congelamento de versão: [`gitops/ROLLBACK.md`](../../gitops/ROLLBACK.md).

```bash
kubectl get pods,svc,ingress -n adailsilva-site
kubectl get certificate -n adailsilva-site
kubectl -n argocd get application adailsilva-site-frontend
```
