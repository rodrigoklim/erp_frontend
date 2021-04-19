<template>
  <div class="createRoute">
    <q-page class="flex">
      <div class="row fit justify-center items-center content-start">
        <div class="col-11 q-mt-md q-mb-md">
          <q-card
            dark
            class="full-width"
            style="border-radius: 2em; overflow: inherit !important; color:white; font-family: poppins; font-weight: 300"
          >
            <q-card-section class="q-ma-none q-pa-none ">
              <div class="row items-baseline q-ml-sm q-mr-sm q-mt-">
                <div class="col sef-start q-mt-md">
                  <div
                    class="text-h4 "
                    style="color: #4DA3FE; opacity:0.75"
                  >Rota</div>
                </div>
                <div class="col-2 self-end q-mt-md q-pl-md">
                  <q-input
                    class="text-uppercase"
                    ref="delivery"
                    outlined
                    dark
                    dense
                    label="Data de Entrega"
                    v-model="deliveryDate"
                    :rules="[val => !!val || 'Campo obrigatório.']"
                    style="width: 100%;"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="deliveryDate"
                            dark
                            :locale="myLocale"
                            mask=DD/MM/YYYY
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator dark />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-12">
                <div class="row">
                  <div class="col-10">
                    <div class="row">
                      <div class="col-3">
                        <div class="row justify-start q-pr-md q-pt-none">
                          <q-card
                            dark
                            style="width: 100%"
                          >
                            <q-card-section>
                              <div
                                class="text"
                                style="opacity: 0.75"
                              >Clientes:</div>
                            </q-card-section>
                            <q-separator
                              color="white"
                              inset
                            />
                            <q-card-section>
                              <draggable
                                v-model="costumers"
                                group="people"
                                @start="drag=true"
                                @end="updateRoute"
                              >
                                <div
                                  v-for="element, index in costumers"
                                  :key="index"
                                >
                                  <q-expansion-item
                                    expand-separator
                                    :label="element.company_name"
                                    :caption="estimatedDelivery(index)"
                                    style="background-color: orange; color: white; border-radius: 1em"
                                    class="q-mb-md"
                                  >
                                    <q-card
                                      class="bg-orange-8"
                                      style="border-radius: 0 0 1em 1em"
                                    >
                                      <q-card-section class="q-pb-none q-mb-none">
                                        Produtos:
                                      </q-card-section>
                                      <q-card-section>
                                        <div
                                          v-for="product, i in element.products"
                                          :key="i"
                                        >
                                          <q-input
                                            outlined
                                            dark
                                            dense
                                            :key="i"
                                            :label="product.product"
                                            v-model="product.qty"
                                            class="q-pb-sm"
                                            @input="sumQty(product)"
                                          />
                                        </div>

                                      </q-card-section>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </draggable>
                            </q-card-section>

                          </q-card>
                        </div>
                      </div>
                      <div class="col-9">
                        <div class="row justify-center">
                          <q-card
                            dark
                            style="width:100%"
                          >
                            <q-card-section>
                              <div class="row">
                                <div class="col self-start q-mr-md">
                                  <q-select
                                    dark
                                    outlined
                                    label="Ponto Inicial"
                                    :options="origin"
                                    @input="updateRoute"
                                    v-model="Lorigin"
                                    class="text-uppercase"
                                    dense
                                    :rules="[val => !!val || 'Campo obrigatório.']"
                                  />
                                </div>
                                <div class="col self-center q-ml-sm q-mr-sm">
                                  <q-select
                                    dark
                                    outlined
                                    label="Ponto Final"
                                    :options="destiny"
                                    @input="updateRoute"
                                    v-model="Ldestiny"
                                    dense
                                    class="text-uppercase"
                                    :rules="[val => !!val || 'Campo obrigatório.']"
                                  />
                                </div>
                                <div class="col self-end q-ml-md">
                                  <q-select
                                    ref="zone"
                                    dark
                                    outlined
                                    dense
                                    label="Região"
                                    :options="zone"
                                    v-model="selectedZone"
                                    class="text-uppercase"
                                    :rules="[val => !!val || 'Campo obrigatório.']"
                                  />
                                </div>
                                <div class="col self-end q-ml-md">
                                  <q-select
                                    ref="vehicle"
                                    dark
                                    outlined
                                    dense
                                    label="Veículo"
                                    :options="vehicle"
                                    v-model="selectedVehicle"
                                    class="text-uppercase"
                                    @input="vehicleDetails"
                                    :rules="[val => !!val || 'Campo obrigatório.']"
                                  />
                                </div>
                              </div>
                            </q-card-section>
                            <q-separator
                              color="white"
                              inset
                            />
                            <q-card-section>
                              <l-map
                                ref="map"
                                v-if="showMap"
                                :zoom="zoom"
                                :center="center"
                                style="min-height:450px;"
                                :options="mapOptions"
                                @update:center="centerUpdate"
                                @update:zoom="zoomUpdate"
                              >
                                <l-tile-layer :url="url" />
                                <l-marker
                                  ref="markers"
                                  :lat-lng="marker.value"
                                  v-for="marker, index in markers"
                                  :key="index"
                                  :icon="marker.icon"
                                >
                                </l-marker>
                                <l-polyline
                                  v-for="polyline in route"
                                  :key="polyline.index"
                                  :lat-lngs="polyline.route"
                                  :color="polyline.color"
                                />
                              </l-map>
                            </q-card-section>
                          </q-card>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="row justify-end q-pl-md q-pt-none">
                      <q-card
                        dark
                        style="width:100%;color:white; opacity:0.95; font-family: poppins; font-weight: 300;"
                      >
                        <q-card-section>
                          <div
                            class="text"
                            style="opacity: 0.75"
                          >Informações Gerais:</div>
                        </q-card-section>
                        <q-separator
                          color="white"
                          inset
                        />
                        <q-card-section
                          class="q-mb-none"
                          style="font-size: 12px; opacity: 0.75"
                        >
                          <div class="row">
                            <div class="col-8">Tempo Estimado:</div>
                            <div class="col-4">{{details.time}}</div>
                          </div>
                          <div class="row">
                            <div class="col-8">Distância Total:</div>
                            <div class="col-4">
                              {{details.totalLength}}
                              km</div>
                          </div>
                        </q-card-section>
                        <div class="row">
                          <div class="col">
                            <!-- Fuel Gauge -->
                            <q-card-section class="q-mt-lg">
                              <VueSvgGauge
                                :start-angle="-110"
                                :end-angle="110"
                                :value="fuel.value"
                                :separator-step="(parseFloat(fuel.max)/5)"
                                :min="fuel.min"
                                :max="fuel.max"
                                :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
                                :scale-interval="0.1"
                                style="transform: rotate(-90deg)"
                              >
                                <div
                                  class="inner-text"
                                  style="transform: rotate(90deg)"
                                >
                                  <div class="row justify-end">
                                    <i class="fas fa-gas-pump fa-3x"></i>
                                  </div>
                                </div>
                              </VueSvgGauge>
                              <q-input
                                outlined
                                dark
                                label="Combustível"
                                dense
                                v-model="fuel.value"
                                class="q-mt-md"
                              />
                            </q-card-section>
                          </div>
                          <div class="col">
                            <!-- Load Gauge -->
                            <q-card-section class="q-pt-md q-mt-lg q-mb-lg">
                              <VueSvgGauge
                                :start-angle="-110"
                                :end-angle="110"
                                :value="load.value"
                                :separator-step="parseFloat(load.max)/5"
                                :min="load.min"
                                :max="load.max"
                                :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
                                :scale-interval="0.1"
                                style="transform: rotate(-90deg)"
                              >
                                <div
                                  class="inner-text"
                                  style="transform: rotate(90deg)"
                                >
                                  <div class="row justify-end">
                                    <i class="fas fa-fill-drip fa-3x"></i>
                                  </div>
                                </div>
                              </VueSvgGauge>
                              <q-input
                                outlined
                                dark
                                label="Carga"
                                v-model="load.value"
                                dense
                                class="q-mt-md"
                              />
                            </q-card-section>

                          </div>
                        </div>
                        <q-separator
                          color="white"
                          inset
                        />
                        <q-card dark>
                          <q-card-section>
                            Carregamento:
                          </q-card-section>
                          <q-card-section>
                            <q-list
                              dark
                              bordered
                              separator
                            >
                              <q-item
                                v-for="item in products_list"
                                :key="item.id"
                              >
                                <q-item-section>
                                  <q-item-label overline>{{item.product}}</q-item-label>
                                  <q-item-label caption>{{item.qty}}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-card-section>
                        </q-card>
                      </q-card>
                    </div>
                    <div class="row justify-center q-pt-md q-pb-md">
                      <q-btn
                        label="Criar Rota"
                        push
                        color="primary"
                        @click="submitRoute"
                        style="width: 70%"
                      />
                    </div>
                  </div>
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
import { latLng, Icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import { VueSvgGauge } from 'vue-svg-gauge'
import apiClient from 'src/services/api'
import draggable from 'vuedraggable'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'CreateRoute',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    VueSvgGauge,
    draggable
  },
  data () {
    return {
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      destiny: [],
      origin: [],
      Ldestiny: [],
      Lorigin: [],
      selectedVehicle: '',
      vehicle: [],
      load: [],
      fuel: [],
      costumers: [],
      deliveryDate: '',
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jab_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dec'.split('_'),
        firstDayOfWeek: 1
      },
      center: [-23.5862689, -46.6830193],
      markers: [],
      list: [],
      dragging: false,
      products_list: [],
      details: [],
      route: [],
      markersGroup: [],
      loadControl: '',
      zone: [],
      selectedZone: ''
    }
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },
    centerUpdate (center) {
      this.currentCenter = center
    },
    showLongText () {
      this.showParagraph = !this.showParagraph
    },
    innerClick () {
      alert('Click!')
    },
    sumQty (product) {
      let total = 0
      let totalProd = 0
      this.costumers.forEach(function (prod) {
        prod.products.forEach(function (p) {
          if (p.product_id === product.product_id) {
            if (p.qty) {
              totalProd += parseInt(p.qty)
            }
          }
          if (p.qty) {
            total += parseInt(p.qty)
          }
        })
      })
      this.products_list.forEach(function (item) {
        if (item.product_id === product.product_id) {
          item.qty = totalProd
        }
      })
      if (this.loadControl === 'plus') {
        this.load.value = parseFloat(total)
      } else {
        console.log(this.selectedVehicle.load.balance)
        this.load.value = parseFloat(this.selectedVehicle.load.balance) - parseFloat(total)
      }

      this.$forceUpdate()
    },
    estimatedDelivery (i) {
      return this.details.matrix[i].time
    },
    handleMarkers (data) {
      this.markers.push({
        value: latLng(data.pointB.split(',').reverse())
      })
      const map = this.$refs.map.mapObject
      // const markers = this.$refs.markers
      map.fitBounds(this.markers.map(m => { return [m.value.lat, m.value.lng] }))
      this.zoom = this.currentZoom - 2
    },
    handlePolyline (data) {
      const self = this
      const path = []
      this.route = []
      this.markers = []
      console.log(data.matrix[0])
      this.markers.push({
        value: latLng(data.matrix[0].markers.pointA.split(',').reverse())
      })
      data.matrix.forEach(function (item) {
        self.handleMarkers(item.markers)
        item.route.forEach(function (coords) {
          path.push([coords[1], coords[0]])
        })
        self.route.push({
          route: path,
          color: 'purple'
        })
      })
    },
    updateRoute () {
      const data = {
        params: {
          origin: [this.Lorigin],
          costumers: this.costumers,
          destiny: [this.Ldestiny]
        }
      }
      const url = '/route/update'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      apiClient.post(url, data, config).then(response => {
        console.log(response.data)
        this.details = response.data.details
        this.handlePolyline(this.details)
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
    vehicleDetails (value) {
      this.fuel.min = 0
      this.fuel.max = parseFloat(value.vehicle.fuel_tank)
      this.fuel.value = parseFloat(value.fuel.balance) - (parseFloat(this.details.totalLength) / parseFloat(value.vehicle.autonomy))
      if (value.load === null) {
        this.load.min = 0
        this.load.value = 0
        this.load.max = parseFloat(value.load_details.load_capacity)
        this.loadControl = 'plus'
      } else {
        this.loadControl = 'minus'
        this.load.min = 0
        this.load.value = parseFloat(value.load.balance)
        this.load.max = parseFloat(value.load_details.load_capacity)
      }
    },
    handleZoneList (value) {
      const self = this
      value.forEach(function (item) {
        console.log(item.address.zone)
        self.zone.push(item.address.zone)
      })
    },
    submitRoute () {
      this.$refs.vehicle.validate()
      this.$refs.delivery.validate()
      const url = '/route/create'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const data = {
        params: {
          origin: this.Lorigin,
          costumers: this.costumers,
          destiny: this.Ldestiny,
          vehicle: this.selectedVehicle,
          details: this.details,
          deliveryDate: this.deliveryDate,
          zone: this.selectedZone,
          load: this.load.value
        }
      }

      apiClient.post(url, data, config).then(response => {
        console.log(response.data)
        this.$router.push('/rotas', () => {
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Rota Cadastrada com Sucesso!',
            position: 'top-right'
          })
        })
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
          console.log('Error', error.message)
        }
      })
    },
    handleError () {
      this.$q.notify({
        color: 'red-7',
        icon: 'warning',
        message: 'Rota não cadastrada!',
        position: 'top-right'
      })
    }
  },
  mounted () {
    const url = '/route/create/page'
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    const details = JSON.parse(this.$router.currentRoute.params.props)
    const data = {
      params: {
        details
      }
    }

    apiClient.post(url, data, config).then(response => {
      console.log(response.data)
      this.origin = response.data.origin
      this.destiny = response.data.destiny
      this.costumers = response.data.costumers
      this.products_list = response.data.products
      this.details = response.data.details
      this.vehicle = response.data.vehicles
      this.handlePolyline(this.details)
      this.handleZoneList(this.costumers)
      this.Ldestiny = this.destiny[0]
      this.Lorigin = this.origin[0]
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
}
</script>

<style>
.q-input .text-negative {
  color: tomato !important;
}
.q-field--error .q-field__bottom {
  color: tomato;
}
.text-negative {
  color: tomato !important;
}
</style>
