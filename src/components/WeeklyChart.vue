<template>
  <div class="weekly-chart">
    <van-cell-group inset>
      <van-cell title="近7天大卡趋势" />
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
  
  // 垂直网格线
  for (let i = 0; i < 7; i++) {
    const x = 40 + (width - 60) * (i / 6)
    ctx.beginPath()
    ctx.moveTo(x, 20)
    ctx.lineTo(x, height - 20)
    ctx.stroke()
  }
  
  // 绘制大卡折线
  ctx.strokeStyle = '#1989fa'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  props.data.forEach((point, index) => {
    const x = 40 + (width - 60) * (index / 6)
    const y = height - 20 - ((height - 40) * (point.calories - minCalories) / (maxCalories - minCalories))
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // 绘制数据点
  ctx.fillStyle = '#1989fa'
  props.data.forEach((point, index) => {
    const x = 40 + (width - 60) * (index / 6)
    const y = height - 20 - ((height - 40) * (point.calories - minCalories) / (maxCalories - minCalories))
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
  
  // 绘制坐标轴标签
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  
  // X轴标签（根据实际日期生成）
  props.data.forEach((point, index) => {
    const date = new Date(point.date)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const dayName = weekdays[date.getDay()]
    
    const x = 40 + (width - 60) * (index / 6)
    ctx.fillText(dayName, x, height - 5)
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
.weekly-chart {
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