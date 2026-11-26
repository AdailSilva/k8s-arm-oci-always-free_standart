/**
 * ============================================================================
 *  CONTEÚDO DA ÁREA "INTERNET DAS COISAS" (página /iot e chamada na home)
 *  Textos dos 4 projetos (gateways SX1301 e SX1302, nós ESP32 e Radioenge),
 *  telas reais da página web e do app Flutter e diagramas de ligação ficam
 *  aqui — os componentes só leem estes dados. As imagens ficam em public/iot/.
 * ============================================================================
 */

export interface ServicoIot {
    icone: string;
    titulo: string;
    descricao: string;
    itens: string[];
}

/** O que é entregue num projeto IoT / LoRaWAN, da placa ao painel. */
export const SERVICOS_IOT: ServicoIot[] = [
    {
        icone: 'pi pi-microchip',
        titulo: 'Placas eletrônicas sob medida',
        descricao: 'Hardware desenhado para a ideia do cliente, não adaptado de um kit genérico.',
        itens: ['Esquemático e layout de PCB', 'Sensores, atuadores e interfaces industriais', 'Protótipo, testes de bancada e lote piloto']
    },
    {
        icone: 'pi pi-code',
        titulo: 'Firmware embarcado',
        descricao: 'Código eficiente em C/C++ para ESP32 e STM32, com foco em estabilidade e baixo consumo.',
        itens: ['ESP-IDF + FreeRTOS no ESP32 · LoRaMac-node no STM32', 'LoRaWAN classes A, B e C, OTAA e ABP', 'Um código para ESP32-WROOM-32U e ESP32-S3 (N16R8 e N32R16V)', 'Página web, app Android e console em cada dispositivo']
    },
    {
        icone: 'pi pi-wifi',
        titulo: 'Gateways LoRaWAN',
        descricao: 'Gateways de 8 canais com firmware próprio num único ESP32, sem Raspberry Pi, para AU915.',
        itens: ['Semtech SX1301 (Radioenge, nacional) e SX1302 (Elecrow LR1302)', 'MQTT com TLS direto para o ChirpStack v4, GPS e Gateway EUI automático', 'Página web, app Android e diagnósticos de rede']
    },
    {
        icone: 'pi pi-server',
        titulo: 'Servidor de rede no Kubernetes',
        descricao: 'ChirpStack instalado, versionado e monitorado no meu cluster — ou no seu.',
        itens: ['ChirpStack v4.19 em produção (e v3 para legados)', 'API REST e broker MQTT com certificados digitais', 'HTTPS automático, backups e deploy contínuo']
    },
    {
        icone: 'pi pi-chart-line',
        titulo: 'Aplicações e dashboards',
        descricao: 'Os dados dos sensores viram informação útil para quem decide.',
        itens: ['Painéis em tempo real com Angular', 'APIs e regras de negócio em Spring Boot', 'Alertas, histórico e integração com o seu ERP']
    },
    {
        icone: 'pi pi-map',
        titulo: 'Implantação e operação',
        descricao: 'Da escolha do ponto de instalação ao acompanhamento da rede no dia a dia.',
        itens: ['Estudo de cobertura e posicionamento de antenas', 'Cadastro de dispositivos, chaves e perfis', 'Monitoramento, suporte e evolução contínua']
    }
];

export interface CamadaRede {
    id: string;
    icone: string;
    titulo: string;
    subtitulo: string;
    descricao: string;
    tags: string[];
    /** Rótulo do enlace que sai desta camada em direção à próxima. */
    enlace?: string;
}

/** Arquitetura ponta a ponta de uma rede LoRaWAN completa. */
export const CAMADAS_REDE: CamadaRede[] = [
    {
        id: 'dispositivos',
        icone: 'pi pi-microchip',
        titulo: 'Dispositivos',
        subtitulo: 'placas personalizadas',
        descricao: 'Sensores e atuadores com ESP32 ou STM32 e rádio LoRa, alimentados por bateria, solar ou rede elétrica.',
        tags: ['ESP32', 'STM32', 'Classe A / B / C'],
        enlace: 'LoRa · 915 MHz'
    },
    {
        id: 'gateway',
        icone: 'pi pi-wifi',
        titulo: 'Gateway',
        subtitulo: 'ESP32 + SX130x',
        descricao: 'Escuta 8 canais ao mesmo tempo e entrega cada pacote ao servidor de rede por um canal seguro.',
        tags: ['8 canais', 'AU915', 'Wi-Fi'],
        enlace: 'MQTT · TLS'
    },
    {
        id: 'servidor',
        icone: 'pi pi-server',
        titulo: 'ChirpStack',
        subtitulo: 'no Kubernetes',
        descricao: 'Servidor de rede e de aplicação: autenticação dos dispositivos, deduplicação, ADR e downlinks.',
        tags: ['ChirpStack v4.19', 'Kubernetes', 'ARM64'],
        enlace: 'MQTT · API'
    },
    {
        id: 'aplicacao',
        icone: 'pi pi-chart-bar',
        titulo: 'Aplicação',
        subtitulo: 'painéis e integrações',
        descricao: 'Dashboards em tempo real, alertas, relatórios e integração com os sistemas da empresa.',
        tags: ['Spring Boot', 'Angular', 'APIs']
    }
];

export interface NumeroIot {
    valor: string;
    rotulo: string;
    detalhe: string;
}

export const NUMEROS_IOT: NumeroIot[] = [
    { valor: '4', rotulo: 'projetos LoRaWAN', detalhe: '2 gateways e 2 famílias de nós (5 firmwares), cada um com página web, app Android e console' },
    { valor: '8', rotulo: 'canais simultâneos', detalhe: 'Recepção multicanal e multi-SF nos gateways SX1301 e SX1302' },
    { valor: '3', rotulo: 'placas ESP32 por projeto', detalhe: 'ESP32-WROOM-32U, ESP32-S3 N16R8 e N32R16V, com o mesmo código-fonte' },
    { valor: 'A·B·C', rotulo: 'classes LoRaWAN', detalhe: 'Troca de classe em tempo de execução no nó STM32, sem regravar' }
];

/* ---------------------------------------------------------------------------
 *  PORTFÓLIO: tudo o que já está construído
 * ------------------------------------------------------------------------- */

export interface ProjetoIot {
    id: string;
    icone: string;
    tipo: string;
    nome: string;
    hardware: string;
    descricao: string;
    destaques: string[];
    tags: string[];
    status: string;
    /** 'success' em operação · 'info' no ar, em validação · 'warn' em bancada */
    severidade: 'success' | 'info' | 'warn';
    /** Captura real usada no topo do cartão. */
    imagem: string;
    /** Seção desta página com mais detalhes (opcional). */
    ancora?: 'gateways' | 'nos';
}

