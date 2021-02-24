<template>
  <q-dialog :style="{'background-color': color }">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{title_alert_text}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span> {{alert_text}} </span>
      </q-card-section>

      <q-card-actions
        align="right"
        class="bg-white text-teal"
      >
        <q-btn
          flat
          label="OK"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ErrorAlert',

  props: {
    alert_data: Array
  },
  data () {
    return {
      color: '',
      alert_text: '',
      title_alert_text: ''
    }
  }
}
</script>
<style>
</style>