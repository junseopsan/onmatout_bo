import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useMemberStore = defineStore('member', {
  state: () => ({
    members: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMembers() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('trainees')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.members = data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createMember(memberData) {
      try {
        const { data, error } = await supabase
          .from('trainees')
          .insert([memberData])
          .select()

        if (error) throw error
        this.members.unshift(data[0])
        return data[0]
      } catch (error) {
        console.error('Error creating member:', error)
        throw error
      }
    },

    async updateMember(id, memberData) {
      try {
        const { data, error } = await supabase
          .from('trainees')
          .update(memberData)
          .eq('id', id)
          .select()

        if (error) throw error
        const index = this.members.findIndex(m => m.id === id)
        if (index !== -1) {
          this.members[index] = data[0]
        }
        return data[0]
      } catch (error) {
        console.error('Error updating member:', error)
        throw error
      }
    },

    async deleteMember(id) {
      try {
        const { error } = await supabase
          .from('trainees')
          .delete()
          .eq('id', id)

        if (error) throw error
        this.members = this.members.filter(m => m.id !== id)
      } catch (error) {
        console.error('Error deleting member:', error)
        throw error
      }
    }
  }
}) 