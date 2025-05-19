import axios from 'axios'
import { supabase } from './supabase'

// 기본 axios 인스턴스 생성
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 인증 토큰 추가
api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession()
  if (session.data.session?.access_token) {
    config.headers.Authorization = `Bearer ${session.data.session.access_token}`
  }
  return config
})

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 인증 오류 처리 (401)
    if (error.response?.status === 401) {
      // 세션 만료 시 로그아웃 처리
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 엔드포인트 헬퍼
export const apiEndpoints = {
  // 클래스 관련 API
  classes: {
    getAll: () => api.get('/classes'),
    getById: (id: number) => api.get(`/classes/${id}`),
    create: (data: any) => api.post('/classes', data),
    update: (id: number, data: any) => api.put(`/classes/${id}`, data),
    delete: (id: number) => api.delete(`/classes/${id}`),
    getAttendance: (id: number) => api.get(`/classes/${id}/attendances`)
  },
  
  // 회원 관련 API
  members: {
    getAll: () => api.get('/members'),
    getById: (id: number) => api.get(`/members/${id}`),
    create: (data: any) => api.post('/members', data),
    update: (id: number, data: any) => api.put(`/members/${id}`, data),
    delete: (id: number) => api.delete(`/members/${id}`),
    getAttendance: (id: number) => api.get(`/members/${id}/attendances`)
  },
  
  // 출석 관련 API
  attendances: {
    getByDate: (date: string) => api.get('/attendances', { params: { date } }),
    create: (data: any) => api.post('/attendances', data),
    update: (id: number, status: string) => api.put(`/attendances/${id}`, { status })
  },
  
  // 통계 관련 API
  statistics: {
    getAttendance: (period: string) => api.get('/statistics/attendance', { params: { period } }),
    getMembers: () => api.get('/statistics/members'),
    getTickets: (period: string) => api.get('/statistics/tickets', { params: { period } })
  },
  
  // 리포트 관련 API
  reports: {
    generate: (data: any) => api.post('/reports/generate', data, {
      responseType: 'blob'
    })
  },
  
  // 인증 관련 API
  auth: {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile')
  }
} 