import { Component, inject } from '@angular/core';
import { SurfaceLine } from '@/app/shared/surface-line';
import { AnimatedBorder } from '@/app/shared/animated-border';
import { AppMockup } from '@/app/shared/app-mockup';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { NavService } from '@/app/layout/nav.service';
import { FAIXA_TECNOLOGIAS } from '@/app/core/site.config';

@Component({
    selector: 'home-hero',
    standalone: true,
    imports: [SurfaceLine, AnimatedBorder, AppMockup, RevealDirective],
    template: `
        <section class="relative overflow-hidden pt-36 md:pt-48 pb-16">
            <div class="absolute inset-x-0 top-0 h-[720px] bg-grid pointer-events-none"></div>
            <div class="absolute left-1/2 -translate-x-1/2 top-24 w-[720px] h-[420px] hero-glow pointer-events-none opacity-70"></div>
            <surface-line class="top-16 -left-36 2xl:left-0 md:w-[36vw]" />
            <surface-line class="top-16 -right-36 2xl:right-0 md:w-[36vw] scale-x-[-1]" />
            <surface-line class="top-[410px] -left-36 2xl:left-0 md:w-[48vw] scale-y-[0.5]" />
            <surface-line class="top-[410px] -right-36 2xl:right-0 md:w-[48vw] scale-y-[0.5] scale-x-[-1]" />

            <div class="landing-container relative">
                <div reveal class="w-fit mx-auto mb-6 rounded-full border bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur pl-2 pr-4 py-1.5 flex items-center gap-2.5 text-sm">
                    <span class="flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 font-medium">
                        <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 ping-soft"></span><span class="relative w-2 h-2 rounded-full bg-emerald-500"></span></span>
                        Agenda aberta
                    </span>
                    <span class="text-surface-500">Novos projetos para {{ ano }}</span>
                </div>

                <h1 reveal [revealDelay]="80" class="text-4xl sm:text-5xl md:text-7xl font-medium text-center mx-auto leading-[115%]! tracking-tight max-w-5xl">
                    Sistemas web completos para a <span class="text-gradient">gestão da sua empresa</span>
                </h1>
                <p reveal [revealDelay]="160" class="mt-6 text-center mx-auto text-base md:text-xl text-surface-500 max-w-md md:max-w-3xl leading-7 md:leading-8">
                    Do pedido ao financeiro, da produção ao portal do cliente: desenvolvo ERPs sob medida, modernos e seguros — com as regras do seu negócio e rodando em nuvem com Kubernetes.
                </p>
                <div reveal [revealDelay]="240" class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9">
                    <a href="/#contato" (click)="nav.ir('contato', $event)" class="landing-button-primary rounded-xl! px-6! py-3! inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                        <i class="pi pi-send"></i> Solicitar orçamento
                    </a>
                    <a href="/#projetos" (click)="nav.ir('projetos', $event)" class="landing-button-secondary rounded-xl! px-6! py-3! inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                        Ver projetos <i class="pi pi-arrow-down text-sm!"></i>
                    </a>
                </div>
                <ul reveal [revealDelay]="300" class="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-surface-500">
                    @for (t of garantias; track t) {
                        <li class="flex items-center gap-2"><i class="pi pi-check-circle text-primary-500 text-sm!"></i>{{ t }}</li>
                    }
                </ul>

                <div reveal [revealDelay]="360" class="relative mt-16 md:mt-20 px-1 md:px-6">
                    <div class="relative rounded-3xl bg-surface-50 dark:bg-surface-950 p-2 md:p-3 border">
                        <animated-border />
                        <app-mockup variante="erp" />
                    </div>

                    <!-- cartões flutuantes -->
                    <div class="hidden xl:flex absolute -left-24 top-14 items-center gap-3 rounded-2xl border bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur px-4 py-3 shadow-stroke animate-[float_6s_ease-in-out_infinite]">
                        <span class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center"><i class="pi pi-bolt"></i></span>
                        <span class="text-sm leading-tight"><span class="font-medium block">Pedido atualizado</span><span class="text-surface-500 text-xs">em tempo real · agora</span></span>
                    </div>
                    <div class="hidden xl:flex absolute -right-24 -bottom-5 items-center gap-3 rounded-2xl border bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur px-4 py-3 shadow-stroke animate-[float_7s_ease-in-out_infinite_1s]">
                        <span class="w-9 h-9 rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-300 flex items-center justify-center"><i class="pi pi-shield"></i></span>
                        <span class="text-sm leading-tight"><span class="font-medium block">HTTPS e backups</span><span class="text-surface-500 text-xs">infraestrutura própria</span></span>
                    </div>
                    <p class="text-center text-xs text-surface-400 mt-4">Ilustração da interface · dados fictícios</p>
                </div>
            </div>

            <!-- faixa de tecnologias -->
            <div class="marquee relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
                <div class="marquee-track flex w-max gap-3">
                    @for (t of faixa; track $index) {
                        <span class="whitespace-nowrap rounded-full border px-4 py-2 text-sm text-surface-600 dark:text-surface-300 bg-surface-0 dark:bg-surface-900">{{ t }}</span>
                    }
                </div>
            </div>
        </section>
    `
})
export class HomeHero {
    readonly nav = inject(NavService);
    readonly ano = new Date().getFullYear();
    readonly garantias = ['Feito sob medida', 'Funciona em qualquer tela', 'Suporte direto com o desenvolvedor'];
    readonly faixa = [...FAIXA_TECNOLOGIAS, ...FAIXA_TECNOLOGIAS];
}
