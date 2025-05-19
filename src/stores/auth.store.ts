import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      user.value = data.user
      return data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      user.value = null
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError

      user.value = session?.user ?? null
      return session
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
}) 