<template>
  <div class="editVehicle">
    <div class="row">
      <div class="text-h5">Veículos</div>
    </div>
    <div class="row">
      <div
        class="text-caption"
        style="color:#8d8d8d"
      >Clique no item que deseja editar
      </div>
    </div>
    <div class="row fit justify-center items-center content-start q-mt-lg">
      <div class="col">
        <q-table
          :card-container-class="cardContainerClass"
          class="text-uppercase"
          :dense="$q.screen.lt.md"
          :data="vehicles"
          :columns="columns"
          :filter="filter"
          :pagination.sync="pagination"
          row-key="id"
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
                <q-icon name="search"/>
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
                key="license_plate"
                :props="props"
              >
                {{ props.row.license_plate }}
              </q-td>
              <q-td
                key="nickname"
                :props="props"
                style="cursor:pointer"
              >
                {{ props.row.nickname }}
                <q-popup-edit
                  v-model="props.row.nickname"
                  title="Editar Apelido"
                  buttons
                  persistent
                  @save="editVehicle(props.row)"
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
                key="autonomy"
                :props="props"
                style="cursor:pointer"
              >
                {{ (props.row.autonomy/100).toFixed(2) }} Km/L
                <q-popup-edit
                  v-model="props.row.autonomy"
                  title="Editar Valor"
                  buttons
                  persistent
                  @save="editVehicle(props.row)"
                  content-style="color:white; background-color:#1d1d1d"
                >
                  <q-input
                    type="text"
                    mask="#.## Km/L"
                    unmasked-value
                    fill-mask="0"
                    reverse-fill-mask
                    v-model="props.row.autonomy"
                    dense
                    autofocus
                    dark
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                key="km_cost"
                :props="props"
                style="cursor: pointer"
              >
                R$ {{ (props.row.km_cost / 100).toFixed(2) }} /Km
                <q-popup-edit
                  v-model="props.row.km_cost"
                  title="Editar Valor"
                  buttons
                  persistent
                  @save="editVehicle(props.row)"
                  content-style="color:white; background-color:#1d1d1d"
                >
                  <q-input
                    type="text"
                    mask="R$ #.## /Km"
                    unmasked-value
                    fill-mask="0"
                    reverse-fill-mask
                    v-model="props.row.km_cost"
                    dense
                    autofocus
                    dark
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                key="fuel"
                :props="props"
              >
                {{ props.row.fuel }}
              </q-td>
              <q-td
                key="status"
                :props="props"
                style="cursor:pointer"
              >
                <div
                  v-if="props.row.status == 1"
                  style="color:teal; font-weight: bold!important"
                >
                  Ativo
                </div>
                <div
                  v-else
                  style="color:tomato; font-weight: bold!important"
                >
                  Inativo
                </div>
                <q-popup-edit
                  v-model="props.row.status"
                  title="Editar Status"
                  buttons
                  persistent
                  @save="editVehicle(props.row)"
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
                <div class="row text-uppercase q-pb-md text-h6">
                  Dados Complementares
                </div>
                <div class="col-11">
                  <div class="row justify-center">
                    <div class="col-4">
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm">
                        <q-input
                          v-model="props.row.vehicle_load.load_capacity"
                          label="Cap. Carga"
                          outlined
                          dark
                          class="text-uppercase q-pa-none"
                          style="width: 100%"
                          @blur="editVehicle(props.row)"
                          :suffix="props.row.vehicle_load.unity"/>
                      </div>
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          mask="# Km"
                          unmasked-value
                          fill-mask="0"
                          reverse-fill-mask
                          dark
                          @blur="editVehicle(props.row)"
                          label="Troca de Óleo"
                          v-model="props.row.filters_change"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                          style="width: 100%;"
                        />
                      </div>
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="CIV"
                          v-model="props.row.civ"
                          @blur="editVehicle(props.row)"
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
                    </div>
                    <div class="col-4">
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="Válvulas"
                          @blur="editVehicle(props.row)"
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
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="CIPP"
                          @blur="editVehicle(props.row)"
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
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          mask="# Km"
                          unmasked-value
                          fill-mask="0"
                          reverse-fill-mask
                          dark
                          @blur="editVehicle(props.row)"
                          label="Troca de Óleo"
                          v-model="props.row.oil_change"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                          style="width: 100%;"
                        />
                      </div>
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm">
                        <div v-if="props.row.type === 'carros'">
                          <q-input
                            class="text-uppercase  q-pa-none"
                            outlined
                            dark
                            label="Correia"
                            @blur="editVehicle(props.row)"
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
                    <div class="col-4">
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="IBAMA"
                          v-model="props.row.ibama"
                          @blur="editVehicle(props.row)"
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
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="CTF"
                          @blur="editVehicle(props.row)"
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
                      <div class="row text-caption text-uppercase q-ma-sm q-pb-sm" v-if="props.row.type === 'caminhoes'">
                        <q-input
                          class="text-uppercase q-pa-none"
                          outlined
                          dark
                          label="Tacógrafo"
                          @blur="editVehicle(props.row)"
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
import moment from 'moment'

export default {
  name: 'EditVehicle',
  data () {
    return {
      columns: [
        {
          name: '',
          align: 'start',
          label: ''
        },
        {
          name: 'license_plate',
          align: 'center',
          label: 'Placa',
          field: 'license_plate',
          sortable: true
        },
        {
          name: 'nickname',
          label: 'Veículo',
          align: 'center',
          field: 'nickname',
          sortable: true
        },
        {
          name: 'autonomy',
          align: 'center',
          label: 'Autonomia',
          field: 'autonomy',
          sortable: true
        },
        {
          name: 'km_cost',
          align: 'center',
          label: 'Custo/Km',
          field: 'km_cost',
          sortable: true
        },
        {
          name: 'fuel',
          align: 'center',
          label: 'Combustível',
          field: 'fuel',
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status',
          field: 'status',
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 0
      },
      filter: '',
      vehicles: [],
      visibleColumns: ['', 'license_plate', 'nickname', 'autonomy', 'km_cost', 'fuel', 'status'],
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
</style>
