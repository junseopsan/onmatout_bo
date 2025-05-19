<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">관리자 관리</h1>
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">권한</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="admin in admins" :key="admin.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ admin.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button class="text-primary-600 hover:text-primary-900 mr-3" @click="editAdmin(admin)">수정</button>
              <button class="text-red-600 hover:text-red-900" @click="deleteAdmin(admin)">삭제</button>
            </td>
          </tr>
          <tr v-if="admins.length === 0">
            <td colspan="4" class="text-center text-gray-400 py-8">등록된 관리자가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6 text-right">
      <button class="btn btn-primary" @click="openCreateModal">관리자 등록</button>
    </div>
    <!-- 등록/수정 모달 등 추가 가능 -->
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const admins = ref([])
const openCreateModal = () => {}
const editAdmin = (item) => {}
const deleteAdmin = (item) => {}

const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (!error) admins.value = data
}

onMounted(() => {
  fetchProfiles()
})
</script> 