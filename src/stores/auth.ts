import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface User {
  id: number
  email: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password)
      const { user: userData, token: tokenData } = response.data

      user.value = userData
      token.value = tokenData
      isAuthenticated.value = true

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', tokenData)
      
      return response.data
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const response = await api.auth.me()
        user.value = response.data
        token.value = storedToken
        isAuthenticated.value = true
      } catch (error) {
        console.error('인증 확인 실패:', error)
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}) 