<template>
  <BaseModal :model-value="true" title="수강권 유형" @update:model-value="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          이름 <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="name"
          v-model="form.name"
          type="text"
          required
          :error="errors.name"
        />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">
          가격 <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="price"
          v-model="form.price"
          type="number"
          required
          :error="errors.price"
        />
      </div>
      <div>
        <label for="count" class="block text-sm font-medium text-gray-700">
          횟수 <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="count"
          v-model="form.count"
          type="number"
          required
          :error="errors.count"
        />
      </div>
      <div>
        <label for="validDays" class="block text-sm font-medium text-gray-700">
          유효기간(일) <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="validDays"
          v-model="form.validDays"
          type="number"
          required
          :error="errors.validDays"
        />
      </div>
    </form>
    <template #footer>
      <button
        type="button"
        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleSubmit"
      >
        저장
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
import { ref, reactive } from 'vue'
import { useTicketStore } from '@/stores/ticket'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'

interface TicketType {
  id?: number
  name: string
  price: number
  count: number
  validDays: number
}

const props = defineProps<{
  ticketTypeData: TicketType | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: TicketType): void
}>()

const ticketStore = useTicketStore()

const form = reactive<TicketType>({
  name: props.ticketTypeData?.name || '',
  price: props.ticketTypeData?.price || 0,
  count: props.ticketTypeData?.count || 0,
  validDays: props.ticketTypeData?.validDays || 0
})

const errors = reactive({
  name: '',
  price: '',
  count: '',
  validDays: ''
})

const validate = () => {
  let isValid = true
  errors.name = ''
  errors.price = ''
  errors.count = ''
  errors.validDays = ''

  if (!form.name) {
    errors.name = '이름을 입력해주세요'
    isValid = false
  }
  if (!form.price || form.price <= 0) {
    errors.price = '가격을 입력해주세요'
    isValid = false
  }
  if (!form.count || form.count <= 0) {
    errors.count = '횟수를 입력해주세요'
    isValid = false
  }
  if (!form.validDays || form.validDays <= 0) {
    errors.validDays = '유효기간을 입력해주세요'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    if (props.ticketTypeData?.id) {
      await ticketStore.updateTicketType(props.ticketTypeData.id, form)
    } else {
      await ticketStore.createTicketType(form)
    }
    emit('submit', form)
    emit('close')
  } catch (error) {
    console.error('Error saving ticket type:', error)
  }
}
</script> 