<template>
  <div class="ChecklistCarga">
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
                  >Checklist Carga</div>
                </div>
              </div>
            </q-card-section>
            <q-separator
              dark
              inset
            />
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-10 q-pa-none">
                <load-info></load-info>
              </div>
            </div>
            <div class="row justify-center items-start q-pa-sm">
              <div class="col-10 q-pa-none">
                <load-checklist></load-checklist>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import LoadInfo from '../components/LoadInfo'
import LoadChecklist from '../components/LoadChecklist'

export default {
  name: 'checklistCarga',
  components: {
    LoadInfo,
    LoadChecklist
  }
}
</script>

<style>
</style>