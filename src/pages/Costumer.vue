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
                  <div class="col-12">
                    <q-card-section>
                      <q-table
                        class="text-uppercase"
                        :dense="$q.screen.lt.md"
                        :data="customers"
                        :columns="columns"
                        :filter="filter"
                        :pagination.sync="pagination"
                        row-key="register_number"
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
                            <q-td>
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
                              key="register_number"
                              :props="props"
                            >
                              {{ props.row.register_number.indexOf('.') === -1 ?  props.row.register_number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') :  props.row.register_number}}
                            </q-td>
                            <q-td
                              key="company_name"
                              :props="props"
                            >
                              {{ props.row.company_name }}
                            </q-td>
                            <q-td
                              key="contact"
                              :props="props"
                              style="cursor:pointer"
                            >
                              {{ props.row.contact }}
                              <q-popup-edit
                                v-model="props.row.contact"
                                title="Editar Contato"
                                buttons
                                persistent
                                @save="editCustomer(props.row)"
                                content-style="color:white; background-color:#1d1d1d"
                              >
                                <q-input
                                  type="text"
                                  v-model="props.row.nickname"
                                  dense
                                  autofocus
                                  dark
                                  class="text-uppercase"
                                />
                              </q-popup-edit>
                            </q-td>
                            <q-td
                              key="zone"
                              :props="props"
                              style="cursor:pointer"
                            >
                              {{ (props.row.zone) }}
                              <q-popup-edit
                                v-model="props.row.zone"
                                title="Editar Região"
                                buttons
                                persistent
                                @save="editCustomer(props.row)"
                                content-style="color:white; background-color:#1d1d1d"
                              >
                                <!-- colocar um select com opções do IBGE para região -->
                                <q-select
                                  type="text"
                                  mask="#.## Km/L"
                                  unmasked-value
                                  fill-mask="0"
                                  reverse-fill-mask
                                  v-model="props.row.zone"
                                  dense
                                  autofocus
                                  dark
                                />
                              </q-popup-edit>
                            </q-td>
                            <q-td
                              key="phone_1"
                              :props="props"
                              style="cursor: pointer"
                            >
                              {{ props.row.phone_1.length === 11 ? props.row.phone_1.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') :  props.row.phone_1.replace(/(\d{2})(\d{4})(\d{4})/, '($1)$2-$3')  }}
                              <q-popup-edit
                                v-model="props.row.phone_1"
                                title="Editar Valor"
                                buttons
                                persistent
                                @save="editCustomer(props.row)"
                                content-style="color:white; background-color:#1d1d1d"
                              >
                                <q-input
                                  type="text"
                                  unmasked-value
                                  fill-mask="0"
                                  reverse-fill-mask
                                  v-model="props.row.phone_1"
                                  dense
                                  autofocus
                                  dark
                                />
                              </q-popup-edit>
                            </q-td>
                          </q-tr>
                          <q-tr
                            v-show="props.expand"
                            :props="props"
                          >
                            <q-td colspan="100%">
                              <div class="row q-pb-md">
                                <div class="col text-uppercase text-h6">
                                  Dados do Cliente
                                </div>
                                <div
                                  class="col"
                                  align="end"
                                >
                                  <q-btn
                                    label="Editar Dados"
                                    color="grey-7"
                                    @click="edit(props.row)"
                                  />
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-3">
                                  <div class="q-mx-md">
                                    <q-input
                                      v-if="props.row.ie"
                                      label="Inscrição Estadual"
                                      v-model="props.row.ie"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                    <q-input
                                      label="E-mail"
                                      v-model="props.row.email"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                    <q-input
                                      label="Atividade Principal"
                                      v-model="props.row.main_activity"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                    <q-field
                                      ref="nf"
                                      dark
                                      label="Nota Fiscal"
                                      bottom-slots
                                      :value="props.row.account.nf"
                                      style="font-size: 16px"
                                    >
                                      <template v-slot:control>
                                        <q-toggle
                                          disable
                                          dark
                                          ref="nf"
                                          v-model="props.row.account.nf"
                                          color="teal"
                                          false-value="0"
                                          true-value="1"
                                          size="lg"
                                          checked-icon="check"
                                          unchecked-icon="clear"
                                          style="cursor:default !important"
                                        />
                                      </template>
                                    </q-field>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="q-mx-md">
                                    <q-input
                                      label="Método de Pagamento"
                                      v-model="props.row.pay_method.payment_description"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                    <q-input
                                      v-for="address in props.row.address"
                                      :key="address.id"
                                      label="Endereço"
                                      v-model="address.full_address"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                  </div>
                                </div>
                                <div class="col-3">
                                  <div class="q-mx-md">
                                    <q-input
                                      v-for="product in props.row.products"
                                      :key="product.id"
                                      label="Produto"
                                      v-model="product.product"
                                      disable
                                      dark
                                      style="cursor:default !important"
                                    />
                                  </div>
                                </div>
                              </div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-card-section>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel
                dark
                name='le'
                style="background-color:#1d1d1d"
              >
                <legal-entity @customerCreated="customerCreated"></legal-entity>
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
          <br><br><br>

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
        { name: '', align: 'start', label: '' },
        { name: 'register_number', label: 'CNPJ / CPF', align: 'center', field: 'register_number' },
        { name: 'company_name', align: 'left', label: 'Nome Fantasia', field: 'company_name', sortable: true },
        { name: 'contact', align: 'center', label: 'Contato', field: 'contact', sortable: true },
        { name: 'zone', align: 'center', label: 'Região', field: 'zone', sortable: true },
        { name: 'phone_1', align: 'center', label: 'Telefone', field: 'phone_1', sortable: true }
      ],
      tab: 'edit',
      customers: [],
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
      costumerData: '',
      pagination: {
        rowsPerPage: 0
      }
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
      const data = response.data
      let i
      for (i = 0; i < 2; i++) {
        console.log(data[i])
        data[i].forEach(function (c) {
          self.customers.push(c)
        })
      }
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
    editCustomer (val) {
      console.log(val)
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
    edit (value) {
      // console.log(value)
      // const self = this
      // const id = this.costumer.c_id.split('_')
      this.costumerData = value
      this.editCostumer = true
      // console.log(this.costumerData)
    },
    goTo () {
      window.open(this.link)
    },
    customerCreated (value) {
      this.tab = value
    }
  }
}
</script>
<style>
</style>
