/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DO SITE
 *  Tudo o que muda com frequência (contatos, números, projetos, cluster)
 *  fica aqui — os componentes só leem estes dados.
 * ============================================================================
 */

export interface Contatos {
    /** Somente dígitos com DDI + DDD. Ex.: '5588999999999'. Vazio = oculta o canal. */
    whatsapp: string;
    /** Ex.: 'contato@adailsilva.com.br'. Vazio = oculta o canal. */
    email: string;
    linkedin: string;
    github: string;
    instagram: string;
}

export const CONTATOS: Contatos = {
    whatsapp: '5589994129256',
    email: '', // opcional. Ex.: 'contato@adailsilva.com.br' — vazio oculta o canal
    linkedin: 'https://www.linkedin.com/in/adailsilva/',
    github: 'https://github.com/AdailSilva',
    instagram: 'https://www.instagram.com/adailsilva_101/'
};

export const PERFIL = {
    nome: 'Adail Silva',
    nomeCompleto: 'Adail dos Santos Silva',
    cargo: 'Desenvolvedor Full-Stack, DevOps & IoT',
    cidade: 'Tianguá · Ceará · Brasil',
    inicioCarreira: 2007
};

export interface Numero {
    valor: string;
    rotulo: string;
    detalhe: string;
}

export const NUMEROS: Numero[] = [
    { valor: `${new Date().getFullYear() - PERFIL.inicioCarreira}+`, rotulo: 'anos em TI', detalhe: 'Suporte, redes, automação comercial, NOC e desenvolvimento' },
    { valor: '3', rotulo: 'sistemas integrados', detalhe: 'ERP, controle de produção e licenciamento conversando entre si' },
    { valor: '24', rotulo: 'painéis de indicadores', detalhe: 'Dashboards gerenciais prontos para a tomada de decisão' },
    { valor: '24/7', rotulo: 'em nuvem própria', detalhe: 'Kubernetes com HTTPS, deploy automatizado e backups' }
];

export interface Solucao {
    icone: string;
    titulo: string;
    descricao: string;
    itens: string[];
}

export const SOLUCOES: Solucao[] = [
    {
        icone: 'pi pi-sitemap',
        titulo: 'ERP sob medida',
        descricao: 'Um sistema modelado nas regras do seu negócio, não o contrário.',
        itens: ['Cadastros, vendas, orçamentos e ordens de serviço', 'Fluxos e códigos que sua equipe já conhece', 'Atalhos de teclado para as tarefas do dia a dia']
    },
    {
        icone: 'pi pi-wallet',
        titulo: 'Financeiro completo',
        descricao: 'Do título emitido ao dinheiro conciliado no banco.',
        itens: ['Contas a receber, fechamentos e parcelas', 'Recibos, acertos e descontos com prazo', 'Controle bancário e saúde financeira']
    },
    {
        icone: 'pi pi-box',
        titulo: 'Estoque inteligente',
        descricao: 'Saldo sempre correto, com cada movimento rastreável.',
        itens: ['Baixa automática a partir das vendas e OS', 'Mapas e grades de produtos', 'Curva ABC, estoque baixo e itens parados']
    },
    {
        icone: 'pi pi-objects-column',
        titulo: 'Produção e Kanban',
        descricao: 'Saiba onde está cada serviço, em tempo real.',
        itens: ['Acompanhamento por setores e etapas', 'Tempo médio por etapa e funil de produção', 'Rastreio físico por cartões identificados']
    },
    {
        icone: 'pi pi-globe',
        titulo: 'Portal do Cliente',
        descricao: 'Seus clientes acompanham pedidos sem precisar ligar.',
        itens: ['Status dos pedidos ao vivo, sem atualizar a página', 'Fechamentos, segunda via e histórico', 'Acesso seguro por convite e e-mail confirmado']
    },
    {
        icone: 'pi pi-users',
        titulo: 'RH, folha e comissões',
        descricao: 'Gestão de pessoas integrada à operação.',
        itens: ['Funcionários, setores, férias e afastamentos', 'Comissão de produção por setor e serviço', 'Vales, folha e recibos de pagamento']
    },
    {
        icone: 'pi pi-receipt',
        titulo: 'Fiscal',
        descricao: 'Emissão de documentos fiscais integrada ao fluxo de venda.',
        itens: ['NF-e, NFC-e e NFS-e', 'Certificado A1 e múltiplos CNPJs', 'Sem redigitação: a nota nasce da venda']
    },
    {
        icone: 'pi pi-chart-bar',
        titulo: 'Dashboards e relatórios',
        descricao: 'Indicadores que mostram o negócio de verdade.',
        itens: ['Painéis gerenciais configuráveis', 'Relatórios em PDF com a sua marca', 'Aging de recebíveis, top clientes e serviços']
    },
    {
        icone: 'pi pi-shield',
        titulo: 'Segurança e acessos',
        descricao: 'Cada usuário vê e faz apenas o que deve.',
        itens: ['Permissões por tela e por botão', 'Horários de acesso e controle de sessões', 'Autenticação com token e senhas protegidas']
    }
];

