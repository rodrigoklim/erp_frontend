<template>
  <div class="productSelect">
    <div class="row">
      <div class="col-12">
        <h5
          class="q-ml-lg q-mb-md"
          style="font-family:raleway"
        >Produtos</h5>
      </div>
    </div>
    <!-- select -->
    <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
      <div class="col-11">
        <div class="row q-pb-md items-start">
          <div class="col-6 q-pb-none">
            <div class="row">
              <div class="col-11">
                <q-select
                  outlined
                  v-model="product"
                  :options="productList"
                  label="Produtos"
                  emit-value
                  map-options
                  dark
                  @input="productsDetails(); btnDisabled = false"
                  @filter="productSelection"
                  use-input
                  input-debounce="0"
                />
              </div>
            </div>
            <div class="row q-mt-lg">
              <div class="col-11">
                <q-card
                  dark
                  style="width: 100%;border-radius:1em"
                >
                  <q-card-section style="background-color: #3d3d3d">
                    <div
                      class="text q-ma-none"
                      style="font-family:raleway; ;font-size:18px"
                    >Dados Produto</div>
                  </q-card-section>
                  <q-card-section>
                    <q-input
                      ref="cPrice"
                      style="width: 100%;"
                      v-model="costumerPrice"
                      outlined
                      dark
                      mask="R$ #,##"
                      fill-mask="0"
                      reverse-fill-mask
                      label="Preço para o Cliente"
                      :rules="[val => !!val || 'Campo obrigatório.']"
                    />
                  </q-card-section>
                  <q-card-section v-if="cUnity">
                    <q-field
                      outlined
                      dark
                      bottom-slots
                      :value="unity"
                      ref="unity"
                      label="Unidade para Cliente"
                      stack-label
                      :rules="[val => !!val]"
                    >
                      <template v-slot:control>
                        <q-radio
                          dark
                          v-model="unity"
                          val="m3"
                          label="m3"
                        />
                        <q-radio
                          dark
                          v-model="unity"
                          val="lts"
                          label="Litros"
                        />
                      </template>
                      <template v-slot:error>
                        Campo obrigatório.
                      </template>
                    </q-field>
                  </q-card-section>
                  <q-card-section>
                    <div class="row">
                      <div
                        class="text q-ma-none"
                        style="font-family:poppins; font-weight: 300; font-size:15px"
                      >Escolha a Recorrência</div>
                    </div>
                    <q-separator
                      color="white"
                      style="opacity:0.75"
                    />
                    <div class="row q-mt-md">
                      <div class="col">
                        <div class="row fit items-center">
                          <q-option-group
                            :options="recurrenceOptions"
                            label="Recorrência"
                            type="radio"
                            dark
                            v-model="recurrence"
                          />
                        </div>
                      </div>
                      <div class="col">
                        <div class="row">
                          <q-input
                            style="width: 100%;"
                            v-model="recurrenceInterval"
                            outlined
                            suffix="dias"
                            dark
                            :readonly="recurrence == 'exactDay' || recurrence == ''"
                            label="Intervalo"
                          />
                        </div>
                        <div class="row">
                          <q-select
                            class="q-mt-md"
                            style="width: 100%;"
                            v-model="recurrenceExactDay"
                            :options="ExactDayOptions"
                            use-chips
                            multiple
                            outlined
                            map-options
                            emit-value
                            :readonly="recurrence == 'interval' || recurrence == ''"
                            dark
                            label="Dia Exato"
                          />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row justify-center fit items-center content-start">
              <div class="col-11">
                <q-card
                  dark
                  style="height:100%"
                >
                  <q-card-section>
                    <div class="row">
                      <div
                        class="text q-ma-none"
                        style="font-family:poppins; font-weight: 300; font-size:18px"
                        v-if="product !== null"
                      >
                        {{productListOptions[product].label}}
                      </div>
                      <div
                        class="text q-ma-none"
                        style="font-family:poppins; font-weight: 300; font-size:18px"
                        v-else
                      >
                        PRODUTO SELECIONADO
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator
                    color="white"
                    style="opacity:0.75"
                  />
                  <q-card-section>
                    <div
                      class="row q-mt-md"
                      style="font-family:poppins; font-weight: 300; font-size:16px"
                    >
                      <div class="col">
                        Preço Máximo:
                      </div>
                      <div class="col">
                        <div
                          class="row fit justify-end"
                          style="color: #AA820C"
                          v-if="priceTag"
                        >
                          R$ {{info.max_price.toFixed(2)}}
                        </div>
                      </div>
                    </div>
                    <div
                      class="row q-mt-md"
                      style="font-family:poppins; font-weight: 300; font-size:16px"
                    >
                      <div class="col">
                        Operação:
                      </div>
                      <div class="col">
                        <div
                          class="row fit justify-end"
                          style="color: #AA820C"
                        >
                          {{info.operation}}
                        </div>
                      </div>
                    </div>
                    <div
                      class="row q-mt-md"
                      style="font-family:poppins; font-weight: 300; font-size:16px"
                    >
                      <div class="col">
                        Categoria:
                      </div>
                      <div class="col">
                        <div
                          class="row fit justify-end"
                          style="color: #AA820C"
                        >
                          {{info.category}}
                        </div>
                      </div>
                    </div>
                    <div
                      class="row q-mt-md"
                      style="font-family:poppins; font-weight: 300; font-size:16px"
                    >
                      <div class="col">
                        Classificação:
                      </div>
                      <div class="col">
                        <div
                          class="row fit justify-end"
                          style="color: #AA820C"
                        >
                          {{info.classification}}
                        </div>
                      </div>
                    </div>
                    <div
                      class="row q-mt-md"
                      style="font-family:poppins; font-weight: 300; font-size:16px"
                    >
                      <div class="col">
                        Unidade:
                      </div>
                      <div class="col">
                        <div
                          class="row fit justify-end"
                          style="color: #AA820C"
                        >
                          {{info.unity}}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="row q-mt-lg q-pt-lg">
                <div class="col">
                  <div class="row items-baseline">
                    <q-btn
                      push
                      label="Cadastrar Produto no Cliente"
                      color="yellow-10"
                      @click="addProduct"
                      :disable="btnDisabled"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row fit justify-center">
      <div class="col-11">
        <div class="row q-mt-lg">
          <div class="col">
            <q-table
              title="Produtos Selecionados"
              :data="data"
              :columns="columns"
              row-key="index"
              dark
              color="amber"
              style="font-family:poppins; font-weight: 300;"
            >
              <!-- edit on click -->
              <template v-slot:body="props">
                <q-tr style="color:white; opacity: 0.75">
                  <q-td
                    key="id"
                    :props="props"
                  >{{ props.row.id }}</q-td>
                  <q-td
                    key="product"
                    :props="props"
                  >{{ props.row.product }}</q-td>
                  <q-td
                    key="price"
                    :props="props"
                  >
                    {{ props.row.price }}
                  </q-td>
                  <q-td
                    key="interval"
                    :props="props"
                  >
                    {{ props.row.interval }}
                  </q-td>
                  <q-td
                    v-if="Array.isArray(props.row.exactDay)"
                    key="exactDay"
                    :props="props"
                  >
                    {{ props.row.exactDay.join(', ') }}
                  </q-td>
                  <q-td
                    v-else
                    key="exactDay"
                    :props="props"
                  >
                    {{ props.row.exactDay }}
                  </q-td>
                  <q-td
                    key="unity"
                    :props="props"
                  >
                    {{ props.row.unity }}
                  </q-td>
                  <q-td
                    key="editRow"
                    :props="props"
                  >
                    <q-btn
                      size="sm"
                      round
                      @click="deleteProduct(props.row)"
                      icon="clear"
                      color="red-7"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from 'src/services/api'

