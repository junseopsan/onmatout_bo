import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export interface TicketType {
  id: number
  name: string
  description: string
  sessions: number
  durationDays: number
  price: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface MemberTicket {
  id: number
  memberId: number
  memberName: string
  ticketTypeId: number
  ticketTypeName: string
  remainingSessions: number
  startDate: string
  endDate: string
  status: 'active' | 'used' | 'expired'
  createdAt: string
  updatedAt: string
}

export const useTicketStore = defineStore('ticket', () => {
  // 수강권 유형 관련 상태
  const ticketTypes = ref<TicketType[]>([])
  const ticketTypeLoading = ref(false)
  const ticketTypeError = ref<string | null>(null)

  // 회원 수강권 관련 상태
  const memberTickets = ref<MemberTicket[]>([])
  const memberTicketLoading = ref(false)
  const memberTicketError = ref<string | null>(null)

  // 수강권 유형 관련 메서드
  const fetchTicketTypes = async () => {
    ticketTypeLoading.value = true
    ticketTypeError.value = null
    try {
      const response = await api.get('/ticket-types')
      ticketTypes.value = response.data
    } catch (err) {
      ticketTypeError.value = '수강권 유형 목록을 불러오는데 실패했습니다.'
      console.error('수강권 유형 목록 조회 실패:', err)
    } finally {
      ticketTypeLoading.value = false
    }
  }

  const createTicketType = async (ticketTypeData: Omit<TicketType, 'id' | 'createdAt' | 'updatedAt'>) => {
    ticketTypeLoading.value = true
    ticketTypeError.value = null
    try {
      const response = await api.post('/ticket-types', ticketTypeData)
      ticketTypes.value.unshift(response.data)
      return response.data
    } catch (err) {
      ticketTypeError.value = '수강권 유형 생성에 실패했습니다.'
      console.error('수강권 유형 생성 실패:', err)
      throw err
    } finally {
      ticketTypeLoading.value = false
    }
  }

  const updateTicketType = async (id: number, ticketTypeData: Partial<Omit<TicketType, 'id' | 'createdAt' | 'updatedAt'>>) => {
    ticketTypeLoading.value = true
    ticketTypeError.value = null
    try {
      const response = await api.put(`/ticket-types/${id}`, ticketTypeData)
      const index = ticketTypes.value.findIndex(t => t.id === id)
      if (index !== -1) {
        ticketTypes.value[index] = response.data
      }
      return response.data
    } catch (err) {
      ticketTypeError.value = '수강권 유형 수정에 실패했습니다.'
      console.error('수강권 유형 수정 실패:', err)
      throw err
    } finally {
      ticketTypeLoading.value = false
    }
  }

  const deleteTicketType = async (id: number) => {
    ticketTypeLoading.value = true
    ticketTypeError.value = null
    try {
      await api.delete(`/ticket-types/${id}`)
      ticketTypes.value = ticketTypes.value.filter(t => t.id !== id)
    } catch (err) {
      ticketTypeError.value = '수강권 유형 삭제에 실패했습니다.'
      console.error('수강권 유형 삭제 실패:', err)
      throw err
    } finally {
      ticketTypeLoading.value = false
    }
  }

  // 회원 수강권 관련 메서드
  const fetchMemberTickets = async (memberId?: number) => {
    memberTicketLoading.value = true
    memberTicketError.value = null
    try {
      const url = memberId ? `/members/${memberId}/tickets` : '/member-tickets'
      const response = await api.get(url)
      memberTickets.value = response.data
    } catch (err) {
      memberTicketError.value = '회원 수강권 목록을 불러오는데 실패했습니다.'
      console.error('회원 수강권 목록 조회 실패:', err)
    } finally {
      memberTicketLoading.value = false
    }
  }

  const createMemberTicket = async (memberTicketData: {
    memberId: number;
    ticketTypeId: number;
    startDate: string;
  }) => {
    memberTicketLoading.value = true
    memberTicketError.value = null
    try {
      const response = await api.post('/member-tickets', memberTicketData)
      memberTickets.value.unshift(response.data)
      return response.data
    } catch (err) {
      memberTicketError.value = '회원 수강권 생성에 실패했습니다.'
      console.error('회원 수강권 생성 실패:', err)
      throw err
    } finally {
      memberTicketLoading.value = false
    }
  }

  const updateMemberTicketStatus = async (id: number, status: MemberTicket['status']) => {
    memberTicketLoading.value = true
    memberTicketError.value = null
    try {
      const response = await api.put(`/member-tickets/${id}/status`, { status })
      const index = memberTickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        memberTickets.value[index] = response.data
      }
      return response.data
    } catch (err) {
      memberTicketError.value = '회원 수강권 상태 변경에 실패했습니다.'
      console.error('회원 수강권 상태 변경 실패:', err)
      throw err
    } finally {
      memberTicketLoading.value = false
    }
  }

  return {
    // 수강권 유형 관련
    ticketTypes,
    ticketTypeLoading,
    ticketTypeError,
    fetchTicketTypes,
    createTicketType,
    updateTicketType,
    deleteTicketType,
    
    // 회원 수강권 관련
    memberTickets,
    memberTicketLoading,
    memberTicketError,
    fetchMemberTickets,
    createMemberTicket,
    updateMemberTicketStatus
  }
}) 