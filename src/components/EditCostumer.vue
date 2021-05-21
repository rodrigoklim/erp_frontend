<template>
  <div
    class="EditCostumer"
    style="overflow:hidden"
  >
    <q-card dark>
      <q-card-section>
        <div class="row">
          <div class="col-11">
            <div class="text-h4 text-primary">{{costumer.company_name}}</div>
          </div>
          <div class="col-1 column items-end">
            <q-btn
              flat
              v-close-popup
              round
              dense
              icon="close"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="text-caption"
            style="color: #4DA3FE"
          >Edite os dados desejados</div>
        </div>
      </q-card-section>
      <q-separator
        dark
        inset
      />
      <q-card-section
        style="max-height: 90vh"
        class="scroll"
      >
        <div>
          <q-splitter
            v-model="splitterModel"
            style="height: 500px"
          >

            <template v-slot:before>
              <q-tabs
                v-model="tab"
                vertical
                class="text-primary"
              >
                <q-tab
                  name="register"
                  icon="account_box"
                  label="Cadastro"
                />
                <q-tab
                  name="address"
                  icon="edit_location_alt"
                  label="Endereço"
                />
                <q-tab
                  name="payment"
                  icon="attach_money"
                  label="Pagamento"
                />
                <q-tab
                  name="products"
                  icon="fas fa-dolly"
                  label="Produtos"
                />
                <q-tab
                  name="submitEdit"
                  icon="done_outline"
                  label="Gravar"
                  @click="getData"
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <!-- Register Data -->
                <q-tab-panel
                  dark
                  name="register"
                  style="background-color:#1d1d1d"
                >
                  <div class="text-h5 q-mb-md">Dados Cadastrais</div>
                  <div v-if="!editedRegister">
                    <div class="row">
                      <div class="col">
                        <div class="row justify-center items-center content-start q-pa-none q-ma-none">
                          <q-input
                            style="width: 100%;"
                            v-model="form.company_name"
                            autocomplete="off"
                            spellcheck="false"
                            class="text-uppercase"
                            outlined
                            dark
                            label="Nome Fantasia"
                            :rules="[val => !!val || 'Campo obrigatório.']"
                          />
                        </div>
                        <!-- fiscal state | HeadQuarters -->
                        <div
                          class="row justify-start items-center content-start q-pa-none q-ma-none"
                          style="background-color:#1d1d1d"
                        >
                          <div class="col-6">
                            <div class="row">
                              <div class="col-6">
                                <div
                                  class="text q-mt-sm"
                                  style="font-weight: 300; font-size: 1.1rem"
                                >Nota Fiscal:</div>
                              </div>
                              <div class="col-2">
                                <q-field
                                  ref="nf"
                                  dark
                                  bottom-slots
                                  :value="form.nf"
                                  :rules="[val => !!val]"
                                  style="font-size: 16px"
                                >
                                  <template v-slot:control>
                                    <q-toggle
                                      dark
                                      ref="nf"
                                      v-model="form.nf"
                                      color="teal"
                                      :false-value="false"
                                      :true-value="true"
                                      size="lg"
                                      checked-icon="check"
                                      unchecked-icon="clear"
                                    />
                                  </template>
                                  <template v-slot:error>
                                    Campo obrigatório.
                                  </template>
                                </q-field>
                              </div>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="row">
                              <div class="col-4">
                                <div
                                  class="text q-mt-sm"
                                  style="font-weight: 300; font-size: 1.1rem"
                                >Tipo:</div>
                              </div>
                              <div class="col-3">
                                <q-field
                                  ref="nf"
                                  bottom-slots
                                  :value="form.company_type"
                                  :rules="[val => !!val]"
                                  style="font-size: 16px"
                                >
                                  <template v-slot:control>
                                    <div class="row">
                                      <div class="col">
                                        <div class="row">
                                          <q-radio
                                            ref="company_type"
                                            dark
                                            v-model="form.company_type"
                                            val="matriz"
                                            label="Matriz"
                                          />
                                        </div>
                                        <div class="row">
                                          <q-radio
                                            dark
                                            v-model="form.company_type"
                                            val="filial"
                                            label="Filial"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                  </template>
                                  <template v-slot:error>
                                    Campo obrigatório.
                                  </template>
                                </q-field>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Heaquerters or Subsidiary | Zone -->
                        <div class="row justify-center items-center content-start q-mt-lg">
                          <div
                            class="row justify-start items-top content-start"
                            v-if="form.company_type == 'filial'"
                          >
                            <q-select
                              label="Matriz"
                              dark
                              outlined
                              v-model="form.parent_id"
                              :options="parentList"
                              emit-value
                              map-options
                              style="width:100%"
                            />
                          </div>
                        </div>
                        <!-- contact -->
                        <div class="row justify-center items-center content-start q-mt-lg">
                          <q-input
                            style="width: 100%;"
                            v-model="form.contact"
                            outlined
                            dark
                            class="text-uppercase"
                            label="Contato"
                            :rules="[val => !!val || 'Campo obrigatório.']"
                          />
                        </div>
                        <!-- phones - criar lista para editar -->
                        <div class="row justify-center items-center content-start q-mt-lg">
                          <div class="col">
                            <phone
                              :editPhones="phones"
                              :phoneNumbers="getPhones"
                              @responsePhones="numbers"
                            ></phone>
                          </div>
                        </div>

                        <!-- emails -->
                        <div class="row justify-start items-center content-start q-mt-lg">
                          <div class="row fit justify-start items-center content-start">
                            <div class="col">
                              <q-select
                                label="Email"
                                outlined
                                dark
                                type="email"
                                v-model="form.email"
                                hint="Insira um e-mail apertando o Enter após a digitação."
                                use-input
                                use-chips
                                multiple
                                :rules="[val => !!val || 'Campo obrigatório.']"
                                hide-dropdown-icon
                                input-debounce="0"
                                @new-value="createValue"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Save Btn -->
                    <div class="row justify-center items-center content-start q-mt-lg">
                      <div class="col">
                        <div class="row justify-center q-mt-lg">
                          <q-btn
                            color="primary"
                            push
                            label="Salvar Alterações"
                            @click="saveRegister"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="q-mt-lg"
                  ><br>
                    <div
                      class="text-h5 text-uppercase q-mt-lg"
                      style="color: teal"
                    >
                      Dados Cadastrais alterados com sucesso!!
                      <div
                        class="text-caption"
                        style="color: #FFBF00"
                      >
                        Não esqueça de salvar as alterações.
                      </div>
                    </div>
                  </div>

                </q-tab-panel>

                <!-- Address -->
                <q-tab-panel
                  dark
                  name="address"
                  style="background-color:#1d1d1d; color:white; opacity:0.75"
                >
                  <div class="row">
                    <div class="text-h4 q-mb-md">Endereço</div>
                  </div>
                  <br>
                  <q-list
                    bordered
                    style="background-color:#3d3d3d"
                  >
                    <div
                      v-for="
                    (address,
                    index)
                    in
                    addressList"
                      :key="index"
                    >
                      <q-item
                        clickable
                        v-ripple
                      >
                        <q-item-section>{{address.full_address.toUpperCase()}}</q-item-section>
                        <q-item-section
                          avatar
                          @click="deleteAddress(index)"
                        >
                          <q-icon
                            color="negative"
                            name="delete"
                          />
                        </q-item-section>
                      </q-item>
                    </div>
                  </q-list>
                  <div class="row q-mt-lg">
                    <q-btn
                      push
                      label="Adicionar Endereço de Entrega"
                      icon="fas fa-map-marker-alt"
                      color="primary"
                      @click="newAddress = !newAddress"
                    />
                  </div>
                  <div
                    class="row"
                    v-if="newAddress === true"
                    style="overflow:hidden"
                  >
                    <q-form
                      ref="form"
                      autofocus
                      spellcheck="false"
                      autocomplete="off"
                      @submit.prevent.stop="beforeSubmitAddress"
                      greedy
                    >
                      <div class="col">
                        <div class="row justify-center">
                          <div class="col">
                            <delivery-address
                              :company="company"
                              :submitAddress="msg"
                              @addressFilled="addressFilled"
                            />
                          </div>
                        </div>
                        <div class="row justify-center">
                          <q-btn
                            color="primary"
                            push
                            label="Cadastrar Novo Endereço"
                            type="submit"
                          />
                        </div>
                      </div>
                    </q-form>
                  </div>
                </q-tab-panel>

                <!-- Payment -->
                <q-tab-panel
                  dark
                  name="payment"
                  style="background-color:#1d1d1d"
                >
                  <div class="text-h4 q-mb-md">Método de Pagamento</div>

                  <div v-if="!editedPay">
                    <div class="text-caption">{{costumer.pay_method.payment_description}}</div>
                    <div class="row">
                      <div class="col">
                        <payment-methods
                          :getPayment="pamsg"
                          @paymentMethod="paymentMethod"
                        ></payment-methods>
                      </div>
                    </div>
                    <div class="row justify-center q-mt-lg q-pt-lg">
                      <div class="col">
                        <div class="row justify-center">
                          <q-btn
                            color="primary"
                            push
                            label="Salvar Alteração de Pagamento"
                            @click="pamsg++"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="q-mt-lg"
                  ><br>
                    <div
                      class="text-h5 text-uppercase q-mt-lg"
                      style="color: teal"
                    >
                      Método de Pagamento alterado com sucesso!!
                      <div
                        class="text-caption"
                        style="color: #FFBF00"
                      >
                        Para entrar em rigor as alterações necessitam de aprovação do depto financeiro.
                      </div>
                      <br><br>
                      <div
                        class="text-caption"
                        style="color: #FFBF00"
                      >
                        Não esqueça de salvar as alterações.
                      </div>
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Products -->
                <q-tab-panel
                  dark
                  name="products"
                  style="background-color:#1d1d1d"
                >
                  <div class="text-h4 q-mb-md">Produtos</div>
                  <div v-if="!edited">
                    <div class="row">
                      <div class="col">
                        <product-select
                          :editProducts="editProducts"
                          :submitProduct="pmsg"
                          @productPicked="productPicked"
                        ></product-select>
                      </div>
                    </div>

                    <div class="row justify-center q-mt-lg q-pt-lg">
                      <div class="col">
                        <div class="row justify-center">
                          <q-btn
                            color="primary"
                            push
                            label="Salvar Alteração dos Produtos"
                            @click="pmsg++"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="row q-mt-lg"
                    v-else
                  >
                    <div
                      class="text-h5 text-uppercase"
                      style="color: teal"
                    >
                      Produtos alterados com sucesso!!
                      <div
                        class="text-caption"
                        style="color: #FFBF00"
                      >
                        Não esqueça de salvar as alterações.
                      </div>
                    </div>
                  </div>

                </q-tab-panel>

                <!-- Save -->
                <q-tab-panel
                  dark
                  name="submitEdit"
                  style="background-color:#1d1d1d"
                >
                  <div class="text-h4 q-mb-md">Gravar Alterações</div>
                  <div class="row q-pt-lg justify-center items-center">
                    <div class="col-3">
                      <div class="row justify-start">
                        <q-icon
                          name="verified"
                          style="color: teal; font-size:5em"
                        />
                      </div>
                    </div>
                    <div class="col-9">
                      <div class="row justify-start">
                        <div class="text-h5">
                          Deseja gravar as alterações feitas?
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row justify-around q-pt-lg">
                    <q-btn
                      size="lg"
                      color="red-6"
                      v-close-popup
                      label="Cancelar"
                    />
                    <q-btn
                      size="lg"
                      color="teal"
                      label="Gravar Alterações"
                      @click="submit"
                      :loading="submitting"
                    >
                      <template v-slot:loading>
                        <q-spinner-orbit
                          color="white"
                          size="1.35em"
                        />
                      </template>

                    </q-btn>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import DeliveryAddress from './DeliveryAddress.vue'