export default {
  name: 'productSelect',
  props: {
    submitProduct: Number,
    editProducts: Array
  },
  data () {
    return {
      products: [],
      product: null,
      productList: [],
      recurrence: '',
      costumerPrice: '',
      recurrenceInterval: '',
      recurrenceExactDay: [],
      unity: '',
      cUnity: false,
      productSelected: false,
      priceTag: '',
      btnDisabled: true,
      productListOptions: [],
      recurrenceOptions: [
        { value: 'interval', label: 'Intervalo' },
        { value: 'exactDay', label: 'Dia Exato' }
      ],
      ExactDayOptions: [
        { label: 'Segunda', value: 'Seg' },
        { label: 'Terça', value: 'Ter' },
        { label: 'Quarta', value: 'Qua' },
        { label: 'Quinta', value: 'Qui' },
        { label: 'Sexta', value: 'Sex' }
      ],
      info: {
        max_price: '',
        operation: '',
        category: '',
        classification: '',
        unity: ''
      },
      columns: [
        { name: 'id', label: '#', align: 'center', field: 'id' },
        { name: 'product', align: 'left', label: 'Produto', field: 'product' },
        { name: 'price', align: 'center', label: 'Preço', field: 'price' },
        { name: 'interval', align: 'center', label: 'Intervalo', field: 'interval' },
        { name: 'exactDay', align: 'center', label: 'Dia Exato', field: 'exactDay' },
        { name: 'unity', align: 'center', label: 'Unidade', field: 'unity' },
        { name: 'editRow' }
      ],
      data: []
    }
  },
  created () {
    const self = this
    const url = '/products/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      },
      params: {
        user: localStorage.userId
      }
    }
    apiClient.get(url, data).then(response => {
      Object.keys(response.data).forEach((key) => {
        var category = response.data[key].category.toUpperCase()
        var id = response.data[key].id
        var product = id + ' | ' + category + ' | ' + response.data[key].product.toUpperCase()

        self.productListOptions.push({
          value: key,
          label: product,
          disable: false
        })
      })

      this.products = response.data
      this.edit()
    }).catch(error => {
      console.log('error', error)
    })
  },
  methods: {
    productsDetails () {
      const price = (this.products[this.product].max_price / 100)
      this.info.operation = this.products[this.product].operation
      this.info.category = this.products[this.product].category
      this.info.classification = this.products[this.product].classification
      this.info.unity = this.products[this.product].unity
      this.info.max_price = parseFloat(price)
      this.priceTag = true
      if (this.products[this.product].customer_unity === '1') {
        this.cUnity = true
      } else {
        this.cUnity = false
      }
    },
    productSelection (val, update) {
      if (val === '') {
        update(() => {
          this.productList = this.productListOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.productList = this.productListOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    addProduct () {
      const e = this.$refs.cPrice.validate()
      const u = this.$refs.unity.validate()

      if (e === false) {
        return false
      }

      if (u === false) {
        return false
      }

      var interval = ''
      var eDay = ''
      if (this.recurrenceInterval === '' && this.recurrenceExactDay.length === 0) {
        interval = '-'
        eDay = '-'
      } else if (this.recurrenceInterval === '') {
        interval = '-'
        eDay = this.recurrenceExactDay
      } else if (this.recurrenceExactDay.length === 0) {
        eDay = '-'
        interval = this.recurrenceInterval
      }

      if (this.products[this.product].customer_unity === null) {
        this.unity = '-'
      }

      const pSelected = {
        id: this.products[this.product].id,
        product: this.productListOptions[this.product].label,
        price: this.costumerPrice,
        interval: interval,
        exactDay: eDay,
        unity: this.unity,
        index: this.product
      }
      this.data.push(pSelected)
      this.clearFields()
      this.productListOptions[this.product].disable = true
      this.product = null
    },
    edit () {
      const p = this.editProducts
      const self = this
      const pList = this.products
      this.data = []
      Object.keys(p).forEach((k) => {
        Object.keys(pList).forEach((key) => {
          if (parseInt(pList[key].id) === parseInt(p[k].products_id)) {
            const price = (pList[key].max_price * p[k].price) / 100
            self.data.push({
              id: p[k].products_id,
              product: pList[key].category.toUpperCase() + ' | ' + pList[key].product,
              price: 'R$ ' + price.toFixed(2),
              interval: p[k].interval,
              exactDay: p[k].exact_day,
              unity: p[k].unity
            })
            this.productListOptions[key].disable = true
          }
        })
      })
      this.$forceUpdate()
    },
    deleteProduct (o) {
      const p = this.data
      Object.keys(p).forEach((k) => {
        if (p[k].id === o.id) {
          this.productListOptions[parseInt(o.index)].disable = false
          p.splice(k, 1)
        }
      })
    },
    clearFields () {
      this.costumerPrice = ''
      this.recurrenceInterval = ''
      this.recurrenceExactDay = []
      this.recurrence = ''
      this.info.operation = ''
      this.info.category = ''
      this.info.classification = ''
      this.info.unity = ''
      this.info.max_price = ''
      this.priceTag = false
    },
    getObjects (obj, key, val) {
      var objects = []
      for (var i in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
        if (typeof obj[i] === 'object') {
          objects = objects.concat(this.getObjects(obj[i], key, val))
        } else if (i === key && obj[key] === val) {
          objects.push(obj)
        }
      }
      return objects
    }
  },
  watch: {
    submitProduct: function () {
      this.$emit('productPicked', this.data)
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.q-dialog__title {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
  color: white;
  opacity: 0.75;
}
</style>