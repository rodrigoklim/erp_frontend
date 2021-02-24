<template>
  <div class="products">
    <q-page class="flex">
      <div class="row fit justify-center items-center content-start">
        <div class="col-11 q-mt-md q-mb-md">
          <q-card
            dark
            class="full-width"
            style="border-radius: 2em; overflow: inherit !important; color:white; opacity:0.75; font-family: poppins; font-weight: 200"
          >
            <q-card-section>
              <div class="row">
                <div class="col-3">
                  <div
                    class="text-h4"
                    style="color: #4DA3FE"
                  >Produtos</div>
                </div>
                <div class="col-9">
                  <div class="row justify-end items-baseline">
                    <q-btn-toggle
                      v-model="tab"
                      toggle-color="primary"
                      flat
                      :options="[
                      {label: 'Novo Produto', value: 'np', icon: 'fas fa-dolly'},
                      {label: 'Listar Produtos', value: 'edit', icon: 'mode_edit'}
                    ]"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="flip-up"
              transition-next="flip-down"
            >
              <q-tab-panel
                dark
                name='np'
                style="background-color:#1d1d1d"
              >
                <new-product></new-product>
              </q-tab-panel>
              <q-tab-panel
                dark
                name='edit'
                style="background-color:#1d1d1d"
              >
                <edit-product></edit-product>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import NewProduct from 'src/components/NewProduct.vue'
import EditProduct from 'src/components/EditProduct.vue'
export default {
  components: { NewProduct, EditProduct },
  name: 'Products',
  data () {
    return {
      tab: 'edit'
    }
  }
}
</script>

<style>
</style>