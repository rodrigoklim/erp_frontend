<template>
  <div class="LoadInfo">
    <q-card-section>
      <div class="row items-baseline">
        <div class="text-h5">
          Rota #{{route.id}}
        </div>
      </div>
    </q-card-section>
    <q-separator
      dark
      color="white"
      style="opacity: 0.75"
    />
    <q-card-section class="q-mt-none">
      <div class="row">
        <div class="col-6">
          <div
            class="row items-baseline justify-start"
            style="opacity:0.75"
          >
            <div class="col-4">
              <h6 class="q-ma-none">
                Entrega:
              </h6>
            </div>
            <div class="col text-h6">
              {{route.delivery_date}}
            </div>
          </div>
          <div
            class="row items-baseline justify-start"
            style="opacity:0.75"
          >
            <div class="col-4">
              <h6 class="q-ma-none">
                Veículo:
              </h6>
            </div>
            <div class="col text-h6">
              {{vehicle}}
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="row justify-start">
            <q-table
              title="Carga"
              :data="loadTable"
              :columns="columns"
              row-key="name"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination"
              hide-header
              hide-bottom
              dark
              color="amber"
              style="width:100%"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator
      dark
      color="white"
      style="opacity: 0.75"
    />
    <q-card-section>
      <div class="row items-baseline justify-start">
        <h6 class="q-ma-md">
          <q-icon
            name="fas fa-hard-hat"
            color="primary"
            size="lg"
            class="q-mr-md"
          />
          Itens de Apoio:
        </h6>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div class="text-h6">
                        Botijão Criogênico
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.bot_crio.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.bot_crio.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.bot_crio.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Cilindro
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.cylinder.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.cylinder.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.cylinder.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Tampas
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.caps.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.caps.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.caps.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Capacete
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.helmet.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.helmet.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.helmet.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Funil
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.funnel.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.funnel.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.funnel.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Régua
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.scale.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.scale.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.scale.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card
                dark
                class="q-ma-md"
              >
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div
                        class="text-h6"
                        style="height: 64px;"
                      >
                        Carrinho
                      </div>
                    </div>
                    <div class="col-2">
                      <q-checkbox v-model="form.dolly.use" />
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="form.dolly.use"
                  >
                    <q-input
                      dark
                      outlined
                      dense
                      label="Quantidade"
                      v-model="form.dolly.qty"
                      class="q-mt-md"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3"></div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator
      dark
      color="white"
      style="opacity: 0.75"
    />
    <q-card-actions
      align="between"
      class="q-mt-md"
    >
      <q-btn
        label="Cancelar"
        color="red-6"
        push
        style="width: 250px"
        to="/rotas"
      />
      <q-btn
        label="Salvar"
        color="positive"
        push
        style="width: 250px"
        @click="submitForm"
      />
    </q-card-actions>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import moment from 'moment'

export default {
  name: 'loadInfo',
  data () {
    return {
      route: {},
      vehicle: '',
      columns: [
        { name: 'product', align: 'left', label: 'Produto', field: 'product' },
        { name: 'qty', align: 'center', label: 'Qtd', field: 'qty' }
      ],
      loadTable: [],
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      form: {
        bot_crio: {
          use: false,
          qty: 0
        },
        cylinder: {
          use: false,
          qty: 0
        },
        caps: {
          use: false,
          qty: 0
        },
        helmet: {
          use: false,
          qty: 0
        },
        funnel: {
          use: false,
          qty: 0
        },
        scale: {
          use: false,
          qty: 0
        },
        dolly: {
          use: false,
          qty: 0
        }
      }
    }
  },
  created () {
    const url = '/route/checklist/load/info'
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    console.log(this.$router.currentRoute.params.props)
    const details = this.$router.currentRoute.params.props
    const data = {
      params: {
        details
      }
    }

    apiClient.post(url, data, config).then(response => {
      this.route = response.data.route
      this.route.delivery_date = moment(this.route.delivery_date).format('DD/MM/Y')
      this.vehicle = response.data.vehicle
      this.loadTable = response.data.route_order
    }).catch(error => {
      if (error.response) {
        // this.handleError()
        this.submitting = false
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // this.handleError()
        this.submitting = false
        console.log(error.request)
      } else {
        // Something happened in setting up the request and triggered an Error
        // this.handleError()
        console.log('Error', error.message)
      }
    })
  },
  methods: {
    submitForm () {
      console.log('oi')
      const url = '/route/checklist/load/save'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const data = {
        params: {
          route: this.route,
          info: this.form
        }
      }

      apiClient.post(url, data, config).then(response => {
        this.$router.push('/rotas', () => {
          this.$q.notify({
            color: 'teal',
            icon: 'check',
            message: 'Checklist Salvo com Sucesso!',
            position: 'top-right'
          })
        })
      }).catch(error => {
        if (error.response) {
          // this.handleError()
          this.submitting = false
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // this.handleError()
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
        message: 'Erro! Checklist não cadastrado!',
        position: 'top-right'
      })
    }
  }
}
</script>

<style>
</style>