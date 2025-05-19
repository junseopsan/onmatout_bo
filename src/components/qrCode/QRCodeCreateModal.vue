<template>
  <Modal title="QR 코드 생성" @close="$emit('close')">
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
          <option
            v-for="classItem in classes"
            :key="classItem.id"
            :value="classItem.id"
          >
            {{ classItem.name }} ({{ formatDateTime(classItem.dateTime) }})
          </option>
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
          {{ loading ? '생성 중...' : '생성' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup >
import { ref, onMounted } from 'vue'
import { useClassStore } from '@/stores/class'
import Modal from '@/components/common/Modal.vue'
import { formatDateTime } from '@/utils/date'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', classId: number): void
}>()

const classStore = useClassStore()
const { classes } = storeToRefs(classStore)

const selectedClassId = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!selectedClassId.value) return

  loading.value = true
  try {
    emit('submit', Number(selectedClassId.value))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  classStore.fetchClasses()
})
</script> 