import { Component, computed, input } from '@angular/core';

type Variante = 'erp' | 'producao' | 'licencas';

/**
 * Ilustração de interface (feita em HTML/CSS, sem imagens), no estilo dos sistemas.
 * Os números são ilustrativos.
 */
@Component({
    selector: 'app-mockup',
    standalone: true,
    template: `
        <div class="rounded-2xl overflow-hidden border bg-surface-0 dark:bg-surface-900 text-left select-none shadow-[0px_46px_28px_0px_rgba(44,54,87,0.05),0px_20px_20px_0px_rgba(44,54,87,0.09),0px_5px_12px_0px_rgba(44,54,87,0.10)]" aria-hidden="true">
            <!-- barra da janela -->
            <div class="flex items-center gap-3 px-4 py-2.5 border-b bg-surface-50 dark:bg-surface-950">
                <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <div class="flex-1 flex justify-center">
                    <span class="inline-flex items-center gap-1.5 text-[11px] text-surface-500 bg-surface-0 dark:bg-surface-900 border rounded-md px-3 py-0.5 max-w-full truncate">
                        <i class="pi pi-lock text-[9px]! text-emerald-500"></i>{{ endereco() }}
                    </span>
                </div>
                <span class="w-10"></span>
            </div>

            <div class="flex">
                <!-- menu lateral -->
                <div class="hidden sm:flex flex-col items-center gap-3 py-4 px-2.5 border-r bg-surface-50/60 dark:bg-surface-950/60">
                    <span class="w-7 h-7 rounded-lg bg-primary-500/90 flex items-center justify-center text-white text-[11px] font-bold">A</span>
                    @for (ic of menu(); track ic; let i = $index) {
                        <span class="w-7 h-7 rounded-lg flex items-center justify-center" [class]="i === 0 ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300' : 'text-surface-400'">
                            <i [class]="ic" class="text-xs!"></i>
                        </span>
                    }
                </div>

                <div class="flex-1 min-w-0 p-3 md:p-5">
                    @switch (variante()) {
                        @case ('erp') {
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-[13px] md:text-sm font-semibold">Painel de Gestão</div>
                                    <div class="text-[10px] md:text-[11px] text-surface-500">Visão geral · mês atual</div>
                                </div>
                                <span class="text-[10px] md:text-[11px] px-2 py-1 rounded-md bg-primary-500 text-white font-medium"><i class="pi pi-plus text-[9px]! mr-1"></i>Nova OS <span class="opacity-70">F2</span></span>
                            </div>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
                                @for (k of kpis; track k.rotulo) {
                                    <div class="rounded-xl border p-2 md:p-3">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[9px] md:text-[10px] text-surface-500 truncate">{{ k.rotulo }}</span>
                                            <i [class]="k.icone" class="text-[10px]! text-surface-400"></i>
                                        </div>
                                        <div class="text-sm xl:text-lg font-semibold mt-1 whitespace-nowrap">{{ k.valor }}</div>
                                        <div class="text-[9px] md:text-[10px] mt-0.5" [class]="k.positivo ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-500'">{{ k.variacao }}</div>
                                    </div>
                                }
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-5 gap-2 md:gap-3 mt-2 md:mt-3">
                                <div class="lg:col-span-3 rounded-xl border p-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[11px] font-medium">Faturamento mensal</span>
                                        <span class="text-[9px] text-surface-500">últimos 12 meses</span>
                                    </div>
                                    <div class="flex items-end gap-1 md:gap-1.5 h-20 md:h-28 mt-3">
                                        @for (b of barras; track $index) {
                                            <div class="flex-1 rounded-t-[4px] grow-bar" [style.height.%]="b" [style.animation-delay]="$index * 60 + 'ms'" [class]="$index === barras.length - 1 ? 'bg-primary-500' : 'bg-primary-500/25 dark:bg-primary-400/25'"></div>
                                        }
                                    </div>
                                </div>
                                <div class="lg:col-span-2 rounded-xl border p-3 hidden sm:block">
                                    <span class="text-[11px] font-medium">Últimas ordens de serviço</span>
                                    <div class="mt-2 space-y-1.5">
                                        @for (o of ordens; track o.numero) {
                                            <div class="flex items-center justify-between gap-2 text-[10px]">
                                                <span class="font-mono text-surface-500">{{ o.numero }}</span>
                                                <span class="flex-1 truncate">{{ o.cliente }}</span>
                                                <span class="px-1.5 py-0.5 rounded-md font-medium" [class]="o.cor">{{ o.status }}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        @case ('producao') {
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-[13px] md:text-sm font-semibold">Produção por setor</div>
                                    <div class="text-[10px] md:text-[11px] text-surface-500">Atualizado em tempo real</div>
                                </div>
                                <span class="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                                    <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 ping-soft"></span><span class="relative w-2 h-2 rounded-full bg-emerald-500"></span></span>
                                    ao vivo
                                </span>
                            </div>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
                                @for (col of kanban; track col.setor) {
                                    <div class="rounded-xl bg-surface-50 dark:bg-surface-950 border p-2">
                                        <div class="flex items-center justify-between px-1">
                                            <span class="text-[10px] md:text-[11px] font-medium flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full" [class]="col.cor"></span>{{ col.setor }}</span>
                                            <span class="text-[9px] text-surface-500">{{ col.cartoes.length }}</span>
                                        </div>
                                        <div class="mt-2 space-y-1.5">
                                            @for (c of col.cartoes; track c.os) {
                                                <div class="rounded-lg bg-surface-0 dark:bg-surface-900 border p-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="font-mono text-[10px] font-medium">OS {{ c.os }}</span>
                                                        <i class="pi pi-id-card text-[9px]! text-surface-400"></i>
                                                    </div>
                                                    <div class="text-[9px] text-surface-500 mt-1 truncate">{{ c.desc }}</div>
                                                    <div class="mt-1.5 h-1 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"><div class="h-full rounded-full" [class]="col.cor" [style.width.%]="c.prog"></div></div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        @case ('licencas') {
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-[13px] md:text-sm font-semibold">Licenças</div>
                                    <div class="text-[10px] md:text-[11px] text-surface-500">Sistemas e módulos por cliente</div>
                                </div>
                                <span class="text-[10px] md:text-[11px] px-2 py-1 rounded-md bg-primary-500 text-white font-medium"><i class="pi pi-key text-[9px]! mr-1"></i>Emitir licença</span>
                            </div>
                            <div class="mt-3 md:mt-4 rounded-xl border overflow-hidden">
                                <div class="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] md:text-[10px] uppercase tracking-wide text-surface-500 bg-surface-50 dark:bg-surface-950 border-b">
                                    <span class="col-span-4">Cliente</span><span class="col-span-3 hidden md:block">Módulos</span><span class="col-span-4 md:col-span-3">Usuários</span><span class="col-span-4 md:col-span-2 text-right">Status</span>
                                </div>
                                @for (l of licencas; track l.cliente) {
                                    <div class="grid grid-cols-12 gap-2 items-center px-3 py-2 text-[10px] md:text-[11px] border-b last:border-b-0">
                                        <span class="col-span-4 truncate"><span class="font-medium">{{ l.cliente }}</span><span class="block text-[9px] text-surface-500">válida até {{ l.validade }}</span></span>
                                        <span class="col-span-3 hidden md:flex flex-wrap gap-1">
                                            @for (m of l.modulos; track m) {
                                                <span class="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-[9px]">{{ m }}</span>
                                            }
                                        </span>
                                        <span class="col-span-4 md:col-span-3">
                                            <span class="text-[9px] text-surface-500">{{ l.usados }}/{{ l.limite }}</span>
                                            <span class="block mt-1 h-1 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"><span class="block h-full rounded-full bg-primary-500" [style.width.%]="(l.usados / l.limite) * 100"></span></span>
                                        </span>
                                        <span class="col-span-4 md:col-span-2 text-right"><span class="px-1.5 py-0.5 rounded-md font-medium text-[9px] md:text-[10px]" [class]="l.cor">{{ l.status }}</span></span>
                                    </div>
                                }
                            </div>
                            <div class="grid grid-cols-3 gap-2 md:gap-3 mt-2 md:mt-3">
                                @for (k of resumoLicencas; track k.rotulo) {
                                    <div class="rounded-xl border p-2 md:p-3">
                                        <div class="text-[9px] md:text-[10px] text-surface-500">{{ k.rotulo }}</div>
                                        <div class="text-sm md:text-lg font-semibold">{{ k.valor }}</div>
                                    </div>
                                }
                            </div>
                        }
                    }
                </div>
            </div>
        </div>
    `
})
export class AppMockup {
    variante = input<Variante>('erp');

