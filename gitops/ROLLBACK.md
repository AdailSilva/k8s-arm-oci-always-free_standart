# Rollback

## A) Git (recomendado)

Edite o `newTag` em `<app>/kubernetes/kustomization.yaml`, faça `git commit -m "rollback: <componente> X.Y [skip ci]"` e push. O ArgoCD sincroniza.

```bash
# Versões disponíveis de um componente (tags Git)
git fetch --tags
git tag --list 'app-adailsilva-site-frontend-*' | sort -V | tail -10
```

| Componente | `kustomization.yaml` | Application |
|---|---|---|
| `app-adailsilva-site-frontend` | `04.homepage/app_adailsilva_site_frontend/kubernetes/` | `adailsilva-site-frontend` |

O **próximo build** daquele componente volta a gravar o `newTag` da versão nova — para manter o rollback, congele o app (`# adailsilva-release-congelado: <motivo>` na `kustomization.yaml`) ou não faça push de código do componente até corrigir.

## B) UI do ArgoCD — evite

**History and Rollback** existe (20 pontos de histórico), mas com `automated` + `selfHeal` o ArgoCD volta ao que está no Git logo em seguida. Use A.

## C) Emergência (sem ArgoCD)

```bash
kubectl set image deployment/<deployment> <container>=gru.ocir.io/<namespace>/<repositório>:X.Y -n <namespace>
```

O `selfHeal` tende a reverter para o Git; para um hotfix que precisa ficar, use A.

## Pré-requisito

As versões precisam existir no OCI Registry: não apague as tags `X.Y` antigas (mantenha pelo menos as ~10 últimas de cada repositório).
