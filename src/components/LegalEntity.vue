<template>
  <div class="legalEntity">
    <div class="row">
      <h4 class="q-ma-sm q-mb-none">Pessoa Jurídica</h4>
    </div>
    <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
      <div class="col-11">
        <div class="row">
          <h5
            class="q-mt-lg q-ml-lg q-mb-sm"
            style="font-family:raleway"
          >Dados Cadastrais</h5>
        </div>
        <q-form
          ref="form"
          autofocus
          spellcheck="false"
          autocomplete="off"
          @submit.prevent.stop="beforeSubmit"
          greedy
        >
          <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
            <div class="col-11">
              <div class="row fit justify-center items-center content-start">
                <search-cnpj
                  style="width: 100%;"
                  @update="companyData"
                ></search-cnpj>
              </div>
              <!-- names -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <q-input
                  style="width: 100%;"
                  v-model="form.ie"
                  outlined
                  readonly
                  dark
                  label="Inscrição Estadual"
                />
              </div>
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <q-input
                  style="width: 100%;"
                  v-model="form.corporate_name"
                  outlined
                  dark
                  readonly
                  label="Razão Social"
                />
              </div>
              <div class="row fit justify-center items-center content-start q-mt-lg">
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
              <!-- main activity -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <q-select
                  outlined
                  v-model="form.main_activity"
                  :options="activitiesList"
                  style="width: 100%;"
                  label="Atividade Principal"
                  dark
                  use-chips
                  use-input
                  new-value-mode="add-unique"
                  input-debounce="0"
                  @filter="activitySelection"
                  :rules="[val => !!val || 'Campo obrigatório.']"
                />
              </div>
              <!-- fiscal state | Register Situation -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <div class="col-6">
                  <q-input
                    style="width: 100%;"
                    v-model="form.register_situation"
                    outlined
                    readonly
                    dark
                    label="Situação Cadastral"
                  />
                </div>
                <div class="col-6">
                  <div class="row">
                    <div class="col-6">
                      <div
                        class="text q-mt-sm q-ml-md"
                        style="font-weight: 300; font-size: 1.1rem"
                      >Nota Fiscal:</div>
                    </div>
                    <div class="col-6">
                      <q-field
                        outlined
                        dark
                        class="row q-ml-md"
                        style="background-color: #1d1d1d"
                      >
                        <template v-slot:control>
                          <div class="col-6 self-center q-pb-sm">
                            <div
                              class="text q-mt-sm q-ml-md text-uppercase text-caption"
                              style="font-weight: 300; font-size: 1.1rem"
                            >Nota Fiscal:</div>
                          </div>
                          <div class="col-6">Não
                            <q-toggle
                              ref="nf"
                              v-model="form.nf"
                              color="teal"
                              indeterminate-value="false"
                              size="lg"
                              checked-icon="check"
                              label="Sim"
                              unchecked-icon="clear"
                              class="q-ml-2"
                            />
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
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <div class="col-6">
                  <div class="row">
                    <div class="col-4">
                      <div
                        class="text q-mt-sm"
                        style="font-weight: 300; font-size: 1.1rem"
                      >Tipo:</div>
                    </div>
                    <div class="col-8">
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
                <div class="col-6 self-start">
                  <div
                    class="row fit justify-start items-top content-start"
                    v-if="form.company_type == 'filial'"
                  >
                    <q-select
                      label="Matriz"
                      dark
                      outlined
                      v-model="form.parent_id"
                      :options="parentList"
                      use-input
                      emit-value
                      map-options
                      @filter="parentSelection"
                      style="width:100%"
                    />
                  </div>
                </div>
              </div>
              <!-- contact -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
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
              <!-- phones -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <div class="col">
                  <phone
                    ref="phone"
                    :phoneNumbers="getPhones"
                    @responsePhones="numbers"
                  ></phone>
                </div>
              </div>
              <!-- emails -->
              <div class="row fit justify-start items-center content-start q-mt-lg">
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
            <!-- /Register Data END -->

            <!-- separator -->
            <div class="col-12">
              <div class="row justify-center q-ma-lg">
                <div class="col-12">
                  <q-separator
                    color="white"
                    style="opacity:0.85"
                    class="q-mt-lg"
                  />
                </div>
              </div>
            </div>
            <!-- Payment Methods -->
            <div class="row  justify-center fit items-center content-start">
              <div class="col-12">
                <payment-methods
                  v-if="form.company_type != 'filial'"
                  ref="paymentMethod"
                  :getPayment="pamsg"
                  @paymentMethod="paymentMethod"
                ></payment-methods>
              </div>
            </div>
            <!-- /Payment Methods -->
            <!-- separator -->
            <div class="col-12">
              <div class="row justify-center q-ma-lg">
                <div class="col-12">
                  <q-separator
                    color="white"
                    style="opacity:0.85"
                    class="q-mt-lg"
                  />
                </div>
              </div>
            </div>
            <!-- delivery address -->
            <div class="row  justify-center fit items-center content-start">
              <div class="col-12">
                <delivery-address
                  :fillAddress="addressSent"
                  @addressFilled="addressFilled"
                  :submitAddress="msg"
                  :company="company"
                ></delivery-address>
              </div>
            </div>
            <!-- / delivery address -->
            <!-- separator -->
            <div class="col-12">
              <div class="row justify-center q-ma-lg">
                <div class="col-12">
                  <q-separator
                    color="white"
                    style="opacity:0.85"
                    class="q-mt-lg"
                  />
                </div>
              </div>
            </div>
            <!-- products -->
            <div class="row  justify-center fit items-center content-start">
              <div class="col-12">
                <product-select
                  ref="productSelect"
                  :submitProduct="pmsg"
                  @productPicked="productPicked"
                ></product-select>
              </div>
            </div>
            <!-- /products -->

          </div>
          <!-- submit buttons -->
          <div class="row fit justify-center q-mt-lg q-mb-lg">
            <q-btn
              label="Criar Cliente"
              style="width: 300px"
              push
              type="submit"
              color="primary"
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
        </q-form>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Phone from './Phone.vue'
