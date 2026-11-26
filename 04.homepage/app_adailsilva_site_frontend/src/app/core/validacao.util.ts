/**
 * Validação e máscara do campo "WhatsApp ou e-mail" do formulário de contato.
 * Vazio não é tratado aqui: a obrigatoriedade é verificada à parte.
 */

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function somenteDigitos(v: string | null | undefined): string {
    return (v ?? '').replace(/\D/g, '');
}

export function emailValido(v: string | null | undefined): boolean {
    const s = (v ?? '').trim();
    return !s || (s.length <= 160 && EMAIL.test(s));
}

/** Telefone/celular brasileiro: DDD + 8 ou 9 dígitos (aceita o +55 na frente). */
export function telefoneValido(v: string | null | undefined): boolean {
    let d = somenteDigitos(v);
    if (!d) return true;
    if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
    if (d.length !== 10 && d.length !== 11) return false;
    if (d[0] === '0' || d[1] === '0') return false;
    return d.length === 10 || d[2] === '9';
}

/** Decide pelo conteúdo: com "@" ou letras é e-mail; só números/pontuação é telefone. */
export function pareceEmail(v: string): boolean {
    return /[@A-Za-z]/.test(v);
}

export function contatoValido(v: string): boolean {
    return pareceEmail(v) ? emailValido(v) : telefoneValido(v);
}

/** (00) 0000-0000 ou (00) 00000-0000; com +55 na frente vira +55 (00) 00000-0000. */
export function mascaraTelefone(v: string): string {
    let d = somenteDigitos(v);
    let prefixo = '';
    if (v.trim().startsWith('+') && d.startsWith('55')) {
        prefixo = '+55 ';
        d = d.slice(2);
    }
    d = d.slice(0, 11);
    if (!d) return prefixo.trim();
    let r: string;
    if (d.length <= 2) r = `(${d}`;
    else if (d.length <= 6) r = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    else if (d.length <= 10) r = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    else r = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return prefixo + r;
}

/** Aplica a máscara de telefone apenas quando o valor não parece e-mail. */
export function mascararContato(v: string): string {
    if (!v || pareceEmail(v)) return v;
    return mascaraTelefone(v);
}
