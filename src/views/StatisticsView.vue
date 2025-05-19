<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">통계 및 리포트</h1>
      <button
        class="btn btn-primary"
        @click="generateReport"
        :disabled="loading"
      >
        <DocumentTextIcon class="h-5 w-5 mr-2" />
        리포트 생성
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="text-red-600 text-center py-4">
      {{ error }}
    </div>

    <!-- 통계 대시보드 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 출석률 개요 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">출석 현황</h2>
        <div v-if="attendanceStats">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">총 수업</p>
              <p class="text-2xl font-bold">{{ attendanceStats.totalClasses }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">총 출석</p>
              <p class="text-2xl font-bold">{{ attendanceStats.totalAttendance }}</p>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">출석 상태 분포</h3>
            <div class="relative pt-1">
              <div class="flex h-6 mb-2 overflow-hidden rounded-full">
                <div
                  class="bg-green-500"
                  :style="`width: ${attendanceStats.presentRate}%`"
                ></div>
                <div
                  class="bg-yellow-500"
                  :style="`width: ${attendanceStats.lateRate}%`"
                ></div>
                <div
                  class="bg-red-500"
                  :style="`width: ${attendanceStats.absentRate}%`"
                ></div>
                <div
                  class="bg-gray-400"
                  :style="`width: ${attendanceStats.cancelledRate}%`"
                ></div>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-green-600">출석 {{ attendanceStats.presentRate }}%</span>
                <span class="text-yellow-600">지각 {{ attendanceStats.lateRate }}%</span>
                <span class="text-red-600">결석 {{ attendanceStats.absentRate }}%</span>
                <span class="text-gray-600">취소 {{ attendanceStats.cancelledRate }}%</span>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <AttendanceChart
              v-if="attendanceStats.monthlyData.length > 0"
              :chart-data="attendanceChartData"
            />
          </div>
        </div>
      </div>

      <!-- 회원 통계 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">회원 현황</h2>
        <div v-if="memberStats">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">총 회원</p>
              <p class="text-2xl font-bold">{{ memberStats.totalMembers }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">활동 회원</p>
              <p class="text-2xl font-bold">{{ memberStats.activeMembers }}</p>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">회원 상태</h3>
            <div class="relative pt-1">
              <div class="flex h-6 mb-2 overflow-hidden rounded-full">
                <div
                  class="bg-green-500"
                  :style="`width: ${(memberStats.activeMembers / memberStats.totalMembers) * 100}%`"
                ></div>
                <div
                  class="bg-gray-400"
                  :style="`width: ${(memberStats.inactiveMembers / memberStats.totalMembers) * 100}%`"
                ></div>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-green-600">활동 {{ Math.round((memberStats.activeMembers / memberStats.totalMembers) * 100) }}%</span>
                <span class="text-gray-600">비활동 {{ Math.round((memberStats.inactiveMembers / memberStats.totalMembers) * 100) }}%</span>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">최다 출석 회원</h3>
            <ul class="space-y-2">
              <li v-for="member in memberStats.topMembers" :key="member.id" class="flex justify-between">
                <span class="text-sm">{{ member.name }}</span>
                <span class="text-sm font-medium">{{ member.attendanceCount }}회</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 수강권 통계 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">수강권 현황</h2>
        <div v-if="ticketStats">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">총 수강권</p>
              <p class="text-2xl font-bold">{{ ticketStats.totalTickets }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-sm text-gray-500">활성 수강권</p>
              <p class="text-2xl font-bold">{{ ticketStats.activeTickets }}</p>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">수강권 상태</h3>
            <div class="relative pt-1">
              <div class="flex h-6 mb-2 overflow-hidden rounded-full">
                <div
                  class="bg-blue-500"
                  :style="`width: ${(ticketStats.activeTickets / ticketStats.totalTickets) * 100}%`"
                ></div>
                <div
                  class="bg-gray-400"
                  :style="`width: ${(ticketStats.expiredTickets / ticketStats.totalTickets) * 100}%`"
                ></div>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-blue-600">활성 {{ Math.round((ticketStats.activeTickets / ticketStats.totalTickets) * 100) }}%</span>
                <span class="text-gray-600">만료 {{ Math.round((ticketStats.expiredTickets / ticketStats.totalTickets) * 100) }}%</span>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <TicketChart
              v-if="ticketStats.monthlyData.length > 0"
              :chart-data="ticketChartData"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 기간별 필터 -->
    <div class="mt-6 bg-white shadow rounded-lg p-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label for="period" class="block text-sm font-medium text-gray-700 mb-1">
            기간 선택
          </label>
          <select
            id="period"
            v-model="selectedPeriod"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            @change="fetchStatsByPeriod"
          >
            <option value="week">주간</option>
            <option value="month">월간</option>
            <option value="year">연간</option>
          </select>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">
            날짜 범위
          </label>
          <div class="flex items-center space-x-2">
            <input
              type="date"
              v-model="startDate"
              class="input"
            />
            <span>~</span>
            <input
              type="date"
              v-model="endDate"
              class="input"
            />
            <button
              class="btn btn-secondary"
              @click="applyDateRange"
              :disabled="loading"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup >
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useStatisticsStore } from '@/stores/statistics'
import AttendanceChart from '@/components/statistics/AttendanceChart.vue'
import TicketChart from '@/components/statistics/TicketChart.vue'

const statisticsStore = useStatisticsStore()
const { attendanceStats, memberStats, ticketStats, loading, error } = storeToRefs(statisticsStore)

// 기간 필터
const selectedPeriod = ref<'week' | 'month' | 'year'>('month')
const startDate = ref(new Date(new Date().setDate(1)).toISOString().split('T')[0]) // 이번 달 1일
const endDate = ref(new Date().toISOString().split('T')[0]) // 오늘

// 차트 데이터 계산
const attendanceChartData = computed(() => {
  if (!attendanceStats.value?.monthlyData) return null
  
  return {
    labels: attendanceStats.value.monthlyData.map(item => item.month),
    datasets: [
      {
        label: '출석',
        data: attendanceStats.value.monthlyData.map(item => item.present),
        backgroundColor: '#10B981',
      },
      {
        label: '지각',
        data: attendanceStats.value.monthlyData.map(item => item.late),
        backgroundColor: '#FBBF24',
      },
      {
        label: '결석',
        data: attendanceStats.value.monthlyData.map(item => item.absent),
        backgroundColor: '#EF4444',
      },
      {
        label: '취소',
        data: attendanceStats.value.monthlyData.map(item => item.cancelled),
        backgroundColor: '#9CA3AF',
      }
    ]
  }
})

const ticketChartData = computed(() => {
  if (!ticketStats.value?.monthlyData) return null
  
  return {
    labels: ticketStats.value.monthlyData.map(item => item.month),
    datasets: [
      {
        label: '구매',
        data: ticketStats.value.monthlyData.map(item => item.purchased),
        backgroundColor: '#3B82F6',
      },
      {
        label: '만료',
        data: ticketStats.value.monthlyData.map(item => item.expired),
        backgroundColor: '#9CA3AF',
      }
    ]
  }
})

// 기간별 통계 조회
const fetchStatsByPeriod = async () => {
  try {
    await Promise.all([
      statisticsStore.fetchAttendanceStats(selectedPeriod.value),
      statisticsStore.fetchTicketStats(selectedPeriod.value === 'week' ? 'month' : selectedPeriod.value)
    ])
  } catch (error) {
    console.error('통계 조회 실패:', error)
  }
}

// 날짜 범위 적용
const applyDateRange = async () => {
  // 날짜 범위에 따른 통계 조회 API 호출 (백엔드에서 구현 필요)
  try {
    await statisticsStore.fetchAllStats()
  } catch (error) {
    console.error('통계 조회 실패:', error)
  }
}

// 리포트 생성
const generateReport = async () => {
  try {
    // 리포트 생성 및 다운로드 API 호출 (백엔드에서 구현 필요)
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period: selectedPeriod.value,
        startDate: startDate.value,
        endDate: endDate.value
      }),
    })
    
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } else {
      throw new Error('리포트 생성에 실패했습니다.')
    }
  } catch (error) {
    console.error('리포트 생성 실패:', error)
  }
}

// 초기 데이터 로드
onMounted(async () => {
  await statisticsStore.fetchAllStats()
})
</script> 