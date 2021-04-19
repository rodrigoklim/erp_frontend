<template>
  <div class="DeliveryFollowUp">
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
                <div class="col-6">
                  <div
                    class="text-h4"
                    style="color: #4DA3FE"
                  >Entregas</div>
                </div>
                <div class="col-6 " align="end">
                  <div
                    class="text-h5 q-mt-sm"
                  >Rota#1 - São Paulo</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-3">
               <route-list @routePath="routePath"></route-list>
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
              <div class="col-3">
                <q-card
                  dark
                  class="q-ml-sm"
                >
                  <q-card-section>
                    <div class="text-h5">Dados Rota</div>
                  </q-card-section>
                  <q-separator dark />
                  <q-card-section>
                    <q-timeline
                      color="accent"
                      dark
                    >
                      <q-timeline-entry
                        title="Cliente 1"
                        subtitle="07:23"
                        icon="done"
                      />
                      <q-timeline-entry
                        title="Cliente 2"
                        subtitle="08:23"
                        icon="done"
                      />
                      <q-timeline-entry
                        title="Cliente 3"
                        subtitle="Chegada Estimada: 09:23"
                        icon="clear"
                        color="primary"
                        style="opacity:.85"
                      />
                      <q-timeline-entry
                        title="Cliente 4"
                        subtitle="Chegada Estimada: 10:23"
                        icon="clear"
                        color="primary"
                        style="opacity:.85"
                      />
                    </q-timeline>
                  </q-card-section>
                </q-card>
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
import RouteList from 'components/RouteList'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  name: 'deliveryFollowUp',
  components: {
    RouteList,
    LMap,
    LTileLayer,
    LMarker,
    LPolyline
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
      markers: []
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
      this.handlePolyline(newVal)
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
      this.route = []
      this.markers = []
      var path = []
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
    }
  }
}
</script>

<style>
</style>
