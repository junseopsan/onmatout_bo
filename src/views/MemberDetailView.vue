<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button
          class="mr-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-900"
          @click="$router.back()"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-1" />
          뒤로 가기
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ loading ? '회원 정보 로딩 중...' : member?.name }}
        </h1>
      </div>
      <div class="flex space-x-3">
        <button
          class="btn btn-secondary"
          @click="editMember"
        >
          <PencilIcon class="h-5 w-5 mr-2" />
          수정
        </button>
        <button
          class="btn btn-danger"
          @click="confirmDelete"
        >
          <TrashIcon class="h-5 w-5 mr-2" />
          삭제
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

    <!-- 회원 정보 -->
    <div v-else-if="member" class="bg-white shadow rounded-lg">
      <!-- 기본 정보 -->
      <div class="px-4 py-5 sm:p-6 border-b">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">기본 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">이름</p>
                <p class="mt-1 text-sm text-gray-900">{{ member.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">닉네임</p>
                <p class="mt-1 text-sm text-gray-900">@{{ member.nickname }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">이메일</p>
                <p class="mt-1 text-sm text-gray-900">{{ member.email }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">역할</p>
                <p class="mt-1">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(member.status)"
                  >
                    {{ getStatusLabel(member.status) }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">요가원</p>
                <p class="mt-1 text-sm text-gray-900">{{ member.studio_name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">전화번호</p>
                <p class="mt-1 text-sm text-gray-900">{{ member.phone }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">상태</p>
                <p class="mt-1">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(member.status)"
                  >
                    {{ getStatusLabel(member.status) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">수강 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">남은 수업</p>
                <p class="mt-1 text-sm text-gray-900">{{ member.remaining_tickets }}회</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">마지막 출석</p>
                <p class="mt-1 text-sm text-gray-900">
                  {{ member.last_attendance ? formatDate(member.last_attendance) : '없음' }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">가입일</p>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(member.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">정보 갱신일</p>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(member.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 탭 메뉴 -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-6 py-3 border-b-2 text-sm font-medium"
            :class="[
              activeTab === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- 탭 컨텐츠 -->
      <div class="px-4 py-5 sm:p-6">
        <!-- 수강권 탭 -->
        <div v-if="activeTab === 'tickets'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">수강권 목록</h3>
            <button
              class="btn btn-primary"
              @click="openTicketModal"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              수강권 등록
            </button>
          </div>

          <!-- 수강권 로딩 상태 -->
          <div v-if="memberTicketLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>

          <!-- 수강권 에러 메시지 -->
          <div v-else-if="memberTicketError" class="text-red-600 text-center py-4">
            {{ memberTicketError }}
          </div>

          <!-- 데이터가 없는 경우 -->
          <div v-else-if="memberTickets.length === 0" class="text-gray-500 text-center py-4">
            등록된 수강권이 없습니다.
          </div>

          <!-- 수강권 목록 테이블 -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수강권 유형
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    남은 횟수
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시작일
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    만료일
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="ticket in memberTickets" :key="ticket.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ ticket.ticketTypeName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ ticket.remainingSessions }}회</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(ticket.startDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(ticket.endDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getTicketStatusClass(ticket.status)"
                    >
                      {{ getTicketStatusLabel(ticket.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      v-if="ticket.status === 'active'"
                      class="text-red-600 hover:text-red-900"
                      @click="confirmInvalidateTicket(ticket)"
                    >
                      비활성화
                    </button>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 출석 이력 탭 -->
        <div v-else-if="activeTab === 'attendance'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">출석 이력</h3>
          </div>

          <!-- 출석 로딩 상태 -->
          <div v-if="attendanceLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>

          <!-- 출석 에러 메시지 -->
          <div v-else-if="attendanceError" class="text-red-600 text-center py-4">
            {{ attendanceError }}
          </div>

          <!-- 데이터가 없는 경우 -->
          <div v-else-if="attendances.length === 0" class="text-gray-500 text-center py-4">
            출석 이력이 없습니다.
          </div>

          <!-- 출석 이력 테이블 -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수업
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    날짜
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="attendance in attendances" :key="attendance.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ attendance.className }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDateTime(attendance.date) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getAttendanceStatusClass(attendance.status)"
                    >
                      {{ getAttendanceStatusLabel(attendance.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 회원 정보 수정 모달 -->
    <MemberFormModal
      v-if="showMemberFormModal"
      :member-data="member"
      @close="closeMemberFormModal"
      @submit="handleMemberSubmit"
    />

    <!-- 수강권 등록 모달 -->
    <MemberTicketFormModal
      v-if="showTicketModal"
      :member-id="Number(id)"
      @close="closeTicketModal"
      @submit="handleTicketSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item-name="member?.name"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />

    <!-- 수강권 비활성화 확인 모달 -->
    <DeleteConfirmModal
      v-if="showInvalidateModal"
      :item-name="`${selectedTicket?.ticketTypeName} 수강권`"
      title="수강권 비활성화"
      confirm-text="비활성화"
      @close="closeInvalidateModal"
      @confirm="handleInvalidateTicket"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useMemberStore } from '@/stores/member'
import { useTicketStore } from '@/stores/ticket'
import MemberFormModal from '@/components/member/MemberFormModal.vue'
import MemberTicketFormModal from '@/components/ticket/MemberTicketFormModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { formatDate, formatDateTime } from '@/utils/date'
import { useAttendanceStore } from '@/stores/attendance'
import { supabase } from '@/services/supabase'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const memberStore = useMemberStore()
const ticketStore = useTicketStore()
const attendanceStore = useAttendanceStore()

// 회원 상태
const { member, loading, error } = storeToRefs(memberStore)
// 수강권 상태
const { memberTickets, memberTicketLoading, memberTicketError } = storeToRefs(ticketStore)
// 출석 이력 상태
const { attendances, loading: attendanceLoading, error: attendanceError } = storeToRefs(attendanceStore)

// 탭 관련
const tabs = [
  { label: '수강권', value: 'tickets' },
  { label: '출석 이력', value: 'attendance' }
]
const activeTab = ref('tickets')

// 모달 상태
const showMemberFormModal = ref(false)
const showTicketModal = ref(false)
const showDeleteModal = ref(false)
const showInvalidateModal = ref(false)
const selectedTicket = ref(null)

// 회원 상태 스타일 및 라벨
const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800'
  }
  return classes[status] || ''
}

const getStatusLabel = (status) => {
  const labels = {
    'active': '활성',
    'inactive': '비활성'
  }
  return labels[status] || status
}

// 수강권 상태 스타일 및 라벨
const getTicketStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'used': 'bg-blue-100 text-blue-800',
    'expired': 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getTicketStatusLabel = (status) => {
  const labels = {
    'active': '활성',
    'used': '사용 완료',
    'expired': '만료'
  }
  return labels[status]
}

// 출석 이력 상태 스타일 및 라벨
const getAttendanceStatusClass = (status) => {
  const classes = {
    'present': 'bg-green-100 text-green-800',
    'late': 'bg-yellow-100 text-yellow-800',
    'absent': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  }
  return classes[status]
}

const getAttendanceStatusLabel = (status) => {
  const labels = {
    'present': '출석',
    'late': '지각',
    'absent': '결석',
    'cancelled': '취소'
  }
  return labels[status]
}

// 모달 관련 메서드
const editMember = () => {
  showMemberFormModal.value = true
}

const closeMemberFormModal = () => {
  showMemberFormModal.value = false
}

const openTicketModal = () => {
  showTicketModal.value = true
}

const closeTicketModal = () => {
  showTicketModal.value = false
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmInvalidateTicket = (ticket) => {
  selectedTicket.value = ticket
  showInvalidateModal.value = true
}

const closeInvalidateModal = () => {
  showInvalidateModal.value = false
  selectedTicket.value = null
}

// 데이터 처리 메서드
const handleMemberSubmit = async (formData) => {
  try {
    await memberStore.updateMember(Number(id), formData)
    closeMemberFormModal()
  } catch (error) {
    console.error('회원 정보 업데이트 실패:', error)
  }
}

const handleTicketSubmit = async (formData) => {
  try {
    await ticketStore.createMemberTicket({
      ...formData,
      memberId: Number(id)
    })
    closeTicketModal()
    await ticketStore.fetchMemberTickets(Number(id))
    await memberStore.fetchMember(Number(id)) // 잔여 횟수 업데이트를 위해 회원 정보 갱신
  } catch (error) {
    console.error('수강권 등록 실패:', error)
  }
}

const handleDelete = async () => {
  try {
    await memberStore.deleteMember(Number(id))
    closeDeleteModal()
    router.push('/members')
  } catch (error) {
    console.error('회원 삭제 실패:', error)
  }
}

const handleInvalidateTicket = async () => {
  if (selectedTicket.value) {
    try {
      await ticketStore.updateMemberTicketStatus(selectedTicket.value.id, 'expired')
      closeInvalidateModal()
      await ticketStore.fetchMemberTickets(Number(id))
      await memberStore.fetchMember(Number(id)) // 잔여 횟수 업데이트를 위해 회원 정보 갱신
    } catch (error) {
      console.error('수강권 상태 변경 실패:', error)
    }
  }
}

// 초기 데이터 로드
const fetchMember = async () => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', route.params.id).single()
  if (!error) member.value = data
}

onMounted(fetchMember)
</script> 