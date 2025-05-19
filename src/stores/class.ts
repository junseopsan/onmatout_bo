import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/services/supabase'
import { isToday, isThisWeek } from '@/utils/date'

export interface Class {
  id: number
  name: string
  instructor: string
  dateTime: string
  capacity: number
  attendance: {
    total: number
    present: number
    late: number
    absent: number
  }
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export const useClassStore = defineStore('class', () => {
  // 상태
  const classes = ref<Class[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 필터링된 클래스 목록
  const todayClasses = computed(() => 
    classes.value.filter(item => isToday(item.dateTime))
  )
  
  const thisWeekClasses = computed(() => 
    classes.value.filter(item => isThisWeek(item.dateTime))
  )

  // 클래스 목록 조회
  const fetchClasses = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await db.classes.getAll()
      
      // 출석 정보를 포함하여 클래스 데이터 가공
      const classesWithAttendance = await Promise.all(
        data.map(async (classItem) => {
          try {
            const attendances = await db.attendances.getByClassId(classItem.id)
            
            // 출석 통계 계산
            const total = attendances.length
            const present = attendances.filter(a => a.status === 'present').length
            const late = attendances.filter(a => a.status === 'late').length
            const absent = attendances.filter(a => a.status === 'absent').length
            
            return {
              ...classItem,
              attendance: {
                total,
                present,
                late,
                absent
              }
            }
          } catch (error) {
            console.error(`클래스 ID ${classItem.id}의 출석 정보 조회 실패:`, error)
            return {
              ...classItem,
              attendance: {
                total: 0,
                present: 0,
                late: 0,
                absent: 0
              }
            }
          }
        })
      )
      
      classes.value = classesWithAttendance as Class[]
      return classesWithAttendance
    } catch (err) {
      error.value = '수업 정보 조회에 실패했습니다.'
      console.error('수업 정보 조회 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 클래스 생성
  const createClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'attendance'>) => {
    loading.value = true
    error.value = null
    try {
      const result = await db.classes.create({
        ...classData,
        attendance: {
          total: 0,
          present: 0,
          late: 0,
          absent: 0
        }
      })
      
      const newClass = {
        ...result,
        attendance: {
          total: 0,
          present: 0,
          late: 0,
          absent: 0
        }
      } as Class
      
      classes.value.push(newClass)
      return newClass
    } catch (err) {
      error.value = '수업 생성에 실패했습니다.'
      console.error('수업 생성 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 클래스 수정
  const updateClass = async (id: number, classData: Partial<Class>) => {
    loading.value = true
    error.value = null
    try {
      // 클래스 업데이트 시 attendance 정보는 제외
      const { attendance, ...updateData } = classData
      
      const result = await db.classes.update(id, updateData)
      
      // 로컬 상태 업데이트
      const index = classes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        // 기존 attendance 정보 유지
        const existingAttendance = classes.value[index].attendance
        classes.value[index] = {
          ...result,
          attendance: existingAttendance
        } as Class
      }
      
      return result
    } catch (err) {
      error.value = '수업 수정에 실패했습니다.'
      console.error('수업 수정 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 클래스 삭제
  const deleteClass = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await db.classes.delete(id)
      
      // 로컬 상태 업데이트
      classes.value = classes.value.filter(c => c.id !== id)
      
      return true
    } catch (err) {
      error.value = '수업 삭제에 실패했습니다.'
      console.error('수업 삭제 실패:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    classes,
    todayClasses,
    thisWeekClasses,
    loading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass
  }
}) 