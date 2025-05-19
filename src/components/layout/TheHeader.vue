<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-primary-600">요가원 관리자</h1>
          </div>
          <nav class="ml-10 flex items-center space-x-4">
            <ul class="flex space-x-4">
              <li>
                <router-link to="/dashboard" class="text-gray-700 hover:text-primary-600 font-medium">대시보드</router-link>
              </li>
              <li>
                <router-link to="/admin-manage" class="text-gray-700 hover:text-primary-600 font-medium">관리자 관리</router-link>
              </li>
              <li>
                <router-link to="/member-manage" class="text-gray-700 hover:text-primary-600 font-medium">회원 관리</router-link>
              </li>
              <!-- 기타 메뉴 -->
            </ul>
          </nav>
        </div>
        <div class="flex items-center">
          <button class="btn btn-secondary">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// 컴포넌트 로직
</script> 