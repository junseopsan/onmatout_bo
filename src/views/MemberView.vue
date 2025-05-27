<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 헤더 섹션 -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p class="mt-1 text-sm text-gray-500">전체 {{ members.length }}명의 회원</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        회원 등록
      </button>
    </div>

    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-200 hover:shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">검색</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="이름, 전화번호로 검색"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10 transition-all duration-200"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <select
            id="status"
            v-model="selectedStatus"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="">전체</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">정렬</label>
          <select
            id="sort"
            v-model="sortBy"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="name">이름순</option>
            <option value="createdAt">가입일순</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 회원 목록 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- 에러 메시지 -->
      <div v-else-if="error" class="text-center p-8">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="fetchMembers"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
        >
          다시 시도
        </button>
      </div>

      <!-- 회원 목록 -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전화번호
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  남은 수강권
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="member in paginatedMembers"
                :key="member.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                @click="showMemberDetail(member)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ member.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(member.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ member.status === 'active' ? '활성' : '비활성' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ member.remainingTickets || 0 }}회</div>
                </td>
              </tr>
              <tr v-if="paginatedMembers.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  회원이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              이전
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              다음
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                총 <span class="font-medium">{{ filteredMembers.length }}</span>명의 회원 중
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> -
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredMembers.length) }}</span>번째
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">이전</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                    currentPage === page
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                >
                  <span class="sr-only">다음</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 회원 등록 모달 -->
    <MemberFormModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @submit="handleCreateMember"
    />

    <!-- 회원 상세 모달 -->
    <BaseModal
      v-if="selectedMember"
      :model-value="true"
      title="회원 상세 정보"
      @update:model-value="selectedMember = null"
      class="max-w-2xl mx-auto"
    >
      <div class="space-y-6">
        <!-- 삭제 버튼 -->
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            @click="handleDeleteMember"
          >
            <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            회원 삭제
          </button>
        </div>

        <!-- 기본 정보 -->
        <div class="bg-gray-50 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500">이름</p>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMember.name }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">전화번호</p>
              <p class="mt-1 text-sm text-gray-900">{{ selectedMember.phone }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">상태</p>
              <p class="mt-1">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                    selectedMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ selectedMember.status === 'active' ? '활성' : '비활성' }}
                </span>
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">가입일</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedMember.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- 수강권 정보 -->
        <div class="bg-gray-50 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">수강권 정보</h3>
            <button
              @click="showTicketModal = true"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              수강권 등록
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="ticket in selectedMember.tickets"
              :key="ticket.id"
              class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ ticket.ticketType.name }}</h4>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ formatDate(ticket.startDate) }} ~ {{ formatDate(ticket.endDate) }}
                  </p>
                </div>
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                    ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ ticket.status === 'active' ? '사용중' : '만료' }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>남은 횟수: {{ ticket.remainingSessions }}회</span>
                <button
                  @click.stop="handleDeleteTicket(ticket.id)"
                  class="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 출석 정보 -->
        <div class="bg-gray-50 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">출석 정보</h3>
          <div class="space-y-4">
            <div
              v-for="attendance in selectedMember.attendances"
              :key="attendance.id"
              class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ attendance.class.name }}</h4>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ formatDate(attendance.date) }} {{ formatTime(attendance.date) }}
                  </p>
                </div>
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                    getStatusClass(attendance.status)
                  ]"
                >
                  {{ getStatusLabel(attendance.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            @click="selectedMember = null"
          >
            닫기
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            @click="showEditModal = true"
          >
            수정
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- 회원 수정 모달 -->
    <MemberFormModal
      v-if="showEditModal"
      :member-data="selectedMember"
      @close="showEditModal = false"
      @submit="handleUpdateMember"
    />

    <!-- 수강권 등록 모달 -->
    <MemberTicketFormModal
      v-if="showTicketModal"
      :member-id="selectedMember?.id"
      @close="showTicketModal = false"
      @submit="handleCreateTicket"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useTicketStore } from '@/stores/ticket'
import { useAttendanceStore } from '@/stores/attendance'
import { storeToRefs } from 'pinia'
import BaseModal from '@/components/common/BaseModal.vue'
import MemberFormModal from '@/components/member/MemberFormModal.vue'
import MemberTicketFormModal from '@/components/ticket/MemberTicketFormModal.vue'

const memberStore = useMemberStore()
const ticketStore = useTicketStore()
const attendanceStore = useAttendanceStore()

const { members } = storeToRefs(memberStore)

const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('name')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showTicketModal = ref(false)
const selectedMember = ref(null)
const loading = ref(false)
const error = ref(null)

const itemsPerPage = 10
const currentPage = ref(1)

// 데이터 불러오기
const fetchMembers = async () => {
  loading.value = true
  error.value = null
  try {
    await memberStore.fetchMembers()
  } catch (err) {
    error.value = '회원 목록을 불러오는데 실패했습니다.'
    console.error('Error fetching members:', err)
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 불러오기
onMounted(() => {
  fetchMembers()
})

const filteredMembers = computed(() => {
  let result = [...members.value]

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query)
    )
  }

  // 상태 필터링
  if (selectedStatus.value) {
    result = result.filter(member => member.status === selectedStatus.value)
  }

  // 정렬
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return result
})

// 페이지네이션 관련 computed 속성들
const totalPages = computed(() => Math.ceil(filteredMembers.value.length / itemsPerPage))

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMembers.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 검색어나 필터가 변경될 때 첫 페이지로 이동
watch([searchQuery, selectedStatus, sortBy], () => {
  currentPage.value = 1
})

const showMemberDetail = async (member) => {
  selectedMember.value = member
  try {
    const [tickets, attendances] = await Promise.all([
      ticketStore.getMemberTickets(member.id),
      attendanceStore.getMemberAttendances(member.id)
    ])
    selectedMember.value = {
      ...member,
      tickets,
      attendances
    }
  } catch (error) {
    console.error('Error fetching member details:', error)
  }
}

const handleCreateMember = async (memberData) => {
  try {
    await memberStore.createMember(memberData)
    showCreateModal.value = false
  } catch (error) {
    console.error('Error creating member:', error)
  }
}

const handleUpdateMember = async (memberData) => {
  try {
    await memberStore.updateMember(selectedMember.value.id, memberData)
    showEditModal.value = false
    selectedMember.value = null
  } catch (error) {
    console.error('Error updating member:', error)
  }
}

const handleDeleteMember = async () => {
  if (!confirm('정말로 이 회원을 삭제하시겠습니까?')) return

  try {
    await memberStore.deleteMember(selectedMember.value.id)
    selectedMember.value = null
  } catch (error) {
    console.error('Error deleting member:', error)
  }
}

const handleCreateTicket = async (ticketData) => {
  try {
    await ticketStore.createMemberTicket(ticketData.memberId, ticketData)
    showTicketModal.value = false
    await showMemberDetail(selectedMember.value)
  } catch (error) {
    console.error('Error creating ticket:', error)
  }
}

const handleDeleteTicket = async (ticketId) => {
  if (!confirm('정말로 이 수강권을 삭제하시겠습니까?')) return

  try {
    await ticketStore.deleteMemberTicket(ticketId)
    await showMemberDetail(selectedMember.value)
  } catch (error) {
    console.error('Error deleting ticket:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    present: '출석',
    absent: '결석',
    late: '지각'
  }
  return labels[status] || status
}
</script>