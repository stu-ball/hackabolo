
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Broadcast.vue') },
      {
        path: '/bolos',
        component: () => import('pages/Bolo.vue')
      },
      {
        path: '/management',
        component: () => import('pages/Management.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