import SearchCnpj from './SearchCnpj.vue'
import InputTag from 'vue-input-tag'
import PaymentMethods from './PaymentMethods.vue'
import DeliveryAddress from './DeliveryAddress.vue'
import ProductSelect from './ProductSelect.vue'
import { scroll, throttle } from 'quasar'
import apiClient from 'src/services/api'

const { getScrollTarget, setScrollPosition } = scroll

Vue.component('input-tag', InputTag)

export default {
  name: 'LegalEntity',
  components: {
    SearchCnpj,
    Phone,
    PaymentMethods,
    DeliveryAddress,
    ProductSelect
  },
  data () {
    return {
      form: {
        cnpj: '',
        ie: '',
        corporate_name: '',
        company_name: '',
        nf: '',
        company_type: '',
        contact: '',
        main_activity: null,
        register_situation: '',
        phone: []
      },
      phoneNumbers: [],
      address: [],
      products: [],
      payment: [],
      getPhones: 0,
      addressSent: {},
      msg: 0,
      pmsg: 0,
      pamsg: 0,
      validNF: Boolean,
      modelAdd: null,
      sendRequest: [],
      parentList: [],
      submitting: false,
      company: '',
      subflag: 0,
      activitiesList: [],
      activitiesListOptions: [],
      parentListOptions: []
    }
  },
  methods: {
    companyData (data) {
      this.form.cnpj = data.tax_id
      if (data.sintegra.home_state_registration) {
        this.form.ie = data.sintegra.home_state_registration
      } else {
        this.form.ie = 'ISENTO'
      }
      this.form.corporate_name = data.name.toUpperCase()
      this.form.register_situation = data.registration.status.toUpperCase()
      this.addressSent = data.address
    },
    numbers (phoneNumbers) {
      this.form.phone = phoneNumbers
    },
    redirect () {
      this.$emit('customerCreated', 'edit')
    },
    beforeSubmit () {
      this.submitting = true
      this.subflag = 0
      if (this.form.nf === '') {
        const el = this.$refs.nf.$el
        this.scrollToElement(el)
        this.$q.notify({
          message: 'Escolha uma opção para nota fiscal!',
          icon: 'warning',
          color: 'red-7'
        })
        this.submitting = false
        return false
      }

      // company_type validation
      if (this.form.company_type === '') {
        const el = this.$refs.company_type.$el
        this.scrollToElement(el)
        this.$q.notify({
          message: 'Determine se a Empresa é Matriz ou Filial!',
          icon: 'warning',
          color: 'red-7'
        })
        this.submitting = false
        return false
      }
      this.msg++
      this.pmsg++
      this.pamsg++
      this.getPhones++
      // const self = this
      // setTimeout(function () {
      //   self.submit()
      // }, 800)
    },
    submit () {
      const url = '/costumer/le/create'
      const data = {
        params: {
          form: this.form,
          payment: this.payment,
          address: this.address,
          products: this.products
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
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Cliente Cadastrado com sucesso!',
            position: 'top-right'
          })
          this.redirect()
        } else {
          this.submitting = false
          this.$q.notify({
            color: 'tomato',
            icon: 'warning',
            message: 'Cliente não cadastrado, verifique os dados!',
            position: 'top-right'
          })
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
          // this.handleError()
          console.log('Error', error.message)
        }
      })
    },
    handleError () {
      this.$q.notify({
        color: 'red-7',
        icon: 'warning',
        message: 'Cliente não cadastrado, falha no envio!',
        position: 'top-right'
      })
    },
    addressFilled (data) {
      this.address = data
    },
    productPicked (data) {
      this.products = data
      if (this.products.length === 0) {
        const el = this.$refs.productSelect.$el
        this.scrollToElement(el)
        this.$q.notify({
          message: 'Insira um produto.',
          icon: 'warning',
          color: 'red-7'
        })
        this.submitting = false
        return false
      } else {
        this.subflag++
      }
    },
    paymentMethod (data) {
      if (data.control === '' || data.control.length === 0) {
        const el = this.$refs.paymentMethod.$el
        this.scrollToElement(el)
        this.$q.notify({
          message: 'Insira um prazo válido.',
          icon: 'warning',
          color: 'red-7'
        })
        this.submitting = false
        return false
      } else if (data.term === '') {
        this.$q.notify({
          message: 'Insira um prazo válido.',
          icon: 'warning',
          color: 'red-7'
        })
        this.submitting = false
        return false
      } else {
        this.subflag++
      }
      this.payment = data
    },
    scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setScrollPosition(target, offset, duration)
    },
    createValue (val, done) {
      const e = val.split('@')
      if (e.length === 2) {
        done(val)
      }
    },
    activitySelection (val, update) {
      if (val === '') {
        update(() => {
          this.activitiesList = this.activitiesListOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.activitiesList = this.activitiesListOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    parentSelection (val, update) {
      if (val === '') {
        update(() => {
          this.parentList = this.parentListOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.parentList = this.parentListOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted () {
    this.submit = throttle(this.submit, 500)
    this.company = 'le'
    const self = this
    const url = '/costumer/le/list'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      const le = response.data[0]
      this.activitiesListOptions = response.data[1]

      Object.keys(le).forEach((key) => {
        const id = le[key].id
        const company = le[key].company_name.toUpperCase()

        self.parentListOptions.push({
          value: id,
          label: company
        })
      })
    }).catch(error => {
      console.log('error', error)
    })
  },
  watch: {
    subflag: function (val) {
      if (val === 2) {
        this.submit()
      } else {
        this.submitting = false
      }
    }
  }
}
</script>
<style>
.q-radio {
  font-weight: 300;
}
.vue-input-tag {
  font-weight: 300;
  background-color: #1b1b1b;
  border-block-color: #818181;
  opacity: 0.75;
}
.vue-input-tag-wrapper {
  background-color: #1b1b1b;
  border: 1px solid #818181;
  overflow: hidden;
  padding-left: 4px;
  padding-top: 4px;
  cursor: text;
  text-align: left;
  -webkit-appearance: textfield;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.new-tag {
  color: #fff !important;
  font-size: 17px !important;
}
.input-tag {
  background-color: #616161 !important;
  border-radius: 2px !important;
  border: 1px solid #313131 !important;
  color: #fff !important;
  display: inline-block;
  font-size: 17px !important;
  font-weight: 400;
  margin-bottom: 4px;
  margin-right: 4px;
  padding: 3px;
}
.vue-input-tag-wrapper .input-tag .remove:empty:before {
  content: " x";
  color: tomato;
}
</style>