<template>
  <div class="route">
    <q-page class="flex">
      <div class="row fit justify-center items-center content-start">
        <div class="col-11 q-mt-md q-mb-md">
          <q-card
            dark
            class="full-width"
            style="border-radius: 2em; overflow: inherit !important; color:white; opacity:0.75; font-family: poppins; font-weight: 200"
          >
            <q-card-section>
              <div class="row">
                <div class="col-3">
                  <div
                    class="text-h4"
                    style="color: #4DA3FE"
                  >Rotas</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center">
              <div class="col-11 q-pa-none">
                <q-calendar
                  v-model="selectedDate"
                  view="week-agenda"
                  dark
                  locale="pt-br"
                  no-scroll
                  bordered
                  class="q-pa-sm"
                  style="min-height: 500px;"
                >
                  <template #day-body="{ timestamp }">
                    <template
                      v-for="(agenda) in getAgenda(timestamp.date)"
                      class="justify-start q-ma-sm q-mb-none shadow-5"
                    >
                      <div
                        :key="index"
                        v-for="(event, index) in agenda"
                        class="row justify-center q-pa-sm"
                        style="margin-top: 30px; width: 100%;"
                      >
                        <q-card
                          :class="event.color"
                          :key="index"
                        >
                          <q-card-section>
                            <strong>{{ event.label }}</strong>
                          </q-card-section>
                        </q-card>

                      </div>
                    </template>
                  </template>
                </q-calendar>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'Route',
  data () {
    return {
      selectedDate: '',
      val: [],
      agenda: {}
    }
  },
  methods: {
    getAgenda (day) {
      const c = this.agenda
      const event = {}
      Object.keys(c).forEach((i) => {
        if (c[i].date === day) {
          if (!event[parseInt(c[i].weekday, 10)]) {
            event[parseInt(c[i].weekday, 10)] = []
          }
          event[parseInt(c[i].weekday, 10)].push(c[i])
        }
      })
      return event
    }
  },
  mounted () {
    const url = '/route/list'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      console.log(response.data)
      this.agenda = response.data
    }).catch(error => {
      if (error.response) {
        this.handleError()
        this.submitting = false
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        this.handleError()
        this.submitting = false
        console.log(error.request)
      } else {
        // Something happened in setting up the request and triggered an Error
        this.handleError()
        console.log('Error', error.message)
      }
    })
  },
  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      console.log('ol')
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    }
  }
}
</script>

<style>
</style>