<template>
  <div class="newVehicle">
    <div class="row">
      <h5 class="q-ma-sm q-mb-none">Novo Veículo</h5>
    </div>
    <q-form
      ref="form"
      autofocus
      spellcheck="false"
      autocomplete="off"
      @submit.prevent.stop="submit"
      greedy
    >
      <!-- Vehicle Model -->
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <div class="col-11">
          <div class="row justify-between items-start">
            <div class="col-2">
              <q-card
                dark
                class="q-mr-sm"
              >
                <q-field
                  dark
                  outlined
                  ref="category"
                  v-model="vehicle.type"
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
                          v-model="vehicle.type"
                          val="caminhoes"
                          label="Caminhão"
                          @input="getBrands"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="vehicle.type"
                          val="carros"
                          label="Carro"
                          @input="getBrands"
                        />
                        <div class="row">
                          <q-radio
                            dark
                            v-model="vehicle.type"
                            val="motos"
                            label="Moto"
                            @input="getBrands"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </q-field>
              </q-card>
            </div>
            <div class="col-3">
              <q-select
                outlined
                dark
                v-model="vehicle.brand"
                use-input
                input-debounce="0"
                label="Marca"
                :options="brands"
                option-value="id"
                option-label="name"
                map-options
                @filter="filterFn"
                @input="getModels"
                class="text-uppercase"
                style="width: 95%"
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
            <div class="col-3">
              <q-select
                outlined
                dark
                v-model="vehicle.model"
                use-input
                input-debounce="0"
                label="Modelo"
                :options="models"
                option-value="id"
                option-label="name"
                @input="getSpecificModels"
                map-options
                @filter="filterFn"
                class="text-uppercase"
                style="width: 95%"
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
            <div class="col-4">
              <q-select
                outlined
                dark
                v-model="vehicle.specificModel"
                use-input
                input-debounce="0"
                label="Modelo Específico"
                :options="specificModels"
                option-value="id"
                option-label="name"
                map-options
                @input="getVehicle"
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
          </div>
        </div>
      </div>
      <div class="row justify-center items-baseline">
        <div class="col-11">
          <q-input
            v-model="vehicle.nickname"
            label="Apelido"
            outlined
            dark
            class="text-uppercase"
            style="width: 100%"
          />
        </div>
      </div>
      <!-- / Vehicle Model -->

      <!-- separtor -->
      <div class="col-12">
        <div class="row justify-start q-ma-lg">
          <div class="col-12">
            <q-separator
              color="white"
              style="opacity:0.85"
              class="q-mt-lg"
            />
          </div>
        </div>
        <div class="row">
          <h5 class="q-ma-sm q-mb-none">Informações Gerais</h5>
        </div>
      </div>
      <!-- / separator -->

      <!-- General Info -->
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <div class="col-11">
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                v-model="vehicle.licensePlate"
                label="Placa"
                outlined
                dark
                mask="XXXXXXX"
                :rules="[ val => val.length == 7 || 'O campo deve conter 7 caracteres.']"
                class="text-uppercase"
                style="width: 100%"
              />
            </div>
            <div class="col q-ml-sm">
              <q-field
                dark
                outlined
                ref="category"
                v-model="vehicle.fuel"
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
                    <q-radio
                      dark
                      v-model="vehicle.fuel"
                      val="diesel"
                      label="Diesel"
                    />
                    <q-radio
                      dark
                      v-model="vehicle.fuel"
                      val="etanol"
                      label="Etanol"
                    />
                    <q-radio
                      dark
                      v-model="vehicle.fuel"
                      val="flex"
                      label="Flex"
                    />
                    <q-radio
                      dark
                      v-model="vehicle.fuel"
                      val="gasolina"
                      label="Gasolina"
                    />
                  </div>
                </template>
              </q-field>
            </div>
          </div>
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                style="width: 100%;"
                v-model="vehicle.kmCost"
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
                v-model="vehicle.autonomy"
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
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                style="width: 100%;"
                v-model="vehicle.fuelTank"
                outlined
                dark
                reverse-fill-mask
                label="Tanque de Combustível"
                class="text-uppercase"
                :rules="[val => !!val || 'Campo obrigatório.']"
                suffix="Lts"
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                class="text-uppercase"
                outlined
                dark
                label="Última Troca de Óleo"
                v-model="vehicle.oilChange"
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
                        v-model="vehicle.oilChange"
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
          <div class="row">
            <div class="col q-mr-sm">
              <q-input
                style="width: 100%;"
                v-model="vehicle.initialKm"
                outlined
                dark
                label="Quilometragem Inicial"
                class="text-uppercase"
                :rules="[val => !!val || 'Campo obrigatório.']"
                suffix="Kms"
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                class="text-uppercase"
                outlined
                dark
                label="Última Troca de Filtros"
                v-model="vehicle.filterChange"
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
                        v-model="vehicle.filterChange"
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
          <div
            class="row"
            v-if="vehicle.type === 'carros'"
          >
            <div class="col q-mr-sm">
              <q-input
                class="text-uppercase q-mr-sm"
                outlined
                dark
                label="Última Troca de Correia"
                v-model="vehicle.toothedBelt"
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
                        v-model="vehicle.toothedBelt"
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

            </div>
          </div>
        </div>
      </div>
      <!-- /General Info -->

      <!-- separtor -->
      <div class="col-12">
        <div class="row justify-start q-ma-lg">
          <div class="col-12">
            <q-separator
              color="white"
              style="opacity:0.85"
              class="q-mt-lg"
            />
          </div>
        </div>
        <div class="row">
          <h5 class="q-ma-sm q-mb-none">Carga</h5>
        </div>
      </div>
      <!-- / separator -->

      <!-- Load Info -->
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <div class="col-11">
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
                  v-model="vehicle.load_category"
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
                          v-model="vehicle.load_category"
                          val="granel"
                          label="Granel"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="vehicle.load_category"
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
                  v-model="vehicle.load_classification"
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
                          v-model="vehicle.load_classification"
                          val="gas"
                          label="Gás"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="vehicle.load_classification"
                          val="liquido"
                          label="Líquido"
                        />
                      </div>
                      <div
                        class="row"
                        v-if="vehicle.load_category === 'fracionado'"
                      >
                        <q-radio
                          dark
                          v-model="vehicle.load_classification"
                          val="embalagem"
                          label="Embalagem"
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
                  v-model="vehicle.load_unity"
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
                          v-model="vehicle.load_unity"
                          val="litros"
                          label="Litros"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="vehicle.load_unity"
                          val="quilos"
                          label="Quilos"
                        />
                      </div>
                      <div class="row">
                        <q-radio
                          dark
                          v-model="vehicle.load_unity"
                          val="m3"
                          label="m3"
                        />
                      </div>
                    </div>
                  </template>

                </q-field>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col-6 q-mr-sm">
              <q-input
                v-model="vehicle.load_capacity"
                label="Capacidade"
                outlined
                dark
                class="text-uppercase"
                style="width: 100%"
                :suffix="vehicle.load_unity"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- /Load Info -->

      <!-- separator -->
      <div class="col-12">
        <div class="row justify-start q-ma-lg">
          <div class="col-12">
            <q-separator
              color="white"
              style="opacity:0.85"
              class="q-mt-lg"
            />
          </div>
        </div>
      </div>
      <div v-if="vehicle.type === 'caminhoes'">
        <div class="col-12">
          <div class="row">
            <h5 class="q-ma-sm q-mb-none">Certificados</h5>
          </div>
        </div>
        <!-- / separator -->

        <!-- Certificates -->

        <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
          <div class="col-11">
            <div class="row justify-center fit items-top content-strech q-mt-md q-mb-lg">
              <div class="col q-mr-sm">
                <q-input
                  class="text-uppercase"
                  outlined
                  dark
                  label="Certificado CIV"
                  v-model="vehicle.civ"
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
                          v-model="vehicle.civ"
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
                  label="Certificado CIPP"
                  v-model="vehicle.cipp"
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
                          v-model="vehicle.cipp"
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
            <div class="row justify-center fit items-top content-strech q-mt-md q-mb-lg">
              <div class="col q-mr-sm">
                <q-input
                  class="text-uppercase"
                  outlined
                  dark
                  label="Certificado de Válvulas"
                  v-model="vehicle.valvule"
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
                          v-model="vehicle.valvule"
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
                  label="Certificado IBAMA"
                  v-model="vehicle.ibama"
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
                          v-model="vehicle.ibama"
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
            <div class="row justify-center fit items-top content-strech q-mt-md q-mb-lg">
              <div class="col q-mr-sm">
                <q-input
                  class="text-uppercase"
                  outlined
                  dark
                  label="Certificado CTF"
                  v-model="vehicle.ctf"
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
                          v-model="vehicle.ctf"
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
                  label="Certificado Tacógrafo"
                  v-model="vehicle.tachograph"
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
                          v-model="vehicle.tachograph"
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
      </div>
      <!-- button -->
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <q-btn
          color="primary"
          push
          label="Criar Veículo"
          style="width: 300px"
          type="submit"
        >
          <template v-slot:loading>
            <q-spinner-orbit
              color="white"
              size="1.35em"
            />
          </template>
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
export default {
  name: 'NewVehicle',
  data () {
    return {
      vehicle: {
        type: '',
        brand: '',
        model: '',
        specificModel: '',
        nickname: '',
        vehicle: '',
        fuel: '',
        kmCost: '',
        autonomy: '',
        fuelTank: '',
        oilChange: '',
        initialKm: '',
        filterChange: '',
        toothedBelt: '',
        load_category: '',
        load_classification: '',
        load_unity: '',
        load_capacity: '',
        civ: '',
        cipp: '',
        valvule: '',
        ibama: '',
        ctf: '',
        tachograph: ''
      },
      submitting: false,
      brands: [],
      models: [],
      specificModels: [],
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
    getBrands () {
      const self = this
      const url = 'https://fipeapi.appspot.com/api/1/' + this.vehicle.type + '/marcas.json'
      this.$axios.get(url).then(response => {
        self.brands = response.data
      }).catch(error => {
        console.log('error', error)
      })
    },
    getModels () {
      const self = this
      const url = 'https://fipeapi.appspot.com/api/1/' + this.vehicle.type + '/veiculos/' + this.vehicle.brand.id + '.json'
      this.$axios.get(url).then(response => {
        console.log(response.data)
        self.models = response.data
      }).catch(error => {
        console.log('error', error)
      })
    },
    getSpecificModels () {
      const self = this
      const url = 'https://fipeapi.appspot.com/api/1/' + this.vehicle.type + '/veiculo/' + this.vehicle.brand.id + '/' + this.vehicle.model.id + '.json'
      this.$axios.get(url).then(response => {
        console.log(response.data)
        self.specificModels = response.data
      }).catch(error => {
        console.log('error', error)
      })
    },
    getVehicle () {
      const self = this
      const url = 'https://fipeapi.appspot.com/api/1/' + this.vehicle.type + '/veiculo/' + this.vehicle.brand.id + '/' + this.vehicle.model.id + '/' + this.vehicle.specificModel.id + '.json'
      this.$axios.get(url).then(response => {
        console.log(response.data)
        self.vehicle.vehicle = response.data
      }).catch(error => {
        console.log('error', error)
      })
    },
    submit () {
      this.submitting = true
      const url = '/vehicle/create'
      const data = {
        params: {
          form: this.vehicle
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
              message: 'Veículo cadastrado com sucesso!',
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
              message: 'Veículo não cadastrado, verifique os dados!',
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
        message: 'Veículo não cadastrado, falha no envio!',
        position: 'top-right'
      })
    }
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