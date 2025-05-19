<template>
  <BaseModal :model-value="true" title="QR 코드 생성" @update:model-value="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="class" class="block text-sm font-medium text-gray-700">
          수업 선택
        </label>
        <select
          id="class"
          v-model="selectedClassId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">수업을 선택하세요</option>
          <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
            {{ classItem.name }}
          </option>
        </select>
      </div>
    </form>
    <template #footer>
      <button
        type="button"
        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleSubmit"
      >
        생성
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
import { useClassStore } from '@/stores/class'
import BaseModal from '@/components/common/BaseModal.vue'

const emit = defineEmits(['close', 'submit'])

const classStore = useClassStore()
const classes = ref([])
const selectedClassId = ref('')

onMounted(async () => {
  try {
    const response = await classStore.getClasses()
    classes.value = response
  } catch (error) {
    console.error('Error fetching classes:', error)
  }
})

const handleSubmit = () => {
  if (!selectedClassId.value) return
  emit('submit', Number(selectedClassId.value))
  emit('close')
}
</script> 