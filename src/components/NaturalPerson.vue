<template>
  <div class="naturalPerson">
    <div class="row">
      <h4 class="q-ma-sm q-mb-none">Pessoa Física</h4>
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
              <!-- search CPF -->
              <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
                <div class="row fit justify-center items-center content-start">
                  <search-cpf
                    style="width: 100%;"
                    @update="personData"
                  ></search-cpf>
                </div>
              </div>
              <!-- name -->
              <div class="row fit justify-center items-center content-start q-mt-lg">
                <q-input
                  style="width: 100%;"
                  v-model="form.name"
                  outlined
                  dark
                  readonly
                  label="Nome"
                />
              </div>
              <!-- company name -->
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
              <!-- /Register Data END -->
            </div>
          </div>
          <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
            <div class="col-11">
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
import DeliveryAddress from './DeliveryAddress.vue'
import PaymentMethods from './PaymentMethods.vue'
import Phone from './Phone.vue'
import ProductSelect from './ProductSelect.vue'
import SearchCpf from './SearchCpf.vue'
import { scroll, throttle } from 'quasar'
import apiClient from 'src/services/api'

const { getScrollTarget, setScrollPosition } = scroll

export default {
  name: 'NaturalPerson',
  components: {
    SearchCpf,
    Phone,
    PaymentMethods,
    ProductSelect,
    DeliveryAddress
  },
  data () {
    return {
      form: {
        cpf: '',
        name: '',
        birthdate: '',
        company_name: '',
        main_activity: null,
        register_situation: '',
        company_type: 'matriz',
        nf: '',
        email: null,
        phones: []
      },
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
      activitiesList: [],
      activitiesListOptions: []
    }
  },
  methods: {
    personData (data) {
      this.form.cpf = data.cpf
      this.form.birthdate = data.data_nascimento
      this.form.name = data.nome.toUpperCase()
      this.form.register_situation = data.situacao_cadastral.toUpperCase()
      if (this.form.register_situation === 'TITULAR FALECIDO') {
        this.invalidCPF()
      }
    },
    invalidCPF () {
      this.$q.notify({
        color: 'red-6',
        icon: 'warning',
        message: 'Dados Inválidos, Titular Falecido!',
        position: 'top-right'
      })
      this.redirect()
    },
    redirect () {
      this.$emit('customerCreated', 'edit')
    },
    numbers (data) {
      this.form.phones = data
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
        return false
      } else if (data.term === '') {
        this.$q.notify({
          message: 'Insira um prazo válido.',
          icon: 'warning',
          color: 'red-7'
        })
        return false
      }

      this.payment = data
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
      }
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
    beforeSubmit () {
      this.submitting = true
      this.msg++
      this.pmsg++
      this.pamsg++
      this.getPhones++
      const self = this
      setTimeout(function () {
        self.submit()
      }, 800)
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
    submit () {
      const url = '/costumer/np/create'
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
          this.handleError()
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
    }
  },
  mounted () {
    this.submit = throttle(this.submit, 500)
    const url = '/costumer/le/list'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      this.activitiesListOptions = response.data[1]
    }).catch(error => {
      console.log('error', error)
    })
  },
  created () {
    this.company = 'np'
  }
}
</script>

<style>
</style>