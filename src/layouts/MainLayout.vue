<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      style="background-color: #181825;"
      elevated
    >
      <q-toolbar>
        <q-img
          src="~assets/img/logo_novo.png"
          style="opacity: 0.95"
          width="110px"
          fluid
          alt="Criomec"
          to="/"
        />
        <q-toolbar-title class="absolute-center">
          <q-tabs
            no-caps
            align="center"
            indicator-color="white"
            v-model="tab"
          >
            <q-route-tab
              to="/"
              label="Home"
              name="home"
              style="font-family: poppins; font-weight:800 !important; font-size: 20px; color:#007bff; opacity: 0.75"
            />
            <q-route-tab
              to="/pre-venda"
              label="Pré-Venda"
              name="presell"
              style="font-family: poppins; font-weight:800 !important; font-size: 20px; color:#007bff; opacity: 0.75"
            />
            <q-route-tab
              to="/rotas"
              label="Rotas "
              name="routes"
              style="font-family: poppins; font-weight:800 !important; font-size: 20px; color:#007bff; opacity: 0.75"
            />
            <q-route-tab
              to="/entregas"
              label="Entregas"
              name="deliveryFollowUp"
              style="font-family: poppins; font-weight:800 !important; font-size: 20px; color:#007bff; opacity: 0.75"
            />
            <q-route-tab
              to="/page3"
              label="Manutenção"
              name="maintenance"
              style="font-family: poppins; font-weight:800 !important; font-size: 20px; color:#007bff; opacity: 0.75"
            />
            <q-btn-dropdown
              auto-close
              stretch
              flat
              no-caps
              label="Cadastro"
              name="register"
              style="font-family: poppins; font-weight:800 !important; font-size: 14px; color:#007bff; opacity: 0.75"
            >
              <q-list style="background-color: #181825;font-family: poppins; font-weight:800 !important; font-size: 14px; color:#007bff; opacity: 0.75">
                <q-item
                  clickable
                  to="/clientes"
                  name="costumer"
                >
                  <q-item-section>Cliente</q-item-section>
                </q-item>
                <q-item
                  clickable
                  to="/produtos"
                  name="products"
                >
                  <q-item-section>Produtos</q-item-section>
                </q-item>
                <q-item
                  clickable
                  to="/veiculos"
                  name="vehicles"
                >
                  <q-item-section>Veículos</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-tabs>
        </q-toolbar-title>
        <q-toolbar-title class="absolute-right">
          <q-tabs
            align="right"
            indicator-color="white"
            style="margin-top: 0.45em"
            no-caps
          >
            <q-btn-dropdown
              auto-close
              stretch
              flat
              :label="user"
              no-caps
              style="font-family: poppins; font-weight:800; font-size: 14px; color:#007bff; opacity: 0.75; width: 175px"
            >
              <q-list style="background-color: #181825;font-family: poppins; font-weight:800; font-size: 14px; color:#007bff; opacity: 0.75">
                <q-item
                  clickable
                  @click='logout'
                >
                  <q-item-section>
                    <q-icon
                      name="exit_to_app"
                      style="color:#007bff;opacity:0.75; font-size:1.5em"
                    />
                  </q-item-section>
                  <q-item-section>
                    Log-out
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-tabs>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container style="background-color:#141414">
      <router-view />
    </q-page-container>

    <!-- <q-footer
      elevated
      class="bg-grey-8 text-white"
    >
      <q-toolbar>
        <span
          class="absolute-right"
          style="margin-top:1em; font-family: poppins; font-weight: 280; margin-right: 10px"
        >2021, feito com <q-icon
            name="favorite"
            color="negative"
          ></q-icon> por TecnoKlim</span>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      user: '',
      tab: ''
    }
  },
  mounted () {
    this.user = localStorage.name
  },
  created () {
    this.$q.addressbarColor.set('#181825')
  },
  methods: {
    logout () {
      this.$q.sessionStorage.set('logged', 'false')
      this.$router.push('/login')
    }
  }
}
</script>
<style>
.q-tab__label {
  font-size: 14px;
  line-height: 1.715em;
  font-weight: 800;
}
</style>
