<template>
  <aside class="w-64 bg-white min-h-screen border-r">
    <div class="flex items-center h-16 px-6 font-bold text-primary-700 text-xl select-none">
      <svg class="w-7 h-7 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
      TailAdmin
    </div>
    <nav class="mt-5 px-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        :class="[
          $route.path === item.href
            ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
            : 'text-primary-500 hover:bg-primary-50 hover:text-primary-700',
          'group flex items-center px-3 py-2 text-base rounded-lg transition-colors duration-150'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            $route.path === item.href ? 'text-primary-600' : 'text-primary-300 group-hover:text-primary-500',
            'mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-150'
          ]"
          aria-hidden="true"
        />
        {{ item.name }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup >
import { HomeIcon, UserGroupIcon, CalendarIcon, QrCodeIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: '대시보드', href: '/', icon: HomeIcon },
  { name: '수업 관리', href: '/classes', icon: CalendarIcon },
  { name: '회원 관리', href: '/members', icon: UserGroupIcon },
  { name: 'QR 코드', href: '/qr-codes', icon: QrCodeIcon },
  { name: '통계', href: '/statistics', icon: ChartBarIcon },
]
</script> 