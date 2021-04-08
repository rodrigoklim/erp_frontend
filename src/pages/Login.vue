<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-dark">

        <div
          class="fit row no-wrap justify-center items-center content-start"
          style="height:auto"
        >
          <q-img
            src="~assets/img/logo_novo.png"
            width="500px"
            fluid
            alt="Criomec"
          />
        </div>
        <div class="row">
          <q-card style="font-family: poppins; font-weight: 800; font-size: 20px; color:#007bff; opacity: 0.75; border-radius:1em; min-width: 400px ;background-color:#343A40; margin-top:0; ">
            <q-card-section align="center">
              <h6 style="margin:0; padding:0;  font-weight: 800;">Login</h6>
            </q-card-section>
            <q-form>
              <q-card-section>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      type="email"
                      outlined
                      v-model="email"
                      label="E-mail"
                      dark
                    />
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-12">
                    <q-input
                      type="password"
                      outlined
                      v-model="password"
                      label="Senha"
                      dark
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="center">
                <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                  <div class="row">
                    <div class="col-12">
                      <q-btn
                        @click.prevent="login()"
                        class="btn btn-primary"
                        label="Entrar"
                        color="primary"
                        style="width:200px"
                        icon-right="double_arrow"
                        :loading="visible"
                      >
                        <template v-slot:loading>
                          <q-spinner-orbit
                            color="white"
                            size="1.35em"
                          />
                        </template>
                      </q-btn>
                    </div>
                  </div>
                </transition>
              </q-card-actions>
            </q-form>
          </q-card>
        </div>
      </q-page>

    </q-page-container>

    <q-footer
      elevated
      class="bg-grey-8 text-white"
    >
      <q-toolbar>
        <span
          class="absolute-right"
          style="margin-top:1em; font-family: poppins; font-weight: normal; margin-right: 10px"
        >2021, feito com <q-icon
            name="favorite"
            color="negative"
          ></q-icon> por TecnoKlim</span>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script>
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import apiClient from '../services/api'
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.use(VueSweetalert2)

export default {
  name: 'Login',
  data () {
    return {
      password: '',
      email: '',
      visible: false,
      errors: ''
    }
  },
  methods: {
    async login () {
      const self = this
      this.visible = true // can use this to triggle a :disabled on login button
      this.errors = null
      try {
        await apiClient.post('/login', {
          email: this.email,
          password: this.password
          // }
        }).then(response => {
          console.log(response)
          self.output = response.data
          localStorage.token = ''
          localStorage.token = response.data.token
          localStorage.userId = response.data.user.id
          localStorage.name = response.data.user.name
          this.$q.sessionStorage.set('logged', 'true')
          self.visible = false
          self.$router.push('/')
        })
      } catch (error) {
        this.errors = error.response && error.response.data.errors
        console.log(this.errors)
        self.$swal({
          icon: 'error',
          title: 'Erro!',
          text: 'Usuário ou senha inválidos'
        })
        self.visible = false
        self.output = error
        return false
      }

      this.visible = false
    }
  }
}
</script>
<style scoped>
</style>