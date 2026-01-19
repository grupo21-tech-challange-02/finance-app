export const routes = [
  {
    path: '/dashboard',
    name: 'Início',
    component: () => import('@/app/Inicio/page'),
  },
  {
    path: '/transacoes',
    name: 'Transações',
    component: () => import('@/app/Transacoes/page'),
  },
  {
    path: '/analises',
    name: 'Análises',
    component: () => import('@/app/Analises/page'),
  },
];