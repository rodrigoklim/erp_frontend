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
  src: local('/assets/fonts/raleway-bold-webfont.ttf') format("truetype"), url("https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap");
}

@font-face {
  font-family: poppins;
  src: local('/assets/fonts/Poppins-ExtraLight.ttf') format("truetype"), url("https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap");
}
</style>