<template>
  <div class="deliveryAddress">
    <div class="row">
      <div class="col-12">
        <h5
          class="q-ml-lg q-mb-md"
          style="font-family:raleway"
        >Dados de Entrega</h5>
      </div>
    </div>
    <div
      v-for="(delivery, index) in size"
      :key="index"
    >
      <!-- separator -->
      <div
        class="row justify-center fit items-center content-start"
        v-if="index > 0"
      >
        <div class="col-12">
          <div class="row justify-center">
            <div class="col-9">
              <div class="row justify-center q-ma-lg">
                <div class="col-12">
                  <q-separator
                    color="amber"
                    style="opacity:0.85"
                    class="q-mt-lg"
                  />
                </div>
              </div>
            </div>

          </div>
          <div class="row justify-center fit items-center content-start">
            <div class="col-11">
              <div class="row justify-start">
                <h6 style="font-family:raleway">Endereço de Entrega Alternativo</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
        <div class="col-11">
          <div class="row q-pb-md items-start">
            <div class="col-6 q-pb-none">
              <div class="row">
                <div class="col-11">
                  <q-select
                    ref="delveryTime"
                    outlined
                    v-model="address[index].deliveryPeriod"
                    :options="periods"
                    label="Período de Entrega"
                    emit-value
                    map-options
                    dark
                    :rules="[val => !!val || 'Campo obrigatório.']"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-4">
                  <div
                    class="text q-mt-sm"
                    style="font-weight: 300; font-size: 1.1rem"
                  >Região:</div>
                </div>
                <div class="col-8">
                  <search-zone
                    :zone_search="[state_search[index], city_search[index]]"
                    @zone_value="zoneValue"
                    :control="zoneControl = index"
                  ></search-zone>
                </div>
              </div>
            </div>

          </div>
          <div class="row q-pt-lg q-pb-md">
            <div class="col">
              <q-input
                v-model="address[index].street"
                outlined
                dark
                class="text-uppercase"
                label="Logradouro"
                :readonly="readonlyStreet[index]"
                :rules="[val => !!val || 'Campo obrigatório.']"
                @input="$forceUpdate()"
              />
            </div>
          </div>
          <div class="row q-pt-lg q-pb-md">
            <div class="col-6">
              <div class="row">
                <div class="col-11">
                  <q-input
                    :ref="number"
                    v-model="address[index].number"
                    outlined
                    dark
                    class="text-uppercase"
                    label="Número"
                    :readonly="readonlySecond[index]"
                    error-message="Preencha o número do endereço."
                    :error="numberEmpty"
                    @blur="geolocation(index)"
                    :rules="[val => !!val || 'Campo obrigatório.']"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row justify-end">
                <div class="col-11">
                  <q-input
                    v-model="address[index].complement"
                    outlined
                    class="text-uppercase"
                    dark
                    label="Complemento"
                    :readonly="readonlySecond[index]"
                    @input="$forceUpdate()"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-md">
            <div class="col-6">
              <div class="row">
                <div class="col-11">
                  <q-input
                    v-model="address[index].district"
                    outlined
                    dark
                    class="text-uppercase"
                    label="Bairro"
                    :readonly="readonlyDistrict[index]"
                    @input="$forceUpdate()"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row justify-end">
                <div class="col-11">
                  <q-input
                    ref="zipCode"
                    v-model="address[index].zipCode"
                    outlined
                    dark
                    mask="##.###-###"
                    unmasked-value
                    label="CEP"
                    :error="zipError"
                    :error-message="zipErrorMessage"
                    :readonly="readonlyZip[index]"
                    :rules="[  val => !!val, val => val.length == 8 || 'O CEP deve conter 8 números']"
                    @input="searchZipCode"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-md">
            <div class="col-6">
              <div class="row">
                <div class="col-11">
                  <q-input
                    v-model="address[index].city"
                    outlined
                    dark
                    :readonly="readonly[index]"
                    label="MunicÍpio"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row justify-end">
                <div class="col-11">
                  <q-input
                    v-model="address[index].state"
                    outlined
                    :readonly="readonly[index]"
                    dark
                    label="Estado"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-pb-md">
            <div class="col-6">
              <div class="row">
                <div class="col-11">
                  <q-input
                    v-model="address[index].latitude"
                    outlined
                    dark
                    :readonly="readonly[index]"
                    label="Latitude"
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="row justify-end">
                <div class="col-11">
                  <q-input
                    v-model="address[index].longitude"
                    outlined
                    :readonly="readonly[index]"
                    dark
                    label="Longitude"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row justify-center fit items-center content-start q-mt-md q-mb-sm q-pt-lg"
      v-if="control-1==0"
    >
      <div class="col-11">
        <div class="row justify-start">
          <q-btn
            push
            color="yellow-10"
            label="Adicionar Endereço de Entrega Alternativo"
            @click="addAddress"
            style="width: 300px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchZone from './SearchZone.vue'
