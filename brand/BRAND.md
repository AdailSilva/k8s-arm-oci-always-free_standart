# Adail Silva · Guia de identidade visual

> Da Sua Ideia ao Kubernetes.
> Vale para o site k8s.adailsilva.com.br (`04.homepage/app_adailsilva_site_frontend`) e para qualquer material novo de serviços (sistemas para empresas e redes LoRaWAN).

## 1. Identificadores

monograma "A" estilizado (traço branco com a barra em 65% de opacidade e um ponto no pé direito) sobre bloco arredondado em degradê azul.

## 2. Logotipo

Todos os arquivos saem do mesmo símbolo 40×40 usado no site (`04.homepage/app_adailsilva_site_frontend/src/app/shared/logo.ts`
e `public/favicon.svg`). Os textos dos logotipos usam a fonte **Archivo** (a mesma do site), com
`Inter`/`Arial` como reserva — **não estão convertidos em curvas**: para material impresso, abra o
SVG num editor vetorial com a fonte instalada e converta o texto antes de enviar.

| Arquivo | Uso |
|---|---|
| `adailsilva-logo-horizontal.svg` / `-1200.png` | Marca principal: símbolo à esquerda do nome, fundos claros. |
| `adailsilva-logo-horizontal-negativo.svg` / `-1200.png` | Horizontal para fundos escuros. |
| `adailsilva-logo.svg` / `-1200.png` | Marca vertical (símbolo sobre o nome), fundos claros. |
| `adailsilva-logo-negativo.svg` / `-1200.png` | Vertical para fundos escuros. |
| `adailsilva-simbolo.svg` / `-256.png` | Só o símbolo — favicon, topo do menu, marca d'água. |
| `adailsilva-simbolo-negativo.svg` / `-256.png` | Símbolo para fundos escuros (bloco branco, traço na cor escura). |
| `adailsilva-icone.svg` / `-512.png` / `-1024.png` | Ícone em fundo escuro — avatar, redes sociais. |
| `adailsilva-icone-claro.svg` / `-512.png` / `-1024.png` | Ícone em fundo branco. |

- **Símbolo**: _
- Área de proteção: ao redor do símbolo, no mínimo 1/4 da altura dele. Tamanho mínimo: 16 px (favicon).

## 3. Cores

| Papel | Cor | Uso |
|---|---|---|
| Primária clara | `#60a5fa` | Início do degradê do símbolo, destaques no tema escuro. |
| Primária escura | `#1d4ed8` | Fim do degradê, botões e links no tema claro. |
| Fundo escuro | `#0b1a3a` | Fundo do ícone e das áreas escuras. |
| Texto | `#0b1220` / `#64748b` | Título e subtítulo nos fundos claros. |

No site, a cor primária vem do preset do PrimeNG (`src/app.config.ts`), então as telas seguem a
mesma paleta sem cor fixa no código.

## 4. Padrão entre repositórios

Mesmo conjunto de arquivos e mesma nomenclatura (`<projeto>-<peça>[-variação][-tamanho].ext`) das
pastas `brand/` dos demais repositórios do cluster. Ao criar um sistema novo neste
repositório, acrescente `adailsilva-<sistema>-icone*.svg/png` e `adailsilva-<sistema>-logo-horizontal*.svg/png`.
