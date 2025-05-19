import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/services/supabase'

export interface Member {
  id: string
  name: string
  phone: string
  email: string
  remainingTickets: number
  lastAttendance: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export const useMemberStore = defineStore('member', () => {
  // 상태
  const members = ref<Member[]>([])
  const member = ref<Member | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 모든 회원 조회
  const fetchMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await db.profiles.getAll()
      members.value = data as Member[]
      return data
    } catch (err) {
      error.value = '회원 정보 조회에 실패했습니다.'
      console.error('회원 정보 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 특정 회원 조회
  const fetchMember = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await db.profiles.getById(id)
      member.value = data as Member
      return data
    } catch (err) {
      error.value = '회원 정보 조회에 실패했습니다.'
      console.error('회원 정보 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원 생성
  const createMember = async (data: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    try {
      const result = await db.profiles.create(data)
      members.value.push(result as Member)
      return result
    } catch (err) {
      error.value = '회원 생성에 실패했습니다.'
      console.error('회원 생성 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원 수정
  const updateMember = async (id: string, data: Partial<Member>) => {
    loading.value = true
    error.value = null
    try {
      const result = await db.profiles.update(id, data)
      
      // 로컬 상태 업데이트
      const index = members.value.findIndex(m => m.id === id)
      if (index !== -1) {
        members.value[index] = { ...members.value[index], ...result }
      }
      
      if (member.value && member.value.id === id) {
        member.value = { ...member.value, ...result }
      }
      
      return result
    } catch (err) {
      error.value = '회원 수정에 실패했습니다.'
      console.error('회원 수정 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원 삭제
  const deleteMember = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await db.profiles.delete(id)
      
      // 로컬 상태 업데이트
      members.value = members.value.filter(m => m.id !== id)
      if (member.value && member.value.id === id) {
        member.value = null
      }
      
      return true
    } catch (err) {
      error.value = '회원 삭제에 실패했습니다.'
      console.error('회원 삭제 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 회원 검색
  const searchMembers = async (query: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await db.profiles.search(query)
      return data as Member[]
    } catch (err) {
      error.value = '회원 검색에 실패했습니다.'
      console.error('회원 검색 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 남은 수강권 업데이트
  const updateRemainingTickets = async (id: string, change: number) => {
    loading.value = true
    error.value = null
    try {
      const result = await db.profiles.updateRemainingTickets(id, change)
      
      // 로컬 상태 업데이트
      const index = members.value.findIndex(m => m.id === id)
      if (index !== -1) {
        members.value[index].remainingTickets = result.remainingTickets
      }
      
      if (member.value && member.value.id === id) {
        member.value.remainingTickets = result.remainingTickets
      }
      
      return result
    } catch (err) {
      error.value = '수강권 업데이트에 실패했습니다.'
      console.error('수강권 업데이트 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 마지막 출석일 업데이트
  const updateLastAttendance = async (id: string, date: string) => {
    loading.value = true
    error.value = null
    try {
      const result = await db.profiles.updateLastAttendance(id, date)
      
      // 로컬 상태 업데이트
      const index = members.value.findIndex(m => m.id === id)
      if (index !== -1) {
        members.value[index].lastAttendance = result.lastAttendance
      }
      
      if (member.value && member.value.id === id) {
        member.value.lastAttendance = result.lastAttendance
      }
      
      return result
    } catch (err) {
      error.value = '마지막 출석일 업데이트에 실패했습니다.'
      console.error('마지막 출석일 업데이트 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    members,
    member,
    loading,
    error,
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
    updateRemainingTickets,
    updateLastAttendance
  }
}) 