export const PROJETOS_IOT: ProjetoIot[] = [
    {
        id: 'chirpstack',
        icone: 'pi pi-server',
        tipo: 'Servidor',
        nome: 'ChirpStack v4.19 no Kubernetes',
        hardware: 'Cluster ARM64 na Oracle Cloud · deploy contínuo',
        descricao: 'Servidor de rede e de aplicação que recebe os gateways por MQTT/TLS, com API REST em produção para levar os dados a outros sistemas.',
        destaques: ['Broker MQTT com certificados digitais', 'API REST em HTTPS', 'Painel de gestão em Spring Boot + Angular em desenvolvimento'],
        tags: ['Kubernetes', 'MQTT', 'REST'],
        status: 'Em operação',
        severidade: 'success',
        imagem: '/iot/capturas/chirpstack-gateway-mapa-gps.webp'
    },
    {
        id: 'gw-sx1301',
        icone: 'pi pi-wifi',
        tipo: 'Gateway',
        nome: 'Gateway ESP32 + SX1301',
        hardware: 'ESP32 / ESP32-S3 · Radioenge LoRaWAN Gateway RD43HAT / RD43HATGPS (SX1301, homologado pela ANATEL)',
        descricao: 'Porte da lora_gateway 5.0.1 e do packet_forwarder 4.0.1 da Semtech para o ESP32, no lugar do Raspberry Pi, com a placa brasileira da Radioenge como concentrador principal.',
        destaques: ['Página web, MQTT/TLS, GPS, diagnósticos e app Android', 'Até +27 dBm com a placa da Radioenge', 'Também serve RAK2245, RAK831 e iC880A'],
        tags: ['ESP-IDF', 'SX1301', 'Radioenge'],
        status: 'Compilado, aguardando bancada',
        severidade: 'warn',
        imagem: '/iot/gw-sx1301/web-status.webp',
        ancora: 'gateways'
    },
    {
        id: 'gw-sx1302',
        icone: 'pi pi-wifi',
        tipo: 'Gateway',
        nome: 'Gateway ESP32 + SX1302',
        hardware: 'ESP32 / ESP32-S3 · Elecrow LR1302 HAT (SX1302 + SX1250)',
        descricao: 'Gateway de 8 canais com a SX1302_HAL 2.1.0 portada para o ESP-IDF, rodando sozinha num único ESP32: MQTT/TLS nativo do ChirpStack v4, página web completa e app Android.',
        destaques: ['Protocolo ChirpStack v4 em JSON ou Protobuf', 'GPS do HAT com a posição no mapa do ChirpStack', 'Watchdog que reinicia só o SX1302, sem derrubar o Wi-Fi'],
        tags: ['ESP-IDF', 'SX1302', 'MQTT/TLS'],
        status: 'Em operação',
        severidade: 'success',
        imagem: '/iot/gw-sx1302/web-status.webp',
        ancora: 'gateways'
    },
    {
        id: 'no-esp32',
        icone: 'pi pi-microchip',
        tipo: 'Nó LoRaWAN',
        nome: 'Nó ESP32 + RFM95W (ABP e OTAA)',
        hardware: 'ESP32 / ESP32-S3 · HopeRF RFM95W (SX1276)',
        descricao: 'Firmware base de nó em duas versões, OTAA (MCCI LMiC 6.0.1) e ABP (MCCI LMiC 3.3.0), numa HAL própria para o ESP-IDF, com a página web servida pelo próprio ESP32.',
        destaques: ['Chaves de sessão, Frame raw e MIC de cada envio', 'Watchdog do rádio sem perder a sessão', 'App Android que acha o nó por mDNS na rede'],
        tags: ['ESP-IDF', 'MCCI LMiC', 'Wi-Fi'],
        status: 'Em operação',
        severidade: 'success',
        imagem: '/iot/no-esp32/web-status.webp',
        ancora: 'nos'
    },
    {
        id: 'no-radioenge',
        icone: 'pi pi-microchip',
        tipo: 'Nó LoRaWAN',
        nome: 'Nó Radioenge STM32 + SX1272 (ABP e OTAA)',
        hardware: 'Módulo Radioenge LoRaWAN EndDevice (STM32L071CZ + SX1272) regravado',
        descricao: 'Firmware novo para o STM32 do módulo nacional da Radioenge, com a LoRaMac-node 4.7.1: ABP e OTAA no mesmo binário, trocados por AT+NJM, Classes A, B e C e todos os comandos AT de fábrica.',
        destaques: ['Página web por Web Serial ou Web Bluetooth, sem instalar nada', 'App Android por cabo USB OTG ou Bluetooth BLE', 'Modo STOP entre eventos e EEPROM para sessão e DevNonce'],
        tags: ['STM32L0', 'LoRaMac-node', 'Comandos AT'],
        status: 'JOIN e uplinks no ar',
        severidade: 'info',
        imagem: '/iot/no-radioenge/web-status.webp',
        ancora: 'nos'
    }
];

/* ---------------------------------------------------------------------------
 *  TELAS REAIS (página web e app Flutter) · LIGAÇÕES
 * ------------------------------------------------------------------------- */

export interface TelaDispositivo {
    id: string;
    rotulo: string;
    titulo: string;
    descricao: string;
    imagem: string;
}

/** Mantido por compatibilidade com o nome antigo. */
export type TelaNo = TelaDispositivo;

export interface Ligacao {
    id: string;
    rotulo: string;
    imagem: string;
    legenda: string;
}

export interface GrupoFuncionalidade {
    icone: string;
    titulo: string;
    itens: string[];
}

export interface ComandoConsole {
    comando: string;
    descricao: string;
}

/* ---------------------------------------------------------------------------
 *  GATEWAYS LORAWAN (SX1301 e SX1302)
 * ------------------------------------------------------------------------- */

export interface GatewayLorawan {
    id: 'sx1302' | 'sx1301';
    rotulo: string;
    nome: string;
    codinome: string;
    subtitulo: string;
    descricao: string;
    status: string;
    severidade: 'success' | 'info' | 'warn';
    /** Aviso exibido abaixo do resumo (opcional). */
    aviso?: string;
    /** Texto da barra de endereço da moldura do navegador. */
    endereco: string;
    hardware: { rotulo: string; valor: string; icone: string }[];
    stack: string[];
    funcionalidades: GrupoFuncionalidade[];
    web: TelaDispositivo[];
    app: TelaDispositivo[];
    comandos: ComandoConsole[];
    ligacoes: Ligacao[];
}

