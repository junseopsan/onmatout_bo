<template>
  <Modal :title="ticketTypeData ? '수강권 유형 수정' : '수강권 유형 등록'" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          이름 <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="sessions" class="block text-sm font-medium text-gray-700">
            수업 횟수 <span class="text-red-500">*</span>
          </label>
          <input
            id="sessions"
            v-model.number="formData.sessions"
            type="number"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label for="durationDays" class="block text-sm font-medium text-gray-700">
            유효 기간 (일) <span class="text-red-500">*</span>
          </label>
          <input
            id="durationDays"
            v-model.number="formData.durationDays"
            type="number"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">
          가격 <span class="text-red-500">*</span>
        </label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">₩</span>
          </div>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            min="0"
            class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="0"
            required
          />
        </div>
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">
          상태 <span class="text-red-500">*</span>
        </label>
        <select
          id="status"
          v-model="formData.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
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
          :disabled="loading"
        >
          {{ loading ? '저장 중...' : '저장' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup >
import { ref, reactive, onMounted } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { TicketType } from '@/stores/ticket'

const props = defineProps<{
  ticketTypeData: TicketType | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', formData: Omit<TicketType, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const loading = ref(false)

// 폼 데이터 초기화
const defaultFormData = {
  name: '',
  description: '',
  sessions: 1,
  durationDays: 30,
  price: 0,
  status: 'active' as const
}

const formData = reactive({...defaultFormData})

// 수정 시 데이터 초기화
onMounted(() => {
  if (props.ticketTypeData) {
    formData.name = props.ticketTypeData.name
    formData.description = props.ticketTypeData.description
    formData.sessions = props.ticketTypeData.sessions
    formData.durationDays = props.ticketTypeData.durationDays
    formData.price = props.ticketTypeData.price
    formData.status = props.ticketTypeData.status
  }
})

// 폼 제출 처리
const handleSubmit = async () => {
  loading.value = true
  try {
    emit('submit', {
      name: formData.name,
      description: formData.description,
      sessions: formData.sessions,
      durationDays: formData.durationDays,
      price: formData.price,
      status: formData.status
    })
  } finally {
    loading.value = false
  }
}
</script> 