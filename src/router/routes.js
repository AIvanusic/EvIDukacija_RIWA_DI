const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/polaznik',
    component: () => import('pages/PolaznikPage.vue'), // ruta za otvaranje stranice namijenjene polazniku
  },

  {
    path: '/administrator',
    component: () => import('pages/AdministratorPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
