<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">출석 관리</h1>
    </div>

    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-4 md:space-y-0">
          <div>
            <h2 class="text-lg font-medium text-gray-900">날짜별 출석 현황</h2>
          </div>
          <div class="flex items-center space-x-4">
            <div>
              <label for="date" class="sr-only">날짜</label>
              <input
                id="date"
                v-model="selectedDate"
                type="date"
                class="input"
                @change="fetchAttendancesForDate"
              />
            </div>
            <button
              class="btn btn-secondary"
              @click="setToday"
            >
              오늘
            </button>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- 에러 메시지 -->
        <div v-else-if="error" class="text-red-600 text-center py-4">
          {{ error }}
        </div>

        <!-- 데이터가 없는 경우 -->
        <div v-else-if="attendances.length === 0" class="text-gray-500 text-center py-4">
          선택한 날짜에 출석 정보가 없습니다.
        </div>

        <!-- 출석 목록 테이블 -->
        <div v-else class="mt-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수업
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시간
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    출석 상태
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="attendance in attendances" :key="attendance.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ attendance.memberName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ attendance.className }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ formatTime(attendance.date) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(attendance.status)"
                    >
                      {{ getStatusLabel(attendance.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        v-for="status in availableStatuses"
                        :key="status.value"
                        class="px-2 py-1 text-xs font-medium rounded hover:bg-gray-100"
                        :class="{ 'bg-gray-200': attendance.status === status.value }"
                        @click="updateStatus(attendance.id, status.value)"
                      >
                        {{ status.label }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="mb-4">
          <h2 class="text-lg font-medium text-gray-900">수동 출석 체크</h2>
          <p class="text-sm text-gray-500 mt-1">
            수업 참석 여부를 수동으로 기록합니다.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form @submit.prevent="handleManualCheck" class="space-y-4">
              <div>
                <label for="classId" class="block text-sm font-medium text-gray-700">
                  수업 <span class="text-red-500">*</span>
                </label>
                <select
                  id="classId"
                  v-model="manualForm.classId"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">수업 선택</option>
                  <option
                    v-for="classItem in classes"
                    :key="classItem.id"
                    :value="classItem.id"
                  >
                    {{ classItem.name }} ({{ formatDateTime(classItem.dateTime) }})
                  </option>
                </select>
              </div>

              <div>
                <label for="memberId" class="block text-sm font-medium text-gray-700">
                  회원 <span class="text-red-500">*</span>
                </label>
                <select
                  id="memberId"
                  v-model="manualForm.memberId"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">회원 선택</option>
                  <option
                    v-for="member in members"
                    :key="member.id"
                    :value="member.id"
                    :disabled="member.status !== 'active'"
                  >
                    {{ member.name }} ({{ member.phone }})
                  </option>
                </select>
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">
                  출석 상태 <span class="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  v-model="manualForm.status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option
                    v-for="status in availableStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="checkLoading"
                >
                  {{ checkLoading ? '처리 중...' : '출석 체크' }}
                </button>
              </div>
            </form>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-700 mb-2">도움말</h3>
            <ul class="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>회원이 수업에 참석했을 때 수동으로 출석을 체크할 수 있습니다.</li>
              <li>출석 상태는 '출석', '지각', '결석', '취소' 중 선택할 수 있습니다.</li>
              <li>출석 체크 시 회원의 수강권 잔여 횟수가 자동으로 차감됩니다. (결석 제외)</li>
              <li>이미 등록된 출석 정보는 위 출석 목록에서 상태를 변경할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script  setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttendanceStore } from '@/stores/attendance'
import { useClassStore } from '@/stores/class'
import { useMemberStore } from '@/stores/member'
import { formatDateTime, formatTime } from '@/utils/date'

const attendanceStore = useAttendanceStore()
const classStore = useClassStore()
const memberStore = useMemberStore()

// 출석 상태
const { attendances, loading, error } = storeToRefs(attendanceStore)
// 클래스 상태
const { classes } = storeToRefs(classStore)
// 회원 상태
const { members } = storeToRefs(memberStore)

// 날짜 선택
const selectedDate = ref(new Date().toISOString().split('T')[0])

// 수동 출석 체크 폼
const manualForm = ref({
  classId: '',
  memberId: '',
  status: 'present'
})
const checkLoading = ref(false)

// 출석 상태 옵션
const availableStatuses = [
  { value: 'present', label: '출석' },
  { value: 'late', label: '지각' },
  { value: 'absent', label: '결석' },
  { value: 'cancelled', label: '취소' }
]

// 출석 상태 스타일 및 라벨
const getStatusClass = (status) => {
  const classes = {
    'present': 'bg-green-100 text-green-800',
    'late': 'bg-yellow-100 text-yellow-800',
    'absent': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  }
  return classes[status]
}

const getStatusLabel = (status) => {
  const labels = {
    'present': '출석',
    'late': '지각',
    'absent': '결석',
    'cancelled': '취소'
  }
  return labels[status]
}

// 오늘 날짜로 설정
const setToday = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
  fetchAttendancesForDate()
}

// 날짜별 출석 정보 조회
const fetchAttendancesForDate = async () => {
  try {
    await attendanceStore.fetchDateAttendances(selectedDate.value)
  } catch (error) {
    console.error('출석 정보 조회 실패:', error)
  }
}

// 출석 상태 변경
const updateStatus = async (attendanceId, status) => {
  try {
    await attendanceStore.updateAttendanceStatus(attendanceId, status)
  } catch (error) {
    console.error('출석 상태 변경 실패:', error)
  }
}

// 수동 출석 체크
const handleManualCheck = async () => {
  if (!manualForm.value.classId || !manualForm.value.memberId || !manualForm.value.status) return

  checkLoading.value = true
  try {
    await attendanceStore.checkAttendance({
      classId: Number(manualForm.value.classId),
      memberId: manualForm.value.memberId,
      status: manualForm.value.status
    })
    
    // 폼 초기화
    manualForm.value = {
      classId: '',
      memberId: '',
      status: 'present'
    }
    
    // 출석 목록 새로고침
    if (selectedDate.value === new Date().toISOString().split('T')[0]) {
      fetchAttendancesForDate()
    }
  } catch (error) {
    console.error('출석 체크 실패:', error)
  } finally {
    checkLoading.value = false
  }
}

// 초기 데이터 로드
onMounted(async () => {
  await Promise.all([
    fetchAttendancesForDate(),
    classStore.fetchClasses(),
    memberStore.fetchMembers()
  ])
})
</script> 