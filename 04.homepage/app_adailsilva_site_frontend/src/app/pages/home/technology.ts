import { Component, inject } from '@angular/core';
import { SectionHeader } from '@/app/shared/section-header';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { NavService } from '@/app/layout/nav.service';
import { CLUSTER, TECNOLOGIAS } from '@/app/core/site.config';

@Component({
    selector: 'home-technology',
    standalone: true,
    imports: [SectionHeader, RevealDirective],
    template: `
        <section id="tecnologia" class="relative pt-24 md:pt-36">
            <div class="landing-container">
                <section-header selo="Tecnologia" icone="pi pi-microchip" subtitulo="As mesmas tecnologias usadas por grandes empresas, aplicadas ao tamanho do seu negócio.">
                    Engenharia de ponta,<br class="hidden md:block" />
                    do código à nuvem
                </section-header>

                <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    @for (g of grupos; track g.titulo; let i = $index) {
                        <div reveal [revealDelay]="i * 90" class="p-2 rounded-3xl bg-surface-50 dark:bg-surface-950 border">
                            <div class="h-full p-6 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-stroke">
                                <div class="flex items-center gap-3">
                                    <span class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><i [class]="g.icone"></i></span>
                                    <h3 class="font-medium text-lg">{{ g.titulo }}</h3>
                                </div>
                                <div class="mt-5 flex flex-wrap gap-2">
                                    @for (t of g.itens; track t) {
                                        <span class="text-sm rounded-lg border px-2.5 py-1 text-surface-600 dark:text-surface-300">{{ t }}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <!-- destaque do cluster -->
                <div reveal class="mt-6 relative overflow-hidden rounded-[2rem] border p-2 bg-surface-50 dark:bg-surface-950">
                    <div class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-surface-950 text-surface-0">
                        <div class="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_85%_20%,var(--p-primary-600),transparent_45%),radial-gradient(circle_at_10%_90%,#7c3aed,transparent_40%)]"></div>
                        <div class="relative grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-surface-300">
                                    <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 ping-soft"></span><span class="relative w-2 h-2 rounded-full bg-emerald-500"></span></span>
                                    Cluster online
                                </span>
                                <h3 class="mt-5 text-3xl md:text-4xl font-medium leading-tight">Seu sistema numa nuvem que eu mesmo construí e opero</h3>
                                <p class="mt-4 text-surface-300 leading-7">
                                    Kubernetes {{ cluster.kubernetes }} em {{ cluster.nos }} nós {{ cluster.arquitetura }} na {{ cluster.provedor }}: certificados HTTPS automáticos, deploy contínuo a cada versão e
                                    infraestrutura descrita como código.
                                </p>
                                <a href="/infraestrutura" (click)="nav.ir('/infraestrutura', $event)" class="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-surface-950 px-5 py-2.5 font-medium hover:bg-surface-200 transition-colors">
                                    Conhecer a infraestrutura <i class="pi pi-arrow-right text-sm!"></i>
                                </a>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                @for (n of cluster.nosDetalhe; track n.nome) {
                                    <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                                        <div class="flex items-center justify-between">
                                            <i class="pi pi-server text-surface-300"></i>
                                            <span class="text-[11px] rounded-full px-2 py-0.5 bg-white/10 text-surface-300">ARM64</span>
                                        </div>
                                        <div class="mt-4 font-mono text-sm">{{ n.nome }}</div>
                                        <div class="text-xs text-surface-400 mt-0.5">{{ n.papel }}</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class HomeTechnology {
    readonly nav = inject(NavService);
    readonly grupos = TECNOLOGIAS;
    readonly cluster = CLUSTER;
}
