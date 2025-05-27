<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">관리자 관리</h1>
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">권한</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="admin in admins" :key="admin.email" @click="showAdminDetail(admin)" class="hover:bg-gray-50 cursor-pointer transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.nickname }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.role }}</td>
          </tr>
          <tr v-if="admins.length === 0">
            <td colspan="3" class="text-center text-gray-400 py-8">등록된 관리자가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6 text-right">
      <button class="btn btn-primary" @click="openCreateModal">관리자 등록</button>
    </div>
    <!-- 등록/수정 모달 등 추가 가능 -->
    <BaseModal v-if="selectedAdmin" :model-value="true" title="관리자 상세 정보" @update:model-value="selectedAdmin = null" class="max-w-lg mx-auto">
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500">닉네임</p>
              <p class="mt-1 text-sm text-gray-900">{{ selectedAdmin.nickname }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">이메일</p>
              <p class="mt-1 text-sm text-gray-900">{{ selectedAdmin.email }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">권한</p>
              <p class="mt-1 text-sm text-gray-900">{{ selectedAdmin.role }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200" @click="selectedAdmin = null">닫기</button>
          <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200" @click="editAdmin(selectedAdmin)">수정</button>
          <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200" @click="deleteAdmin(selectedAdmin)">삭제</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const admins = ref([])
const openCreateModal = () => {}
const editAdmin = (item) => {}
const deleteAdmin = (item) => {}
const selectedAdmin = ref(null)

const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  console.log('profiles data:', data)
  if (!error && Array.isArray(data)) admins.value = data
}

const showAdminDetail = (admin) => {
  selectedAdmin.value = admin
}

onMounted(() => {
  fetchProfiles()
})
</script> 