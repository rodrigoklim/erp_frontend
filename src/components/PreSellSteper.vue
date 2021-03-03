<template>
  <div class="preSellStepper">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      dark
      style="font-weight: 300"
    >
      <q-step
        :name="1"
        title="Cliente"
        icon="settings"
        :done="step > 1"
      >
        <q-table
          class="text-uppercase"
          :data="costumers"
          :columns="columns"
          :filter="filter"
          row-key="name"
          dark
          style="color:white; opacity:0.95; font-family: poppins; font-weight: 300;"
          @row-click="selectCostumer"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              outlined
              dense
              dark
              debounce="300"
              v-model="filter"
              placeholder="Pesquisar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </q-step>
      <q-step
        :name="2"
        title="Endereço"
        icon="fas fa-map-marker-alt"
        :done="step > 2"
      >
        <q-card dark>
          <q-card-section>
            Endereços de Entrega
          </q-card-section>
          <q-separator
            color="white"
            style="opacity:0.85"
          />
          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <q-field
                    outlined
                    label="Endereços"
                    dark
                    class="text-uppercase text-white q-pa-md"
                  >
                    <q-option-group
                      dark
                      :options="address"
                      v-model="selectedAddress"
                      class="q-pa-md text-white"
                      @input="selectedPeriod"
                    />
                  </q-field>
                </div>
                <div class="row">
                  <q-input
                    class="text-uppercase q-pa-md"
                    outlined
                    dark
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
              <div class="col-6">
                <q-field
                  outlined
                  label="Período de Entrega"
                  dark
                  class="text-uppercase text-white q-pa-md"
                >
                  <q-option-group
                    v-model="period"
                    :options="[
                        {label: 'Manhã', value: 'MANHÃ'},
                        {label: 'Tarde', value: 'TARDE'},
                        {label: 'Indiferente', value: 'INDIFERENTE'}
                    ]"
                    class="q-pa-md text-white"
                  />
                </q-field>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </q-step>

      <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
      >
        This step won't show up because it is disabled.
      </q-step>

      <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step>

      <template v-slot:navigation>
        <div class="row justify-end q-pa-md">
          <q-btn
            v-if="step > 1"
            color="red-6"
            @click="$refs.stepper.previous()"
            :label="step > 1 ? 'Voltar' : 'Voltar'"
            class="q-ma-sm"
          />
          <q-stepper-navigation>
            <q-btn
              @click="nextStep"
              color="primary"
              :label="step === 4 ? 'Finish' : 'Continue'"
              class="q-ma-sm"
            />
          </q-stepper-navigation>
        </div>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import EventBus from 'src/boot/EventBus'
import moment from 'moment'

export default {
  name: 'PreSellSteper',
  data () {
    return {
      step: 1,
      costumers: [],
      address: [],
      selectedAddress: '',
      filter: '',
      deliveryDate: moment().format('DD/MM/YYYY'),
      period: '',
      controlCostumer: false,
      columns: [
        { name: 'register_number', label: 'CNPJ / CPF', align: 'center', field: 'register_number' },
        { name: 'company_name', align: 'left', label: 'Nome Fantasia', field: 'company_name', sortable: true },
        { name: 'contact', align: 'center', label: 'Contato', field: 'contact', sortable: true },
        { name: 'zone', align: 'center', label: 'Região', field: 'zone', sortable: true }
      ],
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Mar;o_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jab_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dec'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },
  mounted () {
    this.visible = true
    const self = this
    const url = '/costumer/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      self.costumers = response.data
      self.visible = false
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
        // Something happened in setting up the request and triggered an Error
        this.handleError()
        console.log('Error', error.message)
      }
    })
  },
  methods: {
    selectedPeriod (value) {
      console.log(this.address[value].period)
      this.period = this.address[value].period
      EventBus.$emit('address', this.address[value])
    },
    addressPopulator (element, index) {
      console.log(element, index)
      this.address.push(
        {
          label: element.city + ' - ' + element.street,
          value: index,
          id: element.id,
          period: element.preference_period
        }
      )
    },
    selectCostumer (evt, row) {
      this.controlCostumer = true
      console.log(row.register[0].address)
      this.address = []
      row.register[0].address.forEach(this.addressPopulator)

      //   row.register[0].address :label="location.city +' - ' + location.street"
      //                   :val="location.id"
      EventBus.$emit('costumer', row)
    },
    nextStep () {
      if (this.controlCostumer === true) {
        this.$refs.stepper.next()
      } else {
        this.$q.notify({
          color: 'red-6',
          icon: 'check',
          message: 'Necessita selecionar um cliente para prosseguir',
          position: 'bottom'
        })
      }
    }
  }
  //   methods: {
  //     costumerDetails (evt, row, index) {
  //       this.company_name = row.company_name
  //       // this.address = row.register[0].address[0].street + ', ' + row.register[0].address[0].number + ', ' + row.register[0].address[0].complement + ', ' + row.register[0].address[0].city + ' - ' + row.register[0].address[0].state
  //       this.phone_1 = row.register[0].phone_1
  //       if (row.register[0].phone_1zap) {
  //         const phone = row.register[0].phone_1
  //         const user = localStorage.name
  //         this.zap = true
  //         this.link = 'https://api.whatsapp.com/send?phone=55' + phone + '&text=Oi%2C%20aqui%20%C3%A9%20' + user + '%20da%20Criomec%2C%20tudo%20bem%3F'
  //       }
  //       this.pay_method = row.register[0].pay_method.payment_description
  //       this.costumer = row
  //     }
  //   }
}
</script>

<style>
</style>