export interface Projeto {
    id: string;
    nome: string;
    subtitulo: string;
    descricao: string;
    status: string;
    icone: string;
    destaques: { icone: string; texto: string }[];
    stack: string[];
    mockup: 'erp' | 'producao' | 'licencas';
    url: string;
}

export const PROJETOS: Projeto[] = [
    {
        id: 'web',
        nome: 'CSLab WEB',
        subtitulo: 'ERP completo para laboratório óptico',
        descricao:
            'Plataforma de gestão de ponta a ponta para um laboratório de lentes: da ordem de serviço com receita óptica até o fechamento financeiro, com portal para as óticas clientes acompanharem seus pedidos ao vivo.',
        status: 'Em produção',
        icone: 'pi pi-eye',
        destaques: [
            { icone: 'pi pi-file-edit', texto: 'Ordens de serviço com receita óptica e baixa automática de estoque' },
            { icone: 'pi pi-globe', texto: 'Portal do Cliente com pedidos atualizados em tempo real' },
            { icone: 'pi pi-wallet', texto: 'Fechamentos, recibos, contas a receber e controle bancário' },
            { icone: 'pi pi-users', texto: 'RH, folha de pagamento e comissão de produção por setor' },
            { icone: 'pi pi-receipt', texto: 'Módulo fiscal: NF-e, NFC-e e NFS-e' },
            { icone: 'pi pi-chart-bar', texto: '24 painéis gerenciais e relatórios em PDF' }
        ],
        stack: ['Java 21', 'Spring Boot 3', 'Angular 21', 'PrimeNG', 'PostgreSQL 16', 'Kubernetes'],
        mockup: 'erp',
        url: 'https://app-cslab-web.adailsilva.com.br'
    },
    {
        id: 'cardscontrol',
        nome: 'CSLab CardsControl',
        subtitulo: 'Controle de produção por cartões e setores',
        descricao:
            'Cada serviço do laboratório recebe um cartão físico. O CardsControl registra a passagem desse cartão por cada setor, mostrando em tempo real onde está cada pedido — integrado nos dois sentidos com o ERP.',
        status: 'Em produção',
        icone: 'pi pi-id-card',
        destaques: [
            { icone: 'pi pi-arrows-h', texto: 'Vínculo bidirecional entre cartões e ordens de serviço do ERP' },
            { icone: 'pi pi-sitemap', texto: 'Baixas por setor com permissões por usuário' },
            { icone: 'pi pi-clock', texto: 'Histórico completo de cada serviço na linha do tempo' },
            { icone: 'pi pi-user', texto: 'Mesmo cadastro e login dos funcionários do ERP' },
            { icone: 'pi pi-cloud-upload', texto: 'Backup automático e incremental em nuvem' }
        ],
        stack: ['Java 17', 'Spring Boot 3', 'Angular', 'PrimeNG', 'PostgreSQL', 'Kubernetes'],
        mockup: 'producao',
        url: 'https://app-cslab-cardscontrol.adailsilva.com.br'
    },
    {
        id: 'backoffice',
        nome: 'CSLab BackOffice',
        subtitulo: 'Licenciamento e administração SaaS',
        descricao:
            'A central que transforma os sistemas em produto: controla as licenças do ERP e do CardsControl — validade, módulos habilitados e limite de usuários — além de monitorar quem está conectado.',
        status: 'Em produção',
        icone: 'pi pi-key',
        destaques: [
            { icone: 'pi pi-verified', texto: 'Autoridade de licenças para os demais sistemas' },
            { icone: 'pi pi-th-large', texto: 'Módulos licenciáveis e limite de usuários por cliente' },
            { icone: 'pi pi-desktop', texto: 'Controle de visitantes, logoff forçado e bloqueios' },
            { icone: 'pi pi-book', texto: 'Guia de licenciamento completo integrado' }
        ],
        stack: ['Java 21', 'Spring Boot 3', 'Angular 21', 'PrimeNG', 'PostgreSQL 16', 'Kubernetes'],
        mockup: 'licencas',
        url: 'https://app-cslab-backoffice.adailsilva.com.br'
    }
];

