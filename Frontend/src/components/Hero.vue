<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Anapliroths } from 'types/interfaces'
import Dialog from './Dialog.vue'

const router = useRouter()
const nameArray = ref([])
const name = ref('')
const loading = ref()
const synonymyModal = ref(false)
const filteredArray = ref()
const typoi = ref([])
const kladoi = ref([])
const perioxes = ref([])
const dieythynseis = ref([])
const typos = ref()
const klados = ref()
const perioxh = ref()
const dieythynsh = ref()
const searchType = ref(false)

const userInput = computed(() => {
  return name.value !== ''
})

const userInputAll = computed(() => {
  return typos.value?.length || klados.value?.length || perioxh.value?.length || dieythynsh.value?.length
})

function groupData(data: Anapliroths) {
  const result: Anapliroths[] = []
  const groups: { [key: string]: Anapliroths } = {}

  data.forEach((item) => {
    const patronymo = item.Patronymo

    if (!groups[patronymo]) {
      groups[patronymo] = []
      result.push(groups[patronymo])
    }

    groups[patronymo].push(item)
  })

  return result
}

function getNames(names: string) {
  if (names && names.length > 0)
    name.value = names.normalize('NFD').replace(/[\u0300-\u036F]/g, '')

  loading.value = true
  axios
    .post(
      'https://eanaplirotes.iee.ihu.gr/api/anaplirotes',
      {
        name: name.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response) => {
      nameArray.value = response.data
      loading.value = false
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

function getInfo() {
  const infoName = name.value.replace(/ /g, '_')
  axios
    .get(`https://eanaplirotes.iee.ihu.gr/api/onoma/${infoName}`)
    .then((response) => {
      filteredArray.value = groupData(response.data as Anapliroths)

      if (filteredArray.value.length > 1) {
        synonymyModal.value = true
      }
      else {
        const { Eponymo, Onoma, Patronymo } = filteredArray.value[0][0]
        router.push({
          name: 'User',
          params: {
            Eponymo,
            Onoma,
            Patronymo,
          },
        })
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

function customFilter(item: string, nameArray: string) {
  const queries = nameArray.trim().toLowerCase().split(' ')
  const names = item.trim().toLowerCase().split(' ')
  return queries.every(query => names.some(name => name.includes(query)))
}

axios.get('https://eanaplirotes.iee.ihu.gr/api/typos').then((response) => {
  typoi.value = response.data
})
axios.get('https://eanaplirotes.iee.ihu.gr/api/klados').then((response) => {
  kladoi.value = response.data
})
axios.get('https://eanaplirotes.iee.ihu.gr/api/perioxh').then((response) => {
  perioxes.value = response.data
})
axios.get('https://eanaplirotes.iee.ihu.gr/api/dieythynsh').then((response) => {
  dieythynseis.value = response.data
})
</script>

<template>
  <div class="mb-11">
    <v-switch v-model="searchType" hide-details class="text-cyan-600 w-56" :class="searchType ? 'ml-0' : 'ml-5'" :label="searchType === false ? 'Γενική αναζήτηση' : 'Προσωπική Αναζήτηση'" />
    <div v-if="searchType">
      <v-autocomplete
        v-model="name"
        hide-no-data
        :custom-filter="customFilter"
        :loading="loading"
        class="bg-white w-96"
        label="Αναζητήστε το ονοματεπώνυμό σας"
        :items="nameArray"
        @update:search="getNames"
      />
      <v-btn class="w-96" :disabled="!userInput" @click="getInfo">
        Αναζητηση
      </v-btn>
    </div>
    <div v-else>
      <v-select
        v-model="typos"
        class="w-96 px-5"
        clearable
        label="Τύπος"
        :items="typoi"
      />
      <v-select
        v-model="klados"
        class="w-96 px-5"
        clearable
        label="Κλάδος"
        :items="kladoi"
      />
      <v-select
        v-model="perioxh"
        class="w-96 px-5"
        clearable
        chips
        label="Περιοχή Τοποθέτησης"
        :items="perioxes"
        multiple
      />
      <v-select
        v-model="dieythynsh"
        class="w-96 px-5"
        clearable
        label="Διεύθυνση Εκπαίδευσης"
        :items="dieythynseis"
      />
      <router-link
        class="w-full flex justify-center items-center px-5"
        :to="{
          name: 'SearchResults',
          query: {
            typos,
            klados,
            perioxh,
            dieythynsh,
          },
        }"
      >
        <v-btn class="w-full" :disabled="!userInputAll">
          Αναζητηση
        </v-btn>
      </router-link>
    </div>
    <div class="text-center">
      <Dialog
        v-if="synonymyModal"
        v-model="synonymyModal"
        :people="filteredArray"
        @close-modal="synonymyModal = false"
      />
    </div>
  </div>
</template>
