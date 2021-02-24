<template>
  <div
    class="searchZone"
    v-if="showRadio"
  >
    <q-field
      ref="zoneOption"
      bottom-slots
      :value="zone"
      :rules="[val => !!val]"
      style="font-size: 16px"
    >

      <template v-slot:control>
        <div class="row">
          <q-radio
            dark
            v-model="zone"
            :val="option1"
            :label="label1"
          />
        </div>
        <div class="row">
          <q-radio
            dark
            v-model="zone"
            :val="option2"
            :label="label2"
          />
        </div>
      </template>
      <template v-slot:error>
        Campo obrigatório.
      </template>
    </q-field>
  </div>
</template>
<script>
export default {
  name: 'SearchZone',
  data () {
    return {
      zone: '',
      option1: '',
      option2: '',
      label1: '',
      label2: '',
      showRadio: false
    }
  },
  props: {
    zone_search: Array
  },
  methods: {
    zoneSearch () {
      const self = this
      this.$axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + this.zone_search[0] + '/municipios').then(res => {
        Object.keys(res.data).forEach((key) => {
          var cidade = res.data[key].id
          if (parseInt(this.zone_search[1]) === parseInt(cidade)) {
            self.option1 = res.data[key].microrregiao.nome
            self.label1 = res.data[key].microrregiao.nome
            self.option2 = res.data[key].microrregiao.mesorregiao.nome
            self.label2 = res.data[key].microrregiao.mesorregiao.nome
            self.showRadio = true
          }
        })
      }).catch(error => {
        console.log('error', error)
        return error
      })
    },
    isValid () {
      return this.zone !== ''
    }
  },
  watch: {
    zone_search: function (newVal, oldVal) {
      this.zoneSearch()
    },
    zone: function () {
      this.$emit('zone_value', this.zone)
    }
  }
}
</script>
<style>
.text-negative {
  color: tomato !important;
  color: tomato !important;
}

element.style {
}
*,
*:before,
*:after {
  box-sizing: inherit;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
}
user agent stylesheet div {
  display: block;
}
.q-radio {
  font-weight: 300;
  color: white;
}
</style>