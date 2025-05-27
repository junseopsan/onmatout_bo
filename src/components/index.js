// 레이아웃 컴포넌트
import TheHeader from '../layouts/TheHeader.vue'
import TheSidebar from '../layouts/TheSidebar.vue'

// 공통 컴포넌트
import BaseInput from './common/BaseInput.vue'
import BaseTable from './common/BaseTable.vue'
import BaseModal from './common/BaseModal.vue'
import DeleteConfirmModal from './common/DeleteConfirmModal.vue'

// 통계 컴포넌트
import TicketChart from './statistics/TicketChart.vue'
import AttendanceChart from './statistics/AttendanceChart.vue'

// 회원 컴포넌트
import MemberFormModal from './member/MemberFormModal.vue'

// 수업 컴포넌트
import ClassFormModal from './class/ClassFormModal.vue'
import ClassAttendanceModal from './class/ClassAttendanceModal.vue'

// 티켓 컴포넌트
import TicketTypeFormModal from './ticket/TicketTypeFormModal.vue'
import MemberTicketFormModal from './ticket/MemberTicketFormModal.vue'

// QR 코드 컴포넌트
import QRCodeCreateModal from './qrCode/QRCodeCreateModal.vue'

export {
  TheHeader,
  TheSidebar,
  BaseInput,
  BaseTable,
  BaseModal,
  DeleteConfirmModal,
  TicketChart,
  AttendanceChart,
  MemberFormModal,
  ClassFormModal,
  ClassAttendanceModal,
  TicketTypeFormModal,
  MemberTicketFormModal,
  QRCodeCreateModal
};
