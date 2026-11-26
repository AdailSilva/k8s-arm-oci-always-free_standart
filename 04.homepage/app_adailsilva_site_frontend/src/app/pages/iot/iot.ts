import { Component, computed, inject, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { SurfaceLine } from '@/app/shared/surface-line';
import { SectionHeader } from '@/app/shared/section-header';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { DeviceShowcase } from '@/app/shared/device-showcase';
import { LorawanFlow } from '@/app/shared/lorawan-flow';
import { NavService } from '@/app/layout/nav.service';
import { CONTATOS } from '@/app/core/site.config';
import { linkWhatsapp } from '@/app/core/contato.util';
import { APLICACOES_IOT, CAMADAS_REDE, CAPTURAS_REAIS, ETAPAS_HARDWARE, GATEWAYS, GatewayLorawan, NOS_LORAWAN, NUMEROS_IOT, NoLorawan, PERGUNTAS_IOT, PROJETOS_IOT, ProjetoIot, SERVICOS_IOT, STACK_IOT } from '@/app/core/iot.config';

@Component({
    selector: 'iot-page',
    standalone: true,
    imports: [TagModule, AccordionModule, SurfaceLine, SectionHeader, RevealDirective, DeviceShowcase, LorawanFlow],
    host: { '(document:keydown.escape)': 'ampliada.set(null)' },
    template: `
        <!-- ============================== HERO ============================== -->
        <section class="relative overflow-hidden pt-36 md:pt-48 pb-10">
            <div class="absolute inset-x-0 top-0 h-[680px] bg-grid pointer-events-none"></div>
            <div class="absolute left-1/2 -translate-x-1/2 top-24 w-[720px] h-[420px] iot-glow pointer-events-none opacity-70"></div>
            <surface-line class="top-16 -left-36 2xl:left-0 md:w-[36vw]" />
            <surface-line class="top-16 -right-36 2xl:right-0 md:w-[36vw] scale-x-[-1]" />

            <div class="landing-container relative text-center">
                <div reveal class="w-fit mx-auto mb-6 rounded-full border bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur pl-2 pr-4 py-1.5 flex items-center gap-2.5 text-sm">
                    <span class="flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 font-medium whitespace-nowrap">
                        <i class="pi pi-wifi text-xs!"></i>
                        IoT · LoRaWAN
                    </span>
                    <span class="text-surface-500 hidden sm:inline">Hardware, firmware, rede e nuvem</span>
                </div>
                <h1 reveal [revealDelay]="80" class="text-4xl sm:text-5xl md:text-7xl font-medium leading-[115%]! tracking-tight max-w-5xl mx-auto">Redes <span class="text-gradient-iot">LoRaWAN completas</span>, da placa ao painel</h1>
                <p reveal [revealDelay]="160" class="mt-6 text-base md:text-xl text-surface-500 max-w-md md:max-w-3xl mx-auto leading-7 md:leading-8">
                    Projeto placas eletrônicas sob medida, escrevo o firmware para ESP32 e STM32, construo gateways de 8 canais com um único ESP32, entrego página web e app Android para cada dispositivo e coloco o servidor ChirpStack para rodar em
                    Kubernetes. Uma rede de Internet das Coisas inteira, com um único responsável técnico — do sensor no campo ao dado no seu sistema.
                </p>
                <div reveal [revealDelay]="240" class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9">
                    <a [href]="whatsappIot" target="_blank" rel="noopener" class="landing-button-primary rounded-xl! px-6! py-3! inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                        <i class="pi pi-send"></i> Conversar sobre meu projeto IoT
                    </a>
                    <a href="#portfolio" (click)="rolar('portfolio', $event)" class="landing-button-secondary rounded-xl! px-6! py-3! inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                        Ver o que já está no ar <i class="pi pi-arrow-down text-sm!"></i>
                    </a>
                </div>
                <ul reveal [revealDelay]="300" class="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-surface-500">
                    @for (t of garantias; track t) {
                        <li class="flex items-center gap-2"><i class="pi pi-check-circle text-emerald-500 text-sm!"></i>{{ t }}</li>
                    }
                </ul>

                <!-- diagrama da rede -->
                <div reveal [revealDelay]="360" class="mt-16 md:mt-20 rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950 text-left">
                    <div class="rounded-3xl bg-surface-50/60 dark:bg-surface-950/60 p-4 md:p-6">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
                            <span class="text-sm font-medium flex items-center gap-2"><i class="pi pi-sitemap text-primary-500"></i>Arquitetura de uma rede que eu entrego</span>
                            <span class="flex items-center gap-4 text-xs text-surface-500">
                                <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>uplink (dados)</span>
                                <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>downlink (comandos)</span>
                            </span>
                        </div>
                        <lorawan-flow />
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================== NÚMEROS ============================== -->
        <section class="landing-container py-10">
            <div class="rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                <div class="grid grid-cols-2 lg:grid-cols-4 rounded-3xl bg-surface-0 dark:bg-surface-900 shadow-stroke overflow-hidden">
                    @for (n of numeros; track n.rotulo; let i = $index) {
                        <div reveal [revealDelay]="i * 90" class="p-5 md:p-8" [class.border-l]="i % 2 === 1 || i > 1" [class.lg:border-l]="i > 0" [class.border-t]="i > 1" [class.lg:border-t-0]="i > 1">
                            <div class="text-3xl md:text-5xl font-medium tracking-tight text-gradient-iot w-fit">{{ n.valor }}</div>
                            <div class="mt-2 font-medium">{{ n.rotulo }}</div>
                            <p class="mt-1 text-sm text-surface-500 leading-5">{{ n.detalhe }}</p>
                        </div>
                    }
                </div>
            </div>
        </section>

        <!-- ============================== PORTFÓLIO ============================== -->
        <section id="portfolio" class="landing-container pt-16 md:pt-28">
            <section-header
                selo="Já construído"
                icone="pi pi-briefcase"
                subtitulo="Quatro projetos meus — dois gateways e duas famílias de nós —, do primeiro registrador ao app no celular, em hardware de verdade e falando com o meu ChirpStack em produção."
            >
                4 projetos LoRaWAN e o servidor,<br class="hidden md:block" />
                feitos por mim
            </section-header>
            <div class="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (p of projetos; track p.id; let i = $index) {
                    <article reveal [revealDelay]="(i % 3) * 90" class="group p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border h-full">
                        <div class="h-full rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                            <button type="button" (click)="ampliada.set(p.imagem)" class="relative block h-44 overflow-hidden border-b bg-surface-100 dark:bg-surface-800 cursor-zoom-in" [attr.aria-label]="'Ampliar a captura de ' + p.nome">
                                <img [src]="p.imagem" [alt]="'Captura real: ' + p.nome" loading="lazy" decoding="async" class="w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]" />
                                <span class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-0/90 dark:from-surface-900/90 to-transparent"></span>
                            </button>
                            <div class="p-6 flex flex-col flex-1">
                                <div class="flex items-start justify-between gap-3">
                                    <span class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0"><i [class]="p.icone" class="text-lg!"></i></span>
                                    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" [class]="corStatus(p.severidade)"> <span class="w-1.5 h-1.5 rounded-full bg-current"></span>{{ p.status }} </span>
                                </div>
                                <span class="mt-5 text-xs uppercase tracking-wider text-surface-400">{{ p.tipo }}</span>
                                <h3 class="mt-1 text-lg font-medium">{{ p.nome }}</h3>
                                <p class="mt-1 text-sm text-surface-500 leading-5">{{ p.hardware }}</p>
                                <p class="mt-4 text-sm text-surface-600 dark:text-surface-300 leading-6">{{ p.descricao }}</p>
                                <ul class="mt-4 space-y-2">
                                    @for (d of p.destaques; track d) {
                                        <li class="flex gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-5"><i class="pi pi-check text-emerald-500 text-xs! mt-1"></i>{{ d }}</li>
                                    }
                                </ul>
                                <div class="mt-auto pt-5 flex flex-wrap items-center gap-2">
                                    @for (t of p.tags; track t) {
                                        <span class="text-xs rounded-full border px-2.5 py-0.5 text-surface-600 dark:text-surface-300">{{ t }}</span>
                                    }
                                    @if (p.ancora) {
                                        <a [href]="'#' + p.ancora" (click)="rolar(p.ancora, $event, p.id)" class="ml-auto text-sm font-medium text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                                            >Ver telas <i class="pi pi-arrow-right text-xs!"></i
                                        ></a>
                                    }
                                </div>
                            </div>
                        </div>
                    </article>
                }
            </div>
        </section>

        <!-- ============================== SERVIÇOS ============================== -->
        <section id="servicos-iot" class="relative pt-16 md:pt-28">
            <div class="landing-container">
                <section-header selo="O que eu entrego" icone="pi pi-th-large" subtitulo="Cada camada da rede projetada para funcionar com as outras. Você contrata o projeto inteiro ou só a parte que falta no seu.">
                    Uma rede IoT inteira,<br class="hidden md:block" />
                    com um só responsável técnico
                </section-header>

                <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    @for (s of servicos; track s.titulo; let i = $index) {
                        <div reveal [revealDelay]="(i % 3) * 90" class="group p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border h-full">
                            <div class="h-full p-6 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke transition-transform duration-300 group-hover:-translate-y-1">
                                <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                                    <i [class]="s.icone" class="text-xl!"></i>
                                </div>
                                <h3 class="mt-6 text-lg font-medium">{{ s.titulo }}</h3>
                                <p class="text-surface-500 mt-2 leading-6">{{ s.descricao }}</p>
                                <ul class="mt-5 space-y-2.5">
                                    @for (it of s.itens; track it) {
                                        <li class="flex gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-5"><i class="pi pi-check text-emerald-500 text-xs! mt-1"></i>{{ it }}</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>

        <!-- ============================== CAMADAS EXPLICADAS ============================== -->
        <section class="landing-container pt-20 md:pt-28">
            <section-header selo="Como funciona" icone="pi pi-sitemap" subtitulo="LoRaWAN leva poucos dados por longas distâncias gastando quase nada de energia. Veja o caminho que cada leitura percorre.">
                Do sensor no campo<br class="hidden md:block" />
                ao dado na sua tela
            </section-header>
            <ol class="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                @for (c of camadas; track c.id; let i = $index) {
                    <li reveal [revealDelay]="i * 90" class="p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                        <div class="h-full p-6 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke">
                            <div class="flex items-center justify-between">
                                <span class="w-11 h-11 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center"><i [class]="c.icone"></i></span>
                                <span class="font-mono text-sm text-surface-400">0{{ i + 1 }}</span>
                            </div>
                            <h3 class="mt-5 font-medium text-lg">
                                {{ c.titulo }} <span class="text-surface-400 font-normal text-sm">· {{ c.subtitulo }}</span>
                            </h3>
                            <p class="mt-2 text-sm text-surface-500 leading-6">{{ explicacoes[i] }}</p>
                        </div>
                    </li>
                }
            </ol>
        </section>

        <!-- ============================== GATEWAYS ============================== -->
        <section id="gateways" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header
                    selo="Gateways LoRaWAN"
                    icone="pi pi-wifi"
                    subtitulo="Firmware próprio, desenvolvido por mim, que transforma um único ESP32 e um concentrador Semtech num gateway LoRaWAN de 8 canais com recursos de equipamento profissional — sem Raspberry Pi."
                >
                    Dois gateways de 8 canais,<br class="hidden md:block" />
                    um ESP32 em cada
                </section-header>

                <!-- troca de gateway -->
                <div reveal class="mt-12 flex justify-center">
                    <div class="max-w-full overflow-x-auto [scrollbar-width:none] rounded-full border p-1.5 bg-surface-50 dark:bg-surface-950" role="tablist" aria-label="Gateways LoRaWAN">
                        <div class="flex gap-1 w-max">
                            @for (g of gateways; track g.id) {
                                <button
                                    type="button"
                                    role="tab"
                                    [attr.aria-selected]="g.id === gatewayId()"
                                    (click)="gatewayId.set(g.id)"
                                    class="px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                                    [class]="g.id === gatewayId() ? 'bg-surface-0 dark:bg-surface-900 shadow-stroke text-surface-950 dark:text-surface-0' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
                                >
                                    <i class="pi pi-wifi text-sm!" [class.text-emerald-500]="g.id === gatewayId()"></i>{{ g.rotulo }}
                                </button>
                            }
                        </div>
                    </div>
                </div>

                @let g = gateway();
                <!-- resumo + hardware -->
                <div class="mt-10 grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-7 p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                        <div class="h-full p-6 md:p-8 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke">
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" [class]="corStatus(g.severidade)"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>{{ g.status }}</span>
                                <span class="text-sm text-surface-500 font-mono">{{ g.codinome }}</span>
                            </div>
                            <h3 class="mt-4 text-2xl md:text-3xl font-medium tracking-tight">{{ g.nome }}</h3>
                            <p class="mt-1 text-surface-500">{{ g.subtitulo }}</p>
                            <p class="mt-5 text-surface-600 dark:text-surface-300 leading-7">{{ g.descricao }}</p>
                            @if (g.aviso) {
                                <p class="mt-5 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-surface-600 dark:text-surface-300 leading-6"><i class="pi pi-info-circle text-amber-500 mt-1"></i>{{ g.aviso }}</p>
                            }
                            <div class="mt-6 flex flex-wrap gap-2">
                                @for (s of g.stack; track s) {
                                    <span class="text-xs rounded-full border px-3 py-1 text-surface-600 dark:text-surface-300">{{ s }}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-5 p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                        <div class="h-full p-6 rounded-2xl bg-surface-950 text-surface-0 relative overflow-hidden">
                            <div class="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_90%_10%,#059669,transparent_45%),radial-gradient(circle_at_0%_100%,var(--p-primary-700),transparent_45%)]"></div>
                            <div class="relative">
                                <h4 class="font-medium flex items-center gap-2"><i class="pi pi-microchip text-emerald-400"></i>Hardware</h4>
                                <ul class="mt-5 space-y-3">
                                    @for (h of g.hardware; track h.rotulo) {
                                        <li class="flex items-start gap-3">
                                            <span class="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><i [class]="h.icone" class="text-xs! text-emerald-300"></i></span>
                                            <span class="leading-tight pt-0.5">
                                                <span class="block text-[11px] uppercase tracking-wider text-surface-400">{{ h.rotulo }}</span>
                                                <span class="block text-sm mt-0.5">{{ h.valor }}</span>
                                            </span>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <device-showcase
                    [dispositivo]="g"
                    tituloWeb="Servida pelo próprio ESP32, sem servidor extra"
                    tituloApp="O gateway no bolso, pela rede Wi-Fi"
                    subtituloApp="Login, Status, Configuração com certificados TLS, GPS, Logs, Diagnósticos e Manutenção — os mesmos endereços HTTP da página, sem nuvem e sem gastar RAM do gateway."
                    (ampliar)="ampliada.set($event)"
                />

                <!-- funcionalidades -->
                <div class="mt-20 md:mt-28">
                    <div reveal class="text-center">
                        <h3 class="text-2xl md:text-4xl font-medium tracking-tight">Todas as funcionalidades</h3>
                        <p class="mt-4 text-surface-500 max-w-2xl mx-auto leading-7">Recursos que normalmente só aparecem em gateways comerciais, num firmware que eu conheço linha a linha e posso adaptar para cada cliente.</p>
                    </div>
                    <div class="mt-12 grid md:grid-cols-2 gap-5">
                        @for (f of g.funcionalidades; track f.titulo; let i = $index) {
                            <div class="p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                                <div class="h-full p-6 md:p-7 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke">
                                    <div class="flex items-center gap-3">
                                        <span class="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center"><i [class]="f.icone"></i></span>
                                        <h4 class="font-medium text-lg">{{ f.titulo }}</h4>
                                    </div>
                                    <ul class="mt-5 space-y-3">
                                        @for (it of f.itens; track it) {
                                            <li class="flex gap-3 text-sm text-surface-600 dark:text-surface-300 leading-6"><i class="pi pi-check-circle text-emerald-500 text-sm! mt-1"></i>{{ it }}</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- console -->
                <div reveal class="mt-6 rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="relative overflow-hidden rounded-3xl bg-[#0a0f0d] text-[#c9d6d1] p-6 md:p-10">
                        <div class="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_85%_15%,#059669,transparent_40%)]"></div>
                        <div class="relative grid lg:grid-cols-5 gap-8 items-center">
                            <div class="lg:col-span-2">
                                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-surface-300"><i class="pi pi-code text-xs!"></i>Console serial</span>
                                <h4 class="mt-5 text-2xl md:text-3xl font-medium leading-tight text-white">Administração também pela linha de comando</h4>
                                <p class="mt-4 text-surface-300 leading-7">
                                    Tudo o que a página web faz pode ser feito pelo console USB — ideal para a primeira configuração, para recuperar o acesso e para automatizar a produção de vários gateways. Página e console gravam as mesmas
                                    configurações na NVS.
                                </p>
                            </div>
                            <div class="lg:col-span-3 rounded-2xl border border-white/10 bg-black/40 font-mono text-[12px] md:text-[13px] leading-relaxed p-4 md:p-5 overflow-x-auto">
                                @for (c of g.comandos; track c.comando) {
                                    <div class="whitespace-nowrap">
                                        <span class="text-emerald-400">{{ prompt() }}</span> {{ c.comando }}
                                    </div>
                                    <div class="whitespace-nowrap text-surface-500 mb-2"># {{ c.descricao }}</div>
                                }
                                <div class="whitespace-nowrap">
                                    <span class="text-emerald-400">{{ prompt() }}</span> <span class="cursor-piscando">▍</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================== NÓS LORAWAN ============================== -->
        <section id="nos" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header
                    selo="Dispositivos de campo"
                    icone="pi pi-microchip"
                    subtitulo="Duas famílias de nó, em plataformas bem diferentes, com a mesma experiência: página web, app Android, logs e diagnósticos. As telas abaixo são das interfaces reais."
                >
                    Nós LoRaWAN<br class="hidden md:block" />
                    com página web e app
                </section-header>

                <!-- troca de dispositivo -->
                <div reveal class="mt-12 flex justify-center">
                    <div class="max-w-full overflow-x-auto [scrollbar-width:none] rounded-full border p-1.5 bg-surface-50 dark:bg-surface-950" role="tablist" aria-label="Nós LoRaWAN">
                        <div class="flex gap-1 w-max">
                            @for (n of nos; track n.id) {
                                <button
                                    type="button"
                                    role="tab"
                                    [attr.aria-selected]="n.id === noId()"
                                    (click)="noId.set(n.id)"
                                    class="px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                                    [class]="n.id === noId() ? 'bg-surface-0 dark:bg-surface-900 shadow-stroke text-surface-950 dark:text-surface-0' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
                                >
                                    <i class="pi pi-microchip text-sm!" [class.text-emerald-500]="n.id === noId()"></i>{{ n.rotulo }}
                                </button>
                            }
                        </div>
                    </div>
                </div>

                @let n = no();
                <!-- resumo + especificações -->
                <div class="mt-10 grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-7 p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                        <div class="h-full p-6 md:p-8 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke">
                            <h3 class="text-2xl md:text-3xl font-medium tracking-tight">{{ n.nome }}</h3>
                            <p class="mt-4 text-surface-600 dark:text-surface-300 leading-7">{{ n.resumo }}</p>
                            <ul class="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                                @for (f of n.funcionalidades; track f) {
                                    <li class="flex gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-5"><i class="pi pi-check-circle text-emerald-500 text-sm! mt-0.5"></i>{{ f }}</li>
                                }
                            </ul>
                        </div>
                    </div>
                    <div class="lg:col-span-5 p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                        <div class="h-full p-6 rounded-2xl bg-surface-950 text-surface-0 relative overflow-hidden">
                            <div class="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_90%_10%,#059669,transparent_45%),radial-gradient(circle_at_0%_100%,var(--p-primary-700),transparent_45%)]"></div>
                            <div class="relative">
                                <h4 class="font-medium flex items-center gap-2"><i class="pi pi-list text-emerald-400"></i>Especificações</h4>
                                <dl class="mt-5 space-y-3.5">
                                    @for (e of n.especificacoes; track e.rotulo) {
                                        <div>
                                            <dt class="text-[11px] uppercase tracking-wider text-surface-400">{{ e.rotulo }}</dt>
                                            <dd class="text-sm mt-0.5 leading-5">{{ e.valor }}</dd>
                                        </div>
                                    }
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <device-showcase
                    [dispositivo]="n"
                    [tituloWeb]="n.id === 'esp32' ? 'Servida pelo próprio ESP32' : 'Direto do navegador, pela USB ou Bluetooth'"
                    [tituloApp]="n.id === 'esp32' ? 'O nó no bolso, pela rede Wi-Fi' : 'O módulo no celular, por cabo OTG ou Bluetooth'"
                    [iconeEndereco]="n.id === 'esp32' ? 'pi pi-wifi' : 'pi pi-link'"
                    [subtituloApp]="
                        n.id === 'esp32'
                            ? 'Status, chaves de sessão, ativação OTAA ou ABP, logs, diagnósticos e manutenção — as mesmas seções da página web, para configurar e acompanhar o nó em campo.'
                            : 'O app usa o mesmo console da UART do módulo: status, classe, logs com o Frame raw e configuração, sem nada passar pela internet.'
                    "
                    (ampliar)="ampliada.set($event)"
                />

                <!-- capturas reais -->
                <div class="mt-16 md:mt-24 rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="relative overflow-hidden rounded-3xl bg-[#0a0f0d] text-[#c9d6d1] p-6 md:p-10">
                        <div class="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_85%_15%,#059669,transparent_40%)]"></div>
                        <div class="relative">
                            <span class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-surface-300"><i class="pi pi-camera text-xs!"></i>Capturas reais de bancada</span>
                            <h3 class="mt-5 text-2xl md:text-3xl font-medium leading-tight text-white max-w-3xl">Cada pacote visível, do nó ao mapa</h3>
                            <p class="mt-3 text-surface-300 leading-7 max-w-3xl">
                                Os logs mostram o quadro cifrado que foi ao ar, o FCnt e o MIC de cada envio — o mesmo formato nos nós ESP32 e no Radioenge — e o gateway aparece no mapa do ChirpStack pela posição do GPS. Isso encurta muito o
                                diagnóstico em campo. As chaves de sessão do dispositivo real estão ocultas nestas imagens.
                            </p>
                            <div class="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                @for (c of capturas; track c.imagem) {
                                    <figure>
                                        <button type="button" (click)="ampliada.set(c.imagem)" class="block w-full rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in" [attr.aria-label]="'Ampliar: ' + c.titulo">
                                            <img [src]="c.imagem" [alt]="c.titulo" loading="lazy" decoding="async" class="w-full h-auto block" />
                                        </button>
                                        <figcaption class="mt-3">
                                            <span class="block font-medium text-white">{{ c.titulo }}</span>
                                            <span class="block text-sm text-surface-400 mt-1 leading-6">{{ c.descricao }}</span>
                                        </figcaption>
                                    </figure>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============================== PLACAS PERSONALIZADAS ============================== -->
        <section id="placas" class="landing-container pt-24 md:pt-36">
            <section-header selo="Placas personalizadas" icone="pi pi-microchip" subtitulo="Quando nenhum equipamento de prateleira resolve, a placa nasce da sua ideia — com o tamanho, os sensores e a autonomia que o projeto exige.">
                Hardware sob medida<br class="hidden md:block" />
                para a ideia do cliente
            </section-header>
            <ol class="mt-12 grid md:grid-cols-5 gap-4 relative">
                <div class="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                @for (e of etapas; track e.titulo; let i = $index) {
                    <li reveal [revealDelay]="i * 100" class="relative flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-0">
                        <span class="relative z-10 shrink-0 w-16 h-16 rounded-2xl border bg-surface-0 dark:bg-surface-900 shadow-stroke flex items-center justify-center"><i [class]="e.icone" class="text-emerald-500 text-xl!"></i></span>
                        <span class="md:mt-4">
                            <span class="block font-medium">{{ e.titulo }}</span>
                            <span class="block text-sm text-surface-500 mt-1 leading-5">{{ e.descricao }}</span>
                        </span>
                    </li>
                }
            </ol>
        </section>

        <!-- ============================== APLICAÇÕES ============================== -->
        <section class="landing-container pt-24 md:pt-32">
            <section-header selo="Aplicações" icone="pi pi-globe" subtitulo="Onde há algo para medir longe de uma tomada ou de um cabo de rede, LoRaWAN costuma ser a resposta mais econômica.">Onde a rede faz diferença</section-header>
            <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                @for (a of aplicacoes; track a.titulo; let i = $index) {
                    <div reveal [revealDelay]="(i % 3) * 80" class="flex gap-4 items-start rounded-2xl border p-5 bg-surface-0/60 dark:bg-surface-900/60">
                        <span class="shrink-0 w-11 h-11 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><i [class]="a.icone"></i></span>
                        <div>
                            <h4 class="font-medium">{{ a.titulo }}</h4>
                            <p class="text-sm text-surface-500 mt-1 leading-5">{{ a.descricao }}</p>
                        </div>
                    </div>
                }
            </div>

            <div reveal class="mt-10 flex flex-wrap justify-center gap-2">
                @for (s of stack; track s) {
                    <span class="text-sm rounded-lg border px-3 py-1.5 text-surface-600 dark:text-surface-300 bg-surface-0 dark:bg-surface-900">{{ s }}</span>
                }
            </div>
        </section>

        <!-- ============================== FAQ + CTA ============================== -->
        <section class="landing-container pt-24 md:pt-32">
            <div class="grid lg:grid-cols-12 gap-10">
                <div reveal class="lg:col-span-5">
                    <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-surface-600 dark:text-surface-300 bg-surface-0 dark:bg-surface-900"
                        ><i class="pi pi-question-circle text-primary-500 text-sm!"></i>Dúvidas comuns</span
                    >
                    <h2 class="mt-5 text-3xl md:text-4xl font-medium leading-[125%]!">Antes de começar o seu projeto IoT</h2>
                    <p class="mt-4 text-surface-500 leading-7">Cada rede é diferente. Me conte o que você quer medir, onde e com que frequência — eu respondo com uma proposta de arquitetura.</p>
                </div>
                <div reveal [revealDelay]="100" class="lg:col-span-7">
                    <p-accordion value="0" class="flex flex-col gap-4">
                        @for (p of perguntas; track p.pergunta; let i = $index) {
                            <p-accordion-panel [value]="i.toString()" class="rounded-[2.25rem] bg-surface-50 dark:bg-surface-950 border p-2">
                                <div class="px-6 py-5 bg-surface-0 dark:bg-surface-900 rounded-[2rem] shadow-stroke">
                                    <p-accordion-header class="group flex items-center justify-between w-full gap-4 text-left">
                                        <h3 class="text-base md:text-lg font-medium text-surface-900 dark:text-surface-0 group-hover:opacity-75 transition-opacity duration-150">{{ p.pergunta }}</h3>
                                    </p-accordion-header>
                                    <p-accordion-content>
                                        <p class="m-0 text-surface-500 pt-3 leading-7">{{ p.resposta }}</p>
                                    </p-accordion-content>
                                </div>
                            </p-accordion-panel>
                        }
                    </p-accordion>
                </div>
            </div>

            <div reveal class="mt-20 relative overflow-hidden rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                <div class="relative overflow-hidden rounded-3xl p-8 md:p-14 bg-surface-950 text-surface-0 text-center">
                    <div class="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_80%_20%,#059669,transparent_45%),radial-gradient(circle_at_15%_85%,var(--p-primary-700),transparent_45%)]"></div>
                    <div class="relative">
                        <h3 class="text-3xl md:text-5xl font-medium leading-tight max-w-3xl mx-auto">Tem uma ideia que precisa de sensores conectados?</h3>
                        <p class="mt-5 text-surface-300 leading-7 max-w-2xl mx-auto">Da prova de conceito à rede em produção: placa, firmware, gateways, ChirpStack em Kubernetes e o painel para acompanhar tudo.</p>
                        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <a [href]="whatsappIot" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-surface-950 px-6 py-3 font-medium hover:bg-surface-200 transition-colors"
                                ><i class="pi pi-whatsapp"></i> Falar no WhatsApp</a
                            >
                            <a href="/#contato" (click)="nav.ir('contato', $event)" class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-medium hover:bg-white/10 transition-colors"
                                >Enviar uma mensagem <i class="pi pi-arrow-right text-sm!"></i
                            ></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ampliação da captura real -->
        @if (ampliada(); as src) {
            <div class="fixed inset-0 z-[60] bg-surface-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out" (click)="ampliada.set(null)" role="dialog" aria-modal="true" aria-label="Tela ampliada">
                <img [src]="src" alt="Tela ampliada" class="max-w-full max-h-full rounded-xl shadow-2xl" />
                <button type="button" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Fechar"><i class="pi pi-times"></i></button>
            </div>
        }
    `,
    styles: [
        `
            .cursor-piscando {
                animation: piscar 1s steps(1) infinite;
                color: #34d399;
            }
            @keyframes piscar {
                50% {
                    opacity: 0;
                }
            }
        `
    ]
})
export class Iot {
    readonly nav = inject(NavService);

    readonly servicos = SERVICOS_IOT;
    readonly camadas = CAMADAS_REDE;
    readonly numeros = NUMEROS_IOT;
    readonly gateways = GATEWAYS;
    readonly etapas = ETAPAS_HARDWARE;
    readonly aplicacoes = APLICACOES_IOT;
    readonly stack = STACK_IOT;
    readonly perguntas = PERGUNTAS_IOT;
    readonly projetos = PROJETOS_IOT;
    readonly nos = NOS_LORAWAN;
    readonly capturas = CAPTURAS_REAIS;

    readonly garantias = ['Projeto ponta a ponta', 'Rede própria, sem mensalidade por sensor', 'Página web e app em cada dispositivo', 'Comunicação criptografada'];

    readonly explicacoes = [
        'O sensor acorda, faz a leitura, transmite alguns bytes por rádio e volta a dormir. É assim que uma bateria dura anos.',
        'O gateway recebe as transmissões de centenas de dispositivos ao redor e as envia pela internet, dentro de um túnel TLS.',
        'O ChirpStack confere a identidade de cada dispositivo, descarta duplicados, ajusta a taxa de dados e agenda as respostas.',
        'Os dados decodificados chegam à aplicação: gráficos em tempo real, alertas, relatórios e integração com outros sistemas.'
    ];

    readonly whatsappIot = CONTATOS.whatsapp ? linkWhatsapp('Olá, Adail! Vi a página de IoT no seu site e quero conversar sobre um projeto com LoRaWAN.') : '/#contato';

    readonly ampliada = signal<string | null>(null);

    /* ---- gateways ---- */
    readonly gatewayId = signal<GatewayLorawan['id']>(GATEWAYS[0].id);
    readonly gateway = computed(() => this.gateways.find((g) => g.id === this.gatewayId()) ?? this.gateways[0]);
    readonly prompt = computed(() => (this.gatewayId() === 'sx1301' ? 'ESP32_SX1301>' : 'ESP32_SX1302>'));

    /* ---- nós LoRaWAN ---- */
    readonly noId = signal<NoLorawan['id']>(NOS_LORAWAN[0].id);
    readonly no = computed(() => this.nos.find((n) => n.id === this.noId()) ?? this.nos[0]);

    corStatus(s: ProjetoIot['severidade']): string {
        if (s === 'success') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
        if (s === 'info') return 'bg-sky-500/10 text-sky-700 dark:text-sky-300';
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    }

    rolar(id: string, evento: Event, projeto?: string): void {
        evento.preventDefault();
        if (projeto === 'gw-sx1302') this.gatewayId.set('sx1302');
        if (projeto === 'gw-sx1301') this.gatewayId.set('sx1301');
        if (projeto === 'no-esp32') this.noId.set('esp32');
        if (projeto === 'no-radioenge') this.noId.set('radioenge');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