    endereco = computed(() => {
        switch (this.variante()) {
            case 'producao':
                return 'app-producao.adailsilva.com.br';
            case 'licencas':
                return 'app-licencas.adailsilva.com.br';
            default:
                return 'app-erp.adailsilva.com.br';
        }
    });

    menu = computed(() => {
        switch (this.variante()) {
            case 'producao':
                return ['pi pi-objects-column', 'pi pi-id-card', 'pi pi-history', 'pi pi-users', 'pi pi-cog'];
            case 'licencas':
                return ['pi pi-key', 'pi pi-building', 'pi pi-desktop', 'pi pi-book', 'pi pi-cog'];
            default:
                return ['pi pi-home', 'pi pi-file-edit', 'pi pi-box', 'pi pi-wallet', 'pi pi-chart-bar', 'pi pi-cog'];
        }
    });

    kpis = [
        { rotulo: 'Faturamento', valor: 'R$ 184,3 mil', variacao: '+12,4% vs. mês anterior', icone: 'pi pi-wallet', positivo: true },
        { rotulo: 'OS em produção', valor: '128', variacao: '37 entram hoje', icone: 'pi pi-cog', positivo: false },
        { rotulo: 'Entregas no prazo', valor: '96,2%', variacao: '+3,1 p.p.', icone: 'pi pi-check-circle', positivo: true },
        { rotulo: 'A receber', valor: 'R$ 52,7 mil', variacao: '18 títulos abertos', icone: 'pi pi-calendar', positivo: false }
    ];

