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
          <div
            class="col items-center"
            align="end"
          >
            <q-btn
              size="sm"
              round
              color="blue-grey-6"
              push
              icon="add"
              @click="newCustomer"
              :disable="addBtn"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-list
          bordered
          dark
          separator
          style="opacity: 0.85"
          class="q-mb-md"
        >
          <q-item-label header>Entregue:</q-item-label>
          <div
            v-for="(customer, index) in customers"
            :key="index"
          >
            <div v-if="customer.status === '1'">
              <q-item
                disable="true"
                clickable
                v-ripple
              >
                <q-item-section
                  avatar
                  rounded
                >
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="clear"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-amber">{{ customer.nickname }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-list>
        <q-list
          bordered
          dark
          separator
        >
          <q-item-label header>Próximos Clientes:</q-item-label>
          <draggable
            v-model="next"
            group="people"
            @start="drag=true"
            @end="updateRoute"
          >
            <div
              v-for="(customer, index) in next"
              :key="index"
            >
              <q-item
                clickable
                v-ripple
              >
                <q-item-section
                  avatar
                  rounded
                >
                  <q-avatar
                    color="accent"
                    text-color="white"
                    icon="done"
                    style="opacity: 0.75"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    class="text-amber"
                    style="font-weight: bold; opacity: 0.85;"
                  >{{ customer.nickname }}</q-item-label>
                  <q-item-label
                    caption
                    style="font-weight: 500; font-size: 11px"
                  >Previsão:</q-item-label>
                  <q-item-label
                    caption
                    style="font-weight: 500; font-size: 11px"
                  >{{ customer.time }}</q-item-label>
                </q-item-section>
                <q-item-section
                  avatar
                  side
                  top
                >
                  <q-avatar
                    size="sm"
                    @click="removeCompany"
                    color="red-5"
                    text-color="white"
                    icon="fas fa-trash-alt"
                    style="opacity: 0.75"
                  />
                </q-item-section>
              </q-item>
            </div>
          </draggable>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="addCustomer"
      full-width
    >
      <q-card dark>
        <q-card-section>
          <div class="text-h5">Adicionar Cliente</div>
        </q-card-section>
        <q-card-section>
          <pre-sell :ongoing="flag"></pre-sell>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PreSell from 'src/pages/PreSell.vue'
import draggable from 'vuedraggable'

export default {
  name: 'DeliveryRoute',
  components: {
    draggable,
    PreSell
  },
  props: {
    routeOrder: Array,
    routeNextCostumers: null
  },
  data () {
    return {
      customers: [],
      next: [],
      addCustomer: false,
      addBtn: true,
      flag: 0
    }
  },
  methods: {
    updateRoute () {
      console.log('ok')
    },
    removeCompany () {
      this.$q.notify({
        color: 'red-6',
        icon: 'thumb_up_off_alt',
        message: 'Deseja remover a empresa da Rota?',
        position: 'center',
        actions: [
          {
            label: 'Não',
            color: 'negative',
            handler: () => {
            }
          },
          {
            label: 'Sim',
            color: 'yellow',
            handler: () => {
            }
          }
        ],
        timeout: Math.random() * 5000 + 3000
      })
    },
    newCustomer () {
      this.addCustomer = !this.addCustomer
      this.flag++
    }
  },
  watch: {
    routeOrder: function (val) {
      this.customers = val
    },
    routeNextCostumers: function (val) {
      this.next = val.matrix
      this.addBtn = false
    }
  }
}
</script>

<style scoped>
</style>
