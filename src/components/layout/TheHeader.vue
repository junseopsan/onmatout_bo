<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-primary-600">요가원 관리자</h1>
          </div>
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

<script setup >
// 컴포넌트 로직
</script>

<v-navigation-drawer app>
  <v-list>
    <v-list-item-group>
      <v-list-item to="/dashboard">
        <v-list-item-title>대시보드</v-list-item-title>
      </v-list-item>
      <v-list-item to="/admin-manage">
        <v-list-item-title>관리자 관리</v-list-item-title>
      </v-list-item>
      <v-list-item to="/member-manage">
        <v-list-item-title>회원 관리</v-list-item-title>
      </v-list-item>
      <!-- 기타 메뉴 -->
    </v-list-item-group>
  </v-list>
</v-navigation-drawer> 