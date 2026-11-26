import { Component, input } from '@angular/core';

let seq = 0;

/** Marca própria: monograma "A" estilizado sobre bloco com gradiente da cor primária. */
@Component({
    selector: 'site-logo',
    standalone: true,
    template: `
        <span class="inline-flex items-center gap-2.5">
            <svg [attr.width]="tamanho()" [attr.height]="tamanho()" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                    <linearGradient [attr.id]="gradId" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="var(--p-primary-400)" />
                        <stop offset="1" stop-color="var(--p-primary-700)" />
                    </linearGradient>
                </defs>
                <rect width="40" height="40" rx="12" [attr.fill]="'url(#' + gradId + ')'" />
                <path d="M11 29L20 10L29 29" stroke="white" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.2 22.5H24.8" stroke="white" stroke-opacity="0.65" stroke-width="3" stroke-linecap="round" />
                <circle cx="29" cy="29" r="2.6" fill="white" />
            </svg>
            @if (comTexto()) {
                <span class="leading-none">
                    <span class="block font-semibold tracking-tight text-surface-950 dark:text-surface-0">Adail Silva</span>
                    <span class="block text-[11px] text-surface-500 mt-0.5 tracking-wide">Sistemas Web</span>
                </span>
            }
        </span>
    `
})
export class SiteLogo {
    /** id único por instância: com ids repetidos, o gradiente some quando a 1ª instância está oculta (display:none). */
    readonly gradId = `logo-grad-${++seq}`;
    tamanho = input<number>(34);
    comTexto = input<boolean>(false);
}
