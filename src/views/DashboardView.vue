<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">대시보드</h1>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- 오늘의 수업 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">오늘의 수업</dt>
                <dd class="text-lg font-medium text-gray-900">3개</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 출석 현황 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UserGroupIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">출석 현황</dt>
                <dd class="text-lg font-medium text-gray-900">15명</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 수강권 소진 예정 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ExclamationCircleIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">수강권 소진 예정</dt>
                <dd class="text-lg font-medium text-gray-900">5명</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup >
import { CalendarIcon, UserGroupIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
</script> 