import { Component, inject } from '@angular/core';
import { SectionHeader } from '@/app/shared/section-header';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { AnimatedBorder } from '@/app/shared/animated-border';
import { LorawanFlow } from '@/app/shared/lorawan-flow';
import { NavService } from '@/app/layout/nav.service';
import { PROJETOS_IOT, SERVICOS_IOT } from '@/app/core/iot.config';

/** Chamada da área de Internet das Coisas na home, levando à página /iot. */
@Component({
    selector: 'home-iot',
    standalone: true,
    imports: [SectionHeader, RevealDirective, AnimatedBorder, LorawanFlow],
    template: `
        <section id="iot" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header
                    selo="Internet das Coisas"
                    icone="pi pi-wifi"
                    subtitulo="Além de sistemas de gestão, construo redes LoRaWAN completas: placas eletrônicas sob medida, firmware para ESP32 e STM32, gateways, apps e servidor ChirpStack rodando em Kubernetes."
                >
                    Do sensor no campo<br class="hidden md:block" />
                    ao painel na nuvem
                </section-header>

                <div reveal class="mt-14 relative overflow-hidden rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-surface-950 text-surface-0">
                        <div class="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_85%_15%,#059669,transparent_45%),radial-gradient(circle_at_5%_95%,var(--p-primary-700),transparent_45%)]"></div>
                        <div class="relative grid lg:grid-cols-12 gap-10 items-center">
                            <div class="lg:col-span-5">
                                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-surface-300">
                                    <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 ping-soft"></span><span class="relative w-2 h-2 rounded-full bg-emerald-500"></span></span>
                                    4 projetos LoRaWAN com firmware próprio
                                </span>
                                <h3 class="mt-5 text-3xl md:text-4xl font-medium leading-tight">Dispositivos LoRaWAN com página web e app Android</h3>
                                <p class="mt-4 text-surface-300 leading-7">
                                    Dois gateways de 8 canais num único ESP32 (SX1301 e SX1302), nós ESP32 + RFM95W e o módulo nacional da Radioenge regravado com firmware próprio, todos chegando ao meu ChirpStack v4.19 — os gateways por MQTT/TLS.
                                    Cada um com status, logs e diagnósticos ao vivo no navegador e num app Android em Flutter — o mesmo cuidado de engenharia dos meus sistemas, agora no hardware.
                                </p>
                                <ul class="mt-6 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                                    @for (s of servicos; track s.titulo) {
                                        <li class="flex items-center gap-2.5 text-sm text-surface-200"><i [class]="s.icone" class="text-emerald-400 text-sm!"></i>{{ s.titulo }}</li>
                                    }
                                </ul>
                                <a href="/iot" (click)="nav.ir('/iot', $event)" class="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-surface-950 px-5 py-2.5 font-medium hover:bg-surface-200 transition-colors">
                                    Conhecer a solução IoT <i class="pi pi-arrow-right text-sm!"></i>
                                </a>
                            </div>
                            <div class="lg:col-span-7">
                                <div class="relative pb-10 md:pb-14 pr-10 md:pr-16">
                                    <div class="relative rounded-3xl bg-white/5 border border-white/10 p-2 md:p-3">
                                        <animated-border [count]="3" />
                                        <div class="rounded-2xl overflow-hidden border border-white/10 bg-surface-0">
                                            <div class="flex items-center gap-3 px-4 py-2 border-b bg-surface-50 text-surface-500">
                                                <div class="flex gap-1.5">
                                                    <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                                </div>
                                                <span class="flex-1 text-center text-[11px]"><i class="pi pi-wifi text-[9px]! text-emerald-500 mr-1"></i>192.168.18.101</span>
                                                <span class="w-10"></span>
                                            </div>
                                            <img src="/iot/gw-sx1302/web-status.webp" alt="Página web do Gateway ESP32 with SX1302: painel de status" loading="lazy" decoding="async" class="w-full h-auto block" />
                                        </div>
                                    </div>
                                    <div class="absolute right-0 bottom-0 w-[30%] max-w-[190px] rounded-[1.6rem] border-[5px] border-surface-900 bg-surface-900 overflow-hidden shadow-[0_30px_40px_-15px_rgba(0,0,0,0.6)]">
                                        <img src="/iot/gw-sx1302/app-status.webp" alt="App Android do gateway SX1302: status" loading="lazy" decoding="async" class="w-full h-auto block rounded-[1.25rem]" width="412" height="892" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- os 4 projetos, com capturas reais -->
                <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    @for (p of projetos; track p.id; let i = $index) {
                        <a reveal [revealDelay]="i * 80" href="/iot" (click)="nav.ir('/iot', $event)" class="group block p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border h-full">
                            <div class="h-full rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke overflow-hidden flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
                                <div class="relative h-36 overflow-hidden border-b bg-surface-100 dark:bg-surface-800">
                                    <img [src]="p.imagem" [alt]="'Captura real: ' + p.nome" loading="lazy" decoding="async" class="w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.04]" />
                                    <span
                                        class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium bg-surface-0/90 dark:bg-surface-900/90 backdrop-blur"
                                        [class]="p.severidade === 'success' ? 'text-emerald-700 dark:text-emerald-300' : p.severidade === 'info' ? 'text-sky-700 dark:text-sky-300' : 'text-amber-700 dark:text-amber-300'"
                                        ><span class="w-1.5 h-1.5 rounded-full bg-current"></span>{{ p.status }}</span
                                    >
                                </div>
                                <div class="p-5 flex-1 flex flex-col">
                                    <span class="text-xs uppercase tracking-wider text-surface-400">{{ p.tipo }}</span>
                                    <h4 class="mt-1 font-medium leading-snug">{{ p.nome }}</h4>
                                    <p class="mt-2 text-sm text-surface-500 leading-5">{{ p.hardware }}</p>
                                    <span class="mt-auto pt-4 text-sm font-medium text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                                        >Ver telas reais <i class="pi pi-arrow-right text-xs!"></i
                                    ></span>
                                </div>
                            </div>
                        </a>
                    }
                </div>

                <div reveal class="mt-6 rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="rounded-3xl p-4 md:p-6">
                        <lorawan-flow [compacto]="true" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class HomeIot {
    readonly nav = inject(NavService);
    readonly servicos = SERVICOS_IOT;
    /** Os 4 projetos LoRaWAN (sem o servidor ChirpStack). */
    readonly projetos = PROJETOS_IOT.filter((p) => p.tipo !== 'Servidor');
}
