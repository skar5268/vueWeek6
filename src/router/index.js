import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue'),
  },
  {
    path: '/carts',
    name: 'Carts',
    component: () => import('../views/Carts.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '/admin/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue'),
      },
      {
        path: '/admin/bgProducts',
        name: 'BgProducts',
        component: () => import('../views/BgProducts.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Home',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});
export default router;
