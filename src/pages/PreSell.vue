<template>
  <div class="preSell">
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
                  >Pré-Venda</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <q-card-section>
              <div class="col-11">
                <div class="row justify-center">
                  <div class="col-8 q-mr-md">
                    <q-card dark>
                      <pre-sell-steper></pre-sell-steper>
                    </q-card>
                  </div>
                  <div class="col-3 q-ml-md">
                    <q-card dark>
                      <q-card-section>
                        <div class="row items-baseline">
                          <div class="col">
                            <div class="text-h5">Pré-Venda</div>
                          </div>
                          <div class="col">
                            <q-input
                              dense
                              dark
                              v-model="presell.deliveryDate"
                              label="Data da Entrega"
                            />
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator
                        color="white"
                        style="opacity:0.85"
                      />
                      <q-card-section class="q-pa-none q-ma-none">
                        <q-input
                          v-model="presell.costumer"
                          outlined
                          dark
                          label="Cliente"
                          class="text-uppercase q-pa-sm q-ma-none"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </q-card-section>
                      <q-card-section class="q-pa-none q-ma-none">
                        <q-input
                          v-model="presell.address"
                          outlined
                          dark
                          label="Endereço"
                          class="text-uppercase q-pa-sm q-ma-none"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </q-card-section>
                      <q-card-section class="q-pa-none q-ma-none">
                        <q-input
                          v-model="presell.deliveryPeriod"
                          outlined
                          dark
                          label="Período de Entrega"
                          class="text-uppercase q-pa-sm q-ma-none"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </q-card-section>
                      <q-card-section class="q-pa-none q-ma-none">
                        <q-input
                          v-model="presell.payment.payment_description"
                          outlined
                          dark
                          label="Forma de Pagamento"
                          class="text-uppercase q-pa-sm q-ma-none"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </q-card-section>
                      <q-card-section class="q-pa-none q-ma-none">
                        <q-input
                          outlined
                          label="Nota Fiscal"
                          dark
                          class="text-uppercase q-pa-sm q-ma-none"
                        >
                          <template
                            v-slot:append
                            v-if="presell.nf === true"
                            class="mr-lg"
                          >
                            <q-icon
                              name="check_circle_outlined"
                              color="teal"
                              size="sm"
                            />
                          </template>
                          <template
                            v-slot:append
                            v-else-if="presell.nf === false"
                            class="mr-lg"
                          >
                            <q-icon
                              name="highlight_off"
                              color="red-6"
                              size="sm"
                            />
                          </template>
                        </q-input>
                      </q-card-section>
                      <q-card-section class="q-pa-sm q-ma-none">
                        <q-list
                          dark
                          bordered
                          style="border-radius:0.25em; border-width: 2px"
                          class="text-uppercase"
                        >
                          <q-item
                            v-for="(product, index) in presell.products"
                            :key="index"
                          >
                            <q-item-section>{{(index+1) +'. '+ product.product}}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </q-page>
  </div>
</template>

<script>
import PreSellSteper from 'src/components/PreSellSteper.vue'
import EventBus from 'src/boot/EventBus'
import apiClient from 'src/services/api'

export default {
  components: { PreSellSteper },
  name: 'PreSell',
  data () {
    return {
      presell: {
        costumer: [],
        address: [],
        addressId: '',
        deliveryPeriod: '',
        deliveryDate: '',
        payment: '',
        nf: '',
        products: [],
        observation: []
      },
      costumer: []
    }
  },
  methods: {
    updateCostumer (row) {
      this.presell.costumer = row.company_name
    },
    updateAddress (data) {
      this.presell.address = data.label
      this.presell.addressId = data.id
      this.presell.deliveryPeriod = data.period
      this.presell.deliveryDate = data.deliveryDate
    },
    updatePayment (data) {
      this.presell.payment = data[0]
      this.presell.nf = data[1]
    },
    updateProducts (data) {
      this.presell.products = data
    },
    updateObservation (data) {
      this.presell.observation = data
    },
    submit () {
      const url = '/presell/create'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const data = {
        params: this.presell
      }
      apiClient.post(url, data, config).then(response => {
        console.log(response.data)
        if (response.data === 'ok') {
        }
        this.obs = !this.obs
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
    }
  },
  created () {
    EventBus.$on('costumer', (row) => {
      this.updateCostumer(row)
    })
    EventBus.$on('address', (data) => {
      this.updateAddress(data)
    })
    EventBus.$on('presellPayment', (data) => {
      this.updatePayment(data)
    })
    EventBus.$on('presellProducts', (data) => {
      this.updateProducts(data)
    })
    EventBus.$on('presellObservation', (data) => {
      this.updateObservation(data)
    })
    EventBus.$on('submit', (data) => {
      this.submit(data)
    })
  }
}
</script>

<style>
</style>