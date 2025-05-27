<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- 사이드바 -->
    <aside class="w-56 bg-white text-primary-700 border-r flex flex-col py-6 px-4">      <div class="text-2xl font-bold mb-8 tracking-tight">ONMATOUT</div>
      <nav class="flex-1 space-y-2">
        <router-link
          to="/"
          class="block py-2 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
          exact-active-class="bg-primary-50 text-primary-700 font-bold shadow"
        >대시보드</router-link>
        <router-link
          to="/members"
          class="block py-2 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
          exact-active-class="bg-primary-50 text-primary-700 font-bold shadow"
        >회원 관리</router-link>
        <router-link
          to="/admin"
          class="block py-2 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
          exact-active-class="bg-primary-50 text-primary-700 font-bold shadow"
        >관리자 관리</router-link>
        <router-link
          to="/classes"
          class="block py-2 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
          exact-active-class="bg-primary-50 text-primary-700 font-bold shadow"
        >수업 관리</router-link>
        <!-- <router-link
          to="/qr"
          class="block py-2 px-3 rounded hover:bg-gray-800"
          exact-active-class="bg-gray-800 font-semibold"
        >QR 관리</router-link> -->
      </nav>
    </aside>
    <!-- 메인 -->
    <div class="flex-1 flex flex-col">
      <!-- 상단 헤더 -->
      <header class="bg-white shadow px-6 py-4 flex justify-end">
        <button
          class="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300"
          @click="logout"
        >로그아웃</button>
      </header>
      <!-- 콘텐츠 -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup >
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const router = useRouter()
const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script> 