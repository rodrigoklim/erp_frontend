<template>
  <div class="DeliveryRoute">
    <q-card
      dark
      class="q-ml-sm"
    >
      <q-card-section>
        <div class="row">
          <div class="col items-center">
            <div class="text-h5 ">Dados Rota</div>
          </div>
          <div
            class="col items-center"
            align="end"
          >
            <q-btn
              size="sm"
              round
              color="blue-grey-6"
              push
              icon="add"
              @click="newCustomer"
              :disable="addBtn"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-list
          bordered
          dark
          separator
          style="opacity: 0.85"
          class="q-mb-md"
        >
          <q-item-label header>Entregue:</q-item-label>
          <div
            v-for="(customer, index) in customers"
            :key="index"
          >
            <div v-if="customer.status === '1'">
              <q-item
                disable="true"
                clickable
                v-ripple
              >
                <q-item-section
                  avatar
                  rounded
                >
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="clear"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-amber">{{ customer.nickname }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-list>
        <q-list
          bordered
          dark
          separator
        >
          <q-item-label header>Próximos Clientes:</q-item-label>
          <draggable
            v-model="next"
            group="people"
            @start="drag=true"
            @end="updateRoute"
          >
            <div
              v-for="(customer, index) in next"
              :key="index"
            >
              <div v-if="customer.nickname !==  'Final da Rota'">
                <q-item
                  clickable
                  v-ripple
                >
                  <q-item-section
                    avatar
                    rounded
                  >
                    <q-avatar
                      color="accent"
                      text-color="white"
                      icon="done"
                      style="opacity: 0.75"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      class="text-amber"
                      style="font-weight: bold; opacity: 0.85;"
                    >{{ customer.nickname }}</q-item-label>
                    <q-item-label
                      caption
                      style="font-weight: 500; font-size: 11px"
                    >Previsão:</q-item-label>
                    <q-item-label
                      caption
                      style="font-weight: 500; font-size: 11px"
                    >{{ customer.time }}</q-item-label>
                  </q-item-section>
                  <q-item-section
                    avatar
                    side
                    top
                  >
                    <q-btn
                      push
                      round
                      size="xs"
                      @click="makeSale(customer)"
                      color="teal"
                      text-color="white"
                      icon="fas fa-dollar-sign"
                      style="opacity: 0.75"
                    />
                    <q-btn
                      size="xs"
                      push
                      round
                      @click="removeCompany(customer)"
                      color="red-5"
                      text-color="white"
                      icon="fas fa-trash-alt"
                      style="opacity: 0.75"
                      class="q-mt-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </draggable>
        </q-list>
      </q-card-section>
      <q-card-section class="q-pt-none">

        <q-list
          bordered
          dark
          separator
        >

          <q-item-label header>Ponto Final:</q-item-label>
          <!-- <div v-if="end.nickname">
            <q-item>
              <q-item-section>
                <q-item-label
                  class="text-amber"
                  style="font-weight: bold; opacity: 0.85;"
                >{{ end.nickname }}</q-item-label>
                <q-item-label
                  caption
                  style="font-weight: 500; font-size: 11px"
                >Previsão:</q-item-label>
                <q-item-label
                  caption
                  style="font-weight: 500; font-size: 11px"
                >{{ end.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </div> -->
          <q-select
            dark
            :options="destiny"
            borderless
            @input="updateRoute"
            v-model="Ldestiny"
            dense
            class="text-uppercase"
            :rules="[val => !!val || 'Campo obrigatório.']"
          >
            <template v-slot:selected>
              <q-item>
                <q-item-section>
                  <q-item-label
                    class="text-amber"
                    style="font-weight: bold; opacity: 0.85;"
                  >{{ end.nickname }}</q-item-label>
                  <q-item-label
                    caption
                    style="font-weight: 500; font-size: 11px"
                  >Previsão:</q-item-label>
                  <q-item-label
                    caption
                    style="font-weight: 500; font-size: 11px"
                  >{{ end.time }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="addCustomer"
      full-width
    >
      <q-card dark>
        <q-card-section>
          <div class="text-h5">Adicionar Cliente</div>
        </q-card-section>
        <q-card-section>
          <pre-sell
            :ongoing="route_id"
            @checkRoute="checkRoute"
            @customerUpdated="customerUpdated"
          ></pre-sell>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="saleDialog">
      <q-card
        dark
        style="width: 400px; max-width: 80vw;"
      >
        <q-card-section>
          <div class="text-h5">Venda</div>
        </q-card-section>
        <q-separator
          color="white"
          style="opacity:0.85"
        />
        <q-form
          ref="form"
          autofocus
          spellcheck="false"
          autocomplete="off"
          @submit.prevent.stop="submitSell"
          greedy
        >
          <q-card-section>
            <div class="row q-ml-md">
              <span class="poppins q-mt-md">O Motorista já passou pelo cliente?</span>
            </div>
            <div class="row q-ml-md">
              <q-radio
                dense
                v-model="delivered"
                dark
                val="yes"
                label="Sim"
              />
              <q-radio
                dark
                dense
                v-model="delivered"
                val="no"
                label="Não"
                class="q-ml-md"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-list
              dark
              separator
            >

              <q-item
                v-for="sale, index in saleProducts"
                :key="index"
                class="q-mb-lg"
              >
                <q-item-section>
                  <q-item-label class="poppins  q-mt-md">
                    {{sale.product}}
                  </q-item-label>
                  <q-item-label>
                    <div class="row">

                      <div class="col">
                        <q-input
                          dark
                          outlined
                          label="Qtd Abastecida"
                          v-model="sale.qty"
                          dense
                          mask="#.#"
                          fill-mask="0"
                          reverse-fill-mask
                          :suffix="sale.unity"
                        />
                      </div>

                      <div class="col">
                        <q-input
                          class="q-ml-md"
                          dark
                          outlined
                          label="Qtd Entregue"
                          v-model="sale.qty_sell"
                          dense
                          mask="#.#"
                          fill-mask="0"
                          reverse-fill-mask
                          :suffix="sale.unity"
                          :rules="[val => !!val || 'Campo obrigatório.' ]"
                        />
                      </div>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator dark />
          <q-card-actions
            align="around"
            class="q-my-md"
          >
            <q-btn
              push
              label="Cancelar"
              color="red-6"
              v-close-popup
              @click="clearFields(saleProducts)"
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
import PreSell from 'src/pages/PreSell.vue'
import draggable from 'vuedraggable'
import apiClient from 'src/services/api'
import EventBus from 'src/boot/EventBus'

export default {
  name: 'DeliveryRoute',
  components: {
    draggable,
    PreSell
  },
  props: {
    routeOrder: Array,
    routeNextCostumers: null
  },
  data () {
    return {
      customers: [],
      next: [],
      addCustomer: false,
      addBtn: true,
      flag: '',
      route_id: '',
      Ldestiny: [],
      destiny: [
        {
          value: '-46.49422334086506,-23.5965395361296541',
          label: 'São Paulo'
        },
        {
          value: '-46.34484532012368,-23.047782742801957',
          label: 'Piracaia'
        }
      ],
      end: [],
      delivered: 'no',
      sale: [{
        presell_id: null,
        id: null,
        qty: null,
        qty_sell: null
      }],
      saleDialog: false,
      saleProducts: [],
      submitting: false
    }
  },
  methods: {
    submitSell () {
      const url = '/sale'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: {
          route_id: this.flag,
          products: this.saleProducts,
          delivered: this.delivered
        }
      }
      apiClient.post(url, params, config).then(response => {
        console.log(response.data)
        if (response.data === 'ok') {
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Venda realizada com sucesso!',
            position: 'top-right'
          })
        }
      }).catch(error => {
        if (error.response) {
          // this.handleError()
          this.submitting = false
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // this.handleError()
          this.submitting = false
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          // this.handleError()
          console.log('Error', error.message)
        }
      })
    },
    clearFields (item) {
      item.forEach(function (val) {
        val.qty = 0
        val.qty_sell = 0
      })
    },
    makeSale (item) {
      this.saleProducts = item.products
      this.saleDialog = true
    },
    removeCompany (item) {
      this.$q.notify({
        color: 'red-6',
        icon: 'thumb_up_off_alt',
        message: 'Deseja remover a empresa da Rota?',
        position: 'center',
        actions: [
          {
            label: 'Não',
            color: 'negative',
            handler: () => {
            }
          },
          {
            label: 'Sim',
            color: 'yellow',
            handler: () => {
              this.routeDeleteCustomer(item)
            }
          }
        ],
        timeout: Math.random() * 5000 + 3000
      })
    },
    routeDeleteCustomer (item) {
      const url = '/route/ongoing/removeCustomer'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: item
      }
      apiClient.post(url, params, config).then(response => {
        if (response.data === 'ok') {
          EventBus.$emit('customerUpdated', response.data)
          this.addCustomer = false
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Cliente removido com sucesso!',
            position: 'top-right'
          })
        }
      }).catch(error => {
        if (error.response) {
          // this.handleError()
          this.submitting = false
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // this.handleError()
          this.submitting = false
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          // this.handleError()
          console.log('Error', error.message)
        }
      })
    },
    updateRoute (item) {
      const url = '/route/ongoing/updateOrder'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const params = {
        data: this.next,
        end: this.Ldestiny
      }
      apiClient.post(url, params, config).then(response => {
        console.log(response.data)
        if (response.data === 'ok') {
          EventBus.$emit('customerUpdated', response.data)
          this.addCustomer = false
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Ordem de entrega atuallizada com sucesso!',
            position: 'top-right'
          })
        }
      }).catch(error => {
        if (error.response) {
          // this.handleError()
          this.submitting = false
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // this.handleError()
          this.submitting = false
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          // this.handleError()
          console.log('Error', error.message)
        }
      })
    },
    newCustomer () {
      this.addCustomer = !this.addCustomer
    },
    checkRoute (val) {
      console.log(val)
      this.route_id = ''
      this.route_id = this.flag
    },
    customerUpdated () {
      this.addCustomer = false
    },
    destinySelect (list) {
      const self = this
      list.forEach(function (item) {
        if (item.nickname === 'Final da Rota') {
          self.destiny.forEach(function (val) {
            if (val.value === item.markers.pointB) {
              self.Ldestiny = val.label
              self.end.nickname = val.label
              self.end.time = item.time
            }
          })
        }
      })
    }
  },
  watch: {
    routeOrder: function (val) {
      this.customers = val
      this.flag = val[0].route_id
      console.log(this.customers)
    },
    routeNextCostumers: function (val) {
      this.next = val.matrix
      this.addBtn = false
      this.destinySelect(this.next)
    }
  }
}
</script>

<style scoped>
</style>
