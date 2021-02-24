<template>
  <div class="SearchCpf">
    <div class="row justify-center fit items-center content-start">
      <div class="col-12">
        <q-input
          ref="cpf"
          v-model="cpf"
          hint="Apenas CPFs válidos serão aceitos"
          type="text"
          outlined
          label="CPF"
          dark
          required
          mask="###.###.###-##"
          :loading="loadingState"
          :error-message="error"
          :error="!isValid"
          unmasked-value
          @blur="handleCPF(cpf)"
        >
        </q-input>
      </div>
    </div>
    <div class="row justify-start fit items-center content-start q-pt-lg q-mt-lg">
      <div class="col-6">
        <q-input
          ref="birthdate"
          outlined
          dark
          label="Data de Nascimento"
          v-model="birthdate"
          mask="##/##/####"
          :rules="[val => !!val]"
          :disable="validCPF"
          unmasked-value
          @blur="handleCPF()"
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
                  v-model="birthdate"
                  mask="DD/MM/YYYY"
                  :locale="ptBr"
                  dark
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
</template>

<script>
import apiClient from '../services/api'

export default {
  name: 'SearchCpf',
  data () {
    return {
      cpf: '',
      isValid: true,
      loadingState: false,
      error: '',
      birthdate: '',
      validCPF: true,
      ptBr: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },
  methods: {
    handleCPF () {
      const e = this.validateCPF(this.cpf)
      this.loadingState = true
      this.$refs.cpf.validate()
      console.log(this.birthdate)
      if (e === true) {
        this.$refs.cpf.validate()
        this.uniqueSearch(this.cpf)
      } else {
        this.error = 'CPF inserido inválido ou incorreto'
        this.loadingState = false
        this.$refs.cpf.focus()
        this.isValid = false
      }
    },
    validateCPF (strCPF) {
      var Soma
      var Resto
      var i

      strCPF = String(strCPF)
      strCPF = strCPF.replace(/[^0-9]/g, '')
      // strCPF = parseInt(strCPF);

      Soma = 0
      if (strCPF === '00000000000') return false
      if (strCPF === '11111111111') return false
      if (strCPF === '22222222222') return false
      if (strCPF === '33333333333') return false
      if (strCPF === '44444444444') return false
      if (strCPF === '55555555555') return false
      if (strCPF === '66666666666') return false
      if (strCPF === '77777777777') return false
      if (strCPF === '88888888888') return false
      if (strCPF === '99999999999') return false

      for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
      Resto = (Soma * 10) % 11

      if ((Resto === 10) || (Resto === 11)) Resto = 0
      if (Resto !== parseInt(strCPF.substring(9, 10))) return false

      Soma = 0
      for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
      Resto = (Soma * 10) % 11

      if ((Resto === 10) || (Resto === 11)) Resto = 0
      if (Resto !== parseInt(strCPF.substring(10, 11))) return false
      return true
    },
    searchSintegra (cpf, birthday) {
      this.loadingState = true
      const self = this
      this.$axios.get('https://www.sintegraws.com.br/api/v1/execute-api.php', {
        params: {
          cpf: cpf,
          'data-nascimento': birthday,
          token: '315B1A90-8F61-4328-8635-CD4573979CBB',
          plugin: 'CPF'
        }
      }).then(response => {
        self.loadingState = false
        this.$emit('update', response.data)
      }).catch(error => {
        console.log('error', error)
        return error
      })
    },
    uniqueSearch (cpf) {
      const url = '/costumer/verify'
      const data = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        },
        params: {
          cpf: cpf
        }
      }
      apiClient.get(url, data).then(response => {
        if (response.data === 'error') {
          this.error = 'Este Cliente já está cadastrado'
          this.loadingState = false
          this.$refs.cpf.focus()
          this.isValid = false
        } else {
          this.loadingState = false
          this.validCPF = false
          this.$refs.cpf.resetValidation()
          this.isValid = true
          const e = this.$refs.birthdate.validate()
          if (e === true) {
            this.searchSintegra(cpf, this.birthdate)
          }
        }
      }).catch(error => {
        console.log('error', error)
      })
    }
  }
}
</script>

<style>
</style>