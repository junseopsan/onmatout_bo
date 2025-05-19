<template>
  <BaseModal :model-value="true" title="수강권 등록" @update:model-value="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="ticketTypeId" class="block text-sm font-medium text-gray-700">
          수강권 유형 <span class="text-red-500">*</span>
        </label>
        <select
          id="ticketTypeId"
          v-model="form.ticketTypeId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">수강권 유형을 선택하세요</option>
          <option
            v-for="ticketType in ticketTypes"
            :key="ticketType.id"
            :value="ticketType.id"
          >
            {{ ticketType.name }} ({{ ticketType.sessions }}회)
          </option>
        </select>
      </div>

      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">
          시작일 <span class="text-red-500">*</span>
        </label>
        <input
          id="startDate"
          v-model="form.startDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700">
          만료일 <span class="text-red-500">*</span>
        </label>
        <input
          id="endDate"
          v-model="form.endDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="remainingSessions" class="block text-sm font-medium text-gray-700">
          남은 횟수 <span class="text-red-500">*</span>
        </label>
        <input
          id="remainingSessions"
          v-model.number="form.remainingSessions"
          type="number"
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
    </form>
    <template #footer>
      <button
        type="button"
        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleSubmit"
      >
        등록
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        @click="$emit('close')"
      >
        취소
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticket'
import BaseModal from '@/components/common/BaseModal.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  memberId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const ticketStore = useTicketStore()
const { ticketTypes } = storeToRefs(ticketStore)

const form = ref({
  ticketTypeId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  remainingSessions: 0
})

onMounted(async () => {
  try {
    await ticketStore.fetchTicketTypes()
  } catch (error) {
    console.error('Error fetching ticket types:', error)
  }
})

const handleSubmit = () => {
  if (!form.value.ticketTypeId || !form.value.startDate || !form.value.endDate) return
  
  emit('submit', {
    memberId: props.memberId,
    ticketTypeId: Number(form.value.ticketTypeId),
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    remainingSessions: form.value.remainingSessions
  })
  emit('close')
}
</script> 