<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">수강권 유형 관리</h1>
      <button
        class="btn btn-primary"
        @click="openCreateModal"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        수강권 유형 등록
      </button>
    </div>

    <!-- 수강권 유형 목록 -->
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
              placeholder="수강권 이름 검색"
              class="input w-64"
            />
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="ticketTypeLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- 에러 메시지 -->
        <div v-else-if="ticketTypeError" class="text-red-600 text-center py-4">
          {{ ticketTypeError }}
        </div>

        <!-- 데이터가 없는 경우 -->
        <div v-else-if="filteredTicketTypes.length === 0" class="text-gray-500 text-center py-4">
          등록된 수강권 유형이 없습니다.
        </div>

        <!-- 수강권 유형 테이블 -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수업 횟수
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유효 기간
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
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
              <tr v-for="ticketType in filteredTicketTypes" :key="ticketType.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ ticketType.name }}</div>
                  <div class="text-sm text-gray-500">{{ ticketType.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ ticketType.sessions }}회</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ ticketType.durationDays }}일</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatPrice(ticketType.price) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(ticketType.status)"
                  >
                    {{ getStatusLabel(ticketType.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    class="text-primary-600 hover:text-primary-900 mr-3"
                    @click="editTicketType(ticketType)"
                  >
                    수정
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="confirmDelete(ticketType)"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 수강권 유형 등록/수정 모달 -->
    <TicketTypeFormModal
      v-if="showFormModal"
      :ticket-type-data="selectedTicketType"
      @close="closeFormModal"
      @submit="handleSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item-name="selectedTicketType?.name"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup >
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useTicketStore, type TicketType } from '@/stores/ticket'
import TicketTypeFormModal from '@/components/ticket/TicketTypeFormModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const ticketStore = useTicketStore()
const { ticketTypes, ticketTypeLoading, ticketTypeError } = storeToRefs(ticketStore)

// 필터 및 검색
const filters = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'active' },
  { label: '비활성', value: 'inactive' }
]
const selectedFilter = ref('all')
const searchQuery = ref('')

// 모달 상태
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const selectedTicketType = ref<TicketType | null>(null)

// 필터링된 수강권 유형 목록
const filteredTicketTypes = computed(() => {
  let result = ticketTypes.value

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  // 상태 필터링
  if (selectedFilter.value !== 'all') {
    result = result.filter(t => t.status === selectedFilter.value)
  }

  return result
})

// 상태 스타일 및 라벨
const getStatusClass = (status: TicketType['status']) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status: TicketType['status']) => {
  const labels = {
    'active': '활성',
    'inactive': '비활성'
  }
  return labels[status]
}

// 가격 포맷팅
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW'
  }).format(price)
}

// 모달 관련 메서드
const openCreateModal = () => {
  selectedTicketType.value = null
  showFormModal.value = true
}

const editTicketType = (ticketType: TicketType) => {
  selectedTicketType.value = ticketType
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  selectedTicketType.value = null
}

const confirmDelete = (ticketType: TicketType) => {
  selectedTicketType.value = ticketType
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedTicketType.value = null
}

// CRUD 메서드
const handleSubmit = async (formData: Omit<TicketType, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (selectedTicketType.value) {
      await ticketStore.updateTicketType(selectedTicketType.value.id, formData)
    } else {
      await ticketStore.createTicketType(formData)
    }
    closeFormModal()
  } catch (error) {
    console.error('수강권 유형 저장 실패:', error)
  }
}

const handleDelete = async () => {
  if (selectedTicketType.value) {
    try {
      await ticketStore.deleteTicketType(selectedTicketType.value.id)
      closeDeleteModal()
    } catch (error) {
      console.error('수강권 유형 삭제 실패:', error)
    }
  }
}

// 초기 데이터 로드
onMounted(() => {
  ticketStore.fetchTicketTypes()
})
</script> 