    barras = [42, 55, 48, 62, 58, 70, 66, 74, 69, 81, 77, 92];

    ordens = [
        { numero: '48213', cliente: 'Ótica Central', status: 'Montagem', cor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
        { numero: '48212', cliente: 'Visão & Cia', status: 'Surfaçagem', cor: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
        { numero: '48210', cliente: 'Ótica Bela Vista', status: 'Pronta', cor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
        { numero: '48207', cliente: 'Ótica Primavera', status: 'Tratamento', cor: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
        { numero: '48205', cliente: 'Olhar Ótica', status: 'Entregue', cor: 'bg-surface-500/15 text-surface-600 dark:text-surface-300' }
    ];

    kanban = [
        {
            setor: 'Surfaçagem',
            cor: 'bg-sky-500',
            cartoes: [
                { os: '48212', desc: 'Multifocal · 1.67', prog: 35 },
                { os: '48215', desc: 'Visão simples · 1.59', prog: 60 }
            ]
        },
        {
            setor: 'Tratamento',
            cor: 'bg-violet-500',
            cartoes: [
                { os: '48207', desc: 'Antirreflexo premium', prog: 50 },
                { os: '48209', desc: 'Fotossensível', prog: 80 }
            ]
        },
        {
            setor: 'Montagem',
            cor: 'bg-amber-500',
            cartoes: [{ os: '48213', desc: 'Armação fio de nylon', prog: 45 }]
        },
        {
            setor: 'Expedição',
            cor: 'bg-emerald-500',
            cartoes: [
                { os: '48210', desc: 'Rota Norte · 14h', prog: 100 },
                { os: '48211', desc: 'Retirada no balcão', prog: 100 }
            ]
        }
    ];

    licencas = [
        { cliente: 'Laboratório Alfa', validade: '12/2027', modulos: ['ERP', 'Fiscal', 'RH'], usados: 18, limite: 25, status: 'Ativa', cor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
        { cliente: 'Indústria Beta', validade: '03/2027', modulos: ['ERP', 'Produção'], usados: 9, limite: 10, status: 'Ativa', cor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
        { cliente: 'Comercial Gama', validade: '11/2026', modulos: ['ERP'], usados: 4, limite: 5, status: 'Renovar', cor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
        { cliente: 'Serviços Delta', validade: '08/2027', modulos: ['ERP', 'Portal'], usados: 6, limite: 15, status: 'Ativa', cor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' }
    ];

    resumoLicencas = [
        { rotulo: 'Licenças ativas', valor: '3' },
        { rotulo: 'Usuários conectados', valor: '27' },
        { rotulo: 'Vencem em 60 dias', valor: '1' }
    ];
}
