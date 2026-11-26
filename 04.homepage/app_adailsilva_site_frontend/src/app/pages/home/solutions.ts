import { Component } from '@angular/core';
import { SurfaceLine } from '@/app/shared/surface-line';
import { SectionHeader } from '@/app/shared/section-header';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { DIFERENCIAIS, SOLUCOES } from '@/app/core/site.config';

@Component({
    selector: 'home-solutions',
    standalone: true,
    imports: [SurfaceLine, SectionHeader, RevealDirective],
    template: `
        <section id="solucoes" class="relative pt-20 md:pt-32">
            <surface-line class="-top-16 -left-16 2xl:left-0 md:w-[44vw] scale-y-[-1]" />
            <surface-line class="-top-16 -right-16 2xl:right-0 md:w-[44vw] scale-x-[-1] scale-y-[-1]" />
            <div class="landing-container">
                <section-header selo="Soluções" icone="pi pi-th-large" subtitulo="Módulos que se encaixam como peças de um mesmo sistema. Você começa pelo que precisa agora e evolui no seu ritmo.">
                    Tudo o que a sua empresa<br class="hidden md:block" />
                    precisa, num só sistema
                </section-header>

                <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    @for (s of solucoes; track s.titulo; let i = $index) {
                        <div reveal [revealDelay]="(i % 3) * 90" class="group p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border h-full">
                            <div class="h-full p-6 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke transition-transform duration-300 group-hover:-translate-y-1">
                                <div class="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-white">
                                    <i [class]="s.icone" class="text-xl!"></i>
                                </div>
                                <h3 class="mt-6 text-lg font-medium">{{ s.titulo }}</h3>
                                <p class="text-surface-500 mt-2 leading-6">{{ s.descricao }}</p>
                                <ul class="mt-5 space-y-2.5">
                                    @for (it of s.itens; track it) {
                                        <li class="flex gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-5"><i class="pi pi-check text-primary-500 text-xs! mt-1"></i>{{ it }}</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </div>

                <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    @for (d of diferenciais; track d.titulo; let i = $index) {
                        <div reveal [revealDelay]="i * 80" class="flex gap-4 items-start rounded-2xl border p-5 bg-surface-0/60 dark:bg-surface-900/60">
                            <span class="shrink-0 w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><i [class]="d.icone"></i></span>
                            <div>
                                <h4 class="font-medium">{{ d.titulo }}</h4>
                                <p class="text-sm text-surface-500 mt-1 leading-5">{{ d.descricao }}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>
    `
})
export class HomeSolutions {
    readonly solucoes = SOLUCOES;
    readonly diferenciais = DIFERENCIAIS;
}
