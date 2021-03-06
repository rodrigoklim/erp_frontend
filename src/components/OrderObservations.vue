<template>
  <div class="orderObservations">
    <div class="row">
      <q-btn
        icon="fas fa-plus"
        color="orange-8"
        label="Criar nova Observação"
        @click="obs = !obs"
      />
    </div>
    <div
      class="row"
      v-if="obs"
    >
      <div class="col-7">
        <div class="row q-pt-lg">
          <q-input
            class="text-uppercase"
            outlined
            dark
            label="Título"
            v-model="newObs.title"
            :rules="[val => !!val || 'Campo obrigatório.']"
            style="width: 100%;"
          />
        </div>
        <div class="row q-pt-sm">
          <q-select
            outlined
            dark
            label="Local da Observação"
            v-model="newObs.destination"
            :options="[
              {value: 'DRIVER', label:'MOTORISTA'},
              {value: 'INVOICE', label:'NOTA FISCAL'},
              ]"
            style="width: 100%;"
          />
        </div>
        <div class="row q-pt-lg">
          <q-input
            v-model="newObs.observation"
            outlined
            dark
            type="textarea"
            style="width: 100%;"
            class="text-uppercase"
          />
        </div>
        <div class="row q-pt-lg">
          <q-btn
            label="Criar Observação"
            push
            color="teal"
            style="width: 200px"
            @click="createObs"
          />
        </div>
      </div>
    </div>
    <br>
    <q-separator
      color="white"
      style="opacity:0.85"
    />
    <q-card-section>
      <div class="row">
        <div class="text-h5">OBSERVAÇÕES</div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-pt-md q-pb-md justify-between">
        <div class="col-5">
          <div class="row justify-start">
            <div class="text-h6">NOTA FISCAL</div>
          </div>
          <div class="row  q-pt-md q-pb-md">
            <q-select
              outlined
              v-model="nfSelected"
              dark
              label="Selecione Uma Observação"
              class="text-uppercase"
              :options="fiscalObs"
              :option-label="fiscalObs.title"
              @input="pickedObsNF(); nfRead = false"
              style="width: 100%;"
            />
          </div>
          <q-input
            v-model="details"
            outlined
            label="Observação"
            :readonly="nfRead"
            dark
            type="textarea"
            style="width: 100%"
            class="text-uppercase"
          />
        </div>
        <!-- <div class="col-2"> -->
        <!-- <div class="row justify-center"> -->
        <q-separator
          color="white"
          vertical
          style="opacity:0.85"
          class="q-ml-md q-mr-md"
          @click="createObs"
        />
        <!-- </div> -->
        <!-- </div> -->
        <div class="col-5">
          <div class="row justify-start">
            <div class="text-h6">MOTORISTA</div>
          </div>
          <div class="row  q-pt-md q-pb-md">
            <q-select
              v-model="driverSelected"
              outlined
              dark
              label="Selecione Uma Observação"
              class="text-uppercase"
              :options="driverObs"
              :option-label="driverObs.title"
              @input="pickedObsDriver(); driverRead = false"
              style="width: 100%;"
            />
          </div>
          <q-input
            v-model="driverDetails"
            outlined
            label="Observação"
            :readonly="driverRead"
            dark
            type="textarea"
            style="width: 100%"
            class="text-uppercase"
          />
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script>
import apiClient from 'src/services/api'
import EventBus from 'src/boot/EventBus'

export default {
  name: 'OrderObservations',
  props: {
    submitObservations: Number
  },
  data () {
    return {
      obs: false,
      newObs: {
        c_id: '',
        title: '',
        destination: '',
        observation: ''
      },
      fiscalObs: [],
      driverObs: [],
      c_id: '',
      details: '',
      driverDetails: '',
      nfSelected: [],
      driverSelected: [],
      nfRead: true,
      driverRead: true,
      submitting: false,
      submitObs: {
        invoice: '',
        driver: ''
      }
    }
  },
  methods: {
    createObs () {
      this.newObs.c_id = this.c_id
      this.visible = true
      const url = '/presell/create/observation'
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }
      const data = {
        params: this.newObs
      }
      apiClient.post(url, data, config).then(response => {
        if (response.data === 'ok') {
          if (this.newObs.destination.value === 'INVOICE') {
            this.fiscalObs.push({
              label: this.newObs.title.toUpperCase(),
              details: this.newObs.observation.toUpperCase(),
              c_id: this.newObs.c_id
            })
          } else {
            this.driverObs.push({
              label: this.newObs.title.toUpperCase(),
              details: this.newObs.observation.toUpperCase(),
              c_id: this.newObs.c_id
            })
          }
        }
        this.obs = !this.obs
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
    pickedObsNF () {
      this.details = this.nfSelected.details
    },
    pickedObsDriver () {
      this.driverDetails = this.driverSelected.details
    }
  },
  mounted () {
    const costumer = JSON.parse(localStorage.getItem('costumer'))
    const c = costumer.observations
    this.c_id = costumer.c_id
    Object.keys(c).forEach((i) => {
      if (c[i].destination === 'INVOICE') {
        this.fiscalObs.push({
          label: c[i].title,
          details: c[i].observation,
          c_id: c[i].c_id
        })
      } else {
        this.driverObs.push({
          label: c[i].title,
          details: c[i].observation,
          c_id: c[i].c_id
        })
      }
    })
  },
  watch: {
    submitObservations: function () {
      this.submitObs.invoice = this.details
      this.submitObs.driver = this.driverDetails
      EventBus.$emit('presellObservation', [this.submitObs])
    }
  }
}
</script>

<style>
</style>