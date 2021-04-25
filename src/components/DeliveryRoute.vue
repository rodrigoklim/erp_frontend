<template>
  <div class="DeliveryRoute">
  <q-card
    dark
    class="q-ml-sm"
  >
    <q-card-section>
      <div class="row">
        <div class="col items-center">
          <div class="text-h5 ">Dados Rota</div>
        </div>
        <div class="col items-center" align="end">
          <q-btn size="sm" round color="blue-grey-6" push icon="add" />
        </div>
      </div>
    </q-card-section>
    <q-separator dark/>
    <q-card-section>
      <q-list bordered dark separator style="opacity: 0.85" class="q-mb-md">
        <q-item-label header>Entregue:</q-item-label>
        <div v-for="(customer, index) in customers" :key="index">
          <div v-if="customer.status === '1'">
            <q-item disable="true" clickable v-ripple>
              <q-item-section avatar rounded>
                <q-avatar color="primary" text-color="white" icon="clear"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-amber">{{ customer.nickname }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-list>
      <q-list bordered dark separator>
        <q-item-label header>Próximos Clientes:</q-item-label>
        <draggable v-model="customers" group="people" @start="drag=true" @end="updateRoute">
          <div v-for="(customer, index) in customers" :key="index">
            <div v-if="customer.status === null">
              <q-item clickable v-ripple>
                <q-item-section avatar rounded>
                  <q-avatar color="accent" text-color="white" icon="done" style="opacity: 0.75"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-amber" style="font-weight: bold; opacity: 0.85;">{{ customer.nickname }}</q-item-label>
                  <q-item-label caption style="font-weight: 500; font-size: 11px">Previsão:</q-item-label>
                  <q-item-label caption style="font-weight: 500; font-size: 11px">08hs15min</q-item-label>
                </q-item-section>
                <q-item-section avatar side top>
                  <q-avatar size="sm" color="red-5" text-color="white" icon="fas fa-trash-alt" style="opacity: 0.75"/>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </draggable>
      </q-list>
    </q-card-section>
  </q-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DeliveryRoute',
  components: {
    draggable
  },
  props: {
    routeOrder: Array
  },
  data () {
    return {
      customers: []
    }
  },
  methods: {
    updateRoute () {
      console.log('ok')
    }
  },
  watch: {
    routeOrder: function (val) {
      console.log(val)
      this.customers = val
    }
  }
}
</script>

<style scoped>

</style>
