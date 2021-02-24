<template>
  <div class="newProduct">
    <div class="row">
      <h5 class="q-ma-sm q-mb-none">Novo Produto</h5>
    </div>
    <q-form
      ref="form"
      autofocus
      spellcheck="false"
      autocomplete="off"
      @submit.prevent.stop="submit"
      greedy
    >
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <div class="col-11">
          <div class="row fit q-mt-md q-mb-lg">
            <q-input
              outlined
              dark
              v-model="product.product"
              label="Produto"
              style="width: 100%;"
              class="text-uppercase"
              :rules="[val => !!val || 'Campo Obrigatório']"
            />
          </div>
          <div class="row justify-center fit items-top content-strech q-mt-md q-mb-lg">
            <div class="col">
              <q-card
                dark
                class="q-mr-sm"
              >
                <q-field
                  dark
                  outlined
                  ref="category"
                  v-model="product.category"
                  label="Categoria"
                  stack-label
                  class="text-uppercase"
                  :rules="[val => !!val || 'Campo obrigatório.']"
                >
                  <template v-slot:control>
                    <div
                      class="self-center full-width no-outline"
                      tabindex="0"
                    >
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.category"
                          val="granel"
                          label="Granel"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.category"
                          val="fracionado"
                          label="Fracionado"
                        />
                      </div>
                    </div>
                  </template>
                </q-field>
              </q-card>
            </div>
            <div class="col">
              <q-card
                dark
                class="q-ml-sm q-mr-sm"
              >
                <q-field
                  dark
                  ref="classification"
                  outlined
                  v-model="product.classification"
                  label="Classificação"
                  stack-label
                  class="text-uppercase"
                  :rules="[val => !!val || 'Campo obrigatório.']"
                >
                  <template v-slot:control>
                    <div
                      class="self-center full-width no-outline"
                      tabindex="0"
                    >
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.classification"
                          val="gas"
                          label="Gás"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.classification"
                          val="liquido"
                          label="Líquido"
                        />
                      </div>
                      <div
                        class="row"
                        v-if="product.category === 'fracionado'"
                      >
                        <q-radio
                          dark
                          v-model="product.classification"
                          val="embalagem"
                          label="Embalagem"
                        />
                      </div>
                      <div
                        class="row"
                        v-if="product.category === 'fracionado'"
                      >
                        <q-radio
                          dark
                          v-model="product.classification"
                          val="equipamento"
                          label="Equipamento"
                        />
                      </div>
                    </div>
                  </template>
                </q-field>
              </q-card>
            </div>
            <div class="col">
              <q-card
                dark
                class="q-ml-sm"
              >
                <q-field
                  dark
                  ref="unity"
                  outlined
                  v-model="product.unity"
                  label="Unidade"
                  stack-label
                  class="text-uppercase"
                  :rules="[val => !!val || 'Campo obrigatório.']"
                >
                  <template v-slot:control>
                    <div
                      class="self-center full-width no-outline"
                      tabindex="0"
                    >
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.unity"
                          val="litros"
                          label="Litros"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.unity"
                          val="quilos"
                          label="Quilos"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="product.unity"
                          val="m3"
                          label="m3"
                        />
                      </div>
                      <div
                        class="row"
                        v-if="product.category === 'fracionado'"
                      >
                        <q-radio
                          dark
                          v-model="product.unity"
                          val="carga"
                          label="Carga"
                        />
                      </div>
                      <div
                        class="row"
                        v-if="product.category === 'fracionado'"
                      >
                        <q-radio
                          dark
                          v-model="product.unity"
                          val="unidade"
                          label="Unidade"
                        />
                      </div>
                    </div>
                  </template>

                </q-field>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                ref="cPrice"
                style="width: 100%;"
                v-model="product.price"
                outlined
                dark
                mask="R$ #,##"
                fill-mask="0"
                reverse-fill-mask
                label="Preço Máximo do Produto"
                class="text-uppercase"
                :rules="[val => !!val || 'Campo obrigatório.']"
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                v-model="product.ean"
                label="EAN"
                outlined
                dark
                class="text-uppercase"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-mr-sm">
              <q-select
                outlined
                dark
                v-model="product.ncm"
                use-input
                input-debounce="0"
                label="NCM"
                :options="ncmList"
                @filter="filterFn"
                class="text-uppercase"
                style="width: 100%"
                :rules="[val => !!val || 'Campo obrigatório.']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sem Resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col q-ml-sm">
              <q-input
                v-model="product.cest"
                label="CEST"
                mask="##.##.###"
                outlined
                dark
                class="text-uppercase"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                v-model="product.csosn"
                label="CSOSN"
                outlined
                dark
                placeholder="0102"
                class="text-uppercase"
                style="width: 100%"
                :rules="[val => !!val || 'Campo obrigatório.']"
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                v-model="product.weight"
                label="Peso"
                outlined
                dark
                mask="#,##"
                fill-mask="0"
                reverse-fill-mask
                append="kg"
                class="text-uppercase"
                style="width: 100%"
                :rules="[val => !!val || 'Campo obrigatório.']"
                @input="$forceUpdate()"
              >
                <template v-slot:append>
                  <div class="text-caption">Kg</div>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col q-mr-sm">
              <q-field
                ref="operation"
                dark
                outlined
                v-model="product.operation"
                label="Operação"
                stack-label
                class="text-uppercase"
                :rules="[val => !!val || 'Campo obrigatório.']"
              >
                <template v-slot:control>
                  <div
                    class="self-center full-width no-outline"
                    tabindex="0"
                  >
                    <div class="row">
                      <q-radio
                        dark
                        v-model="product.operation"
                        val="venda"
                        label="Venda"
                      />
                    </div>
                    <div class="row">
                      <q-radio
                        dark
                        v-model="product.operation"
                        val="comodato"
                        label="Comodato"
                      />
                    </div>
                    <div class="row">
                      <q-radio
                        dark
                        v-model="product.operation"
                        val="locacao"
                        label="Aluguel"
                      />
                    </div>
                    <div class="row">
                      <q-radio
                        dark
                        v-model="product.operation"
                        val="outro"
                        label="Outro"
                      />
                    </div>
                  </div>
                </template>
              </q-field>
            </div>
            <div class="col q-ml-sm">

            </div>
          </div>
          <div class="row fit justify-center q-mt-lg">
            <q-btn
              color="primary"
              push
              type="submit"
              label="Criar Produto"
              style="width: 300px"
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
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'NewProduct',
  data () {
    return {
      product: {
        product: '',
        category: '',
        classification: '',
        unity: '',
        price: '',
        ean: '',
        ncm: '',
        csosn: '',
        weight: '',
        operation: '',
        cest: ''
      },
      ncmList: [],
      stringOptions: '',
      submitting: false
    }
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.ncmList = this.stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.ncmList = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    submit () {
      this.$refs.category.validate()
      this.$refs.classification.validate()
      this.$refs.unity.validate()
      this.$refs.operation.validate()
      const url = '/product/create'
      const data = {
        params: {
          form: this.product
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
              message: 'Cliente Cadastrado com sucesso!',
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
              message: 'Cliente não cadastrado, verifique os dados!',
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
        message: 'Cliente não cadastrado, falha no envio!',
        position: 'top-right'
      })
    }
  },
  mounted () {
    const url = '/ncm/list'
    const data = {
      params: {
      },
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      this.stringOptions = response.data
    }).catch(error => {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
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
}
</script>

<style>
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
.text-negative {
  color: tomato !important;
}
.q-field--error .q-field__bottom {
  color: tomato !important;
  font-weight: 300;
}
</style>