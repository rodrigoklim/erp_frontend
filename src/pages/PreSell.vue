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
                      <q-card-section>
                        <div class="row">
                          <div class="col-8">
                            <div
                              class="text"
                              style="font-weight: 300; font-size:17px; opacity: 0.75"
                            >Nota Fiscal: </div>
                          </div>
                          <div class="col-4 self-start">
                            <div v-if="presell.nf === true">
                              <q-icon
                                name="check_circle_outlined"
                                color="teal"
                                size="sm"
                              />
                            </div>
                            <div v-else-if="presell.nf === false">
                              <q-icon
                                name="highlight_off"
                                color="red-6"
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
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
        nf: ''
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
  }
}
</script>

<style>
</style>