function telasWebGateway(pasta: string, chip: string): TelaDispositivo[] {
    return [
        {
            id: 'status',
            rotulo: 'Status',
            titulo: 'Painel de status ao vivo',
            descricao: `Tempo ligado, memória, sinal do Wi-Fi, pacotes recebidos e encaminhados, downlinks, último ACK e GPS, atualizados a cada 5 segundos e pausados quando a aba fica em segundo plano.`,
            imagem: `/iot/${pasta}/web-status.webp`
        },
        { id: 'escuro', rotulo: 'Tema escuro', titulo: 'Tema claro e escuro', descricao: 'A página segue o tema do sistema operacional, com o mesmo layout e todos os textos legíveis.', imagem: `/iot/${pasta}/web-status-escuro.webp` },
        {
            id: 'wifi',
            rotulo: 'Rede Wi-Fi',
            titulo: 'Rede Wi-Fi com IP fixo',
            descricao: 'DHCP ou endereço fixo com máscara, gateway e dois DNS, validados antes de salvar. Se o IP fixo falhar, o firmware volta para o DHCP.',
            imagem: `/iot/${pasta}/web-wifi.webp`
        },
        {
            id: 'mqtt',
            rotulo: 'MQTT seguro',
            titulo: 'MQTT seguro (TLS)',
            descricao: 'Formato ChirpStack v4 ou Espelho Semtech, codificação JSON ou Protobuf trocada ao vivo, e os certificados (CA, cliente e chave para TLS mútuo) enviados pela própria página.',
            imagem: `/iot/${pasta}/web-mqtt.webp`
        },
        {
            id: 'radio',
            rotulo: 'Rádio LoRa',
            titulo: 'Plano de frequência em cartões',
            descricao: `AU915 sub-banda 1 (padrão no Brasil) e sub-banda 0, mais CN470, EU868 e US915, com o desenho dos canais em uso e o JSON de cada plano do ${chip}.`,
            imagem: `/iot/${pasta}/web-radio.webp`
        },
        {
            id: 'gps',
            rotulo: 'GPS',
            titulo: 'GPS da placa',
            descricao: 'Liga e desliga sem reiniciar e mostra latitude, longitude, altitude, satélites e frases NMEA. A posição vai para o ChirpStack nas estatísticas do gateway.',
            imagem: `/iot/${pasta}/web-gps.webp`
        },
        {
            id: 'logs',
            rotulo: 'Logs',
            titulo: 'Logs em tempo real',
            descricao: 'A saída do console no navegador, num buffer circular de 16 KB: filtro, pausa, rolagem automática, cores por tipo de evento e download.',
            imagem: `/iot/${pasta}/web-logs.webp`
        },
        {
            id: 'diag',
            rotulo: 'Diagnósticos',
            titulo: 'Diagnósticos de rede',
            descricao: 'Ping, Traceroute e Nslookup executados pelo próprio gateway, com destino padrão chirpstack-v4.adailsilva.com.br.',
            imagem: `/iot/${pasta}/web-diagnosticos.webp`
        },
        { id: 'classes', rotulo: 'Classes', titulo: 'Classes LoRaWAN explicadas', descricao: 'Uma página que mostra, com animação, quando o nó escuta o rádio em cada classe e o que este gateway atende.', imagem: `/iot/${pasta}/web-classes.webp` },
        {
            id: 'celular',
            rotulo: 'No celular',
            titulo: 'Pensada também para o celular',
            descricao: 'No celular o menu vira uma fileira de atalhos e os indicadores ficam em duas colunas, sem nenhum texto cortado.',
            imagem: `/iot/${pasta}/web-celular.webp`
        }
    ];
}

function telasAppGateway(pasta: string, softAp: string): TelaDispositivo[] {
    return [
        { id: 'lista', rotulo: 'Gateways', titulo: 'Gateways salvos', descricao: 'IP, versão do firmware e placa de cada um.', imagem: `/iot/${pasta}/app-lista.webp` },
        { id: 'procurar', rotulo: 'Procurar', titulo: 'Busca na rede', descricao: 'mDNS nos ESP32-S3 e varredura da sub-rede.', imagem: `/iot/${pasta}/app-procurar.webp` },
        { id: 'softap', rotulo: 'Soft AP', titulo: 'Primeira configuração', descricao: `Pela rede ${softAp}, em 192.168.101.101.`, imagem: `/iot/${pasta}/app-softap.webp` },
        { id: 'status', rotulo: 'Status', titulo: 'Status', descricao: 'Os mesmos cartões da página web.', imagem: `/iot/${pasta}/app-status.webp` },
        { id: 'escuro', rotulo: 'Escuro', titulo: 'Tema escuro', descricao: 'Segue o tema do Android.', imagem: `/iot/${pasta}/app-status-escuro.webp` },
        { id: 'rede', rotulo: 'Rede', titulo: 'Wi-Fi e servidor', descricao: 'SSID, IP fixo e Gateway EUI automático.', imagem: `/iot/${pasta}/app-config-rede.webp` },
        { id: 'mqtt', rotulo: 'MQTT', titulo: 'MQTT e certificados', descricao: 'ChirpStack v4 em JSON ou Protobuf.', imagem: `/iot/${pasta}/app-config-mqtt.webp` },
        { id: 'radio', rotulo: 'Rádio', titulo: 'Plano de frequência', descricao: 'AU915 SB1 e o desenho dos canais.', imagem: `/iot/${pasta}/app-config-radio.webp` },
        { id: 'gps', rotulo: 'GPS', titulo: 'GPS', descricao: 'Liga e desliga sem reiniciar.', imagem: `/iot/${pasta}/app-config-gps.webp` },
        { id: 'logs', rotulo: 'Logs', titulo: 'Logs ao vivo', descricao: 'Filtro, pausa e download.', imagem: `/iot/${pasta}/app-logs.webp` },
        { id: 'diag', rotulo: 'Diagnóst.', titulo: 'Diagnósticos', descricao: 'Ping, Traceroute e Nslookup.', imagem: `/iot/${pasta}/app-diagnosticos.webp` },
        { id: 'manutencao', rotulo: 'Manutenção', titulo: 'Manutenção', descricao: 'Exportar, importar e restaurar.', imagem: `/iot/${pasta}/app-manutencao.webp` }
    ];
}

function ligacoesGateway(pasta: string, placa: string): Ligacao[] {
    return [
        { id: 'esp32', rotulo: 'ESP32-WROOM-32U', imagem: `/iot/${pasta}/ligacoes-esp32.webp`, legenda: `ESP32-WROOM-32U DevKit ↔ ${placa} · VSPI` },
        { id: 'n16r8', rotulo: 'ESP32-S3 N16R8', imagem: `/iot/${pasta}/ligacoes-esp32s3-n16r8.webp`, legenda: `ESP32-S3-WROOM-1U-N16R8 DevKit ↔ ${placa} · FSPI` },
        { id: 'n32r16v', rotulo: 'ESP32-S3 N32R16V', imagem: `/iot/${pasta}/ligacoes-esp32s3-n32r16v.webp`, legenda: `ESP32-S3-WROOM-2-N32R16V DevKit ↔ ${placa} · FSPI` }
    ];
}

