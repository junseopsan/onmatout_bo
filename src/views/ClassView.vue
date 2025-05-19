<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">수업 관리</h1>
      <button
        class="btn btn-primary"
        @click="openCreateModal"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        수업 등록
      </button>
    </div>

    <!-- 수업 목록 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex space-x-4">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="btn"
              :class="[
                selectedFilter === filter.value
                  ? 'btn-primary'
                  : 'btn-secondary'
              ]"
              @click="selectedFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="수업 검색"
              class="input w-64"
            />
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- 에러 메시지 -->
        <div v-else-if="error" class="text-red-600 text-center py-4">
          {{ error }}
        </div>

        <!-- 수업 목록 테이블 -->
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수업명
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강사
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜/시간
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                정원
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="classItem in filteredClasses" :key="classItem.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ classItem.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ classItem.instructor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(classItem.dateTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ classItem.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ classItem.attendance }}/{{ classItem.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(classItem.status)"
                >
                  {{ getStatusLabel(classItem.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-primary-600 hover:text-primary-900 mr-3"
                  @click="openAttendanceModal(classItem)"
                >
                  출석 관리
                </button>
                <button
                  class="text-primary-600 hover:text-primary-900 mr-3"
                  @click="openEditModal(classItem)"
                >
                  수정
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="confirmDelete(classItem)"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && !error && filteredClasses.length === 0" class="text-center text-gray-400 py-8">
          등록된 수업이 없습니다.
        </div>
      </div>
    </div>

    <!-- 수업 등록/수정 모달 -->
    <ClassFormModal
      v-if="showModal"
      :class-data="selectedClass"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item-name="selectedClass?.name ?? ''"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />

    <!-- 출석 관리 모달 -->
    <ClassAttendanceModal
      v-if="showAttendanceModal"
      :class-data="selectedClass"
      @close="closeAttendanceModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useClassStore } from '@/stores/class'
import ClassFormModal from '@/components/class/ClassFormModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import ClassAttendanceModal from '@/components/class/ClassAttendanceModal.vue'
import { formatDateTime } from '@/utils/date'
import { storeToRefs } from 'pinia'

const classStore = useClassStore()
const { classes, loading, error } = storeToRefs(classStore)

// 필터 및 검색
const filters = [
  { label: '전체', value: 'all' },
  { label: '오늘', value: 'today' },
  { label: '이번 주', value: 'this-week' }
]
const selectedFilter = ref('all')
const searchQuery = ref('')

// 모달 상태
const showModal = ref(false)
const showDeleteModal = ref(false)
const showAttendanceModal = ref(false)
const selectedClass = ref(null)

// 필터링된 수업 목록
const filteredClasses = computed(() => {
  let result = classes.value

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query)
    )
  }

  // 상태 필터링
  if (selectedFilter.value !== 'all') {
    const today = new Date()
    const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    result = result.filter(c => {
      const classDate = new Date(c.dateTime)
      switch (selectedFilter.value) {
        case 'today':
          return classDate.toDateString() === today.toDateString()
        case 'this-week':
          return classDate >= today && classDate <= thisWeek
        default:
          return true
      }
    })
  }

  return result
})

// 상태 스타일 및 라벨
const getStatusClass = (status) => {
  const classes = {
    'scheduled': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusLabel = (status) => {
  const labels = {
    'scheduled': '예정',
    'in-progress': '진행 중',
    'completed': '완료',
    'cancelled': '취소'
  }
  return labels[status]
}

// 모달 관련 메서드
const openCreateModal = () => {
  selectedClass.value = null
  showModal.value = true
}

const openEditModal = (classData) => {
  selectedClass.value = { ...classData }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedClass.value = null
}

const confirmDelete = (classData) => {
  selectedClass.value = classData
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedClass.value = null
}

const openAttendanceModal = (classItem) => {
  selectedClass.value = classItem
  showAttendanceModal.value = true
}

const closeAttendanceModal = () => {
  showAttendanceModal.value = false
  selectedClass.value = null
}

// CRUD 메서드
const handleSubmit = async (classData) => {
  try {
    if (selectedClass.value) {
      await classStore.updateClass(selectedClass.value.id, classData)
    } else {
      await classStore.createClass(classData)
    }
    closeModal()
  } catch (error) {
    console.error('수업 저장 실패:', error)
  }
}

const handleDelete = async () => {
  if (selectedClass.value) {
    try {
      await classStore.deleteClass(selectedClass.value.id)
      closeDeleteModal()
    } catch (error) {
      console.error('수업 삭제 실패:', error)
    }
  }
}

onMounted(() => {
  classStore.fetchClasses()
})
</script> 