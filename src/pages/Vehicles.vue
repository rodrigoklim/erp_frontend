<template>
  <div class="vehicles">
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
                  >Veículos</div>
                </div>
                <div class="col-9">
                  <div class="row justify-end items-baseline">
                    <q-btn-toggle
                      v-model="tab"
                      toggle-color="primary"
                      flat
                      :options="[
                        {label: 'Listar Veículos', value: 'edit', icon: 'mode_edit'},
                      {label: 'Novo Veículo', value: 'nv', icon: 'fas fa-truck-moving'}
                      ]"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="slide-left"
              transition-next="slide-right"
            >
              <q-tab-panel
                dark
                name='nv'
                style="background-color:#1d1d1d"
              >
                <new-vehicle></new-vehicle>
              </q-tab-panel>
              <q-tab-panel
                dark
                name='edit'
                style="background-color:#1d1d1d"
              >
                <edit-vehicle></edit-vehicle>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import NewVehicle from 'src/components/NewVehicle.vue'
import EditVehicle from 'src/components/EditVehicle.vue'
export default {
  components: { NewVehicle, EditVehicle },
  name: 'Vehicles',
  data () {
    return {
      tab: 'edit'
    }
  }
}
</script>

<style>
</style>
