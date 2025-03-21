const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'polaznik', component: () => import('pages/PolaznikPage.vue') },
      { path: 'administrator', component: () => import('pages/AdministratorPage.vue') },
      { path: 'nastavnik', component: () => import('pages/NastavnikPage.vue') },
      { path: 'postavke', component: () => import('pages/PostavkePage.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
