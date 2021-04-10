<template>
  <div class="editVehicle">
    <div class="row">
      <div class="text-h5">Veículos</div>
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
          grid
          :card-container-class="cardContainerClass"
          class="text-uppercase"
          :dense="$q.screen.lt.md"
          :data="vehicles"
          :columns="columns"
          :filter="filter"
          row-key="name"
          dark
          :visible-columns="visibleColumns"
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
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card
                dark
                style="background-color:#2d2d2d"
              >
                <q-card-section>
                  <q-expansion-item
                    expand-separator
                    :icon="iconCheck(props.row.type)"
                    :label="props.row.nickname "
                  >
                    <q-form
                      ref="form"
                      autofocus
                      spellcheck="false"
                      autocomplete="off"
                      @submit.prevent.stop="editVehicle(props.row)"
                      greedy
                    >
                      <q-card-section class="text-left">
                        <div class="text-caption">{{ props.row.license_plate + ' - ' + props.row.vehicle_value.brand + ' | ' + props.row.vehicle_value.specific_model}}</div>
                      </q-card-section>
                      <q-separator
                        color="white"
                        style="opacity:0.85"
                      />
                      <q-card-section class="text-left q-pb-none">
                        <q-input
                          style="width: 100%;"
                          v-model="props.row.nickname"
                          outlined
                          dark
                          label="Apelido"
                          class="text-uppercase"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </q-card-section>
                      <q-card-section class="flex flex-center q-pb-none">
                        <div class="row justify-center fit items-top content-strech">
                          <div class="col q-mr-sm">
                            <q-input
                              style="width: 100%;"
                              v-model="props.row.km_cost"
                              outlined
                              dark
                              mask="R$ #,##"
                              fill-mask="0"
                              reverse-fill-mask
                              label="Custo/Km"
                              class="text-uppercase"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              suffix="/Km"
                            />
                          </div>
                          <div class="col q-ml-sm">
                            <q-input
                              v-model="props.row.autonomy"
                              label="Autonomia"
                              outlined
                              dark
                              mask="#.##"
                              fill-mask="0"
                              reverse-fill-mask
                              class="text-uppercase"
                              style="width: 100%"
                              suffix="Km/Lt"
                            />
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none q-pb-none">
                        <div class="row justify-center fit items-top content-strech">
                          <div class="col q-mr-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="Óleo"
                              mask="##/##/####"
                              v-model="props.row.oil_change"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.oil_change"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col q-ml-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="Filtros"
                              v-model="props.row.filters_change"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.filters_change"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="row  justify-center fit items-top content-strech">
                          <div class="col q-mr-sm">
                            <q-input
                              v-model="props.row.vehicle_load.load_capacity"
                              label="Cap. Carga"
                              outlined
                              dark
                              class="text-uppercase"
                              style="width: 100%"
                              :suffix="props.row.vehicle_load.unity"
                            />
                          </div>
                          <div class="col q-ml-sm">
                            <div v-if="props.row.type === 'carros'">
                              <q-input
                                class="text-uppercase q-mr-sm"
                                outlined
                                dark
                                label="Correia"
                                v-model="props.row.toothed_belt_change"
                                style="width: 100%;"
                              >
                                <template v-slot:append>
                                  <q-icon
                                    name="event"
                                    class="cursor-pointer"
                                  >
                                    <q-popup-proxy
                                      ref="qDateProxy"
                                      transition-show="scale"
                                      transition-hide="scale"
                                    >
                                      <q-date
                                        v-model="props.row.toothed_belt_change"
                                        dark
                                        :locale="myLocale"
                                        mask=DD/MM/YYYY
                                      >
                                        <div class="row items-center justify-end">
                                          <q-btn
                                            v-close-popup
                                            label="Close"
                                            color="primary"
                                            flat
                                          />
                                        </div>
                                      </q-date>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                              </q-input>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none q-pb-none">
                        <div class="row justify-center fit items-top content-strech">
                          <div class="col q-mr-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="CIV"
                              v-model="props.row.civ"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.civ"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col q-ml-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="CIPP"
                              v-model="props.row.cipp"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.cipp"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none q-pb-none">
                        <div class="row justify-center fit items-top content-strech">
                          <div class="col q-mr-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="Válvulas"
                              v-model="props.row.valvules"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.valvules"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col q-ml-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="IBAMA"
                              v-model="props.row.ibama"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.ibama"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none q-pb-none">
                        <div class="
                    row
                    justify-center
                    fit
                    items-top
                    content-strech
                    ">
                          <div class="col q-mr-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="CTF"
                              v-model="props.row.ctf"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.ctf"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col q-ml-sm">
                            <q-input
                              class="text-uppercase"
                              outlined
                              dark
                              label="Tacógrafo"
                              v-model="props.row.tachograph"
                              :rules="[val => !!val || 'Campo obrigatório.']"
                              style="width: 100%;"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="event"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="props.row.tachograph"
                                      dark
                                      :locale="myLocale"
                                      mask=DD/MM/YYYY
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="row justify-center">
                          <q-btn
                            color="primary"
                            label="Editar Veículo"
                            type="submit"
                          />
                        </div>
                      </q-card-section>
                    </q-form>
                  </q-expansion-item>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import moment from 'moment'
