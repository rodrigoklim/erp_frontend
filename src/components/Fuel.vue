<template>
  <div class="Fuel">
    <div class="justify-center">
      <q-btn
        round
        color="primary"
        push
        icon="fas fa-gas-pump"
        @click="gas = true"
      >
        <q-tooltip>
          Cadastrar Abastecimento
        </q-tooltip>
      </q-btn>
    </div>
    <q-dialog v-model="gas">
      <q-card dark>
        <q-card-section>
          <div class="text-h4">
            Abastecimento de Combustível
          </div>
        </q-card-section>
        <!-- separator -->
        <div class="col-12">
          <div class="row justify-center">
            <div class="col-12">
              <q-separator
                color="white"
                style="opacity:0.85"
                class="q-mt-sm"
              />
            </div>
          </div>
        </div>
        <q-form
          ref="form"
          autofocus
          spellcheck="false"
          autocomplete="off"
          @submit.prevent.stop="refuel"
          greedy
        >
          <q-card-section>
            <q-select
              dark
              outlined
              v-model="vehicle"
              :options="vehicles"
              stack-label
              label="SELECIONE UM VEÍCULO"
              @filter="vehicleSelection"
              @input="vehicleFuelDetail"
              use-input
            ></q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row fit q-ml-sm">
              <div
                class="text-caption poppins"
                v-if="form.fuel_level"
              >
                Combustível Atual: {{form.fuel_level.toFixed(2)}} / {{form.fuel_tank}} lts
              </div>
            </div>
          </q-card-section>

          <!-- separator -->
          <div class="col-12 q-ma-none q-pa-none">
            <div class="row justify-center">
              <div class="col-12">
                <q-separator
                  color="white"
                  style="opacity:0.85"
                  class="q-mt-sm"
                  inset
                />
              </div>
            </div>
          </div>

          <q-card-section class="q-pt-none">
            <div class="row fit justify-center items-center content-start q-mt-lg">
              <q-input
                style="width: 100%;"
                v-model="form.movement"
                outlined
                dark
                dense
                suffix="lts"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
                class="text-uppercase"
                label="Qtde Abastecida"
                :rules="[val => !!val || 'Campo obrigatório.']"
              />
            </div>
            <div class="row fit justify-center items-center content-start q-mt-sm">
              <q-input
                class="text-uppercase"
                outlined
                dark
                dense
                label="Data"
                v-model="form.date"
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
                        v-model="form.date"
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
            <div class="row fit justify-center items-center content-start q-mt-sm">
              <q-input
                style="width: 100%;"
                v-model="form.value"
                outlined
                dark
                dense
                mask="R$ #,##"
                fill-mask="0"
                reverse-fill-mask
                label="Valor Abastecido"
                :rules="[val => !!val || 'Campo obrigatório.']"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-select
              dark
              outlined
              v-model="driver"
              :options="drivers"
              stack-label
              dense
              label="SELECIONE O MOTORISTA"
              @filter="driverSelection"
              use-input
              @input="driverSelected"
            ></q-select>
          </q-card-section>
          <q-card-actions align="around">
            <q-btn
              push
              label="Cancelar"
              color="red-6"
              v-close-popup
              @click="clearFields"
            />
            <q-btn
              push
              label="Cadastrar"
              color="primary"
              type="submit"
              :loading="submitting"
            >
              <template v-slot:loading>
                <q-spinner-orbit
                  color="white"
                  size="1.35em"
                />
              </template>
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'Fuel',
  data () {
    return {
      gas: false,
      vehicles: [],
      vehicle: '',
      vehicleListOptions: [],
      vehiclesComplete: [],
      driver: '',
      drivers: [],
      driversOptions: [],
      form: {},
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jab_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dec'.split('_'),
        firstDayOfWeek: 1
      },
      submitting: false,
      userData: false
    }
  },
  mounted () {
    this.loadVehicles()
  },
  methods: {
    loadVehicles () {
      const self = this
      const url = '/vehicle/show'
      const data = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      apiClient.get(url, data).then(response => {
        const v = response.data
        this.vehiclesComplete = response.data
        Object.keys(v).forEach((i) => {
          self.vehicleListOptions.push({
            label: v[i].nickname.toUpperCase(),
            value: i,
            index: v[i].id
          })
        })
      })
    },
    vehicleSelection (val, update) {
      if (val === '') {
        update(() => {
          this.vehicles = this.vehicleListOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.vehicles = this.vehicleListOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    driverSelection (val, update) {
      if (val === '') {
        update(() => {
          this.drivers = this.driversOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.drivers = this.driversOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    vehicleFuelDetail (val) {
      const needle = parseInt(val.value)
      const vehicle = this.vehiclesComplete[needle]
      const fuelRecord = vehicle.fuel_record
      const fuelIndex = fuelRecord.length - 1
      this.form.fuel_level = parseFloat(fuelRecord[fuelIndex].balance)
      this.form.fuel_tank = vehicle.fuel_tank
      this.form.vehicle_id = vehicle.id
      this.getDrivers()
    },
    getDrivers () {
      const self = this
      const url = '/drivers/show'
      const data = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      apiClient.post(url, 'test', data).then(response => {
        const d = response.data
        Object.keys(d).forEach((i) => {
          self.driversOptions.push({
            label: d[i].name.toUpperCase(),
            value: d[i].id
          })
        })
      })
    },
    driverSelected (value) {
      this.form.driver = this.driver.value
    },
    clearFields () {
      this.form = []
      this.vehicle = ''
      this.submitting = false
    },
    refuel () {
      this.submitting = true
      const newLoad = parseFloat(this.form.movement) + parseFloat(this.form.fuel_level)
      if (newLoad > parseFloat(this.form.fuel_tank)) {
        this.$q.notify({
          message: 'O combustível será atualizado para a Capacidade Total do Tanque.',
          color: 'primary',
          actions: [
            {
              label: 'Ok',
              color: 'yellow',
              handler: () => {
                // this.form.movement = parseFloat(this.form.fuel_tank) - parseFloat(this.form.fuel_level)
                this.form.newLoad = this.form.fuel_tank
                this.submitRefuel()
              }
            }
          ]
        })
      } else {
        this.$q.notify({
          message: 'Deseja cadastrar o abastecimento?',
          color: 'primary',
          actions: [
            {
              label: 'Ok',
              color: 'yellow',
              handler: () => {
                this.form.newLoad = newLoad
                this.submitRefuel()
              }
            }
          ]
        })
      }
    },
    submitRefuel () {
      const url = '/vehicle/fuel'
      this.userData = JSON.parse(localStorage.user_data)
      this.form.user_id = this.userData.id
      const data = {
        params: {
          form: this.form
        }
      }
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      apiClient.post(url, data, config).then(response => {
        if (response.data === 'ok') {
          this.submitting = false
          this.gas = false
          this.clearFields()
          //   this.loadVehicles()
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Abastecimento cadastrado com sucesso!',
            position: 'top-right'
          })
          this.$emit('update', 'done')
        } else {
          this.submitting = false
          this.handleError()
        }
      }).catch(error => {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
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
    handleError () {
      this.$q.notify({
        color: 'red-6',
        icon: 'warning',
        message: 'Abastecimento não cadastrado, verifique os dados!',
        position: 'top-right'
      })
    }
  }
}
</script>

<style>
</style>