export const GATEWAYS: GatewayLorawan[] = [
    {
        id: 'sx1301',
        rotulo: 'ESP32 + SX1301',
        nome: 'Gateway ESP32 with SX1301',
        codinome: 'ESP32_SX1301 · v0.0.1',
        subtitulo: 'Gateway LoRaWAN de 8 canais com a placa nacional da Radioenge',
        descricao:
            'A HAL original da Semtech para a geração SX1301 (lora_gateway 5.0.1) e o packet_forwarder 4.0.1 rodando nativamente num único ESP32, no lugar do Raspberry Pi. A placa principal é o LoRaWAN Gateway da Radioenge (RD43HAT / RD43HATGPS), fabricado no Brasil e homologado pela ANATEL; também servem RAK2245, RAK831, IMST iC880A e RisingHF RHF0M301.',
        status: 'Compilado, aguardando bancada',
        severidade: 'warn',
        aviso: 'O firmware compila sem avisos para as três placas ESP32. As funções que dependem do concentrador aguardam a validação em bancada com a placa da Radioenge; Wi-Fi, MQTT, página web, logs, diagnósticos e app já funcionam.',
        endereco: '192.168.18.101',
        hardware: [
            { rotulo: 'Microcontrolador', valor: 'ESP32-WROOM-32U · ESP32-S3-WROOM-1U-N16R8 · ESP32-S3-WROOM-2-N32R16V', icone: 'pi pi-microchip' },
            { rotulo: 'Concentrador', valor: 'Semtech SX1301 + 2 × SX1257 (Radioenge RD43HAT / RD43HATGPS)', icone: 'pi pi-wave-pulse' },
            { rotulo: 'Potência', valor: 'Até +27 dBm · 902,5–907 e 915–928 MHz', icone: 'pi pi-bolt' },
            { rotulo: 'Barramento', valor: 'SPI dedicado (VSPI no ESP32 · FSPI no S3) · RESET no pino 26', icone: 'pi pi-arrows-h' },
            { rotulo: 'Firmware', valor: 'ESP-IDF v5.5 / v6.x · FreeRTOS · C', icone: 'pi pi-code' },
            { rotulo: 'Conectividade', valor: 'Wi-Fi com antena externa (u.FL) · GPS da RD43HATGPS', icone: 'pi pi-wifi' }
        ],
        stack: ['ESP32 / ESP32-S3', 'ESP-IDF', 'FreeRTOS', 'lora_gateway 5.0.1', 'packet_forwarder 4.0.1', 'MQTT/TLS', 'Protobuf', 'ChirpStack v4', 'Flutter'],
        funcionalidades: [
            {
                icone: 'pi pi-wave-pulse',
                titulo: 'Rádio e LoRaWAN',
                itens: [
                    'SX1301 + 2 rádios SX1257: 8 canais multi-SF + canal LoRa de serviço + FSK',
                    'Planos AU915 sub-bandas 0 e 1 (padrão), US915, EU868 e CN470',
                    'Fila JIT de downlinks: Classe A (RX1/RX2) e Classe C (imediato)',
                    'Beacon da Classe B em AU915, com o PPS do GPS ligado ao SX1301',
                    'GPS da placa ligado e desligado sem reiniciar, com a posição enviada ao ChirpStack'
                ]
            },
            {
                icone: 'pi pi-lock',
                titulo: 'Conectividade segura',
                itens: [
                    'MQTT sobre TLS com CA própria ou pacote de CAs públicas',
                    'TLS mútuo opcional, com certificado e chave do cliente',
                    'Protocolo nativo do ChirpStack v4, em JSON ou Protobuf',
                    'Packet forwarder UDP da Semtech (porta 1700) para ChirpStack v3 e outros servidores',
                    'Gateway EUI automático (MAC do Wi-Fi + FFFE), com opção manual'
                ]
            },
            {
                icone: 'pi pi-desktop',
                titulo: 'Página web e app',
                itens: [
                    'Página em português, tema claro e escuro, layout para celular',
                    'Status, GPS, logs, diagnósticos de rede e página das Classes LoRaWAN',
                    'Exportar e importar a configuração em JSON e restaurar o padrão de fábrica',
                    'Login configurável (padrão admin / lorawan101) e aviso de alterações não salvas',
                    'App Android em Flutter com as mesmas telas, achado por mDNS (S3) ou varredura'
                ]
            },
            {
                icone: 'pi pi-cog',
                titulo: 'Operação e confiabilidade',
                itens: [
                    'Watchdog do SX1301: reinicia só o concentrador em ~2 s, com Wi-Fi, MQTT e página no ar',
                    'Diagnóstico da fiação do SX1301 quando o concentrador não inicia',
                    'Soft AP lorawan-gateway-sx1301 pelo botão BOOT, para configuração e recuperação',
                    'Console serial com config, mqtt, mqtt_cert, web_auth, gps, pkt_fwd e factory_reset',
                    'Um só código-fonte para as três placas ESP32, escolhida no build'
                ]
            }
        ],
        web: telasWebGateway('gw-sx1301', 'SX1301'),
        app: telasAppGateway('gw-sx1301', 'lorawan-gateway-sx1301'),
        comandos: [
            { comando: 'mqtt --format chirpstack --encoding json', descricao: 'ChirpStack v4 nativo, em JSON' },
            { comando: 'gps', descricao: 'posição, satélites e frases NMEA do GPS da placa' },
            { comando: 'config --region au915_sb1 --reboot', descricao: 'plano AU915 sub-banda 1 e reinício' },
            { comando: 'web_auth --reset', descricao: 'volta o login da página para admin / lorawan101' },
            { comando: 'factory_reset --yes', descricao: 'apaga a configuração e reinicia em Soft AP' }
        ],
        ligacoes: ligacoesGateway('gw-sx1301', 'Radioenge LoRaWAN Gateway')
    },
    {
        id: 'sx1302',
        rotulo: 'ESP32 + SX1302',
        nome: 'Gateway ESP32 with SX1302',
        codinome: 'ESP32_SX1302 · v0.0.1',
        subtitulo: 'Gateway LoRaWAN de 8 canais, de baixo custo, com firmware próprio',
        descricao:
            'Um gateway LoRaWAN completo sobre o ESP32 e o concentrador Semtech SX1302 (Elecrow LR1302 HAT). Portei a SX1302_HAL 2.1.0 para o ESP-IDF e desenvolvi por cima dela tudo o que um gateway profissional precisa: MQTT seguro, protocolo nativo do ChirpStack v4, GPS, página web completa, logs ao vivo, diagnósticos, console de administração e app Android. Não há outro processador no gateway.',
        status: 'Em operação',
        severidade: 'success',
        endereco: '192.168.18.101',
        hardware: [
            { rotulo: 'Microcontrolador', valor: 'ESP32-WROOM-32U · ESP32-S3-WROOM-1U-N16R8 · ESP32-S3-WROOM-2-N32R16V', icone: 'pi pi-microchip' },
            { rotulo: 'Concentrador', valor: 'Semtech SX1302 + SX1250 (Elecrow LR1302 HAT)', icone: 'pi pi-wave-pulse' },
            { rotulo: 'Temperatura', valor: 'STTS751 no I²C para compensar o RSSI', icone: 'pi pi-sun' },
            { rotulo: 'Barramento', valor: 'SPI dedicado (VSPI no ESP32 · FSPI no S3)', icone: 'pi pi-arrows-h' },
            { rotulo: 'Firmware', valor: 'ESP-IDF v5.5 / v6.x · FreeRTOS · C', icone: 'pi pi-code' },
            { rotulo: 'Conectividade', valor: 'Wi-Fi com antena externa (u.FL) · GPS do HAT', icone: 'pi pi-wifi' }
        ],
        stack: ['ESP32 / ESP32-S3', 'ESP-IDF', 'FreeRTOS', 'SX1302_HAL 2.1.0', 'MQTT/TLS', 'Protobuf', 'ChirpStack v4', 'AU915', 'Flutter'],
        funcionalidades: [
            {
                icone: 'pi pi-wave-pulse',
                titulo: 'Rádio e LoRaWAN',
                itens: [
                    'Recepção em 8 canais multi-SF + canal LoRa de serviço + FSK',
                    'Planos AU915 sub-bandas 0 e 1 (padrão), US915, EU868 e CN470',
                    'Fila JIT de downlinks: Classe A (RX1/RX2) e Classe C (imediato), atendendo nós A, B e C',
                    'Compensação de RSSI pela temperatura do concentrador',
                    'GPS do HAT ligado e desligado sem reiniciar, com a posição enviada ao ChirpStack'
                ]
            },
            {
                icone: 'pi pi-lock',
                titulo: 'Conectividade segura',
                itens: [
                    'MQTT sobre TLS com CA própria ou pacote de CAs públicas',
                    'TLS mútuo opcional, com certificado e chave do cliente',
                    'Protocolo nativo do ChirpStack v4, em JSON ou Protobuf, trocado ao vivo',
                    'Packet forwarder UDP da Semtech para ChirpStack v3 e outros servidores',
                    'Gateway EUI automático (MAC do Wi-Fi + FFFE), com opção manual'
                ]
            },
            {
                icone: 'pi pi-desktop',
                titulo: 'Página web e app',
                itens: [
                    'Página em português, tema claro e escuro, layout para celular',
                    'Status, logs, diagnósticos de rede e página das Classes LoRaWAN',
                    'Exportar e importar a configuração em JSON e restaurar o padrão de fábrica',
                    'Login configurável (padrão admin / lorawan101) e aviso de alterações não salvas',
                    'App Android em Flutter com as mesmas telas, achado por mDNS (S3) ou varredura'
                ]
            },
            {
                icone: 'pi pi-cog',
                titulo: 'Operação e confiabilidade',
                itens: [
                    'Watchdog do SX1302: reinicia só o concentrador em ~2 s, com Wi-Fi, MQTT e página no ar',
                    'Diagnóstico automático da fiação SPI quando o concentrador não inicia',
                    'Soft AP lorawan-gateway-sx1302 pelo botão BOOT, para configuração e recuperação',
                    'Console serial com config, mqtt, mqtt_cert, web_auth, gps, pkt_fwd e factory_reset',
                    'Um só código-fonte para as três placas ESP32, escolhida no build'
                ]
            }
        ],
        web: telasWebGateway('gw-sx1302', 'SX1302'),
        app: telasAppGateway('gw-sx1302', 'lorawan-gateway-sx1302'),
        comandos: [
            { comando: 'mqtt --format chirpstack --encoding protobuf', descricao: 'ChirpStack v4 nativo, em Protobuf' },
            { comando: 'gps on', descricao: 'liga o GPS do HAT na hora e grava na NVS' },
            { comando: 'config --ip-mode static --ip 192.168.18.101 --reboot', descricao: 'IP fixo e reinício' },
            { comando: 'web_auth --reset', descricao: 'volta o login da página para admin / lorawan101' },
            { comando: 'factory_reset --yes', descricao: 'apaga a configuração e reinicia em Soft AP' }
        ],
        ligacoes: ligacoesGateway('gw-sx1302', 'Elecrow LR1302 HAT')
    }
];