export default {
  components: { SearchZone },
  name: 'DeliveryAddress',
  props: {
    fillAddress: Object,
    submitAddress: Number,
    company: String,
    reset: Number
  },
  data () {
    return {
      address: [
        { deliveryPeriod: '' },
        { street: '' },
        { number: '' },
        { complement: '' },
        { district: '' },
        { zipCode: '' },
        { city: '' },
        { city_code: '' },
        { state: '' },
        { latitude: '' },
        { longitude: '' },
        { zone: '' }
      ],
      zoneControl: '',
      state_search: [],
      city_search: [],
      control: 0,
      readonly: [],
      readonlyZip: [],
      readonlySecond: [],
      readonlyStreet: [],
      readonlyDistrict: [],
      numberEmpty: false,
      number: [],
      size: [],
      zipError: false,
      zipErrorMessage: '',
      periods: [
        { value: 'MANHÃ', label: 'Manhã' },
        { value: 'TARDE', label: 'Tarde' },
        { value: 'INDIFERENTE', label: 'Indiferente' }
      ]
    }
  },
  mounted () {
    this.control++
    this.size.push('a')
    this.readonly[this.control - 1] = true
    this.readonlyZip[this.control - 1] = true
    this.readonlyDistrict[this.control - 1] = true
    this.readonlyStreet[this.control - 1] = true
    if (this.company === 'np') {
      this.readonlyZip[this.control - 1] = false
      this.zipError = true
      this.zipErrorMessage = 'Preencha primeiro o CEP!'
      this.control++
    }

    if (this.reset > 0) {
      this.onReset()
    }
  },
  methods: {
    addAddress () {
      if (this.control <= 2) {
        this.control++
        this.readonlyZip[this.control - 1] = false
        this.readonly[this.control - 1] = true
        this.size.push('a')
        this.zipError = true
        this.zipErrorMessage = 'Preencha primeiro o CEP!'
        this.$refs.zipCode.focus()
      } else {
        return false
      }
    },
    handleFillAddress () {
      const sentAddress = this.fillAddress
      const i = (this.control - 1)
      if (sentAddress.street) {
        this.address[i].street = sentAddress.street.toUpperCase(
        )
      }

      if (sentAddress.number) {
        this.address[i].number = sentAddress.number
      }

      if (sentAddress.neighborhood) {
        this.address[i].district = sentAddress.neighborhood.toUpperCase()
      }

      if (sentAddress.details) {
        this.address[i].complement = sentAddress.details.toUpperCase()
      }

      if (sentAddress.zip) {
        this.address[i].zipCode = sentAddress.zip
      }

      if (sentAddress.city) {
        this.address[i].city = sentAddress.city.toUpperCase()
      }

      if (sentAddress.city_ibge) {
        this.address[i].city_code = sentAddress.city_ibge
      }

      if (sentAddress.state) {
        this.address[i].state = sentAddress.state.toUpperCase()
      }
      this.geolocation(i)
      this.city_search[i] = sentAddress.city_ibge
      this.state_search[i] = sentAddress.state
    },
    zoneValue (zone) {
      const i = this.zoneControl
      this.address[i].zone = zone
    },
    geolocation (i) {
      // const self = this
      const addressSearched = this.address[i].street + ' ' + this.address[i].number + ' ' + this.address[i].district + ' ' + this.address[i].city + ' ' + this.address[i].state
      const urlPrefix = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      const urlSuffix = '.json?access_token=pk.eyJ1Ijoicm9kcmlnb2tsaW0iLCJhIjoiY2tsMXFqZ3N0MDRreTJubDE0cXE2ajgyNyJ9.Q3uw6cMgSJ6HOuS8K3Wnjg'

      this.$axios.get(urlPrefix + addressSearched + urlSuffix).then(res => {
        this.address[i].latitude = res.data.features[0].center[1]
        this.address[i].longitude = res.data.features[0].center[0]
        this.$forceUpdate()
        this.numberEmpty = false
      }).catch(error => {
        console.log('error', error)
        return error
      })
    },
    searchZipCode () {
      let i
      if (this.company === 'np') {
        i = 0
      } else {
        i = (this.control - 1)
      }
      var zip = this.address[i].zipCode
      this.zipErrorMessage = 'O CEP deve conter 8 números!'
      if (zip.length === 8) {
        this.zipError = false
        this.$axios.get('https://viacep.com.br/ws/' + zip + '/json').then(response => {
          this.city_search[i] = response.data.ibge
          this.state_search[i] = response.data.uf

          if (!response.data.logradouro) {
            this.readonlyStreet = false
          }

          if (!response.data.bairro) {
            this.readonlyDistrict = false
          }
          this.address[i].street = response.data.logradouro.toUpperCase()
          this.readonlySecond[i] = false
          this.numberEmpty = true
          this.address[i].district = response.data.bairro.toUpperCase()
          this.address[i].city = response.data.localidade.toUpperCase()
          this.address[i].city_code = response.data.ibge
          this.address[i].state = response.data.uf.toUpperCase()
          this.$forceUpdate()
        }).catch(error => {
          console.log('error', error)
          this.zipError = true
          this.zipErrorMessage = 'Preencha primeiro o CEP!'
          this.$refs.zipCode.focus()
          return error
        })
      }
    },
    onReset () {
      this.street = ''
      this.number = ''
      this.complement = ''
      this.district = ''
      this.city = ''
      this.state = ''
    }
  },
  watch: {
    fillAddress: function () {
      this.handleFillAddress()
    },
    submitAddress: function () {
      if (this.deliveryPeriod === '') {
        this.$refs.delveryTime.validate()
      }
      this.$emit('addressFilled', this.address)
    }
  }
}
</script>

<style>
</style>