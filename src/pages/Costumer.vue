<template>
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
                >Clientes</div>
              </div>
              <div class="col-9">
                <div class="row justify-end items-baseline">
                  <q-btn-toggle
                    v-model="tab"
                    toggle-color="primary"
                    flat
                    :options="[
                      {label: 'Listar Clientes', value: 'edit', icon: 'mode_edit'},
                      {label: 'Pessoa Física', value: 'np', icon: 'account_box'},
                      {label: 'Pessoa Jurídica', value: 'le', icon:'account_balance'}

                    ]"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator
            dark
            inset
          />
          <q-card-section>
            <q-tab-panels v-model="tab">
              <q-tab-panel
                dark
                name='edit'
                style="background-color:#1d1d1d"
              >
                <div class="row">
                  <div class="col-8">
                    <q-card-section>
                      <q-table
                        class="text-uppercase"
                        :dense="$q.screen.lt.md"
                        :data="costumers"
                        :columns="columns"
                        :filter="filter"
                        @row-click="costumerDetails"
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
                      </q-table>
                    </q-card-section>
                  </div>
                  <div class="col-4 q-pa-md">
                    <q-card
                      dark
                      bordered
                      style="border-radius: 2em"
                    >
                      <q-card-section>
                        <h5
                          class="q-pa-none q-mt-sm q-mb-sm"
                          style="color: #4DA3FE"
                        >Informações</h5>
                      </q-card-section>
                      <q-separator
                        dark
                        inset
                      />
                      <q-card-section>
                        <div class="row justify-center q-mb-md">
                          <div class="col">
                            <q-input
                              outlined
                              class="text-uppercase"
                              label="Empresa"
                              :hint="subtitle"
                              v-model="company_name"
                              disable
                              dark
                            />
                          </div>

                        </div>
                        <div
                          class="row justify-center q-mb-md"
                          @click="goTo"
                          style="cursor:pointer"
                        >
                          <div class="col">
                            <q-input
                              outlined
                              label="Telefone"
                              :hint="subtitle"
                              v-model="phone_1"
                              mask="(##)#####-####"
                              readonly
                              dark
                              style="cursor:pointer"
                            >
                              <template
                                v-slot:append
                                v-if="zap"
                              >
                                <q-icon
                                  name="fab fa-whatsapp"
                                  color="positive"
                                />
                              </template>
                            </q-input>
                          </div>

                        </div>
                        <div class="row fit justify-center q-mb-md">
                          <div class="col">
                            <q-input
                              outlined
                              disable
                              label="Forma de Pagamento"
                              :hint="subtitle"
                              v-model="pay_method"
                              dark
                            />
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-actions align="center">
                        <q-btn
                          label="Editar Dados"
                          color="grey-7"
                          style="width:100%"
                          class="q-px-lg q-mx-lg q-mb-md"
                          @click="edit"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel
                dark
                name='le'
                style="background-color:#1d1d1d"
              >
                <legal-entity></legal-entity>
              </q-tab-panel>
              <q-tab-panel
                dark
                name='np'
                style="background-color:#1d1d1d"
              >
                <natural-person></natural-person>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>

      <!-- dialog edit Costumer -->
      <q-dialog
        full-width
        full-height
        v-model="editCostumer"
      >
        <edit-costumer :costumer="costumerData"></edit-costumer>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import LegalEntity from 'src/components/LegalEntity'
import NaturalPerson from 'src/components/NaturalPerson'
import EditCostumer from 'src/components/EditCostumer'
import apiClient from '../services/api'

export default {
  name: 'Costumer',
  components: {
    LegalEntity,
    NaturalPerson,
    EditCostumer
  },
  data () {
    return {
      columns: [
        { name: 'register_number', label: 'CNPJ / CPF', align: 'center', field: 'register_number' },
        { name: 'company_name', align: 'left', label: 'Nome Fantasia', field: 'company_name', sortable: true },
        { name: 'contact', align: 'center', label: 'Contato', field: 'contact', sortable: true },
        { name: 'zone', align: 'center', label: 'Região', field: 'zone', sortable: true }
      ],
      tab: 'edit',
      costumers: [],
      filter: '',
      hint: '',
      company_name: '',
      address: '',
      pay_method: '',
      products: '',
      subtitle: '',
      costumer_id: '',
      costumer: [],
      costumerEdit: {},
      costumerLe: {},
      costumerNp: {},
      zap: false,
      phone_1: '',
      link: '',
      page: 'edit',
      editCostumer: false,
      costumerData: ''
    }
  },
  mounted () {
    this.visible = true
    const self = this
    const url = '/costumer/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      console.log(response.data)
      self.costumers = response.data
      self.visible = false
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
  },
  methods: {
    handleError () {
      this.$q.notify({
        color: 'red-7',
        icon: 'warning',
        message: 'Cliente não cadastrado, falha no envio!',
        position: 'top-right'
      })
    },
    costumerDetails (evt, row, index) {
      this.company_name = row.company_name
      // this.address = row.register[0].address[0].street + ', ' + row.register[0].address[0].number + ', ' + row.register[0].address[0].complement + ', ' + row.register[0].address[0].city + ' - ' + row.register[0].address[0].state
      this.phone_1 = row.register[0].phone_1
      if (row.register[0].phone_1zap) {
        const phone = row.register[0].phone_1
        const user = localStorage.name
        this.zap = true
        this.link = 'https://api.whatsapp.com/send?phone=55' + phone + '&text=Oi%2C%20aqui%20%C3%A9%20' + user + '%20da%20Criomec%2C%20tudo%20bem%3F'
      }
      this.pay_method = row.register[0].pay_method.payment_description
      this.costumer = row
    },
    edit () {
      // const self = this
      // const id = this.costumer.c_id.split('_')
      this.costumerData = this.costumer
      this.editCostumer = true
      // console.log(this.costumerData)
    },
    goTo () {
      window.open(this.link)
    }
  }
}
</script>
<style>
</style>
