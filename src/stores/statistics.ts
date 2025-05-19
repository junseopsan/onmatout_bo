import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export interface AttendanceStats {
  totalClasses: number
  totalAttendance: number
  presentRate: number
  lateRate: number
  absentRate: number
  cancelledRate: number
  monthlyData: {
    month: string
    present: number
    late: number
    absent: number
    cancelled: number
  }[]
}

export interface MemberStats {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  newMembersThisMonth: number
  averageAttendancePerMember: number
  topMembers: {
    id: number
    name: string
    attendanceCount: number
  }[]
}

export interface TicketStats {
  totalTickets: number
  activeTickets: number
  expiredTickets: number
  averageUsage: number
  monthlyData: {
    month: string
    purchased: number
    expired: number
  }[]
}

export const useStatisticsStore = defineStore('statistics', () => {
  // 통계 데이터 상태
  const attendanceStats = ref<AttendanceStats | null>(null)
  const memberStats = ref<MemberStats | null>(null)
  const ticketStats = ref<TicketStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 출석 통계 조회
  const fetchAttendanceStats = async (period: 'week' | 'month' | 'year' = 'month') => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/statistics/attendance', { params: { period } })
      attendanceStats.value = response.data
      return response.data
    } catch (err) {
      error.value = '출석 통계 조회에 실패했습니다.'
      console.error('출석 통계 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원 통계 조회
  const fetchMemberStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/statistics/members')
      memberStats.value = response.data
      return response.data
    } catch (err) {
      error.value = '회원 통계 조회에 실패했습니다.'
      console.error('회원 통계 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 수강권 통계 조회
  const fetchTicketStats = async (period: 'month' | 'year' = 'month') => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/statistics/tickets', { params: { period } })
      ticketStats.value = response.data
      return response.data
    } catch (err) {
      error.value = '수강권 통계 조회에 실패했습니다.'
      console.error('수강권 통계 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 모든 통계 데이터 조회
  const fetchAllStats = async () => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchAttendanceStats(),
        fetchMemberStats(),
        fetchTicketStats()
      ])
    } catch (err) {
      error.value = '통계 조회에 실패했습니다.'
      console.error('통계 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    attendanceStats,
    memberStats,
    ticketStats,
    loading,
    error,
    fetchAttendanceStats,
    fetchMemberStats,
    fetchTicketStats,
    fetchAllStats
  }
}) 