<template>
  <aside class="w-64 bg-gray-800 min-h-screen">
    <nav class="mt-5 px-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        :class="[
          $route.path === item.href
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            $route.path === item.href ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
            'mr-4 flex-shrink-0 h-6 w-6'
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