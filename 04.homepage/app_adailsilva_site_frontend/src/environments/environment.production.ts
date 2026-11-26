// Perfil production: imagem Nginx publicada no cluster.
export const environment = {
    production: true,
    staging: false,
    /** Endereço público do site neste perfil (links absolutos). */
    siteUrl: 'https://k8s.adailsilva.com.br',
    /** false = a página pede aos buscadores para não indexar (robots noindex). */
    indexar: true,
    appName: 'Adail Silva · Da Sua Ideia ao Kubernetes',
    version: '1.0.0'
};
