import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface ItemNav {
    rotulo: string;
    /** Âncora da home (ex.: 'solucoes') ou rota absoluta (ex.: '/infraestrutura'). */
    destino: string;
}

export const ITENS_NAV: ItemNav[] = [
    { rotulo: 'Soluções', destino: 'solucoes' },
    { rotulo: 'Projetos', destino: 'projetos' },
    { rotulo: 'Como trabalho', destino: 'processo' },
    { rotulo: 'Tecnologia', destino: 'tecnologia' },
    { rotulo: 'IoT', destino: '/iot' },
    { rotulo: 'Infraestrutura', destino: '/infraestrutura' }
];

@Injectable({ providedIn: 'root' })
export class NavService {
    private readonly router = inject(Router);

    href(destino: string): string {
        return destino.startsWith('/') ? destino : `/#${destino}`;
    }

    /** Navega para uma âncora da home (rolando suavemente) ou para uma rota. */
    ir(destino: string, evento?: Event): void {
        evento?.preventDefault();

        if (destino.startsWith('/')) {
            this.router.navigateByUrl(destino);
            return;
        }

        const naHome = this.router.url.split('#')[0].split('?')[0] === '/';
        if (naHome) {
            const alvo = document.getElementById(destino);
            if (alvo) {
                alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', `/#${destino}`);
                return;
            }
        }
        this.router.navigate(['/'], { fragment: destino });
    }

    topo(evento?: Event): void {
        evento?.preventDefault();
        if (this.router.url.split('#')[0] === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, '', '/');
        } else {
            this.router.navigateByUrl('/');
        }
    }
}
