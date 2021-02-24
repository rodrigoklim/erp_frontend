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
          row-key="name"
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
              <q-td
                key="id"
                :props="props"
              >
                {{props.row.id}}
              </q-td>
              <q-td
                key="product"
                :props="props"
              >
                {{props.row.product}}
              </q-td>
              <q-td
                key="max_price"
                :props="props"
                style="cursor:pointer"
              > R$
                {{ ((parseFloat(props.row.max_price))/100).toFixed(2) }}
                <q-popup-edit
                  v-model="props.row.max_price"
                  title="Editar Valor"
                  buttons
                  persistent
                  @save="editProduct(props.row)"
                  content-style="color:white; opacity: 0.75; background-color:#1d1d1d"
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
                  style="color:teal"
                >
                  Ativo
                </div>
                <div
                  v-else
                  style="color:tomato"
                >
                  Inativo
                </div>
                <q-popup-edit
                  v-model="props.row.status"
                  title="Editar Status"
                  buttons
                  persistent
                  @save="editProduct(props.row)"
                  content-style="color:white; opacity: 0.75; background-color:#1d1d1d"
                >
                  <div class="row justify-center">
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
        { name: 'id', align: 'center', label: '#', field: 'id', sortable: true },
        { name: 'product', label: 'Produto', align: 'start', field: 'product', sortable: true },
        { name: 'max_price', align: 'left', label: 'Preço', field: 'max_price', sortable: true },
        { name: 'category', align: 'center', label: 'Categoria', field: 'category', sortable: true },
        { name: 'classification', align: 'center', label: 'Classificação', field: 'classification', sortable: true },
        { name: 'unity', align: 'center', label: 'Unidade', field: 'unity', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true }
      ],
      filter: '',
      products: []
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
    editProduct (product) {
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