<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import '@mdi/font/css/materialdesignicons.css'
</script>

<template>
  <v-app class="grey lighten-4">
    <Navbar />
    <RouterView />
    <Footer />
  </v-app>
</template>

<style scoped>
</style>
