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
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-11">
                <l-map
                  v-if="showMap"
                  :zoom="zoom"
                  :center="center"
                  style="min-height:500px;"
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
    LTooltip
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
      showMap: true
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
  }
}
</script>

<style>
</style>