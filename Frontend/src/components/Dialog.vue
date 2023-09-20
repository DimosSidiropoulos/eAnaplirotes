<script setup lang="ts">
import type { Anapliroths, anapliroths } from 'types/interfaces'
import { computed, defineEmits, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  value: Boolean,
  people: Array as () => Anapliroths[],
})

const emit = defineEmits(['closeModal', 'update:value'])

const router = useRouter()

const propModel = computed({
  get: () => props.value,
  set: (value) => {
    emit('update:value', value)
  },
})

const userArray: Anapliroths = []
if (props.people) {
  for (let i = 0; i < props.people?.length; i++)
    userArray.push(props.people[i][0])
}

function goToUserPage(userInfo: anapliroths) {
  const { Eponymo, Onoma, Patronymo } = userInfo
  router.push({
    name: 'User',
    params: {
      Eponymo,
      Onoma,
      Patronymo,
    },
  })
}
</script>

<template>
  <v-dialog width="500" :value="propModel" @input="$emit('update:modelValue', $event.target.value)">
    <v-card>
      <div class="flex items-center justify-center w-full h-16 shrink-0 bg-cyan-600">
        <span
          class="text-lg font-medium text-white"
        >Συνωνυμία</span>
      </div>
      <div class="flex flex-col justify-center items-center gap-3 text-center mt-5">
        <p v-if="people && people.length > 0" class="font-bold text-lg">
          {{ people[0][0].Onoma }} {{ people[0][0].Eponymo }}
        </p>
        <p class="text-center p-2">
          Υπάρχουν συνωνυμίες στο συγκεκριμένο όνομα παρακαλώ επιλέξτε πατρώνυμο:
        </p>
        <v-btn v-for="userInfo in userArray " :key="userInfo.ID" size="large" class="bg-gray-300 rounded-lg w-44" @click="goToUserPage(userInfo)">
          <span>  {{ userInfo.Patronymo }}</span>
        </v-btn>
      </div>
      <v-card-actions>
        <v-btn class="text-cyan-600" block @click="emit('closeModal')">
          Close Dialog
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
</style>
