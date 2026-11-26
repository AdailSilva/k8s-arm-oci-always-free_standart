import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { TelaGatewayId } from '@/app/core/iot.config';

interface LinhaLog {
    t: string;
    texto: string;
    tipo: 'info' | 'rx' | 'warn' | 'err' | 'mqtt';
}

/**
 * Ilustração da interface web do Gateway ESP32_SX1302 (HTML/CSS, sem imagens),
 * reproduzindo o visual do painel embarcado no firmware: cabeçalho verde,
 * menu lateral com marcação da seção ativa, tema claro/escuro.
 * Os números são ilustrativos e "andam" sozinhos para dar vida à demonstração.
 */
@Component({
    selector: 'gateway-mockup',
    standalone: true,
    template: `
        @if (tela() === 'celular') {
            <!-- ===================== CELULAR ===================== -->
            <div class="py-6 md:py-10 flex justify-center select-none" aria-hidden="true">
                <div class="relative w-[270px] rounded-[2.6rem] border-[10px] border-surface-900 dark:border-surface-700 bg-surface-900 shadow-[0_40px_60px_-20px_rgba(15,23,42,0.45)]">
                    <div class="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-surface-900 dark:bg-surface-700 z-10"></div>
                    <div class="rounded-[1.9rem] overflow-hidden bg-[#eef2f0] dark:bg-[#0d1412] text-[#14211d] dark:text-[#e3ece8] h-[520px] flex flex-col">
                        <div class="pt-8 pb-3 px-4 bg-[#0b7a5f] dark:bg-[#123b30] text-white">
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center"><i class="pi pi-wifi text-[10px]!"></i></span>
                                <span class="text-[12px] font-semibold leading-tight">Gateway ESP32 with SX1302</span>
                            </div>
                            <div class="mt-2 flex gap-1.5">
                                <span class="text-[9px] rounded-full bg-white/15 px-2 py-0.5 inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#7ef0c4]"></span>MQTT conectado</span>
                                <span class="text-[9px] rounded-full bg-white/15 px-2 py-0.5">Logs</span>
                            </div>
                        </div>
                        <div class="flex gap-1.5 px-3 py-2 overflow-hidden border-b border-black/5 dark:border-white/10">
                            @for (m of menuCurto; track m; let i = $index) {
                                <span class="shrink-0 text-[9px] rounded-full px-2.5 py-1" [class]="i === 0 ? 'bg-[#0b7a5f] dark:bg-[#3dbb92] text-white dark:text-[#0d1412] font-semibold' : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10'">{{ m }}</span>
                            }
                        </div>
                        <div class="p-3 flex-1 overflow-hidden">
                            <div class="rounded-xl bg-white dark:bg-[#15201c] border border-black/5 dark:border-white/10 p-3">
                                <div class="text-[11px] font-semibold">Status</div>
                                <div class="mt-2 rounded-md border-l-[3px] border-[#0b7a5f] dark:border-[#3dbb92] bg-[#0b7a5f]/8 dark:bg-[#3dbb92]/10 px-2 py-1.5 text-[9px]">Encaminhando pacotes · MQTT conectado</div>
                                <div class="mt-2 grid grid-cols-2 gap-1.5">
                                    @for (k of kpisStatus().slice(0, 6); track k.rotulo) {
                                        <div class="rounded-lg border border-black/5 dark:border-white/10 bg-[#f6f9f8] dark:bg-white/[0.03] p-2 min-w-0">
                                            <div class="text-[8px] opacity-60 truncate">{{ k.rotulo }}</div>
                                            <div class="text-[13px] font-semibold font-mono tabular-nums truncate">{{ k.valor }}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } @else {
            <!-- ===================== NAVEGADOR ===================== -->
            <div class="rounded-2xl overflow-hidden border bg-surface-0 dark:bg-surface-900 text-left select-none shadow-[0px_46px_28px_0px_rgba(44,54,87,0.05),0px_20px_20px_0px_rgba(44,54,87,0.09),0px_5px_12px_0px_rgba(44,54,87,0.10)]" aria-hidden="true">
                <div class="flex items-center gap-3 px-4 py-2.5 border-b bg-surface-50 dark:bg-surface-950">
                    <div class="flex gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <div class="flex-1 flex justify-center">
                        <span class="inline-flex items-center gap-1.5 text-[11px] text-surface-500 bg-surface-0 dark:bg-surface-900 border rounded-md px-3 py-0.5 max-w-full truncate font-mono">
                            <i class="pi pi-globe text-[9px]!"></i>192.168.0.50{{ tela() === 'logs' ? '/logs' : '/#' + tela() }}
                        </span>
                    </div>
                    <span class="w-10"></span>
                </div>

                <div class="bg-[#eef2f0] dark:bg-[#0d1412] text-[#14211d] dark:text-[#e3ece8]">
                    <!-- cabeçalho do painel do gateway -->
                    <div class="flex items-center justify-between gap-3 px-3 md:px-5 py-2.5 bg-[#0b7a5f] dark:bg-[#123b30] text-white">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 13v8M9 21h6" /><circle cx="12" cy="11" r="2" /><path d="M8.5 7.5a5 5 0 0 0 0 7M15.5 7.5a5 5 0 0 1 0 7M5.6 4.6a9 9 0 0 0 0 12.8M18.4 4.6a9 9 0 0 1 0 12.8" /></svg>
                            </span>
                            <span class="min-w-0">
                                <span class="block text-[12px] md:text-[13px] font-semibold truncate">Gateway ESP32 with SX1302</span>
                                <span class="block text-[9px] md:text-[10px] text-white/70 truncate">{{ tela() === 'logs' ? 'Logs do gateway' : 'Configuração · v0.9.2' }}</span>
                            </span>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <span class="hidden sm:inline-flex text-[9px] md:text-[10px] rounded-full bg-white/15 px-2 py-0.5 items-center gap-1.5">
                                <span class="relative flex w-1.5 h-1.5"><span class="absolute inset-0 rounded-full bg-[#7ef0c4] ping-soft"></span><span class="relative w-1.5 h-1.5 rounded-full bg-[#7ef0c4]"></span></span>
                                MQTT conectado
                            </span>
                            <span class="text-[9px] md:text-[10px] rounded-full px-2 py-0.5" [class]="tela() === 'logs' ? 'bg-white text-[#0b7a5f] font-semibold' : 'bg-white/15'">{{ tela() === 'logs' ? 'Configuração' : 'Logs' }}</span>
                            <span class="text-[9px] md:text-[10px] rounded-full bg-white/15 px-2 py-0.5">Sair</span>
                        </div>
                    </div>

                    @if (tela() === 'logs') {
                        <!-- ===================== LOGS ===================== -->
                        <div class="p-3 md:p-4">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="flex-1 min-w-[120px] inline-flex items-center gap-1.5 text-[10px] rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#15201c] px-2 py-1 opacity-80"><i class="pi pi-filter text-[9px]!"></i>Filtrar (ex.: rxpk, mqtt, ERROR)</span>
                                @for (b of ['Pausar', 'Limpar tela', 'Baixar']; track b) {
                                    <span class="text-[10px] rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#15201c] px-2 py-1">{{ b }}</span>
                                }
                                <span class="text-[10px] inline-flex items-center gap-1 text-[#0b7a5f] dark:text-[#3dbb92]"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>ao vivo</span>
                            </div>
                            <div class="mt-2.5 rounded-lg bg-[#0a0f0d] text-[#c9d6d1] font-mono text-[9px] md:text-[10.5px] leading-[1.6] p-3 h-[248px] md:h-[300px] overflow-hidden flex flex-col justify-end">
                                @for (l of logs(); track l.t + l.texto) {
                                    <div class="whitespace-nowrap overflow-hidden text-ellipsis" [class]="corLog(l.tipo)">
                                        <span class="opacity-50">{{ l.t }}</span> {{ l.texto }}
                                    </div>
                                }
                            </div>
                            <div class="mt-2 flex justify-between text-[9px] opacity-60"><span>Buffer circular de 16 KB na RAM</span><span>atualiza a cada 1,5 s</span></div>
                        </div>
                    } @else {
                        <div class="flex">
                            <!-- menu lateral com a marca verde do item ativo -->
                            <div class="hidden sm:block w-[150px] md:w-[168px] shrink-0 py-3 pl-2 pr-1.5 border-r border-black/5 dark:border-white/10">
                                @for (m of menu; track m.id) {
                                    <div class="relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[10.5px] md:text-[11px]" [class]="m.id === secaoMenu() ? 'bg-white dark:bg-white/5 font-semibold text-[#0b7a5f] dark:text-[#3dbb92]' : 'opacity-70'">
                                        @if (m.id === secaoMenu()) {
                                            <span class="absolute -left-2 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#0b7a5f] dark:bg-[#3dbb92]"></span>
                                        }
                                        <i [class]="m.icone" class="text-[10px]!"></i>{{ m.rotulo }}
                                    </div>
                                }
                            </div>

                            <div class="flex-1 min-w-0 p-3 md:p-4 @container">
                                <div class="rounded-xl bg-white dark:bg-[#15201c] border border-black/5 dark:border-white/10 p-3 md:p-4 min-h-[250px] md:min-h-[270px]">
                                    @switch (tela()) {
                                        @case ('status') {
                                            <div class="text-[12px] md:text-[13px] font-semibold">Status</div>
                                            <div class="text-[9px] md:text-[10px] opacity-60">Funcionamento do gateway desde que ligou. Atualiza a cada 5 s enquanto esta aba estiver visível.</div>
                                            <div class="mt-2.5 rounded-md border-l-[3px] border-[#0b7a5f] dark:border-[#3dbb92] bg-[#0b7a5f]/[0.07] dark:bg-[#3dbb92]/10 px-2.5 py-1.5 text-[10px]">
                                                Encaminhando pacotes · MQTT conectado · ChirpStack v4 Protobuf
                                            </div>
                                            <div class="mt-2.5 grid grid-cols-2 @lg:grid-cols-4 gap-1.5 md:gap-2">
                                                @for (k of kpisStatus(); track k.rotulo) {
                                                    <div class="rounded-lg border border-black/5 dark:border-white/10 bg-[#f6f9f8] dark:bg-white/[0.03] px-2.5 py-2 min-w-0">
                                                        <div class="text-[9px] opacity-60 truncate">{{ k.rotulo }}</div>
                                                        <div class="text-[13px] md:text-[15px] font-semibold font-mono tabular-nums truncate">{{ k.valor }}</div>
                                                        <div class="text-[8.5px] opacity-60 truncate">{{ k.detalhe }}</div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        @case ('wifi') {
                                            <div class="text-[12px] md:text-[13px] font-semibold">Rede Wi-Fi</div>
                                            <div class="text-[9px] md:text-[10px] opacity-60">Rede à qual o gateway se conecta para chegar ao servidor.</div>
                                            <div class="mt-3 grid sm:grid-cols-2 gap-2">
                                                <div>
                                                    <div class="text-[9px] opacity-60 mb-1">Nome da rede (SSID)</div>
                                                    <div [class]="campo">Fazenda-Escritorio</div>
                                                </div>
                                                <div>
                                                    <div class="text-[9px] opacity-60 mb-1">Senha</div>
                                                    <div [class]="campo + ' flex justify-between'"><span class="opacity-50">Senha salva (vazio = manter)</span><span class="text-[#0b7a5f] dark:text-[#3dbb92] font-medium">Mostrar</span></div>
                                                </div>
                                            </div>
                                            <div class="mt-3 text-[9px] opacity-60 mb-1">Endereço IP</div>
                                            <div class="grid grid-cols-2 gap-2">
                                                <div [class]="opcao(false)"><span [class]="radio(false)"></span>Automático (DHCP)</div>
                                                <div [class]="opcao(true)"><span [class]="radio(true)"></span>IP fixo</div>
                                            </div>
                                            <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                                @for (c of camposIp; track c.r) {
                                                    <div>
                                                        <div class="text-[9px] opacity-60 mb-1">{{ c.r }}</div>
                                                        <div [class]="campo + ' font-mono'">{{ c.v }}</div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        @case ('servidor') {
                                            <div class="text-[12px] md:text-[13px] font-semibold">Servidor LoRaWAN</div>
                                            <div class="text-[9px] md:text-[10px] opacity-60">Destino dos pacotes e identidade do gateway.</div>
                                            <div class="mt-2.5 rounded-md border-l-[3px] border-amber-500 bg-amber-500/10 px-2.5 py-1.5 text-[10px]">MQTT ativo: o forwarder UDP fica desligado.</div>
                                            <div class="mt-3 grid sm:grid-cols-2 gap-2">
                                                @for (c of camposServidor; track c.r) {
                                                    <div [class.sm:col-span-2]="c.largo">
                                                        <div class="text-[9px] opacity-60 mb-1">{{ c.r }}</div>
                                                        <div [class]="campo + (c.mono ? ' font-mono' : '')">{{ c.v }}</div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        @case ('mqtt') {
                                            <div class="flex items-center justify-between gap-2">
                                                <div class="text-[12px] md:text-[13px] font-semibold">MQTT seguro (TLS)</div>
                                                <span class="text-[9px] rounded-full bg-[#0b7a5f]/10 dark:bg-[#3dbb92]/15 text-[#0b7a5f] dark:text-[#3dbb92] px-2 py-0.5 font-medium">Conectado · {{ msgs() }} mensagens</span>
                                            </div>
                                            <div class="mt-2.5 grid sm:grid-cols-3 gap-2">
                                                <div class="sm:col-span-2">
                                                    <div class="text-[9px] opacity-60 mb-1">Broker</div>
                                                    <div [class]="campo + ' font-mono'">mqtts://mqtt.seudominio.com.br</div>
                                                </div>
                                                <div>
                                                    <div class="text-[9px] opacity-60 mb-1">Porta</div>
                                                    <div [class]="campo + ' font-mono'">8883</div>
                                                </div>
                                            </div>
                                            <div class="mt-2.5 grid grid-cols-2 gap-2">
                                                <div>
                                                    <div class="text-[9px] opacity-60 mb-1">Formato</div>
                                                    <div class="grid gap-1.5">
                                                        <div [class]="opcao(true)"><span [class]="radio(true)"></span>ChirpStack v4</div>
                                                        <div [class]="opcao(false)"><span [class]="radio(false)"></span>Espelho Semtech</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="text-[9px] opacity-60 mb-1">Codificação (ChirpStack)</div>
                                                    <div class="grid gap-1.5">
                                                        <div [class]="opcao(false)"><span [class]="radio(false)"></span>JSON</div>
                                                        <div [class]="opcao(true)"><span [class]="radio(true)"></span>Protobuf</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mt-2.5 text-[9px] opacity-60 mb-1">Certificados</div>
                                            <div class="grid sm:grid-cols-3 gap-1.5">
                                                @for (c of certificados; track c) {
                                                    <div class="flex items-center gap-1.5 rounded-md border border-black/5 dark:border-white/10 px-2 py-1.5 text-[10px]"><i class="pi pi-verified text-[10px]! text-[#0b7a5f] dark:text-[#3dbb92]"></i>{{ c }}</div>
                                                }
                                            </div>
                                        }
                                        @case ('plano') {
                                            <div class="text-[12px] md:text-[13px] font-semibold">Plano de frequência</div>
                                            <div class="text-[9px] md:text-[10px] opacity-60">Canais que o concentrador escuta. O padrão é a sub-banda 1 do AU915.</div>
                                            <div class="mt-3 grid sm:grid-cols-2 gap-2">
                                                @for (p of planos; track p.nome) {
                                                    <div class="rounded-lg border p-2.5" [class]="p.ativo ? 'border-[#0b7a5f] dark:border-[#3dbb92] bg-[#0b7a5f]/[0.06] dark:bg-[#3dbb92]/10' : 'border-black/10 dark:border-white/10'">
                                                        <div class="flex items-center justify-between">
                                                            <span class="text-[11px] font-semibold">{{ p.nome }}</span>
                                                            <span [class]="radio(p.ativo)"></span>
                                                        </div>
                                                        <div class="mt-1 font-mono text-[10px]">{{ p.faixa }}</div>
                                                        <div class="text-[9px] opacity-60">{{ p.canais }}</div>
                                                        <div class="mt-2 flex gap-[3px] h-5 items-end">
                                                            @for (b of [1, 2, 3, 4, 5, 6, 7, 8]; track b) {
                                                                <span class="flex-1 rounded-sm" [class]="p.ativo ? 'bg-[#0b7a5f] dark:bg-[#3dbb92]' : 'bg-black/15 dark:bg-white/15'" [style.height.%]="40 + ((b * 37) % 60)"></span>
                                                            }
                                                            <span class="w-2 rounded-sm bg-amber-500/80 h-full"></span>
                                                        </div>
                                                        <div class="mt-1.5 text-[9px] text-[#0b7a5f] dark:text-[#3dbb92] font-medium">ver JSON</div>
                                                    </div>
                                                }
                                            </div>
                                            <div class="mt-2 rounded-md border border-dashed border-black/15 dark:border-white/15 px-2.5 py-1.5 text-[10px] opacity-70 flex justify-between"><span>Outros planos: EU868 · US915 · CN470</span><i class="pi pi-chevron-down text-[9px]!"></i></div>
                                        }
                                        @case ('radios') {
                                            <div class="text-[12px] md:text-[13px] font-semibold">Rádios (avançado)</div>
                                            <div class="text-[9px] md:text-[10px] opacity-60">Campos vazios usam o padrão do plano escolhido (em cinza).</div>
                                            <div class="mt-3 grid sm:grid-cols-2 gap-2">
                                                @for (r of radiosCfg; track r.nome) {
                                                    <div class="rounded-lg border border-black/10 dark:border-white/10 p-2.5">
                                                        <div class="flex items-center justify-between">
                                                            <span class="text-[11px] font-semibold">{{ r.nome }}</span>
                                                            <span class="text-[9px] rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 font-mono">SX1250</span>
                                                        </div>
                                                        <div class="mt-2 text-[9px] opacity-60 mb-1">Frequência central (Hz)</div>
                                                        <div [class]="campo + ' font-mono'"><span class="opacity-45">{{ r.freq }}</span></div>
                                                        <div class="mt-2 flex items-center justify-between text-[10px]">
                                                            <span>Transmissão</span>
                                                            <span class="w-7 h-4 rounded-full relative" [class]="r.tx ? 'bg-[#0b7a5f] dark:bg-[#3dbb92]' : 'bg-black/20 dark:bg-white/20'">
                                                                <span class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" [class]="r.tx ? 'right-0.5' : 'left-0.5'"></span>
                                                            </span>
                                                        </div>
                                                        <div class="mt-2 flex flex-wrap gap-1">
                                                            @for (c of r.canais; track c) {
                                                                <span class="text-[8.5px] font-mono rounded bg-[#0b7a5f]/10 dark:bg-[#3dbb92]/15 text-[#0b7a5f] dark:text-[#3dbb92] px-1 py-0.5">{{ c }}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    }
                                </div>
                                <div class="mt-2.5 flex items-center justify-between gap-2">
                                    <span class="text-[9px] md:text-[10px] opacity-60 truncate">{{ tela() === 'status' ? 'Contadores zeram ao reiniciar' : 'As alterações valem após reiniciar' }}</span>
                                    <span class="flex gap-1.5 shrink-0">
                                        <span class="text-[9.5px] md:text-[10.5px] rounded-md bg-[#0b7a5f] dark:bg-[#3dbb92] text-white dark:text-[#0d1412] font-semibold px-2.5 py-1">Salvar</span>
                                        <span class="text-[9.5px] md:text-[10.5px] rounded-md border border-black/10 dark:border-white/15 px-2.5 py-1">Reiniciar gateway</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                    <div class="px-4 py-1.5 text-center text-[8.5px] md:text-[9px] opacity-50 border-t border-black/5 dark:border-white/10">ESP32_SX1302 · baseado no ESXP1302 / SX1302_HAL (Semtech) · AdailSilva</div>
                </div>
            </div>
        }
    `
})
export class GatewayMockup {
    tela = input<TelaGatewayId>('status');

