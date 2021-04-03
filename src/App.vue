<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
@font-face {
  font-family: raleway;
  src: local("raleway") format("truetype"),
    url("/assets/fonts/raleway-bold-webfont.ttf");
}

@font-face {
  font-family: poppins;
  src: local("poppins") format("truetype"),
    url("/assets/fonts/Poppins-ExtraLight.ttf");
}
</style>