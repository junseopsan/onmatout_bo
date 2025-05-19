import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export interface QRCode {
  id: number
  className: string
  dateTime: string
  status: 'active' | 'expired'
  code: string
  createdAt: string
  expiresAt: string
}

export const useQRCodeStore = defineStore('qrCode', () => {
  const qrCodes = ref<QRCode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchQRCodes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/qr-codes')
      qrCodes.value = response.data
    } catch (err) {
      error.value = 'QR 코드 목록을 불러오는데 실패했습니다.'
      console.error('QR 코드 목록 조회 실패:', err)
    } finally {
      loading.value = false
    }
  }

  const createQRCode = async (classId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/qr-codes', { classId })
      qrCodes.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'QR 코드 생성에 실패했습니다.'
      console.error('QR 코드 생성 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteQRCode = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/qr-codes/${id}`)
      qrCodes.value = qrCodes.value.filter(qr => qr.id !== id)
    } catch (err) {
      error.value = 'QR 코드 삭제에 실패했습니다.'
      console.error('QR 코드 삭제 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadQRCode = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/qr-codes/${id}/download`, {
        responseType: 'blob'
      })
      
      // 다운로드 링크 생성 및 클릭
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `qr-code-${id}.png`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      error.value = 'QR 코드 다운로드에 실패했습니다.'
      console.error('QR 코드 다운로드 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    qrCodes,
    loading,
    error,
    fetchQRCodes,
    createQRCode,
    deleteQRCode,
    downloadQRCode
  }
}) 