    readonly menu = [
        { id: 'status', rotulo: 'Status', icone: 'pi pi-chart-line' },
        { id: 'wifi', rotulo: 'Rede Wi-Fi', icone: 'pi pi-wifi' },
        { id: 'servidor', rotulo: 'Servidor LoRaWAN', icone: 'pi pi-server' },
        { id: 'mqtt', rotulo: 'MQTT seguro', icone: 'pi pi-lock' },
        { id: 'plano', rotulo: 'Plano de frequência', icone: 'pi pi-sliders-h' },
        { id: 'radios', rotulo: 'Rádios', icone: 'pi pi-wave-pulse' },
        { id: 'boot', rotulo: 'Modo ao reiniciar', icone: 'pi pi-refresh' },
        { id: 'acesso', rotulo: 'Acesso', icone: 'pi pi-user' }
    ];
    readonly menuCurto = ['Status', 'Wi-Fi', 'Servidor', 'MQTT', 'Plano'];

    readonly secaoMenu = computed(() => this.tela());

    readonly campo = 'rounded-md border border-black/10 dark:border-white/10 bg-[#f6f9f8] dark:bg-white/[0.03] px-2 py-1.5 text-[10px] md:text-[10.5px] truncate';

    opcao(ativo: boolean): string {
        return (
            'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[10px] md:text-[10.5px] ' +
            (ativo ? 'border-[#0b7a5f] dark:border-[#3dbb92] bg-[#0b7a5f]/[0.06] dark:bg-[#3dbb92]/10 font-medium' : 'border-black/10 dark:border-white/10')
        );
    }

