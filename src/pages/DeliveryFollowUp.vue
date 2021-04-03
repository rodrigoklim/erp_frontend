<template>
  <div class="DeliveryFollowUp">
    <q-page class="flex">
      <div class="row fit justify-center items-center content-start">
        <div class="col-11 q-mt-md q-mb-md">
          <q-card
            dark
            class="full-width"
            style="border-radius: 2em; overflow: inherit !important; color:white; opacity:0.75; font-family: poppins; font-weight: 300"
          >
            <q-card-section>
              <div class="row">
                <div class="col-8">
                  <div
                    class="text-h4"
                    style="color: #4DA3FE"
                  >Entregas</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-3">
                <q-card>
                  <q-card-section>
                    <div class="text-h5">Lista de Rotas</div>
                  </q-card-section>
                  <q-separator dark />
                </q-card>
              </div>
              <div class="col-6">
                q-card-section
              </div>
              <div class="col-3"></div>
            </div>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
export default {
  name: 'deliveryFollowUp'
}
</script>

<style>
</style>