/* ---------------------------------------------------------------------------
 *  NÓS LORAWAN: telas da página web e do app Android
 * ------------------------------------------------------------------------- */

export interface NoLorawan {
    id: 'esp32' | 'radioenge';
    rotulo: string;
    nome: string;
    resumo: string;
    /** Texto da barra de endereço da moldura do navegador. */
    endereco: string;
    especificacoes: { rotulo: string; valor: string }[];
    funcionalidades: string[];
    web: TelaDispositivo[];
    app: TelaDispositivo[];
    ligacoes: Ligacao[];
}

export const NOS_LORAWAN: NoLorawan[] = [
    {
        id: 'esp32',
        rotulo: 'ESP32 + RFM95W',
        nome: 'Nó LoRaWAN ESP32 + RFM95W (ABP e OTAA)',
        resumo: 'O ESP32 entra no Wi-Fi e serve a própria página de configuração: basta abrir o IP do nó no navegador, ou achá-lo pelo app, para ver todo o funcionamento LoRaWAN ao vivo. São dois firmwares, um para OTAA e outro para ABP, com a mesma interface.',
        endereco: '192.168.18.101',
        especificacoes: [
            { rotulo: 'Microcontrolador', valor: 'ESP32-WROOM-32U · ESP32-S3-WROOM-1U-N16R8 · ESP32-S3-WROOM-2-N32R16V' },
            { rotulo: 'Rádio', valor: 'HopeRF RFM95W (Semtech SX1276), 915 MHz' },
            { rotulo: 'Pilha LoRaWAN', valor: 'MCCI LMiC 6.0.1 (OTAA) e 3.3.0 (ABP), com HAL própria para o ESP-IDF' },
            { rotulo: 'Ativação', valor: 'OTAA e ABP (dois firmwares) · AU915 sub-banda 1 · Classe A' },
            { rotulo: 'Acesso', valor: 'Página web embarcada, app Android, console e Soft AP lorawan-node-otaa / lorawan-node-abp' }
        ],
        funcionalidades: [
            'Status a cada 5 s: sessão, FCnt, downlinks, memória e sinal do Wi-Fi',
            'Chaves de sessão na ordem DevAddr, NwkSKey e AppSKey, com botão Copiar',
            'Logs com o Frame raw, os contadores e o MIC de cada envio',
            'Ping, Traceroute e Nslookup feitos pelo próprio nó',
            'Reset remoto por downlink e watchdog do rádio sem perder a sessão',
            'Configuração na NVS, aplicada sem reiniciar, e Soft AP pelo botão BOOT'
        ],
        web: [
            {
                id: 'status',
                rotulo: 'Status',
                titulo: 'Status e chaves de sessão',
                descricao: 'Sessão LoRaWAN, contadores, downlinks, memória e Wi-Fi atualizados a cada 5 segundos, com as chaves da sessão e o botão Copiar em cada valor.',
                imagem: '/iot/no-esp32/web-status.webp'
            },
            { id: 'otaa', rotulo: 'Ativação OTAA', titulo: 'Ativação OTAA', descricao: 'DevEUI (com o botão “Do MAC”), JoinEUI e AppKey, mostrando a ordem dos bytes que o ChirpStack vai receber.', imagem: '/iot/no-esp32/web-ativacao-otaa.webp' },
            { id: 'abp', rotulo: 'Ativação ABP', titulo: 'Ativação ABP', descricao: 'No firmware ABP, DevAddr, NetID, NwkSKey e AppSKey copiados do ChirpStack, com o FCnt guardado na NVS.', imagem: '/iot/no-esp32/web-ativacao-abp.webp' },
            { id: 'radio', rotulo: 'Rádio LoRa', titulo: 'Rádio LoRa e plano AU915', descricao: 'Sub-banda, data rate, potência, ADR e janelas de recepção, validados antes de salvar.', imagem: '/iot/no-esp32/web-radio.webp' },
            {
                id: 'uplink',
                rotulo: 'Uplink',
                titulo: 'Uplink com tempo no ar',
                descricao: 'Intervalo, FPort, confirmação e payload em texto ou hexadecimal, com o cálculo do tempo no ar e da ocupação do canal.',
                imagem: '/iot/no-esp32/web-uplink.webp'
            },
            {
                id: 'reset',
                rotulo: 'Reset remoto',
                titulo: 'Reset remoto por downlink',
                descricao: 'FPort, bytes do comando e espera configuráveis: o nó reinicia quando o ChirpStack envia o quadro certo.',
                imagem: '/iot/no-esp32/web-reset-remoto.webp'
            },
            { id: 'logs', rotulo: 'Logs', titulo: 'Logs ao vivo', descricao: 'A saída do firmware no navegador, com filtro, pausa, cores por tipo de evento e download.', imagem: '/iot/no-esp32/web-logs.webp' },
            { id: 'diag', rotulo: 'Diagnósticos', titulo: 'Diagnósticos de rede', descricao: 'Ping, Traceroute e Nslookup executados pelo próprio ESP32 até o servidor ChirpStack.', imagem: '/iot/no-esp32/web-diagnosticos.webp' },
            { id: 'classes', rotulo: 'Classes', titulo: 'Classes LoRaWAN explicadas', descricao: 'Uma página que mostra, com animação, quando o nó escuta o rádio em cada classe (A, B e C).', imagem: '/iot/no-esp32/web-classes.webp' },
            { id: 'escuro', rotulo: 'Tema escuro', titulo: 'Tema claro e escuro', descricao: 'O mesmo painel no tema escuro, que acompanha o sistema operacional.', imagem: '/iot/no-esp32/web-status-escuro.webp' },
            { id: 'celular', rotulo: 'No celular', titulo: 'Layout para o celular', descricao: 'No celular o menu vira uma fileira de atalhos, e as chaves de sessão continuam inteiras, com o botão Copiar.', imagem: '/iot/no-esp32/web-celular.webp' }
        ],
        app: [
            { id: 'lista', rotulo: 'Dispositivos', titulo: 'Nós encontrados na rede', descricao: 'Por mDNS e varredura da sub-rede.', imagem: '/iot/no-esp32/app-lista.webp' },
            { id: 'softap', rotulo: 'Soft AP', titulo: 'Primeira configuração', descricao: 'Pela rede lorawan-node-otaa.', imagem: '/iot/no-esp32/app-softap.webp' },
            { id: 'login', rotulo: 'Login', titulo: 'Login', descricao: 'Mesmo usuário e senha da página.', imagem: '/iot/no-esp32/app-login.webp' },
            { id: 'status', rotulo: 'Status', titulo: 'Status', descricao: 'Os mesmos indicadores da página web.', imagem: '/iot/no-esp32/app-status.webp' },
            { id: 'chaves', rotulo: 'Chaves', titulo: 'Chaves de sessão', descricao: 'DevAddr, NwkSKey e AppSKey com Copiar.', imagem: '/iot/no-esp32/app-chaves.webp' },
            { id: 'config', rotulo: 'OTAA', titulo: 'Ativação OTAA', descricao: 'DevEUI, JoinEUI e AppKey validados.', imagem: '/iot/no-esp32/app-config.webp' },
            { id: 'abp', rotulo: 'ABP', titulo: 'Ativação ABP', descricao: 'DevAddr, NetID e chaves de sessão.', imagem: '/iot/no-esp32/app-config-abp.webp' },
            { id: 'logs', rotulo: 'Logs', titulo: 'Logs', descricao: 'Eventos do LMiC com MIC e FCnt.', imagem: '/iot/no-esp32/app-logs.webp' },
            { id: 'diag', rotulo: 'Diagnóst.', titulo: 'Diagnósticos', descricao: 'Ping, Traceroute e Nslookup.', imagem: '/iot/no-esp32/app-diagnosticos.webp' },
            { id: 'manutencao', rotulo: 'Manutenção', titulo: 'Manutenção', descricao: 'Exportar, importar e restaurar.', imagem: '/iot/no-esp32/app-manutencao.webp' }
        ],
        ligacoes: [
            { id: 'esp32', rotulo: 'ESP32-WROOM-32U', imagem: '/iot/no-esp32/ligacoes.webp', legenda: 'ESP32-WROOM-32U DevKit ↔ RFM95W' },
            { id: 'n16r8', rotulo: 'ESP32-S3 N16R8', imagem: '/iot/no-esp32/ligacoes-esp32s3-n16r8.webp', legenda: 'ESP32-S3-WROOM-1U-N16R8 DevKit ↔ RFM95W' },
            { id: 'n32r16v', rotulo: 'ESP32-S3 N32R16V', imagem: '/iot/no-esp32/ligacoes-esp32s3-n32r16v.webp', legenda: 'ESP32-S3-WROOM-2-N32R16V DevKit ↔ RFM95W' }
        ]
    },
    {
        id: 'radioenge',
        rotulo: 'Radioenge STM32',
        nome: 'Nó LoRaWAN Radioenge (STM32 + SX1272) · ABP e OTAA',
        resumo: 'O módulo nacional da Radioenge ganhou um firmware novo, escrito sobre a LoRaMac-node, com ABP e OTAA no mesmo binário. Como o módulo não tem Wi-Fi, a página web e o app falam com ele pela serial: cabo USB no computador, OTG no celular ou Bluetooth.',
        endereco: 'Web Serial · USB-serial 067b:2303',
        especificacoes: [
            { rotulo: 'Microcontrolador', valor: 'STM32L071CZ (Cortex-M0+, 192 KB de flash, 20 KB de RAM)' },
            { rotulo: 'Rádio', valor: 'Semtech SX1272 no módulo Radioenge LoRaWAN EndDevice' },
            { rotulo: 'Pilha LoRaWAN', valor: 'LoRaMac-node 4.7.1 · LoRaWAN 1.0.4 · RP002-1.0.3' },
            { rotulo: 'Ativação', valor: 'ABP e OTAA no mesmo firmware, trocados por AT+NJM sem regravar' },
            { rotulo: 'Acesso', valor: 'Web Serial, Web Bluetooth, app Android e comandos AT' }
        ],
        funcionalidades: [
            'Classes A, B e C trocadas pelo console, pela página ou por downlink',
            'Todos os comandos AT do firmware de fábrica, com as mesmas respostas',
            'Diagnóstico de sessão: DevAddr, NwkSKey, AppSKey, Frame raw, FCnt e MIC',
            'Modo STOP entre eventos, com a UART acordando o MCU para o console',
            'Configuração, sessão e DevNonce guardados na EEPROM do STM32',
            'Watchdog do rádio, autoteste no firmware e log em RAM com download'
        ],
        web: [
            {
                id: 'conectar',
                rotulo: 'Conectar',
                titulo: 'Conectar pelo navegador',
                descricao: 'A página fala direto com o console do firmware, por USB-serial (Web Serial) ou Bluetooth (Web Bluetooth). Nada é instalado.',
                imagem: '/iot/no-radioenge/web-conectar.webp'
            },
            {
                id: 'status',
                rotulo: 'Status OTAA',
                titulo: 'Status do nó em OTAA',
                descricao: 'Sessão, classe, tráfego, relógio do módulo, modo de energia e VDD, com as chaves de sessão e as ações Enviar agora e Refazer JOIN.',
                imagem: '/iot/no-radioenge/web-status.webp'
            },
            {
                id: 'status-abp',
                rotulo: 'Status ABP',
                titulo: 'O mesmo módulo em ABP',
                descricao: 'Com AT+NJM=0 o firmware passa a ABP e a página mostra a sessão pré-provisionada, sem regravar nada.',
                imagem: '/iot/no-radioenge/web-status-abp.webp'
            },
            { id: 'ativacao', rotulo: 'Ativação OTAA', titulo: 'Ativação OTAA', descricao: 'DevEUI gerado do ID único do STM32 (ou fixo), JoinEUI e AppKey, cada valor com Copiar.', imagem: '/iot/no-radioenge/web-ativacao.webp' },
            { id: 'ativacao-abp', rotulo: 'Ativação ABP', titulo: 'Ativação ABP', descricao: 'DevAddr, NetID, NwkSKey e AppSKey com Copiar. Ao salvar, o nó reinicia a sessão na outra ativação.', imagem: '/iot/no-radioenge/web-ativacao-abp.webp' },
            { id: 'logs', rotulo: 'Logs', titulo: 'Logs do nó', descricao: 'Tudo o que o nó imprime ([TX], [RX], [JOIN], [Classe]...) e o log que o firmware guarda em RAM, com o tempo desde que ligou.', imagem: '/iot/no-radioenge/web-logs.webp' },
            {
                id: 'diag',
                rotulo: 'Diagnósticos',
                titulo: 'Diagnósticos',
                descricao: 'Autoteste do firmware (rádio, EEPROM, sessão, relógio, VDD) e Ping, Traceroute e Nslookup feitos pelo computador.',
                imagem: '/iot/no-radioenge/web-diagnosticos.webp'
            },
            { id: 'classes', rotulo: 'Classes', titulo: 'Classes A, B e C', descricao: 'A mesma explicação animada dos nós ESP32, aqui com a troca de classe valendo de verdade no módulo.', imagem: '/iot/no-radioenge/web-classes.webp' },
            { id: 'manutencao', rotulo: 'Manutenção', titulo: 'Manutenção', descricao: 'Exportar e importar a configuração e restaurar o padrão de fábrica do módulo.', imagem: '/iot/no-radioenge/web-manutencao.webp' }
        ],
        app: [
            { id: 'conectar', rotulo: 'Conectar', titulo: 'USB OTG ou Bluetooth', descricao: 'Adaptador USB-serial no cabo OTG ou módulo BLE-serial.', imagem: '/iot/no-radioenge/app-conectar.webp' },
            { id: 'status', rotulo: 'Status', titulo: 'Status', descricao: 'Sessão, classe, tráfego e módulo.', imagem: '/iot/no-radioenge/app-status.webp' },
            { id: 'logs', rotulo: 'Logs', titulo: 'Logs com Frame raw', descricao: 'Quadro, contadores e MIC de cada envio.', imagem: '/iot/no-radioenge/app-logs.webp' }
        ],
        ligacoes: [
            { id: 'pl2303', rotulo: 'Cabo PL2303', imagem: '/iot/no-radioenge/ligacoes.webp', legenda: 'Cabo USB-serial PL2303 de 4 fios no módulo Radioenge' },
            { id: 'usb-serial', rotulo: 'Adaptador USB-serial', imagem: '/iot/no-radioenge/ligacoes-usb-serial.webp', legenda: 'Adaptador USB-serial externo (CP2102, CH340, FTDI) no console do módulo' },
            { id: 'stlink', rotulo: 'ST-LINK (gravação)', imagem: '/iot/no-radioenge/ligacoes-stlink.webp', legenda: 'Gravação pelo SWD com ST-LINK V2 e console na UART ao mesmo tempo' }
        ]
    }
];

