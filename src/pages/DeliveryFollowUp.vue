<template>
  <div class="DeliveryFollowUp">
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
                <div class="col-6">
                  <div
                    class="text-h4"
                    style="color: #4DA3FE"
                  >Entregas</div>
                </div>
                <div
                  class="col-6 "
                  align="end"
                >
                  <div class="text-h5 q-mt-sm">{{title}}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-3">
                <route-list
                  @routePath="routePath"
                  @routeDetails="routeDetails"
                  style="opacity: 0.85"
                ></route-list>
              </div>
              <div class="col-6">
                <q-card
                  dark
                  class="q-ml-sm"
                >
                  <q-card-section>
                    <div class="text-h5">Localização Atual</div>
                  </q-card-section>
                  <q-separator dark />
                  <q-card-section>
                    <l-map
                      ref="map"
                      v-if="showMap"
                      :zoom="zoom"
                      :center="center"
                      style="min-height:450px; opacity:1!important;"
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
                      >
                        <l-popup>{{marker.text}} - {{marker.value}}</l-popup>
                        <l-icon
                          :icon-size="dynamicSize"
                          :icon-anchor="dynamicAnchor"
                          :icon-url="marker.icon"
                        >
                        </l-icon>
                      </l-marker>
                      <div v-if="truck.set">
                        <l-marker :lat-lng="truck.coords">
                          <l-icon
                            :icon-size="[35, 35]"
                            :icon-anchor="[10,10]"
                            :icon-url="require('../assets/img/tank_truck.svg')"
                            color="primary"
                          />
                        </l-marker>
                      </div>
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
              <div class="col-3">
                <delivery-route
                  :routeOrder="customers"
                  :routeNextCostumers="next"
                ></delivery-route>
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
import { LMap, LTileLayer, LMarker, LPolyline, LIcon, LPopup } from 'vue2-leaflet'
import RouteList from 'components/RouteList'
import DeliveryRoute from 'components/DeliveryRoute'
import apiClient from 'src/services/api'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  name: 'deliveryFollowUp',
  components: {
    DeliveryRoute,
    RouteList,
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LIcon,
    LPopup
  },
  data () {
    return {
      deliveries: [],
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
      center: [-23.5862689, -46.6830193],
      route: [],
      markers: [],
      title: '',
      customers: [],
      control: 0,
      truck: [],
      truckIcon: null,
      next: []
    }
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },
    centerUpdate (center) {
      this.currentCenter = center
    },
    routePath (newVal) {
      const url = '/route/live'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: newVal.routeOrder[0].route_id
      }
      apiClient.post(url, params, config).then(response => {
        this.markers = []
        this.route = []
        this.handlePolyline(response.data)
        this.next = response.data
      })
      this.customers = newVal.routeOrder
      this.getPosition()
      this.makePeriodic()
    },
    handleMarkers (data, popup) {
      console.log(data, popup)
      let icon = ''
      if (popup === 'Final da Rota') {
        icon = require('../assets/img/miniatura_novo.png')
      }
      const m = data.pointB.split(',').reverse()
      this.markers.push({
        value: [parseFloat(m[0]), parseFloat(m[1])],
        text: popup,
        icon: icon
      })
      this.center = this.truck.coords
    },
    handlePolyline (data) {
      console.log(data)
      const self = this
      this.route = []
      this.markers = []
      const path = []
      this.truck.coords = latLng(data.matrix[0].markers.pointA.split(',').reverse())

      data.matrix.forEach(function (item) {
        self.handleMarkers(item.markers, item.nickname)
        item.route.forEach(function (coords) {
          path.push([coords[1], coords[0]])
        })
        self.route.push({
          route: path,
          color: 'purple'
        })
      })
    },
    routeDetails (data) {
      this.title = 'Rota #' + data.id + ' - ' + data.zone
    },
    getPosition () {
      const item = this.customers
      const url = '/route/vehicle/position'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: item
      }
      apiClient.post(url, params, config).then(response => {
        if (response.data !== 0) {
          this.truck.coords = latLng(response.data[1], response.data[0])
          this.truck.set = true
          this.$forceUpdate()
        }
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
    makePeriodic () {
      const self = this
      setInterval(
        function () {
          self.control = 0
          self.getPosition()
        },
        1000 *
        60 * 1
      )
    }
  },
  computed: {
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1.15]
    },
    dynamicAnchor () {
      return [this.iconSize / 2, this.iconSize * 1.15]
    }
  }
}
</script>

<style>
</style>
