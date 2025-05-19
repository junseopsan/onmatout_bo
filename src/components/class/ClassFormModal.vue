<template>
  <Modal
    :title="classData ? '수업 수정' : '수업 등록'"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          수업명
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="instructor" class="block text-sm font-medium text-gray-700">
          강사
        </label>
        <input
          id="instructor"
          v-model="form.instructor"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="dateTime" class="block text-sm font-medium text-gray-700">
          날짜/시간
        </label>
        <input
          id="dateTime"
          v-model="form.dateTime"
          type="datetime-local"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="capacity" class="block text-sm font-medium text-gray-700">
          정원
        </label>
        <input
          id="capacity"
          v-model.number="form.capacity"
          type="number"
          min="1"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">
          상태
        </label>
        <select
          id="status"
          v-model="form.status"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="scheduled">예정</option>
          <option value="in-progress">진행 중</option>
          <option value="completed">완료</option>
          <option value="cancelled">취소</option>
        </select>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
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

<script setup>
import { ref, onMounted } from 'vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps({
  classData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)

const form = ref({
  name: '',
  instructor: '',
  dateTime: '',
  capacity: 20,
  status: 'scheduled'
})

onMounted(() => {
  if (props.classData) {
    form.value = {
      name: props.classData.name,
      instructor: props.classData.instructor,
      dateTime: props.classData.dateTime,
      capacity: props.classData.capacity,
      status: props.classData.status
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    emit('submit', { ...form.value })
  } finally {
    loading.value = false
  }
}
</script> 