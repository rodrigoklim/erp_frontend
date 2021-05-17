<template>
  <div class="searchCnpj">
    <div class="col-12">
      <q-input
        ref="cnpj"
        v-model="cnpj"
        hint="Apenas CPNJs válidos serão aceitos"
        type="text"
        outlined
        label="CNPJ"
        dark
        required
        mask="##.###.###/####-##"
        :loading="loadingState"
        :error-message="error"
        :error="!isValid"
        unmasked-value
        @blur="handleCNPJ(cnpj)"
      >
      </q-input>
    </div>
  </div>
</template>
<script>
import apiClient from 'src/services/api'
import { throttle } from 'quasar'

export default {
  name: 'SearchCnpj',
  data () {
    return {
      cnpj: '',
      isValid: true,
      loadingState: false,
      error: ''
    }
  },
  methods: {
    handleCNPJ (cnpj) {
      this.loadingState = true
      const r = this.validateCNPJ(cnpj)
      if (r === false) {
        this.error = 'CNPJ inserido inválido ou incorreto'
        this.loadingState = false
        this.$refs.cnpj.focus()
        this.isValid = false
      } else {
        this.uniqueSearch(cnpj)
      }
    },
    validateCNPJ (cnpj) {
      if (cnpj === '') {
        return false
      }

      if (cnpj.length !== 14) {
        return false
      }
      // Elimina CNPJs invalidos conhecidos
      if (cnpj === '00000000000000' ||
        cnpj === '11111111111111' ||
        cnpj === '22222222222222' ||
        cnpj === '33333333333333' ||
        cnpj === '44444444444444' ||
        cnpj === '55555555555555' ||
        cnpj === '66666666666666' ||
        cnpj === '77777777777777' ||
        cnpj === '88888888888888' ||
        cnpj === '99999999999999') {
        return false
      }
      // Valida DVs
      var tamanho = cnpj.length - 2
      var numeros = cnpj.substring(0, tamanho)
      var digitos = cnpj.substring(tamanho)
      var soma = 0
      var pos = tamanho - 7
      var i
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) {
          pos = 9
        }
      }
      var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
      if (resultado !== parseInt(digitos.charAt(0))) {
        return false
      }
      tamanho = tamanho + 1
      numeros = cnpj.substring(0, tamanho)
      soma = 0
      pos = tamanho - 7
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--
        if (pos < 2) {
          pos = 9
        }
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
      if (resultado !== parseInt(digitos.charAt(1))) {
        return false
      }
      return true
    },
    searchSintegra (cnpj) {
      const self = this
      const config = {
        headers: {
          'x-rapidapi-key': '72bd2565f8msh6cb15839d744453p1c01cfjsnd6aa9d69201a',
          'x-rapidapi-host': 'consulta-cnpj-gratis.p.rapidapi.com'
        }
      }
      this.$axios.get('https://consulta-cnpj-gratis.p.rapidapi.com/companies/' + cnpj, config).then(response => {
        self.loadingState = false
        this.$emit('update', response.data)
      }).catch(error => {
        console.log('error', error)
        return error
      })
    },
    uniqueSearch (cnpj) {
      const url = '/costumer/verify'
      const data = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        },
        params: {
          cnpj: cnpj
        }
      }
      apiClient.get(url, data).then(response => {
        if (response.data === 'error') {
          this.error = 'Este Cliente já está cadastrado'
          this.loadingState = false
          this.$refs.cnpj.focus()
          this.isValid = false
        } else {
          this.$refs.cnpj.resetValidation()
          this.isValid = true
          this.searchSintegra(cnpj)
        }
      }).catch(error => {
        console.log('error', error)
      })
    }
  },
  created () {
    this.searchSintegra = throttle(this.searchSintegra, 500)
  }
}
</script>
<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.q-input .text-negative {
  color: tomato !important;
}
.q-field--error .q-field__bottom {
  color: tomato !important;
  color: tomato !important;
  font-weight: 300;
}
.q-field__bottom {
  font-weight: 300;
}
</style>