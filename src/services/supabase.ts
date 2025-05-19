import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey)

// 인증 관련 헬퍼 함수
export const auth = {
  // 회원가입
  async signUp(email: string, password: string, userData: { name: string, phone: string }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone
        }
      }
    })
    if (authError) throw authError
    
    // 프로필 정보 저장
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          phone: userData.phone,
          email: email,
          remainingTickets: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      if (profileError) throw profileError
    }
    
    return authData
  },
  
  // 로그인
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  // 현재 사용자 정보 가져오기
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  // 세션 가져오기
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
  
  // 사용자 프로필 가져오기
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },
  
  // 현재 로그인한 사용자의 프로필 가져오기
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (error) throw error
    return data
  },
  
  // 프로필 업데이트
  async updateProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
    if (error) throw error
    return data[0]
  }
}

// 데이터베이스 테이블 접근 헬퍼
export const db = {
  // 프로필(회원) 테이블
  profiles: {
    async getAll() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return data
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    async create(profileData: any) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
      if (error) throw error
      return data[0]
    },
    async update(id: string, profileData: any) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    async updateRemainingTickets(id: string, change: number) {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('remainingTickets')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      const newTickets = (profile.remainingTickets || 0) + change
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          remainingTickets: newTickets >= 0 ? newTickets : 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (updateError) throw updateError
      return data[0]
    },
    async updateLastAttendance(id: string, date: string) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          lastAttendance: date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
      if (error) throw error
      return true
    },
    async search(query: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data
    }
  },
  
  // 클래스 테이블
  classes: {
    async getAll() {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('start_time', { ascending: false })
      if (error) throw error
      return data
    },
    async getById(id: number) {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    async create(classData: any) {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          ...classData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
      if (error) throw error
      return data[0]
    },
    async update(id: number, classData: any) {
      const { data, error } = await supabase
        .from('classes')
        .update({
          ...classData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    async delete(id: number) {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)
      if (error) throw error
      return true
    }
  },
  
  // 출석 테이블
  attendances: {
    async getByClassId(classId: number) {
      const { data, error } = await supabase
        .from('attendances')
        .select('*, profiles(name)')
        .eq('classId', classId)
      if (error) throw error
      
      // 회원 이름 포맷팅
      return data.map(item => ({
        ...item,
        memberName: item.profiles.name
      }))
    },
    async getByMemberId(memberId: string) {
      const { data, error } = await supabase
        .from('attendances')
        .select('*, classes(name)')
        .eq('memberId', memberId)
        .order('date', { ascending: false })
      if (error) throw error
      
      // 클래스 이름 포맷팅
      return data.map(item => ({
        ...item,
        className: item.classes.name
      }))
    },
    async getByDate(date: string) {
      const { data, error } = await supabase
        .from('attendances')
        .select('*, profiles(name), classes(name)')
        .eq('date', date)
      if (error) throw error
      
      // 이름 포맷팅
      return data.map(item => ({
        ...item,
        memberName: item.profiles.name,
        className: item.classes.name
      }))
    },
    async create(attendanceData: any) {
      // 수강권 차감 (결석이 아닌 경우만)
      if (attendanceData.status !== 'absent') {
        await db.profiles.updateRemainingTickets(
          attendanceData.memberId,
          -1
        )
        
        // 마지막 출석일 업데이트
        await db.profiles.updateLastAttendance(
          attendanceData.memberId,
          attendanceData.date
        )
      }
      
      const { data, error } = await supabase
        .from('attendances')
        .insert({
          ...attendanceData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
      if (error) throw error
      return data[0]
    },
    async update(id: number, status: string, oldStatus?: string) {
      // 출석 상태에 따라 수강권 업데이트
      if (oldStatus && oldStatus !== status) {
        const { data: attendance } = await supabase
          .from('attendances')
          .select('memberId, status')
          .eq('id', id)
          .single()
        
        // 상태 변경에 따른 수강권 조정
        if (attendance) {
          // 결석에서 다른 상태로 변경 (차감)
          if (oldStatus === 'absent' && status !== 'absent') {
            await db.profiles.updateRemainingTickets(attendance.memberId, -1)
          }
          // 다른 상태에서 결석으로 변경 (복구)
          else if (oldStatus !== 'absent' && status === 'absent') {
            await db.profiles.updateRemainingTickets(attendance.memberId, 1)
          }
        }
      }
      
      const { data, error } = await supabase
        .from('attendances')
        .update({
          status,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    }
  },
  
  // 통계 데이터
  statistics: {
    async getAttendanceStats(period: string) {
      const { data, error } = await supabase
        .rpc('get_attendance_stats', { period_param: period })
      if (error) throw error
      return data
    },
    async getMemberStats() {
      const { data, error } = await supabase
        .rpc('get_member_stats')
      if (error) throw error
      return data
    },
    async getTicketStats(period: string) {
      const { data, error } = await supabase
        .rpc('get_ticket_stats', { period_param: period })
      if (error) throw error
      return data
    }
  }
}

// 닉네임으로 로그인
export async function signInWithNickname(nickname: string, password: string) {
  const cleanNickname = nickname.replace(/^@/, '');
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('nickname', cleanNickname)
    .single();

  if (error || !data) throw new Error('존재하지 않는 닉네임입니다.');

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password,
  });

  if (signInError) throw signInError;
} 