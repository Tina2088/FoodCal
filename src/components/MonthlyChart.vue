<template>
  <div class="monthly-chart">
    <van-cell-group inset>
      <van-cell title="本月大卡趋势" />
      <van-cell>
        <template #title>
          <div class="chart-container">
            <canvas ref="chartCanvas" width="300" height="200"></canvas>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface ChartData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Props {
  data: ChartData[]
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement>()

const drawChart = () => {
  if (!chartCanvas.value || !props.data.length) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return
  
  const canvas = chartCanvas.value
  const width = canvas.width
  const height = canvas.height
  
  // 清除画布
  ctx.clearRect(0, 0, width, height)
  
  // 获取数据范围
  const maxCalories = Math.max(...props.data.map(d => d.calories), 2000)
  const minCalories = 0
  
  // 绘制网格线
  ctx.strokeStyle = '#f0f0f0'
  ctx.lineWidth = 1
  
  // 水平网格线
  for (let i = 0; i <= 5; i++) {
    const y = (height - 40) * (i / 5) + 20
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(width - 20, y)
    ctx.stroke()
  }
  
  // 绘制大卡柱状图
  const barWidth = (width - 60) / props.data.length
  
  props.data.forEach((point, index) => {
    const x = 40 + barWidth * index
    const barHeight = (height - 40) * (point.calories - minCalories) / (maxCalories - minCalories)
    const y = height - 20 - barHeight
    
    // 绘制柱子
    ctx.fillStyle = point.calories > 1800 ? '#4CAF50' : point.calories > 1200 ? '#FF9800' : '#f44336'
    ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
  })
  
  // 绘制坐标轴标签
  ctx.fillStyle = '#666'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  
  // X轴标签（每5天显示一次）
  props.data.forEach((point, index) => {
    if (index % 5 === 0) {
      const x = 40 + barWidth * index + barWidth / 2
      const date = new Date(point.date)
      const dayOfMonth = date.getDate()
      ctx.fillText(dayOfMonth.toString(), x, height - 5)
    }
  })
  
  // Y轴标签（大卡）
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = (height - 40) * (i / 5) + 25
    const value = Math.round(maxCalories * (1 - i / 5))
    ctx.fillText(value.toString(), 35, y)
  }
}

watch(() => props.data, () => {
  nextTick(() => {
    drawChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
})
</script>

<style scoped>
.monthly-chart {
  margin: 20px;
}

.chart-container {
  padding: 10px;
  text-align: center;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>