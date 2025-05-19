<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">회원 관리</h1>
      <button
        class="btn btn-primary"
        @click="openCreateModal"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        회원 등록
      </button>
    </div>

    <!-- 회원 목록 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex space-x-4">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="btn"
              :class="[
                selectedFilter === filter.value
                  ? 'btn-primary'
                  : 'btn-secondary'
              ]"
              @click="selectedFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="회원 검색"
              class="input w-64"
            />
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

        <!-- 회원 목록 테이블 -->
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                남은 수강권
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 출석
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="member in filteredMembers"
              :key="member.id"
              class="hover:bg-gray-100 cursor-pointer"
              @click="goToDetail(member.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ member.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.remainingTickets }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.lastAttendance ? formatDate(member.lastAttendance) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(member.status)"
                >
                  {{ getStatusLabel(member.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-primary-600 hover:text-primary-900 mr-3"
                  @click.stop="openEditModal(member)"
                >
                  수정
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click.stop="confirmDelete(member)"
                >
                  삭제
                </button>
              </td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="7" class="text-center text-gray-400 py-8">회원이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 회원 등록/수정 모달 -->
    <MemberFormModal
      v-if="showModal"
      :member-data="selectedMember"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item-name="selectedMember?.name"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import MemberFormModal from '@/components/member/MemberFormModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { formatDate } from '@/utils/date'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const members = ref([])
const loading = ref(false)
const error = ref(null)
const router = useRouter()

// 데이터 패칭 함수
const fetchMembers = async () => {
  loading.value = true
  const { data, error: fetchError } = await supabase.from('trainees').select('*').order('created_at', { ascending: false })
  if (!fetchError) {
    members.value = data
  } else {
    error.value = fetchError.message
  }
  loading.value = false
}

// 필터 및 검색
const filters = [
  { label: '전체', value: 'all' },
  { label: '활동 회원', value: 'active' },
  { label: '수강권 소진 예정', value: 'expiring' }
]
const selectedFilter = ref('all')
const searchQuery = ref('')

// 모달 상태
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedMember = ref(null)

// 필터링된 회원 목록
const filteredMembers = computed(() => {
  let result = members.value

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name?.toLowerCase().includes(query) ||
      m.phone?.includes(query) ||
      m.email?.toLowerCase().includes(query)
    )
  }

  // 상태 필터링
  if (selectedFilter.value !== 'all') {
    switch (selectedFilter.value) {
      case 'active':
        result = result.filter(m => m.status === 'active')
        break
      case 'expiring':
        result = result.filter(m => m.status === 'active' && m.remainingTickets <= 3)
        break
    }
  }

  return result
})

// 상태 스타일 및 라벨
const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'expired': 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status) => {
  const labels = {
    'active': '활동',
    'inactive': '비활동',
    'expired': '만료'
  }
  return labels[status]
}

// 모달 관련 메서드
const openCreateModal = () => {
  selectedMember.value = null
  showModal.value = true
}

const openEditModal = (memberData) => {
  selectedMember.value = { ...memberData }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMember.value = null
}

const confirmDelete = (memberData) => {
  selectedMember.value = memberData
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedMember.value = null
}

// CRUD 메서드
const handleSubmit = async (memberData) => {
  try {
    if (selectedMember.value) {
      await memberStore.updateMember(selectedMember.value.id, memberData)
    } else {
      await memberStore.createMember(memberData)
    }
    closeModal()
  } catch (error) {
    console.error('회원 저장 실패:', error)
  }
}

const handleDelete = async () => {
  if (selectedMember.value) {
    try {
      await memberStore.deleteMember(selectedMember.value.id)
      closeDeleteModal()
    } catch (error) {
      console.error('회원 삭제 실패:', error)
    }
  }
}

const goToDetail = (id) => {
  router.push(`/members/${id}`)
}

onMounted(() => {
  fetchMembers()
})
</script>