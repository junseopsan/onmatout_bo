<template>
  <Modal
    title="삭제 확인"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <p class="text-gray-700">
        <span class="font-medium">{{ itemName }}</span>을(를) 삭제하시겠습니까?
      </p>
      <p class="text-sm text-gray-500">
        이 작업은 되돌릴 수 없습니다.
      </p>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('close')"
        >
          취소
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="loading"
          @click="handleConfirm"
        >
          {{ loading ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup >
import { ref } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  itemName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const loading = ref(false)

const handleConfirm = async () => {
  loading.value = true
  try {
    emit('confirm')
  } finally {
    loading.value = false
  }
}
</script> 