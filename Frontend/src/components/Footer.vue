<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
</script>

<template>
  <v-footer class="bg-cyan-600">
    <v-row justify="center" no-gutters>
      <v-btn
        color="white"
        variant="text"
        class="mx-2"
        rounded="xl"
        @click="$router.push('/api')"
      >
        API Documentation
      </v-btn>
      <a href="https://github.com/DimosSidiropoulos/eAnaplirotes" target="_blank">
        <v-btn
          color="white"
          variant="text"
          class="mx-2"
          rounded="xl"
        >
          Github
        </v-btn>
      </a>
      <a href="mailto:dimos1710@gmail.com?subject=Εφαρμογή eAnaplirotes" target="_blank">
        <v-btn
          color="white"
          variant="text"
          class="mx-2"
          rounded="xl"
        >
          Contact
        </v-btn>
      </a>
      <v-col class="text-center mt-4 text-white" cols="12">
        {{ new Date().getFullYear() }} — <strong>Dimos Sidiropoulos</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>