export interface CapturaReal {
    imagem: string;
    titulo: string;
    descricao: string;
}

/** Capturas reais de bancada (as chaves de sessão do dispositivo real ficam ocultas). */
export const CAPTURAS_REAIS: CapturaReal[] = [
    {
        imagem: '/iot/capturas/no-esp32-logs-frame-raw.webp',
        titulo: 'Nó ESP32 · logs com o Frame raw',
        descricao: 'Cada envio mostra o DevAddr, o quadro cifrado que foi ao ar, os contadores e o MIC: o necessário para conferir um pacote no ChirpStack byte a byte.'
    },
    {
        imagem: '/iot/capturas/no-radioenge-logs-join.webp',
        titulo: 'Nó Radioenge · JOIN aceito pelo ChirpStack',
        descricao: 'Join-requests em canais diferentes até o Join-accept, a sessão nova e os primeiros uplinks em AU915, vistos pela página que conversa com o módulo pela USB.'
    },
    {
        imagem: '/iot/capturas/chirpstack-gateway-mapa-gps.webp',
        titulo: 'Gateway SX1302 · posição pelo GPS no ChirpStack',
        descricao: 'O gateway em Tianguá-CE no mapa do meu ChirpStack v4, com a localização enviada pelo GPS do HAT nas estatísticas MQTT.'
    }
];

