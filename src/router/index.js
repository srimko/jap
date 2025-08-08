import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sm2',
      name: 'sm2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SM2view.vue'),
    },
    {
      path: '/transcriptions',
      name: 'transcriptions',
      component: () => import('../views/TranscriptionsView.vue'),
    },
    {
      path: '/podcasts',
      name: 'podcasts',
      component: () => import('../views/PodcastsView.vue'),
    },
    {
      path: '/hiragana',
      name: 'hiragana',
      component: () => import('../views/HiraganaView.vue'),
    },
  ],
})

export default router
