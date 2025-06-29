<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { chartDataInterface } from 'types/interfaces'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
  Title,
  Tooltip,
  Legend,
)
const route = useRoute()
const data = ref<chartDataInterface[]>([])
const chartLabels = ref([])
const dataMin = ref<chartDataInterface[]>([])
const chartLabelsMin = ref([])
const dataArrived = ref(false)
const chartOptions = ref({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Πλήθος αναπληρωτών',
      position: 'bottom',
      align: 'center',
      font: {
        weight: 'bold',
      },
    },
    colors: {
      forceOverride: true,
    },
  },
})
const chartOptionsMin = ref({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Ελάχιστα μόρια εισαγωγής',
      position: 'bottom',
      align: 'center',
      font: {
        weight: 'bold',
      },
    },
    colors: {
      forceOverride: true,
    },
  },
})

const chartData: any = computed(() => ({
  labels: chartLabels.value,
  datasets: data?.value?.map(item => ({
    label: item.label,
    data: item.data,
  })),
}))

const chartDataMin: any = computed(() => ({
  labels: chartLabelsMin.value,
  datasets: dataMin?.value?.map(item => ({
    label: item.label,
    data: item.data,
  })),
}))

onMounted(async () => {
  await performSearch()
})

async function performSearch() {
  const params = route.query

  await axios.get('https://eanaplirotes.iee.ihu.gr/api/search', { params })
    .then((response) => {
      chartLabels.value = response.data.anaplirotesCount.labels
      data.value = response.data.anaplirotesCount.datasets.map(
        (item: chartDataInterface) => {
          return {
            label: item.label,
            data: item.data,
          }
        },
      )
      chartLabelsMin.value = response.data?.minMoria?.labels
      dataMin.value = response.data?.minMoria?.datasets.map(
        (item: chartDataInterface) => {
          return {
            label: item.label,
            data: item.data,
          }
        },
      )
      dataArrived.value = true
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <div class="w-full h-full">
    <div v-if=" chartData.labels.length" class="w-full sm:h-[30rem] flex-none sm:flex justify-center items-center gap-40 mb-10 px-2">
      <Line
        id="countChart"
        :options="chartOptions"
        :data="chartData"
        width="100"
        height="100"
      />
      <Line
        v-if="chartLabelsMin"
        id="minChart"
        :options="chartOptionsMin"
        :data="chartDataMin"
        width="100"
        height="100"
      />
    </div>
    <v-table v-if=" chartData.labels.length">
      <thead>
        <tr>
          <th class="text-left">
            Χρονιά
          </th>
          <th class="text-left">
            Αναπληρωτές
          </th>
          <th v-if="chartLabelsMin" class="text-left">
            Ελάχιστα μόρια εισαγωγής
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in chartLabels"
          :key="index"
        >
          <td>{{ item }}</td>
          <td>{{ chartData?.datasets[0]?.data[index] }}</td>
          <td v-if="chartLabelsMin">
            {{ chartDataMin?.datasets[0]?.data[index] }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="dataArrived === true && !chartData.labels.length" class="h-full flex flex-col justify-center items-center w-full">
      <img width="400" height="400" class="absolute top-5" src="../assets/error-404-4344461-3613889.webp" alt="">
      <h1 class="text-xl font-bold mt-36">
        Δεν βρέθηκαν αποτελέσματα για την αναζήτησή σας, επιστρέψτε στην <span class="text-cyan-600 cursor-pointer underline" @click="$router.push('/')">αρχική</span>.
      </h1>
    </div>
  </div>
</template>
