<template>
  <Modal
    :title="memberData ? '회원 수정' : '회원 등록'"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          이름
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
        <label for="phone" class="block text-sm font-medium text-gray-700">
          연락처
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          required
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          placeholder="010-0000-0000"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="remainingTickets" class="block text-sm font-medium text-gray-700">
          남은 수강권
        </label>
        <input
          id="remainingTickets"
          v-model.number="form.remainingTickets"
          type="number"
          min="0"
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
          <option value="active">활동</option>
          <option value="inactive">비활동</option>
          <option value="expired">만료</option>
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
  memberData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  remainingTickets: 0,
  status: 'active'
})

onMounted(() => {
  if (props.memberData) {
    form.value = {
      name: props.memberData.name,
      phone: props.memberData.phone,
      email: props.memberData.email,
      remainingTickets: props.memberData.remainingTickets,
      status: props.memberData.status
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