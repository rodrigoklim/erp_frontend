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
            <q-card-section>
              <div class="row">
                <div
                  class="text-h4"
                  style="color: #4DA3FE; opacity:0.75"
                >Rota</div>
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
                            <div
                              v-for="(costumer, index) in costumers"
                              :key="index"
                            >
                              <q-card-section>
                                <q-card class="bg-accent">
                                  <q-card-section>
                                    {{costumer.label}}
                                  </q-card-section>
                                </q-card>
                              </q-card-section>
                            </div>

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
                                    emit-value
                                    v-model="Lorigin"
                                  />
                                </div>
                                <div class="col self-center q-ml-sm q-mr-sm">
                                  <q-select
                                    dark
                                    outlined
                                    label="Ponto Final"
                                    :options="destiny"
                                    emit-value
                                    v-model="Ldestiny"
                                  />
                                </div>
                                <div class="col self-end q-ml-md">
                                  <q-select
                                    dark
                                    outlined
                                    label="Veículo"
                                    :options="vehicle"
                                    emit-value
                                    v-model="selectedVehicle"
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
                                v-if="showMap"
                                :zoom="zoom"
                                :center="center"
                                style="min-height:450px;"
                                :options="mapOptions"
                                @update:center="centerUpdate"
                                @update:zoom="zoomUpdate"
                              >
                                <l-tile-layer
                                  :url="url"
                                  :attribution="attribution"
                                />
                                <l-marker :lat-lng="withPopup">
                                  <l-popup>
                                    <div @click="innerClick">
                                      I am a popup
                                      <p v-show="showParagraph">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                                        sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                                        Donec finibus semper metus id malesuada.
                                      </p>
                                    </div>
                                  </l-popup>
                                </l-marker>
                                <l-marker :lat-lng="withTooltip">
                                  <l-tooltip :options="{ permanent: true, interactive: true }">
                                    <div @click="innerClick">
                                      I am a tooltip
                                      <p v-show="showParagraph">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                                        sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                                        Donec finibus semper metus id malesuada.
                                      </p>
                                    </div>
                                  </l-tooltip>
                                </l-marker>
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
                        style="width:100%"
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
                        <div class="row">
                          <div class="col">
                            <!-- Fuel Gauge -->
                            <q-card-section class="q-mt-lg">
                              <VueSvgGauge
                                :start-angle="-110"
                                :end-angle="110"
                                :value="3"
                                :separator-step="1"
                                :min="0"
                                :max="4"
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
                                v-model="fuel"
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
                                :value="3"
                                :separator-step="1"
                                :min="0"
                                :max="4"
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
                                v-model="load"
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
                        </q-card>
                      </q-card>
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
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import { VueSvgGauge } from 'vue-svg-gauge'

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
    LPopup,
    LTooltip,
    VueSvgGauge
  },
  data () {
    return {
      zoom: 13,
      center: latLng(47.41322, -1.219482),
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
      load: '',
      fuel: '',
      costumers: []
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
    }
  },
  mounted () {
    console.log(this.$router.currentRoute.params.props)
    this.costumers = JSON.parse(this.$router.currentRoute.params.props)
  }
}
</script>

<style>
</style>