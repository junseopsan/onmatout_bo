<template>
  <Modal :title="`출석 관리 - ${classData?.name}`" @close="$emit('close')">
    <div class="space-y-4">
      <!-- 수업 정보 요약 -->
      <div v-if="classData" class="bg-gray-50 p-4 rounded-lg">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <p class="text-sm font-medium text-gray-500">수업명</p>
            <p class="text-sm text-gray-900">{{ classData.name }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">강사</p>
            <p class="text-sm text-gray-900">{{ classData.instructor }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">날짜 및 시간</p>
            <p class="text-sm text-gray-900">{{ formatDateTime(classData.dateTime) }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">수강 인원</p>
            <p class="text-sm text-gray-900">{{ classData.attendance.total }}명</p>
          </div>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="attendanceLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- 에러 메시지 -->
      <div v-else-if="attendanceError" class="text-red-600 text-center py-4">
        {{ attendanceError }}
      </div>

      <!-- 데이터가 없는 경우 -->
      <div v-else-if="attendances.length === 0" class="text-gray-500 text-center py-4">
        출석 정보가 없습니다.
      </div>

      <!-- 출석 목록 테이블 -->
      <div v-else class="overflow-x-auto max-h-96">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석 관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="attendance in attendances" :key="attendance.id">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ attendance.memberName }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(attendance.status)"
                >
                  {{ getStatusLabel(attendance.status) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
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

      <!-- 수동 출석 체크 -->
      <div v-if="classData" class="border-t pt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">회원 수동 추가</h3>
        <div class="flex space-x-2">
          <div class="flex-grow">
            <select
              v-model="selectedMemberId"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">회원 선택</option>
              <option
                v-for="member in availableMembers"
                :key="member.id"
                :value="member.id"
                :disabled="member.status !== 'active'"
              >
                {{ member.name }} ({{ member.phone }})
              </option>
            </select>
          </div>
          <div>
            <select
              v-model="selectedStatus"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
          <button
            class="btn btn-primary"
            :disabled="!selectedMemberId || checkLoading"
            @click="handleManualCheck"
          >
            {{ checkLoading ? '처리 중...' : '추가' }}
          </button>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="btn btn-secondary" @click="$emit('close')">
          닫기
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttendanceStore } from '@/stores/attendance'
import { useMemberStore } from '@/stores/member'
import Modal from '@/components/common/Modal.vue'
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  classData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const attendanceStore = useAttendanceStore()
const memberStore = useMemberStore()

// 출석 상태
const { attendances, loading: attendanceLoading, error: attendanceError } = storeToRefs(attendanceStore)
// 회원 목록
const { members } = storeToRefs(memberStore)

// 수동 출석 체크
const selectedMemberId = ref('')
const selectedStatus = ref('present')
const checkLoading = ref(false)

// 이미 출석 체크된 회원을 제외한 회원 목록
const availableMembers = computed(() => {
  const attendedMemberIds = attendances.value.map(a => a.memberId)
  return members.value.filter(m => !attendedMemberIds.includes(m.id))
})

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

// 출석 상태 변경
const updateStatus = async (attendanceId, status) => {
  try {
    await attendanceStore.updateAttendanceStatus(attendanceId, status)
    if (props.classData) {
      await fetchAttendances()
    }
  } catch (error) {
    console.error('출석 상태 변경 실패:', error)
  }
}

// 수동 출석 체크
const handleManualCheck = async () => {
  if (!selectedMemberId.value || !props.classData) return

  checkLoading.value = true
  try {
    await attendanceStore.checkAttendance({
      classId: props.classData.id,
      memberId: Number(selectedMemberId.value),
      status: selectedStatus.value
    })
    
    // 폼 초기화
    selectedMemberId.value = ''
    selectedStatus.value = 'present'
    
    // 출석 목록 새로고침
    await fetchAttendances()
  } catch (error) {
    console.error('출석 체크 실패:', error)
  } finally {
    checkLoading.value = false
  }
}

// 수업별 출석 목록 조회
const fetchAttendances = async () => {
  if (props.classData) {
    await attendanceStore.fetchClassAttendances(props.classData.id)
  }
}

// 초기 데이터 로드
onMounted(async () => {
  await memberStore.fetchMembers()
  await fetchAttendances()
})
</script> 