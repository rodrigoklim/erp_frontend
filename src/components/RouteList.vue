<template>
  <div class="RouteList">
    <q-card
      dark
      class="q-ml-sm"
    >
      <q-card-section>
        <div class="text-h5">Lista de Rotas</div>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item
            clickable
            v-ripple
            v-for="(delivery, index) in deliveries"
            :key="index"
            @click="routeClick(delivery)"
          >
            <q-item-section top>
              <q-item-label
                lines="2"
                class="q-mt-sm text-h6"
              > {{ delivery.zone }}
              </q-item-label>
            </q-item-section>
            <q-item-section top>
              <q-item-label
                lines="1"
                class="q-mt-sm"
                align="end"
              >
                <q-avatar
                  v-if="delivery.status === '3'"
                  icon="far fa-bell"
                  color="accent"
                  size="sm"
                />
                <q-avatar
                  v-if="lastCustomer[index]"
                  icon="fas fa-flag-checkered"
                  color="positive"
                  size="sm"
                />
                <q-avatar
                  v-if="hasChat"
                  icon="fas fa-comment-dots"
                  color="pink"
                  size="sm"
                />
                <q-avatar
                  v-if="mechanicAlert"
                  icon="fas fa-wrench"
                  color="red-6"
                  size="sm"
                />
              </q-item-label>
              <q-item-label
                lines="1"
                class="q-mt-sm"
              >
                <q-avatar
                  icon="fas fa-truck"
                  color="primary"
                  size="sm"
                />
                {{delivery.vehicleNickname}}
              </q-item-label>
              <q-item-label lines="1">
                <q-avatar
                  icon="sports_motorsports"
                  color="primary"
                  size="sm"
                />
                {{delivery.driverName}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!--Awaiting Auth Dialog-->
    <q-dialog
      v-model="loadChecklist"
      id="print"
    >
      <q-card
        dark
        style="width: 500px; max-width: 80vw;"
      >
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h5">Checklist de Carga</div>
            </div>
            <div
              class="col q-mt-sm"
              align="end"
            >
              <q-icon
                class=""
                name="far fa-times-circle"
                size="20px"
                @click="loadChecklist = !loadChecklist"
                style="cursor: pointer"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section>
          <q-table
            dark
            :data="loadChecklistTable"
            :columns="columns"
            color="primary"
            row-key="name"
            hide-pagination
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                v-for="(load, index) in loadProducts"
                :key="index"
              >
                <q-td>
                  {{load.product}}
                </q-td>
                <q-td align="center">{{load.qty + ' ' + load.unity}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Botijão Criogênico
                </q-td>
                <q-td align="center">{{props.row.bot_crio}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Tampa de Botijão
                </q-td>
                <q-td align="center">{{props.row.caps}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Cilindro
                </q-td>
                <q-td align="center">{{props.row.cylinder}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Funil
                </q-td>
                <q-td align="center">{{props.row.funnel}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Capacete
                </q-td>
                <q-td align="center">{{props.row.helmet}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Régua
                </q-td>
                <q-td align="center">{{props.row.scale}}</q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td>
                  Dinheiro
                </q-td>
                <q-td align="center">R$ {{(props.row.money/100).toFixed(2)}}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn
            label="Imprimir"
            color="primary"
            push
            @click="print"
          />
          <q-btn
            push
            color="positive"
            @click="askAuth(auth)"
          >Autorizar Saída</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import EventBus from 'boot/EventBus'
import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
Vue.use(VueHtmlToPaper, options)

export default {
  name: 'RouteList',
  data () {
    return {
      loadChecklist: false,
      deliveries: [],
      loadChecklistTable: [],
      loadProducts: [],
      columns: [
        {
          name: 'item',
          align: 'left',
          label: 'ITEM',
          field: 'item',
          sortable: false
        },
        {
          name: 'qty',
          align: 'center',
          label: 'QTD',
          field: 'qty',
          sortable: false,
          auth: ''
        }
      ],
      lastCustomer: [],
      hasChat: false,
      mechanicAlert: false,
      route: null
    }
  },
  mounted: function () {
    const url = '/route/delivery-list'
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }

    apiClient.get(url, config).then(response => {
      console.log(response.data)
      this.deliveries = response.data
      this.notify()
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
  methods: {
    routeClick (item) {
      this.route = item
      if (item.status === '3') {
        this.loadChecklist = true
        this.loadChecklistTable = [item.load_checklist]
        this.loadProducts = item.products
        this.auth = item.id
        console.log(item.products)
      }
      this.$emit('routeDetails', item)
      const url = '/route/ongoing'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: item.id
      }
      apiClient.post(url, params, config).then(response => {
        this.$emit('routePath', response.data)
      }).catch(error => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          // this.handleError()
          console.log('Error', error.message)
        }
      })
    },
    print () {
      this.$htmlToPaper('print')
    },
    authorize () {
      const url = '/route/auth'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: this.auth
      }
      apiClient.post(url, params, config).then(response => {
        EventBus.$emit('read', 0)
        this.deliveries = response.data
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
      this.sendAuthNotification(this.auth)
    },
    notify () {
      const self = this
      let control = 0
      let d = 0
      this.deliveries.forEach(function (item) {
        if (item.status === '3') {
          control++
        }
        self.endRoute(item.route_order, d)
        d++
      })
      EventBus.$emit('loadChecklist', control)
    },
    endRoute (data, i) {
      let control = 0
      data.forEach(function (item) {
        if (item.status === '1') {
          control++
        }
      })
      if ((data.length - parseInt(control)) === 0) {
        this.lastCustomer[i] = !this.lastCustomer[i]
      }
    },
    askAuth (auth) {
      this.$q.notify({
        color: 'primary',
        icon: 'thumb_up_off_alt',
        message: 'Deseja  autorizar a saída do veículo?',
        position: 'center',
        actions: [
          {
            label: 'Não',
            color: 'negative',
            handler: () => {
              this.loadChecklist = !this.loadChecklist
            }
          },
          {
            label: 'Sim',
            color: 'yellow',
            handler: () => {
              this.loadChecklist = !this.loadChecklist
              this.authorize(auth)
            }
          }
        ],
        timeout: Math.random() * 5000 + 3000
      })
    },
    sendAuthNotification (value) {
      const url = '/route/auth/notify'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: value
      }
      apiClient.post(url, params, config).then(response => {
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
    }
  },
  created () {
    EventBus.$on('customerUpdated', (val) => {
      this.routeClick(this.route)
    })
  }
}
</script>

<style scoped>
</style>
