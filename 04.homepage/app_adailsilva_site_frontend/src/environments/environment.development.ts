// Perfil development: ng serve local (porta 4401), sem otimização.
export const environment = {
    production: false,
    staging: false,
    /** Endereço público do site neste perfil (links absolutos). */
    siteUrl: 'http://localhost:4401',
    /** false = a página pede aos buscadores para não indexar (robots noindex). */
    indexar: false,
    appName: 'Adail Silva · Da Sua Ideia ao Kubernetes',
    version: '1.0.0'
};