    radio(ativo: boolean): string {
        return 'shrink-0 w-2.5 h-2.5 rounded-full border-2 ' + (ativo ? 'border-[#0b7a5f] dark:border-[#3dbb92] bg-[#0b7a5f] dark:bg-[#3dbb92] ring-2 ring-white dark:ring-[#15201c] ring-inset' : 'border-black/25 dark:border-white/25');
    }

    readonly camposIp = [
        { r: 'IP', v: '192.168.0.50' },
        { r: 'Máscara', v: '255.255.255.0' },
        { r: 'Gateway', v: '192.168.0.1' },
        { r: 'DNS primário', v: '1.1.1.1' },
        { r: 'DNS secundário', v: '8.8.8.8' }
    ];

    readonly camposServidor = [
        { r: 'Servidor (host)', v: 'chirpstack-v4.adailsilva.com.br', mono: true, largo: true },
        { r: 'Porta de subida (up)', v: '1700', mono: true, largo: false },
        { r: 'Porta de descida (down)', v: '1700', mono: true, largo: false },
        { r: 'Gateway ID (EUI-64)', v: 'B827EBFFFE6A1C40', mono: true, largo: false },
        { r: 'Servidor NTP', v: 'a.ntp.br', mono: true, largo: false }
    ];

    readonly certificados = ['CA do broker instalada', 'Certificado do cliente', 'Chave privada'];

