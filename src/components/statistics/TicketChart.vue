<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  chartData: {
    type: Object,
    default: null
  }
})

const chart = ref(null)
let lineChart = null

// 차트 생성 함수
const createChart = () => {
  if (!chart.value || !props.chartData) return
  
  // 기존 차트가 있으면 파괴
  if (lineChart) {
    lineChart.destroy()
  }
  
  // 새 차트 생성
  lineChart = new Chart(chart.value, {
    type: 'line',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: '월별 수강권 현황',
          font: {
            size: 16
          }
        }
      }
    }
  })
}

// 컴포넌트 마운트 시 차트 생성
onMounted(() => {
  createChart()
})

// props 변경 시 차트 업데이트
watch(() => props.chartData, () => {
  createChart()
}, { deep: true })
</script> 