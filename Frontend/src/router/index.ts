import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import SearchView from '../views/SearchView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ApiView from '../views/ApiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/:Eponymo/:Onoma/:Patronymo',
      name: 'User',
      component: UserView,
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchView,
    },
    {
      path: '/apiDoc',
      name: 'Api',
      component: ApiView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