import PaymentMethods from './PaymentMethods.vue'
import Phone from './Phone.vue'
import ProductSelect from './ProductSelect.vue'

export default {
  name: 'editCostumer',
  components: {
    DeliveryAddress,
    PaymentMethods,
    ProductSelect,
    Phone
  },
  data () {
    return {
      tab: 'register',
      innerTab: 'innerMails',
      splitterModel: 20,
      form: {
        company_name: '',
        nf: false,
        company_type: '',
        email: [],
        phones: []
      },
      addressList: [],
      parentList: [],
      newAddress: false,
      newAddressSubmit: [],
      company: '',
      msg: 0,
      pmsg: 0,
      pamsg: 0,
      getPhones: 0,
      submitData: {
        form: {},
        address: [],
        payment: [],
        products: []

      },
      phones: [],
      editProducts: [],
      edited: false,
      editedPay: false,
      editedRegister: false,
      submitting: false
    }
  },
  props: {
    costumer: [Object, Array]
  },
  methods: {
    createValue (val, done) {
      const e = val.split('@')
      if (e.length === 2) {
        done(val)
      }
    },
    deleteAddress (i) {
      this.addressList.splice(i, 1)
    },
    beforeSubmitAddress () {
      this.msg++
      const self = this
      setTimeout(function () {
        self.submitAddress()
      }, 800)
    },
    addressFilled (data) {
      this.newAddressSubmit = [data]
    },
    submitAddress () {
      this.addressList.push(this.newAddressSubmit[0][0])
      this.newAddress = false
    },
    getData () {
      console.log(this.submitData)
    },
    productPicked (data) {
      this.costumer.products = ''
      this.costumer.products = data
      console.log(this.costumer.products = data)
      this.submitData.products = data
      this.editProducts = data
      this.edited = true
    },
    numbers (data) {
      this.form.phones = data
    },
    saveRegister () {
      const self = this
      this.getPhones++
      setTimeout(function () {
        self.submitData.form = self.form
        console.log(self.submitData)
      }, 800)
      this.editedRegister = true
    },
    paymentMethod (data) {
      this.costumer.payment = ''
      this.costumer.payment = data
      this.submitData.payment = data
      this.editedPay = true
    },
    submit () {
      this.submitting = true
      const url = '/costumer/edit'
      const data = {
        params: {
          form: this.submitData,
          c_id: this.costumer.c_id
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
          this.$router.push('/', () => {
            this.$q.notify({
              color: 'teal',
              icon: 'check',
              message: 'Dados alterados com sucesso!',
              position: 'top-right'
            })
          })
          console.log('response', response.data)
        } else {
          this.submitting = false
          console.log('response', response.data)
          this.$router.push('/clientes', () => {
            this.$q.notify({
              color: 'tomato',
              icon: 'warning',
              message: 'As alterações não foram salvas! Tente novamente...',
              position: 'top-right'
            })
          })
        }
        console.log(response.data)
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
        color: 'red-7',
        icon: 'warning',
        message: 'As alterações não foram salvas, falha no envio!',
        position: 'top-right'
      })
    }
  },
  watch: {
    costumer () {
      this.form.company_name = this.costumer.company_name
    }
  },
  mounted () {
    const id = this.costumer.c_id.split('_')
    const c = this.costumer
    this.company = id[0]
    this.form.company_name = c.company_name
    this.editPayment = c.pay_method
    this.editProducts = c.products
    if (c.account.nf === '1') {
      this.form.nf = true
    } else {
      this.form.nf = false
    }
    if (id[0] === 'np') {
      this.form.company_type = 'matriz'
      this.form.contact = c.name
    } else {
      this.form.company_type = c.company_type
      this.form.contact = c.contact
    }

    const emailBD = c.email.split(';')

    Object.keys(emailBD).forEach((key) => {
      this.form.email.push(emailBD[key])
    })

    this.addressList = c.address

    if (c.phone_5) {
      this.phones.push(
        [c.phone_5, c.phone_5zap],
        [c.phone_4, c.phone_4zap],
        [c.phone_3, c.phone_3zap],
        [c.phone_2, c.phone_2zap],
        [c.phone_1, c.phone_1zap]
      )
      return false
    }

    if (c.phone_4) {
      this.phones.push(
        [c.phone_4, c.phone_4zap],
        [c.phone_3, c.phone_3zap],
        [c.phone_2, c.phone_2zap],
        [c.phone_1, c.phone_1zap]
      )
      return false
    }

    if (c.phone_3) {
      this.phones.push(
        [c.phone_3, c.phone_3zap],
        [c.phone_2, c.phone_2zap],
        [c.phone_1, c.phone_1zap]
      )
      return false
    }
    if (c.phone_2) {
      this.phones.push(
        [c.phone_2, c.phone_2zap],
        [c.phone_1, c.phone_1zap]
      )
      return false
    }

    if (c.phone_1) {
      this.phones.push([c.phone_1, c.phone_1zap])
      return false
    }
  }
}
</script>

<style>
.scroll {
  background-color: #1d1d1d;
}
</style>