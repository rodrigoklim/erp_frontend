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
                <div class="col-6 " align="end">
                  <div
                    class="text-h5 q-mt-sm"
                  >{{title}}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-3">
               <route-list @routePath="routePath" @routeDetails="routeDetails" style="opacity: 0.85"></route-list>
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
                        v-for="(marker, index) in markers"
                        :key="index"
                        :icon="marker.icon"
                      />
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
               <delivery-route :routeOrder="customers"></delivery-route>
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
import { LMap, LTileLayer, LMarker, LPolyline, LIcon } from 'vue2-leaflet'
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
    LIcon
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
      truckIcon: null
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
      this.handlePolyline(newVal.matrix)
      this.customers = newVal.routeOrder
      this.getPosition()
      this.makePeriodic()
    },
    handleMarkers (data) {
      this.markers.push({
        value: latLng(data.pointB.split(',').reverse())
      })
      const map = this.$refs.map.mapObject
      // const markers = this.$refs.markers
      map.fitBounds(this.markers.map(m => {
        return [m.value.lat, m.value.lng]
      }))
      this.zoom = this.currentZoom - 2
    },
    handlePolyline (data) {
      const self = this
      this.route = []
      this.markers = []
      const path = []
      console.log(data.matrix[0].markers.pointA)
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
      console.log(params)
      apiClient.post(url, params, config).then(response => {
        console.log(response.data)
        this.truck.coords = latLng(response.data[1], response.data[0])
        this.truck.set = true
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
          console.log('zerando', self.control)
          self.getPosition()
        },
        1000 *
        60 * 1
      )
    }
  }
}
</script>

<style>
</style>
