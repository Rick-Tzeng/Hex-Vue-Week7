import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: '後台登入頁面',
    component: () => import('../views/SignInView.vue'),
  },
  {
    path: '/admin',
    name: '管理者首頁',
    component: () => import('../views/AdminView.vue'),
    children: [
      {
        path: 'products',
        name: '產品列表',
        component: () => import('../views/ProductsView.vue'),
      },
      {
        path: 'orders',
        name: '訂單列表',
        component: () => import('../views/OrdersView.vue'),
      },
      {
        path: 'coupons',
        name: '優惠券列表',
        component: () => import('../views/CouponsView.vue'),
      },
      {
        path: 'articles',
        name: '貼文列表',
        component: () => import('../views/ArticlesView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404頁面',
    component: () => import('../views/NotFound.vue'),
  },
  {
    path: '/admin/:pathMatch(.*)*',
    name: '重新導向',
    redirect: {
      name: '管理者首頁',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    if (to.fullPath.match('products')) {
      return {
        top: 0,
      };
    }
    return {};
  },
  linkExactActiveClass: 'active',
});

export default router;
