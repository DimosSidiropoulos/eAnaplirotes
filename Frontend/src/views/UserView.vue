<script setup lang="ts">
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { Anapliroths } from '../../types/interfaces'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)
const moriaPinaka = ref<number[]>([])
const seiraPinaka = ref<number[]>([])
const data = ref<number[]>([])
const chartLabels = ref<string[]>([])
const select = ref('Μόρια Πίνακα')

const chartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [{
    label: select.value,
    data: data.value,
    borderColor: 'rgb(8 145 178)',
    backgroundColor: 'rgb(8 145 178)',
  }],
}))

const chartOptions = ref({
  responsive: true,
})

const route = useRoute()

const userData: Ref<Anapliroths | undefined> = ref()

const { Eponymo, Onoma, Patronymo } = route.params

onMounted(async () => {
  await axios
    .get<Anapliroths>(`https://eanaplirotes.iee.ihu.gr/api/user/${Eponymo}/${Onoma}/${Patronymo}`)
    .then((response) => {
      userData.value = response.data
      for (let i = 0; i < response.data.length; i++) {
        chartLabels.value.push(response.data[i].Etos)
        moriaPinaka.value.push(response.data[i].Moria_Pinaka)
        seiraPinaka.value.push(response.data[i].Seira_Pinaka)
      }
    })
    .catch((error) => {
    // eslint-disable-next-line no-console
      console.log(error)
    })
  data.value = moriaPinaka.value
})

function changeChartValues(event: string) {
  if (event === 'Μόρια Πίνακα')
    data.value = moriaPinaka.value
  else
    data.value = seiraPinaka.value
}
</script>

<template>
  <div class="w-full h-full">
    <div class="flex-none md:flex">
      <div class="w-full md:w-3/4">
        <Line
          id="my-chart-id"
          :options="chartOptions"
          :data="chartData"
        />
      </div>
      <div class="flex flex-col mb-10 md:mb-0 items-center md:w-1/4 mt-7 pr-5">
        <div>
          <v-select
            v-model="select"
            label="Select"
            :items="['Σειρά Πίνακα', 'Μόρια Πίνακα']"
            class="w-[20rem] h-20"
            @update:model-value="changeChartValues"
          />
        </div>
        <div class="flex items-center">
          <v-card title="Στοιχεία Αναπληρωτή" width="320">
            <v-card-text>
              <p>
                Επώνυμο: {{ route.params.Eponymo }}
              </p>
              <p>Όνομα: {{ route.params.Onoma }}</p>
              <p>Πατρώνυμο: {{ route.params.Patronymo }}</p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">
            Χρονιά
          </th>
          <th class="text-left">
            Τύπος
          </th>
          <th class="text-left">
            Κλάδος
          </th>
          <th class="text-left">
            Σειρά Πίνακα
          </th>
          <th class="text-left">
            Μόρια Πίνακα
          </th>
          <th class="text-left">
            Περιοχή Τοποθέτησης
          </th>
          <th class="text-left">
            Διεύθυνση Εκπαίδευσης
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in userData"
          :key="index"
        >
          <td>{{ item.Etos }}</td>
          <td>{{ item.Typos }}</td>
          <td>{{ item.Klados }}</td>
          <td>{{ item.Seira_Pinaka }}</td>
          <td>{{ item.Moria_Pinaka }}</td>
          <td>{{ item.Perioxh_Topothethshs }}</td>
          <td>{{ item.Dieytynsh_Ekpaideyshs }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