    readonly planos = [
        { nome: 'AU915 · sub-banda 1', faixa: '916,8 – 918,2 MHz', canais: 'canais 8–15 + 65 (500 kHz)', ativo: true },
        { nome: 'AU915 · sub-banda 0', faixa: '915,2 – 916,6 MHz', canais: 'canais 0–7 + 64 (500 kHz)', ativo: false }
    ];

    readonly radiosCfg = [
        { nome: 'Rádio A (0)', freq: '917200000', tx: true, canais: ['916,8', '917,0', '917,2', '917,4', '917,5'] },
        { nome: 'Rádio B (1)', freq: '917900000', tx: false, canais: ['917,6', '917,8', '918,0', '918,2'] }
    ];

    /* ---------- dados "vivos" da demonstração ---------- */
    private readonly segundos = signal(3 * 86400 + 7 * 3600 + 42 * 60);
    private readonly rx = signal(18432);
    private readonly tx = signal(1207);
    readonly msgs = signal(19864);
    readonly logs = signal<LinhaLog[]>([]);

    readonly kpisStatus = computed(() => {
        const s = this.segundos();
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const rx = this.rx();
        return [
            { rotulo: 'Ligado há', valor: `${d}d ${h}h ${String(m).padStart(2, '0')}m`, detalhe: 'desde o último boot' },
            { rotulo: 'Memória livre', valor: '61,4 KB', detalhe: 'mínima: 48,9 KB' },
            { rotulo: 'Sinal Wi-Fi', valor: '-58 dBm', detalhe: 'bom' },
            { rotulo: 'Temperatura', valor: '38,5 °C', detalhe: 'concentrador' },
            { rotulo: 'Pacotes recebidos', valor: rx.toLocaleString('pt-BR'), detalhe: `CRC ok ${(rx - 312).toLocaleString('pt-BR')} · erro 312` },
            { rotulo: 'Encaminhados', valor: (rx - 312).toLocaleString('pt-BR'), detalhe: '100% via MQTT' },
            { rotulo: 'Downlinks enviados', valor: this.tx().toLocaleString('pt-BR'), detalhe: 'falhas 0 · rejeitados 2' },
            { rotulo: 'Último ACK', valor: `há ${1 + (s % 4)} s`, detalhe: 'broker MQTT' }
        ];
    });

