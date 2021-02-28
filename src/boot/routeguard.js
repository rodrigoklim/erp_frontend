import { SessionStorage } from 'quasar'

export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    const value = SessionStorage.getItem('logged')
    if (value !== 'true' && to.fullPath !== '/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  })
}