import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { AnimatedBorder } from '@/app/shared/animated-border';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { Ligacao, TelaDispositivo } from '@/app/core/iot.config';

/** O que a vitrine precisa saber de um dispositivo (gateway ou nó). */
export interface DispositivoVitrine {
    id: string;
    nome: string;
    endereco: string;
    web: TelaDispositivo[];
    app: TelaDispositivo[];
    ligacoes: Ligacao[];
}

/**
 * Vitrine das telas REAIS de um dispositivo LoRaWAN: página web (moldura de
 * navegador com abas), app Android em Flutter (fileira de celulares) e
 * diagramas de ligação por placa. Clicar numa imagem pede a ampliação ao pai.
 */
@Component({
    selector: 'device-showcase',
    standalone: true,
    imports: [AnimatedBorder, RevealDirective],
    template: `
        @let d = dispositivo();
        <!-- ============ página web ============ -->
        <div class="mt-16 md:mt-20">
            <div reveal class="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2"><i class="pi pi-desktop text-sm!"></i>Página web · telas reais</span>
                    <h3 class="mt-2 text-2xl md:text-3xl font-medium tracking-tight">{{ tituloWeb() }}</h3>
                </div>
            </div>
            <div class="mt-5 -mx-4 px-4 overflow-x-auto [scrollbar-width:none]">
                <div class="flex gap-1.5 w-max">
                    @for (t of d.web; track t.id) {
                        <button
                            type="button"
                            (click)="webId.set(t.id)"
                            class="px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer whitespace-nowrap"
                            [class]="t.id === telaWeb().id ? 'bg-emerald-600 border-emerald-600 text-white' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'"
                        >
                            {{ t.rotulo }}
                        </button>
                    }
                </div>
            </div>

            @let w = telaWeb();
            <div class="mt-6 grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div class="lg:col-span-9">
                    <div class="relative rounded-3xl bg-surface-50 dark:bg-surface-950 p-2 md:p-3 border">
                        <animated-border [count]="4" />
                        <div class="relative rounded-2xl overflow-hidden border bg-surface-0 dark:bg-surface-900 shadow-[0px_46px_28px_0px_rgba(44,54,87,0.05),0px_20px_20px_0px_rgba(44,54,87,0.09)]">
                            <div class="flex items-center gap-3 px-4 py-2.5 border-b bg-surface-50 dark:bg-surface-950">
                                <div class="flex gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                    <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                </div>
                                <div class="flex-1 flex justify-center min-w-0">
                                    <span class="inline-flex items-center gap-1.5 text-[11px] text-surface-500 bg-surface-0 dark:bg-surface-900 border rounded-md px-3 py-0.5 max-w-full">
                                        <i [class]="iconeEndereco()" class="text-[9px]! text-emerald-500"></i>{{ d.endereco }}
                                    </span>
                                </div>
                                <span class="w-10"></span>
                            </div>
                            <button type="button" (click)="ampliar.emit(w.imagem)" class="relative block w-full cursor-zoom-in group bg-surface-0" [attr.aria-label]="'Ampliar a tela ' + w.titulo">
                                <img [src]="w.imagem" [alt]="d.nome + ', página web: ' + w.titulo" loading="lazy" decoding="async" class="w-full h-auto block" />
                                <span class="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-surface-950/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><i class="pi pi-search-plus text-sm!"></i
                                ></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-3">
                    <span class="text-sm font-mono text-emerald-600 dark:text-emerald-400">{{ indiceWeb() + 1 }} / {{ d.web.length }}</span>
                    <h4 class="mt-2 text-xl font-medium tracking-tight">{{ w.titulo }}</h4>
                    <p class="mt-3 text-surface-500 leading-7">{{ w.descricao }}</p>
                    <div class="mt-5 flex gap-2">
                        <button type="button" (click)="passoWeb(-1)" aria-label="Tela anterior" class="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer">
                            <i class="pi pi-arrow-left text-sm!"></i>
                        </button>
                        <button type="button" (click)="passoWeb(1)" aria-label="Próxima tela" class="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer">
                            <i class="pi pi-arrow-right text-sm!"></i>
                        </button>
                    </div>
                    <p class="mt-5 text-xs text-surface-400 leading-5">Capturas da interface real do firmware, com dados de exemplo · clique para ampliar</p>
                </div>
            </div>
        </div>

        <!-- ============ app Android ============ -->
        <div class="mt-16 md:mt-24">
            <div reveal class="text-center">
                <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2"><i class="pi pi-android text-sm!"></i>App Android (Flutter) · {{ d.app.length }} telas</span>
                <h3 class="mt-2 text-2xl md:text-3xl font-medium tracking-tight">{{ tituloApp() }}</h3>
                <p class="mt-3 text-surface-500 max-w-2xl mx-auto leading-7">{{ subtituloApp() }}</p>
            </div>
            <div class="mt-10 -mx-4 px-4 overflow-x-auto [scrollbar-width:thin] pb-4">
                <div class="flex gap-5 md:gap-7 w-max mx-auto">
                    @for (a of d.app; track a.id; let i = $index) {
                        <figure class="w-[190px] md:w-[220px] shrink-0">
                            <button
                                type="button"
                                (click)="ampliar.emit(a.imagem)"
                                class="block w-full rounded-[2.2rem] border-[7px] border-surface-900 dark:border-surface-700 bg-surface-900 overflow-hidden shadow-[0_30px_40px_-20px_rgba(15,23,42,0.45)] cursor-zoom-in transition-transform duration-300 hover:-translate-y-1"
                                [attr.aria-label]="'Ampliar a tela do app: ' + a.titulo"
                            >
                                <img [src]="a.imagem" [alt]="d.nome + ', app Android: ' + a.titulo" loading="lazy" decoding="async" class="w-full h-auto block rounded-[1.7rem]" width="412" height="892" />
                            </button>
                            <figcaption class="mt-3 text-center">
                                <span class="block text-sm font-medium">{{ a.titulo }}</span>
                                <span class="block text-xs text-surface-500 mt-0.5 leading-4">{{ a.descricao }}</span>
                            </figcaption>
                        </figure>
                    }
                </div>
            </div>
        </div>

        <!-- ============ ligações ============ -->
        @let l = ligacao();
        <div reveal class="mt-14 md:mt-20 grid lg:grid-cols-12 gap-6 items-center">
            <div class="lg:col-span-4">
                <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2"><i class="pi pi-sitemap text-sm!"></i>Documentação</span>
                <h3 class="mt-2 text-2xl font-medium tracking-tight">Cada fio documentado</h3>
                <p class="mt-3 text-surface-500 leading-7">{{ textoLigacoes() }}</p>
                <div class="mt-5 flex flex-wrap gap-1.5">
                    @for (x of d.ligacoes; track x.id) {
                        <button
                            type="button"
                            (click)="ligacaoId.set(x.id)"
                            class="px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer whitespace-nowrap"
                            [class]="x.id === l.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'"
                        >
                            {{ x.rotulo }}
                        </button>
                    }
                </div>
            </div>
            <div class="lg:col-span-8 p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                <button type="button" (click)="ampliar.emit(l.imagem)" class="block w-full rounded-2xl overflow-hidden border bg-white cursor-zoom-in" [attr.aria-label]="'Ampliar: ' + l.legenda">
                    <img [src]="l.imagem" [alt]="l.legenda" loading="lazy" decoding="async" class="w-full h-auto block" />
                </button>
                <p class="text-center text-xs text-surface-400 mt-2.5 mb-1">{{ l.legenda }}</p>
            </div>
        </div>
    `
})
export class DeviceShowcase {
    readonly dispositivo = input.required<DispositivoVitrine>();
    readonly tituloWeb = input('Interface web embarcada');
    readonly tituloApp = input('O dispositivo no bolso');
    readonly subtituloApp = input('As mesmas seções da página web, para configurar e acompanhar o dispositivo em campo.');
    readonly iconeEndereco = input('pi pi-wifi');
    readonly textoLigacoes = input('Todo projeto vem com o diagrama de ligações em alta resolução para cada placa, o passo a passo de gravação e o guia de uso — para a sua equipe montar e manter sem depender de mim.');
    readonly ampliar = output<string>();

    /** Volta para a primeira tela sempre que o dispositivo muda. */
    readonly webId = linkedSignal(() => this.dispositivo().web[0]?.id ?? '');
    readonly ligacaoId = linkedSignal(() => this.dispositivo().ligacoes[0]?.id ?? '');

    readonly indiceWeb = computed(() =>
        Math.max(
            0,
            this.dispositivo().web.findIndex((t) => t.id === this.webId())
        )
    );
    readonly telaWeb = computed(() => this.dispositivo().web[this.indiceWeb()]);
    readonly ligacao = computed(() => this.dispositivo().ligacoes.find((x) => x.id === this.ligacaoId()) ?? this.dispositivo().ligacoes[0]);

    passoWeb(delta: number): void {
        const web = this.dispositivo().web;
        const n = web.length;
        this.webId.set(web[(this.indiceWeb() + delta + n) % n].id);
    }
}
