import { Routes } from '@angular/router';
import { SiteLayout } from '@/app/layout/site-layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: SiteLayout,
        children: [
            {
                path: '',
                title: 'Adail Silva · Sistemas web completos para gestão empresarial',
                loadComponent: () => import('@/app/pages/home/home').then((c) => c.Home)
            },
            {
                path: 'iot',
                title: 'IoT e LoRaWAN · Gateways, placas e ChirpStack em Kubernetes · Adail Silva',
                loadComponent: () => import('@/app/pages/iot/iot').then((c) => c.Iot)
            },
            {
                path: 'infraestrutura',
                title: 'Infraestrutura · Cluster Kubernetes · Adail Silva',
                loadComponent: () => import('@/app/pages/infraestrutura/infraestrutura').then((c) => c.Infraestrutura)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
