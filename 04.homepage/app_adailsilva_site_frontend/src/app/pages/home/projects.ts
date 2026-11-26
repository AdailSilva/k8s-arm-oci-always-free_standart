import { Component, computed, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { SectionHeader } from '@/app/shared/section-header';
import { AppMockup } from '@/app/shared/app-mockup';
import { AnimatedBorder } from '@/app/shared/animated-border';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { PROJETOS } from '@/app/core/site.config';

@Component({
    selector: 'home-projects',
    standalone: true,
    imports: [TagModule, SectionHeader, AppMockup, AnimatedBorder, RevealDirective],
    template: `
        <section id="projetos" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header selo="Projetos" icone="pi pi-briefcase" subtitulo="Três sistemas que trabalham juntos, em produção, atendendo a operação diária de um laboratório óptico — do balcão à expedição.">
                    Sistemas reais,<br class="hidden md:block" />
                    rodando todos os dias
                </section-header>

                <!-- seletor de projeto -->
                <div reveal class="mt-12 flex justify-center">
                    <div class="inline-flex flex-wrap justify-center gap-1 rounded-full border p-1.5 bg-surface-50 dark:bg-surface-950" role="tablist">
                        @for (p of projetos; track p.id) {
                            <button
                                type="button"
                                role="tab"
                                [attr.aria-selected]="p.id === ativoId()"
                                (click)="ativoId.set(p.id)"
                                class="px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer inline-flex items-center gap-2"
                                [class]="p.id === ativoId() ? 'bg-surface-0 dark:bg-surface-900 shadow-stroke text-surface-950 dark:text-surface-0' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
                            >
                                <i [class]="p.icone" class="text-sm!"></i>{{ p.nome }}
                            </button>
                        }
                    </div>
                </div>

                @let p = ativo();
                <div class="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div class="lg:col-span-5 order-2 lg:order-1">
                        <div class="flex items-center gap-3 flex-wrap">
                            <p-tag [value]="p.status" severity="success" [rounded]="true" icon="pi pi-circle-fill" styleClass="text-xs!" />
                            <span class="text-sm text-surface-500">{{ p.subtitulo }}</span>
                        </div>
                        <h3 class="mt-4 text-3xl md:text-4xl font-medium tracking-tight">{{ p.nome }}</h3>
                        <p class="mt-4 text-surface-500 leading-7">{{ p.descricao }}</p>
                        <ul class="mt-6 grid gap-3">
                            @for (d of p.destaques; track d.texto) {
                                <li class="flex items-start gap-3">
                                    <span class="shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center"><i [class]="d.icone" class="text-sm!"></i></span>
                                    <span class="text-surface-700 dark:text-surface-200 leading-6 pt-1">{{ d.texto }}</span>
                                </li>
                            }
                        </ul>
                        <div class="mt-6 flex flex-wrap gap-2">
                            @for (s of p.stack; track s) {
                                <span class="text-xs rounded-full border px-3 py-1 text-surface-600 dark:text-surface-300">{{ s }}</span>
                            }
                        </div>
                    </div>
                    <div class="lg:col-span-7 order-1 lg:order-2">
                        <div class="relative rounded-3xl bg-surface-50 dark:bg-surface-950 p-2 md:p-3 border">
                            <animated-border [count]="4" />
                            @switch (p.mockup) {
                                @case ('erp') {
                                    <app-mockup variante="erp" />
                                }
                                @case ('producao') {
                                    <app-mockup variante="producao" />
                                }
                                @case ('licencas') {
                                    <app-mockup variante="licencas" />
                                }
                            }
                        </div>
                        <p class="text-center text-xs text-surface-400 mt-3">Ilustração da interface · dados fictícios · demonstração real sob agendamento</p>
                    </div>
                </div>

                <!-- integração entre os sistemas -->
                <div reveal class="mt-16 rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="rounded-3xl bg-surface-0 dark:bg-surface-900 shadow-stroke p-6 md:p-8">
                        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-3">
                            @for (p of projetos; track p.id; let ultimo = $last) {
                                <div class="flex-1 flex items-center gap-3 rounded-2xl border p-4">
                                    <span class="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center"><i [class]="p.icone"></i></span>
                                    <span class="leading-tight"><span class="font-medium block">{{ p.nome }}</span><span class="text-xs text-surface-500">{{ p.subtitulo }}</span></span>
                                </div>
                                @if (!ultimo) {
                                    <i class="pi pi-arrow-right-arrow-left text-surface-400 self-center rotate-90 md:rotate-0"></i>
                                }
                            }
                        </div>
                        <p class="mt-5 text-sm text-surface-500 text-center leading-6">
                            Integrados por APIs: o mesmo funcionário, o mesmo login e os mesmos dados circulam entre os sistemas — e o BackOffice garante as licenças de todos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class HomeProjects {
    readonly projetos = PROJETOS;
    readonly ativoId = signal(PROJETOS[0].id);
    readonly ativo = computed(() => this.projetos.find((p) => p.id === this.ativoId()) ?? this.projetos[0]);
}
