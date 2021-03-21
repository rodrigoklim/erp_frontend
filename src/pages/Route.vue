<template>
  <div class="route">
    <q-page class="flex">
      <div class="row fit justify-center items-center content-start">
        <div class="col-11 q-mt-md q-mb-md">
          <q-card
            dark
            class="full-width"
            style="border-radius: 2em; overflow: inherit !important; color:white; opacity:0.75; font-family: poppins; font-weight: 300"
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
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-10 q-pa-none">
                <q-calendar
                  ref="calendar"
                  v-model="selectedDate"
                  view="week-agenda"
                  dark
                  locale="pt-br"
                  no-scroll
                  bordered
                  animated
                  transition-prev="slide-right"
                  transition-next="slide-left"
                  class="q-pa-sm"
                  style="min-height: 550px;"
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
                          <!-- presell element -->
                          <div
                            class="row  q-pb-md"
                            v-if="event.route === undefined"
                          >
                            <div class="col-2 q-mt-none items-start">
                              <q-checkbox
                                v-model="val"
                                :val="event"
                                color:white
                              ></q-checkbox>
                            </div>
                            <div
                              class="col-8 q-ml-md q-mt-none items-start"
                              style="font-size:14px"
                            >
                              <strong>{{ event.label }}</strong>
                              <div class="row">
                                <div class="text-muted q-ma-none q-pa-none "><small>{{event.zone}}</small></div>
                              </div>
                            </div>
                          </div>
                          <!-- route element -->
                          <div
                            class="row  q-pb-sm"
                            v-else
                          >
                            <div class="row q-pb-sm">
                              <div class="col-2 q-mt-none items-start">
                                <q-checkbox
                                  v-model="val"
                                  :val="event"
                                  color:white
                                ></q-checkbox>
                              </div>
                              <div
                                class="col-8 q-ml-md q-mt-none items-start"
                                style="font-size:14px"
                              >
                                <div>
                                  <div class="row q-pa-none">
                                    <strong>Rota #{{event.route}}</strong>
                                  </div>
                                  <div class="row">
                                    <div class="text-muted q-ma-none q-pa-none "><small>{{event.zone}}</small></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              v-for="costumer, index in event.routeOrder"
                              :key="index"
                            >
                              <div class="row">
                                <div
                                  class="text q-ml-sm q-mb-none q-mt-none"
                                  style="font-size:12px; font-weight: 500; color:black"
                                ><span>&#8226;</span> {{ costumer.label }}</div>
                              </div>
                            </div>
                          </div>
                        </q-card>
                      </div>
                    </template>
                  </template>
                </q-calendar>
                <div class="row justify-center items-center">
                  <q-btn
                    flat
                    label="Anterior"
                    icon="keyboard_arrow_left"
                    @click="calendarPrev"
                  />
                  <q-separator vertical />
                  <q-btn
                    flat
                    label="Próximo"
                    icon-right="keyboard_arrow_right"
                    @click="calendarNext"
                  />
                </div>
              </div>
              <div class="col-2 q-pt-sm">
                <div class="row justify-start">
                  Legendas:
                </div>
                <q-separator color="white" />
                <div class="row justify-start items-center q-pt-md q-pb-md">
                  <div class="col-4">
                    <q-btn
                      color="accent"
                      size="sm"
                    />
                  </div>
                  <div class="col-8 q-pr-lg">
                    <div>Pedidos Recorrentes</div>
                  </div>
                </div>
                <q-separator
                  color="white"
                  inset
                  style="opacity:0.7"
                />
                <div class="row justify-start items-center q-pt-md  q-pb-md">
                  <div class="col-4">
                    <q-btn
                      color="red-6"
                      size="sm"
                    />
                  </div>
                  <div class="col-8 q-pr-lg">
                    <div class="text">Pré-Vendas</div>
                  </div>
                </div>
                <q-separator
                  color="white"
                  inset
                  style="opacity:0.7"
                />
                <div class="row justify-start items-center q-pt-md q-pb-md">
                  <div class="col-4">
                    <q-btn
                      color="lime-10"
                      size="sm"
                    />
                  </div>
                  <div class="col-8 q-pr-lg">
                    <div>Rotas</div>
                  </div>
                </div>

                <q-separator color="white" />
                <div class="row justify-start q-pt-md">
                  <q-btn
                    color="primary"
                    push
                    label="Criar/Editar Rota"
                    v-if="val.length > 0"
                    @click="createRoute"
                    style="width: 100%"
                  />
                </div>
                <div class="row justify-start q-pt-md">
                  <q-btn
                    color="positive"
                    push
                    label="Encaminhar Rota"
                    v-if="route.length > 0"
                    @click="setRoute"
                    style="width: 100%"
                  />
                </div>
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
      agenda: {},
      route: []
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
    },
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    createRoute () {
      const value = JSON.stringify(this.val)
      // console.log(value)
      this.$router.push({ path: '/nova/rota/' + value })
    },
    setRoute () {
      console.log(this.route)
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
      this.agenda = response.data
      console.log(response.data)
    }).catch(error => {
      if (error.response) {
        // this.handleError()
        this.submitting = false
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // this.handleError()
        this.submitting = false
        console.log(error.request)
      } else {
        // Something happened in setting up the request and triggered an Error
        // this.handleError()
        console.log('Error', error.message)
      }
    })
  },
  watch: {
    val: function (value) {
      if (value.length === 1 && value[0].route) {
        this.route = value
      } else {
        this.route = []
      }
    }
  }
}
</script>

<style>
</style>