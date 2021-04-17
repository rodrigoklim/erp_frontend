<template>
  <div class="editProduct">
    <div class="row">
      <div class="text-h5">Produtos</div>
    </div>
    <div class="row">
      <div
        class="text-caption"
        style="color:#8d8d8d"
      >Clique no item que deseja editar</div>
    </div>
    <div class="row fit justify-center items-center content-start q-mt-lg">
      <div class="col">
        <q-table
          class="text-uppercase"
          :dense="$q.screen.lt.md"
          :data="products"
          :columns="columns"
          :filter="filter"
          :pagination.sync="pagination"
          :sort-method="customSort"
          row-key="id"
          dark
          color="amber"
          style="color:white; opacity:0.95; font-family: poppins; font-weight: 300;"
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
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                />
              </q-td>
              <q-td
                key="id"
                :props="props"
              >
                {{props.row.id}}
              </q-td>
              <q-td
                key="product"
                :props="props"
                style="cursor:pointer"
              >
                {{props.row.product}}
                <q-popup-edit
                  v-model="props.row.product"
                  title="Editar Nome do Produto"
                  buttons
                  persistent
                  @save="editProduct(props.row)"
                  content-style="color:white; background-color:#1d1d1d"
                >
                  <q-input
                    type="text"
                    v-model="props.row.product"
                    dense
                    autofocus
                    dark
                    class="text-uppercase"
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                key="max_price"
                :props="props"
                style="cursor:pointer"
              >
                {{ ((parseFloat(props.row.max_price))/100).toFixed(2) }}
                <q-popup-edit
                  v-model="props.row.max_price"
                  title="Editar Valor"
                  buttons
                  persistent
                  @save="editProduct(props.row)"
                  content-style="color:white; background-color:#1d1d1d"
                >
                  <q-input
                    type="text"
                    mask="R$ #.##"
                    unmasked-value
                    fill-mask="0"
                    reverse-fill-mask
                    v-model="props.row.max_price"
                    dense
                    autofocus
                    dark
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                key="category"
                :props="props"
              >
                {{props.row.category}}
              </q-td>
              <q-td
                key="classification"
                :props="props"
              >
                {{props.row.classification}}
              </q-td>
              <q-td
                key="unity"
                :props="props"
              >
                {{props.row.unity}}
              </q-td>
              <q-td
                key="status"
                :props="props"
              >
                <div
                  v-if="props.row.status == 1"
                  style="color:teal;font-weight: bold!important"
                >
                  Ativo
                </div>
                <div
                  v-else
                  style="color:tomato;font-weight: bold!important"
                >
                  Inativo
                </div>
                <q-popup-edit
                  v-model="props.row.status"
                  title="Editar Status"
                  buttons
                  persistent
                  @save="editProduct(props.row)"
                  content-style="color:white; background-color:#1d1d1d"
                >
                  <div class="row justify-center items-center">Inativo
                    <q-toggle
                      label="Ativo"
                      color="teal"
                      false-value="0"
                      true-value="1"
                      v-model="props.row.status"
                      style="color:white"
                    />
                  </div>
                </q-popup-edit>

              </q-td>
            </q-tr>
            <q-tr
              v-show="props.expand"
              :props="props"
            >
              <q-td colspan="100%">
                <div class="text-uppercase q-pb-md text-h6">Dados Complementares</div>
                <div class="row q-ma-md">
                  <div class="col">
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">Categoria</div>
                      <div class="col text-amber">{{props.row.category}}</div>
                    </div>
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">Classificação</div>
                      <div class="col text-amber">{{props.row.classification}}</div>
                    </div>
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">Unidade</div>
                      <div class="col text-amber">{{props.row.unity}}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">NCM</div>
                      <div class="col text-amber">{{props.row.ncm}}</div>
                    </div>
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">CEST</div>
                      <div class="col text-amber">{{props.row.cest}}</div>
                    </div>
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">CSOSN</div>
                      <div class="col text-amber">{{props.row.csosn}}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">Peso</div>
                      <div class="col text-amber">{{props.row.weigth}}</div>
                    </div>
                    <div class="row text-caption text-uppercase q-pb-sm">
                      <div class="col">Operação</div>
                      <div class="col text-amber">{{props.row.operation}}</div>
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'EditProduct',
  data () {
    return {
      columns: [
        { name: '', align: 'start', label: '' },
        { name: 'id', align: 'center', label: '#', field: 'id', sortable: true },
        { name: 'product', label: 'Produto', align: 'start', field: 'product', sortable: true },
        { name: 'max_price', align: 'left', label: 'Preço', field: 'max_price', sortable: true },
        { name: 'category', align: 'center', label: 'Categoria', field: 'category', sortable: true },
        { name: 'classification', align: 'center', label: 'Classificação', field: 'classification', sortable: true },
        { name: 'unity', align: 'center', label: 'Unidade', field: 'unity', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true }
      ],
      filter: '',
      products: [],
      pagination: {
        rowsPerPage: 0
      },
      selected: []
    }
  },
  created () {
    const self = this
    const url = '/products/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      self.products = response.data
    }).catch(error => {
      console.log('error', error)
    })
  },
  methods: {
    customSort (rows, sortBy, descending) {
      const data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b
          if (sortBy !== 'max_price') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    },
    details () {
      console.log(this.row)
    },
    editProduct (product) {
      console.log(product)
      const url = '/product/edit'
      const data = {
        params: {
          product
        }
      }
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      apiClient.post(url, data, config).then(response => {
        console.log(response.data)
        if (response.data === 'ok') {
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Produto Editado com Sucesso!',
            position: 'top-right'
          })
          console.log('response', response.data)
        } else {
          console.log('response', response.data)
          this.$q.notify({
            color: 'tomato',
            icon: 'warning',
            message: 'Produto não editado, verifique os dados!',
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
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          this.handleError()
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
        message: 'Produto não cadastrado, falha no envio!',
        position: 'top-right'
      })
    }
  }
}
</script>

<style>
element.style {
  visibility: visible;
  min-width: 69px;
  min-height: 28px;
  top: 279px;
  left: 214.75px;
  background-color: #1d1d1d !important;
  color: white !important;
}
</style>
