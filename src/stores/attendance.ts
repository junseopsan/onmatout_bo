import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/services/supabase'

export interface Attendance {
  id: number
  memberId: string
  memberName: string
  classId: number
  className: string
  date: string
  status: 'present' | 'late' | 'absent' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export const useAttendanceStore = defineStore('attendance', () => {
  // 출석 데이터 상태
  const attendances = ref<Attendance[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 클래스별 출석 조회
  const fetchClassAttendances = async (classId: number) => {
    loading.value = true
    error.value = null
    try {
      const data = await db.attendances.getByClassId(classId)
      attendances.value = data as Attendance[]
      return data
    } catch (err) {
      error.value = '출석 정보 조회에 실패했습니다.'
      console.error('출석 정보 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원별 출석 이력 조회
  const fetchMemberAttendances = async (memberId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await db.attendances.getByMemberId(memberId)
      attendances.value = data as Attendance[]
      return data
    } catch (err) {
      error.value = '출석 이력 조회에 실패했습니다.'
      console.error('출석 이력 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 출석 상태 변경
  const updateAttendanceStatus = async (attendanceId: number, status: Attendance['status']) => {
    loading.value = true
    error.value = null
    try {
      // 기존 상태 가져오기
      const existingAttendance = attendances.value.find(a => a.id === attendanceId)
      const oldStatus = existingAttendance?.status
      
      // 상태 업데이트
      const response = await db.attendances.update(attendanceId, status, oldStatus)
      
      // 로컬 상태 업데이트
      const index = attendances.value.findIndex(a => a.id === attendanceId)
      if (index !== -1) {
        attendances.value[index] = {
          ...attendances.value[index],
          status,
          updatedAt: response.updatedAt
        }
      }
      
      return response
    } catch (err) {
      error.value = '출석 상태 변경에 실패했습니다.'
      console.error('출석 상태 변경 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 수동 출석 체크
  const checkAttendance = async (data: {
    memberId: string;
    classId: number;
    status: Attendance['status'];
  }) => {
    loading.value = true
    error.value = null
    try {
      // 오늘 날짜 설정
      const today = new Date().toISOString().split('T')[0]
      const attendanceData = {
        ...data,
        date: today
      }
      
      const response = await db.attendances.create(attendanceData)
      
      // 새 출석 정보를 목록 맨 앞에 추가
      attendances.value.unshift(response as Attendance)
      
      return response
    } catch (err) {
      error.value = '출석 체크에 실패했습니다.'
      console.error('출석 체크 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 날짜별 출석 조회
  const fetchDateAttendances = async (date: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await db.attendances.getByDate(date)
      attendances.value = response as Attendance[]
      return response
    } catch (err) {
      error.value = '출석 정보 조회에 실패했습니다.'
      console.error('출석 정보 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    attendances,
    loading,
    error,
    fetchClassAttendances,
    fetchMemberAttendances,
    updateAttendanceStatus,
    checkAttendance,
    fetchDateAttendances
  }
}) 