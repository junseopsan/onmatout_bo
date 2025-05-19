<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">QR 코드 관리</h1>
      <button
        class="btn btn-primary"
        @click="openCreateModal"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        QR 코드 생성
      </button>
    </div>

    <!-- QR 코드 목록 -->
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
              placeholder="수업 검색"
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

        <!-- QR 코드 목록 그리드 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="qrCode in filteredQRCodes"
            :key="qrCode.id"
            class="bg-white border rounded-lg overflow-hidden"
          >
            <div class="p-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ qrCode.className }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDateTime(qrCode.dateTime) }}
                  </p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(qrCode.status)"
                >
                  {{ getStatusLabel(qrCode.status) }}
                </span>
              </div>

              <div class="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img
                  :src="qrCode.code"
                  :alt="qrCode.className"
                  class="w-48 h-48 object-contain"
                />
              </div>

              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <p>생성: {{ formatDateTime(qrCode.createdAt) }}</p>
                  <p>만료: {{ formatDateTime(qrCode.expiresAt) }}</p>
                </div>
                <div class="flex space-x-2">
                  <button
                    class="btn btn-secondary btn-sm"
                    @click="handleDownload(qrCode)"
                  >
                    <ArrowDownTrayIcon class="h-4 w-4" />
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="confirmDelete(qrCode)"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR 코드 생성 모달 -->
    <QRCodeCreateModal
      v-if="showModal"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item-name="selectedQRCode?.className"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup >
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useQRCodeStore, type QRCode } from '@/stores/qrCode'
import QRCodeCreateModal from '@/components/qrCode/QRCodeCreateModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { formatDateTime } from '@/utils/date'

const qrCodeStore = useQRCodeStore()
const { qrCodes, loading, error } = storeToRefs(qrCodeStore)

// 필터 및 검색
const filters = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'active' },
  { label: '만료', value: 'expired' }
]
const selectedFilter = ref('all')
const searchQuery = ref('')

// 모달 상태
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedQRCode = ref<QRCode | null>(null)

// 필터링된 QR 코드 목록
const filteredQRCodes = computed(() => {
  let result = qrCodes.value

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(q =>
      q.className.toLowerCase().includes(query)
    )
  }

  // 상태 필터링
  if (selectedFilter.value !== 'all') {
    result = result.filter(q => q.status === selectedFilter.value)
  }

  return result
})

// 상태 스타일 및 라벨
const getStatusClass = (status: QRCode['status']) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status: QRCode['status']) => {
  const labels = {
    'active': '활성',
    'expired': '만료'
  }
  return labels[status]
}

// 모달 관련 메서드
const openCreateModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmDelete = (qrCode: QRCode) => {
  selectedQRCode.value = qrCode
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedQRCode.value = null
}

// CRUD 메서드
const handleSubmit = async (classId: number) => {
  try {
    await qrCodeStore.createQRCode(classId)
    closeModal()
  } catch (error) {
    console.error('QR 코드 생성 실패:', error)
  }
}

const handleDelete = async () => {
  if (selectedQRCode.value) {
    try {
      await qrCodeStore.deleteQRCode(selectedQRCode.value.id)
      closeDeleteModal()
    } catch (error) {
      console.error('QR 코드 삭제 실패:', error)
    }
  }
}

const handleDownload = async (qrCode: QRCode) => {
  try {
    await qrCodeStore.downloadQRCode(qrCode.id)
  } catch (error) {
    console.error('QR 코드 다운로드 실패:', error)
  }
}

// 초기 데이터 로드
onMounted(() => {
  qrCodeStore.fetchQRCodes()
})
</script> 