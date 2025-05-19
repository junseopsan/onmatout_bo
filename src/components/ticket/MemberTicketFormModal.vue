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
          <option v-for="type in ticketTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">
          시작일 <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="startDate"
          v-model="form.startDate"
          type="date"
          required
          :error="errors.startDate"
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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticket'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'

interface TicketType {
  id: number
  name: string
  price: number
  count: number
  validDays: number
}

interface MemberTicket {
  ticketTypeId: number
  startDate: string
}

const props = defineProps<{
  memberId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: MemberTicket): void
}>()

const ticketStore = useTicketStore()
const ticketTypes = ref<TicketType[]>([])

const form = reactive<MemberTicket>({
  ticketTypeId: 0,
  startDate: new Date().toISOString().split('T')[0]
})

const errors = reactive({
  ticketTypeId: '',
  startDate: ''
})

onMounted(async () => {
  try {
    const response = await ticketStore.getTicketTypes()
    ticketTypes.value = response
  } catch (error) {
    console.error('Error fetching ticket types:', error)
  }
})

const validate = () => {
  let isValid = true
  errors.ticketTypeId = ''
  errors.startDate = ''

  if (!form.ticketTypeId) {
    errors.ticketTypeId = '수강권 유형을 선택해주세요'
    isValid = false
  }
  if (!form.startDate) {
    errors.startDate = '시작일을 입력해주세요'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    await ticketStore.createMemberTicket(props.memberId, form)
    emit('submit', form)
    emit('close')
  } catch (error) {
    console.error('Error creating member ticket:', error)
  }
}
</script> 