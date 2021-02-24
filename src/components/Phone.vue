<template>
  <div class="phone">
    <div
      v-for="(phone, index) in phones"
      :key="index"
    >
      <div class="row fit justify-center items-center content-start q-mt-md">
        <div class="col-6">
          <q-input
            outlined
            mask=" (##)#####-#### "
            dark
            class="text-uppercase"
            v-model="phone.phone"
            unmasked-value
            :label="'Telefone '+ (index+1)"
            :rules="[val => !!val, val => val.length >= 10  || 'Campo obrigatório.' ]"
          />
        </div>
        <div
          class="col-6"
          style="font-weight: 300"
        >
          <q-toggle
            v-model="phone.whats"
            color="teal"
            icon="fab fa-whatsapp"
            label="WhatsApp"
            size="lg"
            false-value="false"
          />
        </div>
      </div>
    </div>
    <div class="row fit justify-start items-center content-start q-mt-md">
      <div class="col-7">
        <q-btn
          push
          color="yellow-10"
          label="Adicionar Novo Telefone"
          @click="addPhone"
        />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Phone',
  data () {
    return {
      phones: [{
        phone: null,
        whats: 'false'
      }]
    }
  },
  props: {
    phoneNumbers: Number,
    editPhones: Array
  },
  methods: {
    addPhone (index) {
      if (this.phones.length < 5) {
        this.phones.push({ phone: null, whats: 'false' })
      } else {
        return false
      }
    },
    handleEditPhones () {
      if (this.editPhones) {
        const p = this.editPhones
        Object.keys(p).forEach((key) => {
          this.phones[key].phone = p[key][0]
          if (p[key][1] === '1') {
            this.phones[key].whats = true
          } else {
            this.phones[key].whats = 'false'
          }
          this.addPhone()
        })
      }
    }
  },
  watch: {
    phoneNumbers: function () {
      this.$emit('responsePhones', this.phones)
    },
    editPhones: function () {
      this.handleEditPhones()
    }
  }
}
</script>
<style>
</style>