export interface Etapa {
    titulo: string;
    descricao: string;
    icone: string;
}

export const ETAPAS: Etapa[] = [
    { icone: 'pi pi-comments', titulo: 'Imersão no negócio', descricao: 'Entendo como sua empresa funciona de verdade: processos, regras, documentos e gargalos.' },
    { icone: 'pi pi-pencil', titulo: 'Desenho da solução', descricao: 'Telas, fluxos e módulos definidos com você antes de qualquer linha de código.' },
    { icone: 'pi pi-code', titulo: 'Desenvolvimento em ciclos', descricao: 'Entregas frequentes, testáveis, para você validar e ajustar o rumo cedo.' },
    { icone: 'pi pi-database', titulo: 'Migração e treinamento', descricao: 'Seus dados atuais importados e conferidos; equipe treinada para o primeiro dia.' },
    { icone: 'pi pi-sparkles', titulo: 'Implantação e evolução', descricao: 'Sistema no ar com HTTPS e backups, suporte direto e melhorias contínuas.' }
];

export interface Diferencial {
    icone: string;
    titulo: string;
    descricao: string;
}

export const DIFERENCIAIS: Diferencial[] = [
    { icone: 'pi pi-user', titulo: 'Direto com quem desenvolve', descricao: 'Sem intermediários: quem entende a sua regra é quem escreve o código.' },
    { icone: 'pi pi-mobile', titulo: 'Qualquer tela', descricao: 'Navegador, tablet ou celular — interface responsiva, clara e com tema escuro.' },
    { icone: 'pi pi-bolt', titulo: 'Tempo real', descricao: 'Telas que se atualizam sozinhas quando algo muda na operação.' },
    { icone: 'pi pi-lock', titulo: 'Seguro por padrão', descricao: 'HTTPS, permissões granulares, sessões controladas e backups.' }
];

export interface GrupoTecnologia {
    titulo: string;
    icone: string;
    itens: string[];
}

export const TECNOLOGIAS: GrupoTecnologia[] = [
    { titulo: 'Backend', icone: 'pi pi-server', itens: ['Java 21', 'Spring Boot 3', 'JPA / Hibernate', 'Flyway', 'JWT', 'Thymeleaf (PDF/e-mail)'] },
    { titulo: 'Frontend', icone: 'pi pi-desktop', itens: ['Angular', 'PrimeNG', 'TypeScript', 'Tailwind CSS', 'Signals', 'SSE (tempo real)'] },
    { titulo: 'Dados', icone: 'pi pi-database', itens: ['PostgreSQL 16', 'Migrações versionadas', 'Backups automatizados', 'Cargas de dados'] },
    { titulo: 'Infraestrutura', icone: 'pi pi-cloud', itens: ['Kubernetes', 'Oracle Cloud ARM64', 'NGINX Ingress', "cert-manager + Let's Encrypt", 'GitHub Actions', 'ArgoCD (GitOps)', 'Terraform / OpenTofu'] }
];

export const FAIXA_TECNOLOGIAS: string[] = [
    'Java 21',
    'Spring Boot',
    'Angular',
    'PrimeNG',
    'TypeScript',
    'PostgreSQL',
    'Kubernetes',
    'Docker',
    'NGINX',
    'GitHub Actions',
    'ArgoCD',
    'Oracle Cloud',
    'Terraform',
    'Tailwind CSS',
    "Let's Encrypt",
    'ESP32',
    'LoRaWAN',
    'ChirpStack',
    'MQTT · TLS'
];

export interface Pergunta {
    pergunta: string;
    resposta: string;
}

export const PERGUNTAS: Pergunta[] = [
    {
        pergunta: 'Quanto tempo leva para ter o sistema funcionando?',
        resposta:
            'Depende do escopo. Trabalho em ciclos curtos: os primeiros módulos ficam disponíveis para uso em poucas semanas e o restante é entregue de forma incremental, sempre validado com você.'
    },
    {
        pergunta: 'Consigo aproveitar os dados do sistema que uso hoje?',
        resposta:
            'Sim. Faço a migração dos cadastros, saldos e histórico do seu sistema atual (planilhas ou bancos de dados), com conferência dos números antes da virada.'
    },
    {
        pergunta: 'Onde o sistema fica hospedado?',
        resposta:
            'Em infraestrutura Kubernetes na nuvem, com HTTPS, deploy automatizado e backups. Se a sua empresa preferir, implanto também na nuvem ou no servidor de vocês.'
    },
    {
        pergunta: 'Funciona no celular e no tablet?',
        resposta: 'Sim. Todas as telas são responsivas e funcionam em qualquer navegador moderno — no escritório, na produção ou fora da empresa.'
    },
    {
        pergunta: 'O sistema emite nota fiscal?',
        resposta: 'Sim, quando o projeto precisa. O módulo fiscal emite NF-e, NFC-e e NFS-e integrado à venda, sem redigitação.'
    },
    {
        pergunta: 'Como funcionam o suporte e as melhorias?',
        resposta:
            'O atendimento é direto com o desenvolvedor. Correções e evoluções seguem o mesmo pipeline automatizado: a nova versão entra no ar sem interromper a operação.'
    }
];

