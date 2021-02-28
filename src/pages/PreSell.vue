<template>
  <div class="preSell">
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
                  >Pré-Venda</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <q-card-section>
              <div class="row">
                <div class="col-11">
                  <div class="col-4">
                    <q-card dark>

                    </q-card>
                  </div>
                  <div class="col-8">
                    <q-card dark>

                    </q-card>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- dialog edit Costumer -->
        <q-dialog
          full-width
          full-height
          v-model="editCostumer"
        >
          <edit-costumer :costumer="costumerData"></edit-costumer>
        </q-dialog>
      </div>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'PreSell'
}
</script>

<style>
</style>