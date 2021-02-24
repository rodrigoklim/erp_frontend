<template>
  <div class="paymentMethods">
    <div class="row">
      <div class="col-12">
        <h5
          class="q-ml-lg q-mb-md"
          style="font-family:raleway"
        >Forma de Pagamento</h5>
      </div>
    </div>
    <div class="row justify-center fit items-center content-start q-mt-md q-mb-lg">
      <div class="col-11">
        <div class="row">
          <div class="col-6">
            <div class="row justify-center">
              <div class="col-4">
                <div
                  class="text q-mt-sm"
                  style="font-weight: 300; font-size: 1.1rem"
                >Prazo:</div>
              </div>
              <div class="col-8">
                <div class="row">
                  <q-option-group
                    dark
                    v-model="payment.term"
                    :options="paymentTerms"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- anticipated payment -->
          <div
            class="col-6"
            v-if="payment.term === 'anticipated'"
          >
            <div class="row">
              <div class="col">
                <q-select
                  ref="anticipatedAccount"
                  outlined
                  v-model="anticipated.account"
                  :options="bankAccount"
                  label="Conta para Crédito"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Campo obrigatório.']"
                  dark
                />
              </div>
            </div>
          </div>
          <!-- cash Payment -->
          <div
            class="col-6"
            v-if="payment.term === 'cashPay'"
          >
            <div class="row">
              <div class="col">
                <q-select
                  ref="cashPayMethod"
                  outlined
                  v-model="cashPay.method"
                  :options="cashPayMethods"
                  label="Modalidade de Pagamento"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Campo obrigatório.']"
                  dark
                />
              </div>
            </div>
          </div>
          <div
            class="col-6"
            v-if="payment.term === 'credit'"
          >
            <div class="row">
              <div class="col">
                <q-select
                  ref="creditMethod"
                  outlined
                  v-model="credit.method"
                  :options="creditPaymentMethods"
                  label="Modalidade de Pagamento"
                  emit-value
                  map-options
                  dark
                  :rules="[val => !!val || 'Campo obrigatório.']"
                />
              </div>
            </div>
            <br>
            <div v-if="credit.method == 'bankSlip'">
              <div class="row">
                <div class="col">
                  <div
                    class="text q-mt-sm q-ml-sm q-mb-sm"
                    style="font-weight: 300; font-size: 1.1rem"
                  >Prazo para Pagamento:</div>
                </div>
              </div>
              <div class="row fit justify-start items-center content-start">
                <div class="col">
                  <input-tag
                    v-model="bankSlipTerm"
                    placeholder="Separe os dias com vírgula"
                  >
                  </input-tag>
                </div>
              </div>
            </div>
            <div v-if="credit.method == 'check'">
              <div class="row">
                <div class="col">
                  <div
                    class="text q-mt-sm q-ml-sm q-mb-sm"
                    style="font-weight: 300; font-size: 1.1rem"
                  >Prazo para Pagamento:</div>
                </div>
              </div>
              <div class="row fit justify-start items-center content-start">
                <div class="col">
                  <input-tag
                    v-model="checkTerm"
                    placeholder="Separe os dias com vírgula"
                  >
                  </input-tag>
                </div>
              </div>
            </div>
            <div v-if="credit.method == 'bankTransfer'">
              <q-card dark>
                <q-card-section>
                  <div class="row">
                    <div class="row fit justify-start items-center content-start">
                      <div class="col">
                        <q-input
                          style="width: 100%;"
                          ref="transferContract"
                          v-model="bankTransfer.contract"
                          outlined
                          dark
                          label="Número do Contrato"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row fit justify-start items-center content-start">
                    <div class="row">
                      <div class="col">
                        <div
                          class="text q-mt-md q-mb-sm"
                          style="font-weight: 300; font-size: 1.1rem"
                        >Prazo para Pagamento:</div>
                      </div>
                    </div>
                    <div class="row fit justify-start items-center content-start">
                      <div class="col">
                        <input-tag
                          v-model="bankTransfer.term"
                          placeholder="Separe os dias com vírgula"
                        >
                        </input-tag>
                      </div>
                    </div>
                  </div>
                  <br>
                  <div class="row q-mt-mg">
                    <div class="col">
                      <q-select
                        outlined
                        ref="transferAccount"
                        v-model="bankTransfer.account"
                        :options="bankAccount"
                        label="Conta para Crédito"
                        emit-value
                        map-options
                        dark
                        :rules="[val => !!val || 'Campo obrigatório.']"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-if="credit.method == 'monthlyPayment'">
              <q-card dark>
                <q-card-section>
                  <div class="row">
                    <div class="row fit justify-start items-center content-start">
                      <div class="col">
                        <q-input
                          style="width: 100%; text-align: center;"
                          ref="monthlyClose"
                          v-model.number="monthlyPayment.closeDate"
                          type="number"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                          outlined
                          @input="limitCloseDayRange()"
                          dark
                          label="Dia de Fechamento"
                          prefix="todo dia    "
                          suffix="do mês"
                        />
                      </div>
                    </div>
                  </div>
                  <br>
                  <div class="row">
                    <div class="row fit justify-start items-center content-start">
                      <div class="col">
                        <q-input
                          style="width: 100%; text-align: center;"
                          ref="monthlyPay"
                          v-model.number="monthlyPayment.paymentDate"
                          type="number"
                          :rules="[val => !!val || 'Campo obrigatório.']"
                          @input="limitPayDayRange()"
                          outlined
                          dark
                          label="Dia Vencimento Boleto"
                          prefix="todo dia    "
                          suffix="do mês"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethods',
  props: {
    getPayment: Number
  },
  data () {
    return {
      payment: {
        term: ''
      },
      anticipated: {
        account: ''
      },
      cashPay: {
        method: ''
      },
      credit: {
        method: ''
      },
      bankSlipTerm: [],
      checkTerm: [],
      bankTransfer: {
        contract: '',
        term: [],
        account: ''
      },
      monthlyPayment: {
        closeDate: '',
        paymentDate: ''
      },
      paymentTerms: [
        { value: 'anticipated', label: 'Antecipado' },
        { value: 'cashPay', label: 'À Vista' },
        { value: 'credit', label: 'À Prazo' }
      ],
      bankAccount: [
        { value: 'bb1', label: 'Banco do Brasil - 2354 / 4565465-5' },
        { value: 'bb2', label: 'Bradesco - 2354 / 4565465-5' },
        { value: 'bb3', label: 'Caixa Econômica Federal - 2354 / 4565465-5' }
      ],
      cashPayMethods: [
        { value: 'cash', label: 'Dinheiro' },
        { value: 'debitCard', label: 'Cartão de Débito' },
        { value: 'creditCard', label: 'Cartão de Crédito' },
        { value: 'check', label: 'Cheque' }
      ],
      creditPaymentMethods: [
        { value: 'bankSlip', label: 'Boleto Bancário' },
        { value: 'check', label: 'Cheque' },
        { value: 'bankTransfer', label: 'Transferência Bancária' },
        { value: 'monthlyPayment', label: 'Fechamento Mensal' }
      ]
    }
  },
  methods: {
    limitPayDayRange () {
      const value = this.monthlyPayment.paymentDate
      if (value < 0) {
        this.monthlyPayment.paymentDate = 0
      } else if (value > 30) {
        this.monthlyPayment.paymentDate = 30
      }
    },
    limitCloseDayRange () {
      const value = this.monthlyPayment.closeDate
      if (value < 0) {
        this.monthlyPayment.closeDate = 0
      } else if (value > 30) {
        this.monthlyPayment.closeDate = 30
      }
    }
  },
  watch: {
    getPayment: function () {
      var payMethod = []
      if (this.payment.term === 'anticipated') {
        this.$refs.anticipatedAccount.validate()
        payMethod = {
          term: 'anticipated',
          method: 'bankTransfer',
          account: this.anticipated.account,
          control: this.anticipated.account
        }
        this.$emit('paymentMethod', payMethod)
      } else if (this.payment.term === 'cashPay') {
        this.$refs.cashPayMethod.validate()
        payMethod = {
          term: 'cashPay',
          method: this.cashPay.method,
          control: this.cashPay.method
        }
        this.$emit('paymentMethod', payMethod)
      } else if (this.payment.term === 'credit') {
        this.$refs.creditMethod.validate()
        switch (this.credit.method) {
          case 'bankSlip':
            payMethod = {
              term: 'credit',
              method: 'bankSlip',
              methodTerm: this.bankSlipTerm,
              control: this.bankSlipTerm
            }
            this.$emit('paymentMethod', payMethod)
            break
          case 'check':
            payMethod = {
              term: 'credit',
              method: 'check',
              methodTerm: this.checkTerm,
              control: this.checkTerm
            }
            this.$emit('paymentMethod', payMethod)
            break
          case 'bankTransfer':
            this.$refs.transferAccount.validate()
            this.$refs.transferContract.validate()
            payMethod = {
              term: 'credit',
              method: 'bankTransfer',
              contract: this.bankTransfer.contract,
              account: this.bankTransfer.account,
              methodTerm: this.bankTransfer.term,
              control: this.bankTransfer.term
            }
            this.$emit('paymentMethod', payMethod)
            break
          case 'monthlyPayment':
            this.$refs.monthlyClose.validate()
            this.$refs.monthlyPay.validate()
            payMethod = {
              term: 'credit',
              method: 'monthlyPayment',
              closeDate: this.monthlyPayment.closeDate,
              paymentDate: this.monthlyPayment.paymentDate,
              control: ['pay', 'ok']
            }
            this.$emit('paymentMethod', payMethod)
            break
        }
      } else {
        payMethod = {
          term: '',
          control: ''
        }
        this.$emit('paymentMethod', payMethod)
      }
    }
  }
}
</script>

<style>
.q-select .text-negative {
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