/* ---------------------------------------------------------------------------
 *  PLACAS PERSONALIZADAS · PROCESSO · APLICAÇÕES · FAQ
 * ------------------------------------------------------------------------- */

export interface EtapaIot {
    icone: string;
    titulo: string;
    descricao: string;
}

export const ETAPAS_HARDWARE: EtapaIot[] = [
    { icone: 'pi pi-lightbulb', titulo: 'Ideia e requisitos', descricao: 'O que medir, onde instalar, como alimentar e com que frequência enviar dados.' },
    { icone: 'pi pi-bolt', titulo: 'Prova de conceito', descricao: 'Montagem com módulos de desenvolvimento para validar sensores, alcance e consumo.' },
    { icone: 'pi pi-pencil', titulo: 'Esquemático e PCB', descricao: 'Placa própria, compacta e adequada ao ambiente, com proteções e conectores certos.' },
    { icone: 'pi pi-check-square', titulo: 'Firmware e testes de campo', descricao: 'Código final, testes de bancada e medições reais de cobertura e bateria.' },
    { icone: 'pi pi-box', titulo: 'Lote piloto e rede no ar', descricao: 'Primeiras unidades instaladas, cadastradas no ChirpStack e enviando dados ao painel.' }
];

export interface Aplicacao {
    icone: string;
    titulo: string;
    descricao: string;
}

