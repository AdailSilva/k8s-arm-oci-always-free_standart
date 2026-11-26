import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { AnimatedBorder } from '@/app/shared/animated-border';
import { RevealDirective } from '@/app/shared/reveal.directive';
import { CONTATOS, SEGMENTOS } from '@/app/core/site.config';
import { canais, linkEmail, linkWhatsapp } from '@/app/core/contato.util';
import { contatoValido, mascararContato } from '@/app/core/validacao.util';

interface Formulario {
    nome: string;
    empresa: string;
    contato: string;
    segmento: string | null;
    mensagem: string;
}

@Component({
    selector: 'home-contact',
    standalone: true,
    imports: [FormsModule, InputTextModule, TextareaModule, SelectModule, AnimatedBorder, RevealDirective],
    template: `
        <section id="contato" class="relative pt-24 md:pt-36 pb-8">
            <div class="landing-container">
                <div reveal class="relative">
                    <animated-border [count]="5" />
                    <div class="relative overflow-hidden rounded-3xl bg-surface-0 dark:bg-surface-950 shadow-stroke">
                        <div class="grid lg:grid-cols-5">
                            <!-- lado informativo -->
                            <div class="lg:col-span-2 relative p-8 md:p-12 bg-surface-950 text-surface-0 overflow-hidden">
                                <div class="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_0%_0%,var(--p-primary-600),transparent_50%),radial-gradient(circle_at_100%_100%,#7c3aed,transparent_45%)]"></div>
                                <div class="relative">
                                    <h2 class="text-3xl md:text-5xl font-medium leading-[120%]">Vamos tirar sua ideia do papel?</h2>
                                    <p class="mt-5 text-surface-300 leading-7">Conte um pouco sobre a sua empresa e o que precisa resolver. Respondo pessoalmente, com uma proposta clara de escopo, prazo e investimento.</p>
                                    <ul class="mt-8 space-y-3">
                                        @for (c of canais; track c.id) {
                                            <li>
                                                <a [href]="c.href" target="_blank" rel="noopener" class="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-3">
                                                    <span class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><i [class]="c.icone"></i></span>
                                                    <span class="flex-1 min-w-0 leading-tight">
                                                        <span class="block text-xs text-surface-400">{{ c.rotulo }}</span>
                                                        <span class="block font-medium truncate">{{ c.valor }}</span>
                                                    </span>
                                                    <i class="pi pi-arrow-up-right text-sm! text-surface-400 group-hover:text-white transition-colors"></i>
                                                </a>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </div>

                            <!-- formulário -->
                            <form #f="ngForm" (ngSubmit)="enviar(f, 'whatsapp')" class="lg:col-span-3 p-8 md:p-12 space-y-5" novalidate>
                                <div class="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label for="nome" class="block text-sm font-medium mb-2">Seu nome *</label>
                                        <input pInputText id="nome" name="nome" [(ngModel)]="form.nome" required minlength="2" placeholder="Ex.: Maria Oliveira" class="w-full" [invalid]="tentou() && !form.nome.trim()" />
                                    </div>
                                    <div>
                                        <label for="empresa" class="block text-sm font-medium mb-2">Empresa</label>
                                        <input pInputText id="empresa" name="empresa" [(ngModel)]="form.empresa" placeholder="Ex.: Comercial Silva Ltda." class="w-full" />
                                    </div>
                                </div>
                                <div class="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label for="contato" class="block text-sm font-medium mb-2">WhatsApp ou e-mail *</label>
                                        <input
                                            pInputText
                                            id="contato"
                                            name="contato"
                                            [(ngModel)]="form.contato"
                                            (input)="aoDigitarContato($any($event.target))"
                                            required
                                            maxlength="160"
                                            autocomplete="on"
                                            placeholder="Ex.: (89) 99999-9999"
                                            class="w-full"
                                            [invalid]="(tentou() && !form.contato.trim()) || contatoInvalido()"
                                        />
                                        @if (contatoInvalido()) {
                                            <small class="block mt-1 text-red-500">Informe um WhatsApp com DDD ou um e-mail válido.</small>
                                        }
                                    </div>
                                    <div>
                                        <label for="segmento" class="block text-sm font-medium mb-2">Segmento</label>
                                        <p-select inputId="segmento" name="segmento" [(ngModel)]="form.segmento" [options]="segmentos" placeholder="Ramo da empresa" [showClear]="true" class="w-full" appendTo="body" />
                                    </div>
                                </div>
                                <div>
                                    <label for="mensagem" class="block text-sm font-medium mb-2">O que você precisa? *</label>
                                    <textarea
                                        pTextarea
                                        id="mensagem"
                                        name="mensagem"
                                        [(ngModel)]="form.mensagem"
                                        required
                                        rows="5"
                                        [autoResize]="true"
                                        placeholder="Ex.: Preciso controlar pedidos, estoque e financeiro num só lugar; hoje usamos planilhas e um sistema antigo."
                                        class="w-full"
                                        [invalid]="tentou() && !form.mensagem.trim()"
                                    ></textarea>
                                </div>

                                @if (tentou() && incompleto()) {
                                    <p class="text-sm text-red-500 flex items-center gap-2"><i class="pi pi-exclamation-circle text-sm!"></i>Preencha nome, contato e mensagem para continuar.</p>
                                }

                                <div class="flex flex-col sm:flex-row gap-3 pt-1">
                                    @if (temWhatsapp) {
                                        <button type="submit" class="landing-button-primary rounded-xl! py-3! inline-flex items-center justify-center gap-2 flex-1">
                                            <i class="pi pi-whatsapp"></i> Enviar pelo WhatsApp
                                        </button>
                                    }
                                    @if (temEmail) {
                                        <button type="button" (click)="enviar(f, 'email')" class="landing-button-secondary rounded-xl! py-3! inline-flex items-center justify-center gap-2 flex-1">
                                            <i class="pi pi-envelope"></i> Enviar por e-mail
                                        </button>
                                    }
                                </div>
                                <p class="text-xs text-surface-500 leading-5">
                                    <i class="pi pi-lock text-xs! mr-1"></i>Seus dados não são gravados por este site: a mensagem é aberta direto no seu WhatsApp{{ temEmail ? ' ou e-mail' : '' }} para você revisar e enviar.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class HomeContact {
    readonly canais = canais();
    readonly segmentos = SEGMENTOS;
    readonly temWhatsapp = !!CONTATOS.whatsapp;
    readonly temEmail = !!CONTATOS.email;

    readonly tentou = signal(false);

    form: Formulario = { nome: '', empresa: '', contato: '', segmento: null, mensagem: '' };

    incompleto(): boolean {
        return !this.form.nome.trim() || !this.form.contato.trim() || !this.form.mensagem.trim();
    }

    /** Telefone recebe a máscara enquanto digita; e-mail fica como digitado. */
    aoDigitarContato(el: HTMLInputElement): void {
        const mascarado = mascararContato(el.value ?? '');
        if (mascarado !== el.value) el.value = mascarado;
        this.form.contato = mascarado;
    }

    /** Só acusa erro quando há algo digitado (o obrigatório é tratado à parte). */
    contatoInvalido(): boolean {
        const v = this.form.contato.trim();
        return !!v && this.tentou() && !contatoValido(v);
    }

    enviar(_f: NgForm, canal: 'whatsapp' | 'email'): void {
        this.tentou.set(true);
        if (this.incompleto() || !contatoValido(this.form.contato.trim())) {
            return;
        }

        const linhas = [
            `Olá, Adail! Vim pelo seu site.`,
            ``,
            `*Nome:* ${this.form.nome.trim()}`,
            this.form.empresa.trim() ? `*Empresa:* ${this.form.empresa.trim()}` : '',
            `*Contato:* ${this.form.contato.trim()}`,
            this.form.segmento ? `*Segmento:* ${this.form.segmento}` : '',
            ``,
            `*O que preciso:*`,
            this.form.mensagem.trim()
        ].filter((l, i, arr) => l !== '' || (arr[i - 1] ?? '') !== '');

        const texto = linhas.join('\n');
        const url = canal === 'whatsapp' ? linkWhatsapp(texto) : linkEmail(`Orçamento de sistema — ${this.form.empresa.trim() || this.form.nome.trim()}`, texto.replace(/\*/g, ''));
        window.open(url, '_blank', 'noopener');
    }
}
