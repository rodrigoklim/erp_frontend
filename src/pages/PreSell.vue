<template>
  <div class="preSell">
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
                  >Pré-Venda</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <q-card-section>
              <div class="row">
                <div class="col-11">
                  <div class="col-4">
                    <q-card dark>
                      <q-stepper
                        v-model="step"
                        ref="stepper"
                        color="primary"
                        animated
                        dark
                        style="font-weight: 300"
                      >
                        <q-step
                          :name="1"
                          title="Selecione o Cliente"
                          icon="settings"
                          :done="step > 1"
                        >
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
                        </q-step>
                        <q-step
                          :name="2"
                          title="Create an ad group"
                          caption="Optional"
                          icon="create_new_folder"
                          :done="step > 2"
                        >
                          An ad group contains one or more ads which target a shared set of keywords.
                        </q-step>

                        <q-step
                          :name="3"
                          title="Ad template"
                          icon="assignment"
                          disable
                        >
                          This step won't show up because it is disabled.
                        </q-step>

                        <q-step
                          :name="4"
                          title="Create an ad"
                          icon="add_comment"
                        >
                          Try out different ad text to see what brings in the most customers, and learn how to
                          enhance your ads using features like ad extensions. If you run into any problems with
                          your ads, find out how to tell if they're running and how to resolve approval issues.
                        </q-step>

                        <template v-slot:navigation>
                          <q-stepper-navigation>
                            <q-btn
                              @click="$refs.stepper.next()"
                              color="primary"
                              :label="step === 4 ? 'Finish' : 'Continue'"
                            />
                            <q-btn
                              v-if="step > 1"
                              flat
                              color="primary"
                              @click="$refs.stepper.previous()"
                              label="Back"
                              class="q-ml-sm"
                            />
                          </q-stepper-navigation>
                        </template>
                      </q-stepper>
                    </q-card>
                  </div>
                  <div class="col-8">
                    <q-card dark>

                    </q-card>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </q-page>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'PreSell',
  data () {
    return {
      step: 1,
      costumers: [],
      filter: '',
      columns: [
        { name: 'register_number', label: 'CNPJ / CPF', align: 'center', field: 'register_number' },
        { name: 'company_name', align: 'left', label: 'Nome Fantasia', field: 'company_name', sortable: true },
        { name: 'contact', align: 'center', label: 'Contato', field: 'contact', sortable: true },
        { name: 'zone', align: 'center', label: 'Região', field: 'zone', sortable: true }
      ]
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
    }
  }
}
</script>

<style>
</style>