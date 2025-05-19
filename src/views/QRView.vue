<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">QR 코드 관리</h1>
        <p class="mt-2 text-sm text-gray-700">
          수업별 QR 코드를 생성하고 관리합니다.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
        >
          QR 코드 생성
        </button>
      </div>
    </div>

    <!-- 검색 -->
    <div class="mt-4">
      <div class="relative rounded-md shadow-sm">
        <input
          type="text"
          v-model="searchQuery"
          class="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="수업명으로 검색..."
        />
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- QR 코드 목록 -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    수업명
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    날짜
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    시간
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    상태
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">관리</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="qr in filteredQRCodes" :key="qr.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ qr.className }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(qr.date) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ qr.time }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      :class="[
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                        qr.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ qr.isActive ? '활성' : '비활성' }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="downloadQR(qr)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      다운로드
                    </button>
                    <button
                      @click="toggleQRStatus(qr)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      {{ qr.isActive ? '비활성화' : '활성화' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- QR 코드 생성 모달 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">QR 코드 생성</h3>
        <form @submit.prevent="createQR">
          <div class="space-y-4">
            <div>
              <label for="classId" class="block text-sm font-medium text-gray-700">수업 선택</label>
              <select
                id="classId"
                v-model="newQR.classId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              >
                <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                  {{ classItem.name }} ({{ formatDate(classItem.date) }} {{ classItem.time }})
                </option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate } from '@/utils/date'
import { supabase } from '@/services/supabase'

const qrCodes = ref([])
const classes = ref([])
const searchQuery = ref('')
const showCreateModal = ref(false)
const loading = ref(false)

const newQR = ref({
  classId: ''
})

const filteredQRCodes = computed(() => {
  return qrCodes.value.filter(qr =>
    qr.className.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchQRCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        classes (
          name,
          date,
          time
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    qrCodes.value = data.map(qr => ({
      id: qr.id,
      classId: qr.class_id,
      className: qr.classes.name,
      date: qr.classes.date,
      time: qr.classes.time,
      isActive: qr.is_active,
      createdAt: qr.created_at
    }))
  } catch (error) {
    console.error('Error fetching QR codes:', error.message)
  }
}

const fetchClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error

    classes.value = data
  } catch (error) {
    console.error('Error fetching classes:', error.message)
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newQR.value = { classId: '' }
}

const createQR = async () => {
  try {
    loading.value = true
    const { error } = await supabase
      .from('qr_codes')
      .insert({
        class_id: newQR.value.classId,
        is_active: true
      })

    if (error) throw error

    await fetchQRCodes()
    closeCreateModal()
  } catch (error) {
    console.error('Error creating QR code:', error.message)
  } finally {
    loading.value = false
  }
}

const downloadQR = async (qr) => {
  try {
    const { data, error } = await supabase
      .storage
      .from('qr-codes')
      .download(`${qr.id}.png`)

    if (error) throw error

    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${qr.className}-${formatDate(qr.date)}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading QR code:', error.message)
  }
}

const toggleQRStatus = async (qr) => {
  try {
    const { error } = await supabase
      .from('qr_codes')
      .update({ is_active: !qr.isActive })
      .eq('id', qr.id)

    if (error) throw error

    await fetchQRCodes()
  } catch (error) {
    console.error('Error toggling QR code status:', error.message)
  }
}

onMounted(() => {
  fetchQRCodes()
  fetchClasses()
})
</script> 