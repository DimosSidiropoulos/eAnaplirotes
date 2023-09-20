<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

const links = ref([
  'About',
  'Github',
  'Contact',
])
</script>

<template>
  <v-footer class="bg-cyan-600">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        variant="text"
        class="mx-2"
        rounded="xl"
      >
        {{ link }}
      </v-btn>
      <v-col class="text-center mt-4 text-white" cols="12">
        {{ new Date().getFullYear() }} — <strong>Dimos Sidiropoulos</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>
