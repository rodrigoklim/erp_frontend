
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/clientes', component: () => import('pages/Costumer.vue') },
      { path: '/produtos', component: () => import('pages/Products.vue') },
      { path: '/veiculos', component: () => import('pages/Vehicles.vue') },
      { path: '/pre-venda', component: () => import('pages/PreSell.vue') },
      { path: '/rotas', component: () => import('pages/Route.vue') },
      { path: '/nova/rota/:props', component: () => import('pages/CreateRoute.vue') },
      { path: '/nova/rota/checklist/carga/:props', component: () => import('pages/ChecklistCarga.vue') },
      { path: '/entregas', component: () => import('pages/DeliveryFollowUp.vue') }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
