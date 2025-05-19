<template>
  <BaseModal :model-value="true" title="수강권 유형 등록" @update:model-value="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          수강권 이름 <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">
          가격 <span class="text-red-500">*</span>
        </label>
        <input
          id="price"
          v-model.number="form.price"
          type="number"
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="count" class="block text-sm font-medium text-gray-700">
          횟수 <span class="text-red-500">*</span>
        </label>
        <input
          id="count"
          v-model.number="form.count"
          type="number"
          min="1"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label for="validDays" class="block text-sm font-medium text-gray-700">
          유효기간(일) <span class="text-red-500">*</span>
        </label>
        <input
          id="validDays"
          v-model.number="form.validDays"
          type="number"
          min="1"
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
        {{ props.ticketTypeData ? '수정' : '등록' }}
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
import BaseModal from '@/components/common/BaseModal.vue'

const props = defineProps({
  ticketTypeData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  name: '',
  price: 0,
  count: 1,
  validDays: 30
})

onMounted(() => {
  if (props.ticketTypeData) {
    form.value = { ...props.ticketTypeData }
  }
})

const handleSubmit = () => {
  if (!form.value.name || !form.value.price || !form.value.count || !form.value.validDays) return
  
  emit('submit', {
    ...form.value,
    id: props.ticketTypeData?.id
  })
  emit('close')
}
</script> 