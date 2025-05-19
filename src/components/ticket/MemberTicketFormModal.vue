<template>
  <Modal title="수강권 등록" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="ticketTypeId" class="block text-sm font-medium text-gray-700">
          수강권 유형 <span class="text-red-500">*</span>
        </label>
        <select
          id="ticketTypeId"
          v-model="formData.ticketTypeId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">수강권 유형 선택</option>
          <option
            v-for="ticketType in ticketTypes"
            :key="ticketType.id"
            :value="ticketType.id"
            :disabled="ticketType.status !== 'active'"
          >
            {{ ticketType.name }} ({{ ticketType.sessions }}회, {{ ticketType.durationDays }}일)
          </option>
        </select>
      </div>

      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">
          시작일 <span class="text-red-500">*</span>
        </label>
        <input
          id="startDate"
          v-model="formData.startDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :min="today"
          required
        />
      </div>

      <div v-if="selectedTicketType" class="bg-gray-50 p-4 rounded-md">
        <h4 class="text-sm font-medium text-gray-700 mb-2">선택한 수강권 정보</h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p class="font-medium text-gray-500">수업 횟수</p>
            <p>{{ selectedTicketType.sessions }}회</p>
          </div>
          <div>
            <p class="font-medium text-gray-500">유효 기간</p>
            <p>{{ selectedTicketType.durationDays }}일</p>
          </div>
          <div>
            <p class="font-medium text-gray-500">만료일</p>
            <p>{{ expiryDate }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-500">가격</p>
            <p>{{ formatPrice(selectedTicketType.price) }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('close')"
        >
          취소
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || !formData.ticketTypeId"
        >
          {{ loading ? '등록 중...' : '등록' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup >
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTicketStore, type TicketType } from '@/stores/ticket'
import Modal from '@/components/common/Modal.vue'

const props = defineProps<{
  memberId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', formData: { ticketTypeId: number; startDate: string }): void
}>()

const ticketStore = useTicketStore()
const { ticketTypes } = storeToRefs(ticketStore)

const loading = ref(false)

// 오늘 날짜 포맷 변환
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

// 폼 데이터 초기화
const formData = reactive({
  ticketTypeId: '',
  startDate: today.value
})

// 선택된 수강권 유형
const selectedTicketType = computed(() => {
  return ticketTypes.value.find(t => t.id === Number(formData.ticketTypeId)) || null
})

// 만료일 계산
const expiryDate = computed(() => {
  if (!selectedTicketType.value || !formData.startDate) return '-'
  
  const startDate = new Date(formData.startDate)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + selectedTicketType.value.durationDays)
  
  return endDate.toISOString().split('T')[0]
})

// 가격 포맷팅
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW'
  }).format(price)
}

// 폼 제출 처리
const handleSubmit = async () => {
  if (!formData.ticketTypeId) return
  
  loading.value = true
  try {
    emit('submit', {
      ticketTypeId: Number(formData.ticketTypeId),
      startDate: formData.startDate
    })
  } finally {
    loading.value = false
  }
}

// 초기 데이터 로드
onMounted(() => {
  ticketStore.fetchTicketTypes()
})
</script> 