    private readonly modelosLog: Omit<LinhaLog, 't'>[] = [
        { tipo: 'rx', texto: 'INFO: [up] rxpk 917.200 MHz SF7BW125 RSSI -97 dBm SNR 8.5 · 23 bytes' },
        { tipo: 'mqtt', texto: 'I gw_mqtt: published au915_1/gateway/b827ebfffe6a1c40/event/up (protobuf, 96 B)' },
        { tipo: 'info', texto: 'INFO: [jit] queue empty' },
        { tipo: 'rx', texto: 'INFO: [up] rxpk 916.800 MHz SF9BW125 RSSI -112 dBm SNR -3.2 · 18 bytes' },
        { tipo: 'mqtt', texto: 'I gw_mqtt: command/down received · scheduling RX1 at +1.000 s' },
        { tipo: 'info', texto: 'INFO: [down] TX 923.300 MHz SF9 14 dBm · ACK ok' },
        { tipo: 'warn', texto: 'W wifi: RSSI -71 dBm, link degradado' },
        { tipo: 'rx', texto: 'INFO: [up] rxpk 917.500 MHz SF8BW500 RSSI -89 dBm SNR 10.0 · 12 bytes' },
        { tipo: 'mqtt', texto: 'I gw_mqtt: published event/stats · rx 14 ok 13 bad 1 tx 2' },
        { tipo: 'err', texto: 'E (crc) pacote descartado: CRC inválido em 917.000 MHz' },
        { tipo: 'info', texto: 'INFO: [heap] free 62 840 B · min 50 112 B · largest 31 744 B' }
    ];