export const APLICACOES_IOT: Aplicacao[] = [
    { icone: 'pi pi-sun', titulo: 'Agronegócio', descricao: 'Umidade do solo, estações meteorológicas, irrigação e nível de reservatórios.' },
    { icone: 'pi pi-bolt', titulo: 'Energia', descricao: 'Medição de consumo, qualidade de energia e leitura remota de medidores.' },
    { icone: 'pi pi-building', titulo: 'Indústria', descricao: 'Temperatura, vibração e estado de máquinas, com alertas antes da parada.' },
    { icone: 'pi pi-truck', titulo: 'Rastreamento', descricao: 'Localização de ativos, veículos e equipamentos em áreas extensas.' },
    { icone: 'pi pi-home', titulo: 'Condomínios e cidades', descricao: 'Água, iluminação, vagas e sensores ambientais em larga escala.' },
    { icone: 'pi pi-box', titulo: 'Cadeia do frio', descricao: 'Temperatura de câmaras, freezers e transporte, com histórico auditável.' }
];

export const STACK_IOT: string[] = [
    'ESP32 / ESP32-S3',
    'STM32L0',
    'ESP-IDF',
    'FreeRTOS',
    'C / C++',
    'Semtech SX1301 / SX1302',
    'SX1276 / SX1272',
    'MCCI LMiC',
    'LoRaMac-node',
    'Web Serial · Web Bluetooth',
    'LoRaWAN',
    'ChirpStack v3 / v4',
    'MQTT · TLS',
    'Protobuf',
    'Modbus-RTU',
    'Kubernetes',
    'Spring Boot',
    'Angular',
    'Flutter'
];

export interface PerguntaIot {
    pergunta: string;
    resposta: string;
}

export const PERGUNTAS_IOT: PerguntaIot[] = [
    {
        pergunta: 'O que é LoRaWAN e por que usar?',
        resposta:
            'É uma tecnologia de rádio de longo alcance e baixíssimo consumo, feita para sensores que enviam poucos dados com frequência. Um único gateway cobre uma área de vários quilômetros, e os dispositivos podem funcionar por anos com bateria — sem chip de celular e sem mensalidade por sensor.'
    },
    {
        pergunta: 'Preciso de internet em cada sensor?',
        resposta: 'Não. Os sensores falam por rádio com o gateway; só o gateway precisa de internet (Wi-Fi ou cabo). A partir dele, os dados seguem criptografados até o servidor e chegam ao painel.'
    },
    {
        pergunta: 'Qual é o alcance de um gateway?',
        resposta:
            'Depende do relevo, da altura e da qualidade da antena. Em área aberta, com a antena bem posicionada, a cobertura chega a vários quilômetros; em área urbana densa, menos. Por isso faço um estudo de cobertura antes de definir quantos gateways instalar.'
    },
    {
        pergunta: 'A rede fica sob o controle da minha empresa?',
        resposta: 'Sim. Diferente de redes públicas, a rede é sua: gateways, servidor ChirpStack e dados. O servidor pode rodar no meu cluster Kubernetes ou na infraestrutura da sua empresa.'
    },
    {
        pergunta: 'Dá para usar módulos nacionais, homologados pela ANATEL?',
        resposta:
            'Sim. Tenho firmware próprio para o módulo LoRaWAN EndDevice da Radioenge (STM32 + SX1272), que mantém os comandos AT de fábrica e acrescenta ABP e OTAA no mesmo binário, as Classes A, B e C, página web e app. Também portei a pilha SX1301 da Semtech para o ESP32 para usar a placa de gateway da Radioenge (RD43HAT / RD43HATGPS), em fase de validação em bancada. E trabalho com módulos importados, como o RFM95W e o LR1302.'
    },
    {
        pergunta: 'Como eu acompanho os dispositivos no dia a dia?',
        resposta:
            'Cada gateway e cada nó tem uma página web e um app Android com status, logs ao vivo e diagnósticos de rede. Os dados chegam ao ChirpStack e dele aos painéis da aplicação. Em campo, o técnico liga o celular no dispositivo — pelo Wi-Fi, pelo cabo USB OTG ou por Bluetooth — e vê o mesmo que você vê no escritório.'
    },
    {
        pergunta: 'Vocês desenvolvem a placa ou eu preciso comprar um equipamento pronto?',
        resposta: 'Os dois caminhos são possíveis. Quando existe um sensor comercial adequado, integro-o à rede. Quando a ideia exige algo específico, desenvolvo a placa sob medida — do esquemático ao firmware — junto com a rede e o painel.'
    }
];
