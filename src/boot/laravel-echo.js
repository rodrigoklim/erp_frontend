import Echo from 'laravel-echo'

window.Pusher = require('pusher-js')

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '767abfc5a6bb0acfa545',
  cluster: 'us2',
  forceTLS: false,
  disableStats: true
})

export default async ({ Vue }) => {
}