export default {
  name: 'EditVehicle',
  data () {
    return {
      columns: [
        { name: 'license_plate', align: 'center', label: 'Placa', field: 'license_plate', sortable: true },
        { name: 'nickname', label: 'Veículo', align: 'start', field: 'nickname', sortable: true },
        { name: 'autonomy', align: 'left', label: 'Autonomia', field: 'autonomy', sortable: true },
        { name: 'km_cost', align: 'center', label: 'Custo/Km', field: 'km_cost', sortable: true },
        { name: 'oil_change', align: 'center', label: 'Troca de Óleo', field: 'oil_change', sortable: true },
        { name: 'filters_change', align: 'center', label: 'Troca de Filtros', field: 'filters_change', sortable: true },
        { name: 'toothed_belt_change', align: 'center', label: 'Troca de Correia Dentada', field: 'toothed_belt_change', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true }
      ],
      filter: '',
      vehicles: [],
      visibleColumns: ['license_plate', 'nickname', 'autonomy', 'km_cost', 'oil_change', 'filters_change', 'status'],
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Mar;o_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jab_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dec'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },
  created () {
    const self = this
    const url = '/vehicle/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }
    apiClient.get(url, data).then(response => {
      console.log(response.data)
      self.vehicles = response.data
      if (response.data[0].toothed_belt_change !== null) {
        self.visibleColumns.push('toothed_belt_change')
      }
    })
  },
  methods: {
    iconCheck (e) {
      if (e === 'caminhoes') {
        return 'fas fa-truck'
      } else if (e === 'carros') {
        return 'fas fa-car-side'
      } else if (e === 'motos') {
        return 'fas fa-motorcycle'
      }
    },
    dateFilter (e) {
      moment.locale('pt-br')
      return moment(e).fromNow()
    },
    getItemsPerPage () {
      const { screen } = this.$q
      if (screen.lt.sm) {
        return 3
      }
      if (screen.lt.md) {
        return 6
      }
      return 9
    },
    editVehicle (e) {
      const url = '/vehicle/edit'
      const data = {
        params: {
          e
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
            message: 'Veículo Editado com Sucesso!',
            position: 'top-right'
          })
          console.log('response', response.data)
        } else {
          console.log('response', response.data)
          this.$q.notify({
            color: 'tomato',
            icon: 'warning',
            message: 'Veículo não editado, verifique os dados!',
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
        message: 'Veículo não editado, falha no envio!',
        position: 'top-right'
      })
    }
  },
  computed: {
    cardContainerClass () {
      if (this.$q.screen.gt.xs) {
        return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      }

      return undefined
    },

    rowsPerPageOptions () {
      if (this.$q.screen.gt.xs) {
        return this.$q.screen.gt.sm ? [3, 6, 9] : [3, 6]
      }

      return [3]
    }
  },
  watch: {
    '$q.screen.name' () {
      this.pagination.rowsPerPage = this.getItemsPerPage()
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
.q-menu {
  min-height: 100px !important;
}
</style>