export const SEGMENTOS: string[] = [
    'Indústria / produção',
    'Laboratório',
    'Comércio / varejo',
    'Distribuição',
    'Prestação de serviços',
    'Saúde',
    'Agronegócio',
    'Projeto IoT / LoRaWAN',
    'Outro'
];

/**
 * Dados da página "Infraestrutura" (cluster Kubernetes).
 */
export const CLUSTER = {
    dominio: 'k8s.adailsilva.com.br',
    provedor: 'Oracle Cloud Infrastructure',
    regiao: 'sa-saopaulo-1 (São Paulo)',
    kubernetes: 'v1.31',
    nos: 4,
    arquitetura: 'ARM64 (Ampere A1)',
    vcpus: 4,
    memoriaGb: 24,
    componentes: [
        { nome: 'Provisionamento', valor: 'kubeadm', icone: 'pi pi-cog' },
        { nome: 'Sistema operacional', valor: 'Ubuntu 24.04 LTS · ARM64', icone: 'pi pi-desktop' },
        { nome: 'Container runtime', valor: 'containerd', icone: 'pi pi-box' },
        { nome: 'Rede (CNI)', valor: 'Flannel · 10.244.0.0/16', icone: 'pi pi-share-alt' },
        { nome: 'Ingress', valor: 'NGINX Ingress Controller', icone: 'pi pi-sign-in' },
        { nome: 'Certificados', valor: "cert-manager + Let's Encrypt", icone: 'pi pi-lock' },
        { nome: 'Armazenamento', valor: 'OCI File Storage (NFS)', icone: 'pi pi-database' },
        { nome: 'Registry', valor: 'OCI Container Registry (OCIR)', icone: 'pi pi-images' },
        { nome: 'Infra como código', valor: 'Terraform / OpenTofu', icone: 'pi pi-code' },
        { nome: 'CI/CD', valor: 'GitHub Actions · runner ARM64 próprio', icone: 'pi pi-sync' },
        { nome: 'GitOps', valor: 'ArgoCD (app-of-apps)', icone: 'pi pi-sitemap' }
    ],
    nosDetalhe: [
        { nome: 'leader', papel: 'Control plane · 1 OCPU · 3 GB' },
        { nome: 'worker-0', papel: 'Worker · CI runner · 1 OCPU · 7 GB' },
        { nome: 'worker-1', papel: 'Worker · 1 OCPU · 7 GB' },
        { nome: 'worker-2', papel: 'Worker · 1 OCPU · 7 GB' }
    ],
    aplicacoes: [
        { nome: 'CSLab WEB', host: 'app-cslab-web.adailsilva.com.br', namespace: 'cslab-web' },
        { nome: 'CSLab CardsControl', host: 'app-cslab-cardscontrol.adailsilva.com.br', namespace: 'cslab-cardscontrol' },
        { nome: 'CSLab BackOffice', host: 'app-cslab-backoffice.adailsilva.com.br', namespace: 'cslab-backoffice' },
        { nome: 'PF Gráfica · Gestão', host: 'app-pfgrafica-gestao.adailsilva.com.br', namespace: 'pfgrafica-gestao' },
        { nome: 'Este site', host: 'k8s.adailsilva.com.br', namespace: 'homepage' }
    ],
    pipeline: [
        { titulo: 'Push na master', descricao: 'Versão e tag Git calculadas automaticamente', icone: 'pi pi-tag' },
        { titulo: 'GitHub Actions', descricao: 'Runner ARM64 no próprio cluster', icone: 'pi pi-github' },
        { titulo: 'Build ARM64', descricao: 'Docker Buildx → OCIR', icone: 'pi pi-box' },
        { titulo: 'GitOps', descricao: 'Nova versão gravada no repositório', icone: 'pi pi-code' },
        { titulo: 'ArgoCD', descricao: 'Sincroniza o cluster, sem downtime', icone: 'pi pi-check-circle' }
    ]
};
