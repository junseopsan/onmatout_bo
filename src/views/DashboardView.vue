<template>
  <div class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
      <!-- 월 선택 및 네비게이션 -->
      <div class="flex items-center justify-between mb-8">
        <button 
          @click="changeMonth(-1)"
          class="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">{{ monthLabel }}</h1>
        <button 
          @click="changeMonth(1)"
          class="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 월별 수업 목록 -->
      <div class="mb-8">
        <h2 class="text-lg font-bold mb-4">{{ monthLabel }} 수업 목록</h2>
        <div v-if="monthClasses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="cls in monthClasses" 
            :key="cls.id" 
            class="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer hover:shadow-md transition"
            @click="selectDate(new Date(cls.dateTime))"
          >
            <div class="font-bold text-primary-700 text-lg mb-2">{{ cls.name }}</div>
            <div class="text-gray-500 mb-1">{{ formatDateTime(cls.dateTime) }}</div>
            <div class="text-sm text-gray-400">담당: {{ cls.instructor }}</div>
            <div class="mt-2 flex gap-2">
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                출석 {{ cls.attendance?.present ?? 0 }}
              </span>
              <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                지각 {{ cls.attendance?.late ?? 0 }}
              </span>
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                결석 {{ cls.attendance?.absent ?? 0 }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-400 py-8 text-center">이번 달에 등록된 수업이 없습니다.</div>
      </div>

      <!-- 선택 날짜의 수업별 출석 현황 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold mb-4">{{ selectedDateLabel }} 수업별 출석 현황</h2>
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">수업명</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">출석</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">지각</th>
              <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">결석</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in daySummary" :key="item.classId" class="hover:bg-primary-50 transition">
              <td class="px-4 py-2 font-medium">{{ item.className }}</td>
              <td class="px-4 py-2 text-center text-green-700 font-bold">{{ item.present }}</td>
              <td class="px-4 py-2 text-center text-yellow-700 font-bold">{{ item.late }}</td>
              <td class="px-4 py-2 text-center text-red-700 font-bold">{{ item.absent }}</td>
            </tr>
            <tr v-if="daySummary.length === 0">
              <td colspan="4" class="text-center text-gray-400 py-8">해당 날짜에 예정된 수업이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClassStore } from '@/stores/class'

const selectedDate = ref(new Date())
const classStore = useClassStore()

const formatDateTime = (dt) => {
  const d = new Date(dt)
  return d.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    weekday: 'short' 
  })
}

const monthLabel = computed(() =>
  selectedDate.value.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
)

const selectedDateLabel = computed(() =>
  selectedDate.value.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  })
)

const monthClasses = computed(() =>
  classStore.classes.filter(cls => {
    const d = new Date(cls.dateTime)
    return d.getFullYear() === selectedDate.value.getFullYear() && 
           d.getMonth() === selectedDate.value.getMonth()
  })
)

const daySummary = ref([])

const updateDaySummary = () => {
  const y = selectedDate.value.getFullYear()
  const m = selectedDate.value.getMonth()
  const d = selectedDate.value.getDate()
  
  const classes = classStore.classes.filter(cls => {
    const cd = new Date(cls.dateTime)
    return cd.getFullYear() === y && 
           cd.getMonth() === m && 
           cd.getDate() === d
  })
  
  daySummary.value = classes.map(cls => ({
    classId: cls.id,
    className: cls.name,
    present: cls.attendance?.present ?? 0,
    late: cls.attendance?.late ?? 0,
    absent: cls.attendance?.absent ?? 0,
  }))
}

const selectDate = (date) => {
  selectedDate.value = date
  updateDaySummary()
}

const changeMonth = (delta) => {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  selectedDate.value = newDate
}

const fetchAll = async () => {
  await classStore.fetchClasses()
  updateDaySummary()
}

onMounted(fetchAll)
</script> 