    constructor() {
        let n = 0;
        const base = new Date(2026, 9, 16, 14, 32, 0).getTime();
        const hora = (i: number) => new Date(base + i * 1700).toTimeString().slice(0, 8);
        const inicial: LinhaLog[] = [];
        for (; n < 14; n++) inicial.push({ ...this.modelosLog[n % this.modelosLog.length], t: hora(n) });
        this.logs.set(inicial);

        const reduzir = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduzir || typeof window === 'undefined') return;

        const id = window.setInterval(() => {
            if (document.hidden) return;
            this.segundos.update((v) => v + 2);
            this.rx.update((v) => v + 1 + Math.floor(Math.random() * 3));
            if (Math.random() < 0.3) this.tx.update((v) => v + 1);
            this.msgs.update((v) => v + 2);
            if (this.tela() === 'logs') {
                const linha = { ...this.modelosLog[n % this.modelosLog.length], t: hora(n) };
                n++;
                this.logs.update((l) => [...l.slice(-17), linha]);
            }
        }, 1800);
        inject(DestroyRef).onDestroy(() => window.clearInterval(id));
    }

    corLog(tipo: LinhaLog['tipo']): string {
        switch (tipo) {
            case 'rx':
                return 'text-[#5fe0a8]';
            case 'warn':
                return 'text-[#f5c451]';
            case 'err':
                return 'text-[#ff7a7a]';
            case 'mqtt':
                return 'text-[#8fc7ff]';
            default:
                return '';
        }
    }
}
