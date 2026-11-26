import { Component } from '@angular/core';
import { SectionHeader } from '@/app/shared/section-header';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { ETAPAS } from '@/app/core/site.config';

@Component({
    selector: 'home-process',
    standalone: true,
    imports: [SectionHeader, RevealDirective],
    template: `
        <section id="processo" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header selo="Como trabalho" icone="pi pi-directions" subtitulo="Um processo transparente, com você participando de cada etapa — sem surpresas no fim.">
                    Da primeira conversa<br class="hidden md:block" />
                    ao sistema no ar
                </section-header>

                <ol class="mt-14 relative grid md:grid-cols-5 gap-5">
                    <div class="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"></div>
                    @for (e of etapas; track e.titulo; let i = $index) {
                        <li reveal [revealDelay]="i * 110" class="relative flex md:flex-col gap-4 md:gap-0 md:text-center">
                            <div class="relative z-10 shrink-0 md:mx-auto w-14 h-14 rounded-2xl border bg-surface-0 dark:bg-surface-900 shadow-stroke flex items-center justify-center">
                                <i [class]="e.icone" class="text-primary-500 text-lg!"></i>
                                <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-semibold flex items-center justify-center">{{ i + 1 }}</span>
                            </div>
                            <div class="md:mt-5">
                                <h3 class="font-medium">{{ e.titulo }}</h3>
                                <p class="mt-1.5 text-sm text-surface-500 leading-6">{{ e.descricao }}</p>
                            </div>
                        </li>
                    }
                </ol>
            </div>
        </section>
    `
})
export class HomeProcess {
    readonly etapas = ETAPAS;
}
