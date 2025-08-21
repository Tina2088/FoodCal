<template>
  <div class="analytics-view">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="Tina卡路里助手" 
      left-text="返回" 
      left-arrow 
      @click-left="$router.back()"
    />

    <!-- 周期选择 -->
    <van-tabs v-model:active="activePeriod" sticky>
      <van-tab title="本周" name="week">
        <WeeklyChart :data="weeklyData" />
      </van-tab>
      <van-tab title="本月" name="month">
        <MonthlyChart :data="monthlyData" />
      </van-tab>
    </van-tabs>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <van-grid :gutter="10" :column-num="2">
        <van-grid-item>
          <div class="stat-card">
            <div class="stat-value">{{ totalCaloriesThisWeek }}</div>
            <div class="stat-label">本周总大卡</div>
          </div>
        </van-grid-item>
        
        <van-grid-item>
          <div class="stat-card">
            <div class="stat-value">{{ averageCaloriesPerDay }}</div>
            <div class="stat-label">日均大卡</div>
          </div>
        </van-grid-item>
        
        <van-grid-item>
          <div class="stat-card">
            <div class="stat-value">{{ totalRecordsThisWeek }}</div>
            <div class="stat-label">记录次数</div>
          </div>
        </van-grid-item>
        
        <van-grid-item>
          <div class="stat-card">
            <div class="stat-value">{{ goalAchievementRate }}%</div>
            <div class="stat-label">日摄入/大卡目标</div>
          </div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 营养素分布 -->
    <div class="nutrition-distribution">
      <van-cell-group inset>
        <van-cell title="营养素分布" />
        <van-cell>
          <template #title>
            <div class="nutrition-chart">
              <div class="nutrition-pie" :style="pieChartStyle"></div>
              <div class="nutrition-legend">
                <div class="legend-item">
                  <span class="legend-color protein-color"></span>
                  <span>蛋白质 {{ Math.round(avgProtein) }}g ({{ proteinPercentage }}%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color carbs-color"></span>
                  <span>碳水 {{ Math.round(avgCarbs) }}g ({{ carbsPercentage }}%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color fat-color"></span>
                  <span>脂肪 {{ Math.round(avgFat) }}g ({{ fatPercentage }}%)</span>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 最常吃的食物 -->
    <div class="frequent-foods">
      <van-cell-group inset>
        <van-cell title="最常吃的食物" />
        <van-cell 
          v-for="food in frequentFoods" 
          :key="food.name"
          :title="food.name"
          :label="`${food.count}次 · ${food.totalCalories}大卡`"
        />
      </van-cell-group>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" fixed>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/scan">扫描</van-tabbar-item>
      <van-tabbar-item icon="bar-chart-o" to="/analytics">分析</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFoodStore } from '@/stores/foodStore'
import { useUserStore } from '@/stores/userStore'
import WeeklyChart from '@/components/WeeklyChart.vue'
import MonthlyChart from '@/components/MonthlyChart.vue'

const foodStore = useFoodStore()
const userStore = useUserStore()

const activePeriod = ref('week')
const activeTabbar = ref(2)

// 获取本周数据
const weeklyData = computed(() => {
  const today = new Date()
  const weekData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    // 使用本地时间格式化日期
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const summary = foodStore.getDailySummary(dateStr)
    
    weekData.push({
      date: dateStr,
      calories: Math.round(summary.total_calories),
      protein: Math.round(summary.total_protein),
      carbs: Math.round(summary.total_carbs),
      fat: Math.round(summary.total_fat)
    })
  }
  
  return weekData
})

// 获取本月数据
const monthlyData = computed(() => {
  const today = new Date()
  const monthData = []
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    // 使用本地时间格式化日期
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const summary = foodStore.getDailySummary(dateStr)
    
    monthData.push({
      date: dateStr,
      calories: Math.round(summary.total_calories),
      protein: Math.round(summary.total_protein),
      carbs: Math.round(summary.total_carbs),
      fat: Math.round(summary.total_fat)
    })
  }
  
  return monthData
})

// 本周总大卡
const totalCaloriesThisWeek = computed(() => {
  return weeklyData.value.reduce((sum, day) => sum + day.calories, 0)
})

// 日均大卡
const averageCaloriesPerDay = computed(() => {
  return Math.round(totalCaloriesThisWeek.value / 7)
})

// 本周记录次数
const totalRecordsThisWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return foodStore.foodRecords.filter(record => record.timestamp >= oneWeekAgo).length
})

// 日摄入/大卡目标比率
const goalAchievementRate = computed(() => {
  const target = userStore.profile.daily_calorie_target
  const daysWithRecords = weeklyData.value.filter(day => day.calories > 0).length
  const totalCalories = weeklyData.value.reduce((sum, day) => sum + day.calories, 0)
  
  if (daysWithRecords === 0 || target === 0) return 0
  
  // 计算平均日摄入与目标的比率，转换为百分比
  const averageDailyIntake = totalCalories / daysWithRecords
  const ratio = (averageDailyIntake / target) * 100
  
  return Math.round(ratio)
})

// 平均营养素
const avgProtein = computed(() => {
  const total = weeklyData.value.reduce((sum, day) => sum + day.protein, 0)
  return total / 7
})

const avgCarbs = computed(() => {
  const total = weeklyData.value.reduce((sum, day) => sum + day.carbs, 0)
  return total / 7
})

const avgFat = computed(() => {
  const total = weeklyData.value.reduce((sum, day) => sum + day.fat, 0)
  return total / 7
})

// 营养素百分比计算
const proteinPercentage = computed(() => {
  const total = avgProtein.value + avgCarbs.value + avgFat.value
  return total > 0 ? Math.round((avgProtein.value / total) * 100) : 0
})

const carbsPercentage = computed(() => {
  const total = avgProtein.value + avgCarbs.value + avgFat.value
  return total > 0 ? Math.round((avgCarbs.value / total) * 100) : 0
})

const fatPercentage = computed(() => {
  const total = avgProtein.value + avgCarbs.value + avgFat.value
  return total > 0 ? Math.round((avgFat.value / total) * 100) : 0
})

// 动态饼图样式
const pieChartStyle = computed(() => {
  const protein = proteinPercentage.value
  const carbs = carbsPercentage.value
  const fat = fatPercentage.value
  
  // 计算累积角度
  const proteinEnd = protein * 3.6
  const carbsEnd = proteinEnd + (carbs * 3.6)
  const fatEnd = carbsEnd + (fat * 3.6)
  
  // 使用conic-gradient创建动态饼图
  return `background: conic-gradient(
    #4CAF50 0deg ${proteinEnd}deg,
    #2196F3 ${proteinEnd}deg ${carbsEnd}deg,
    #FF9800 ${carbsEnd}deg ${fatEnd}deg,
    #f0f0f0 ${fatEnd}deg 360deg
  )`
})

// 最常吃的食物
const frequentFoods = computed(() => {
  const foodCounts: Record<string, { count: number, totalCalories: number }> = {}
  
  foodStore.foodRecords.forEach(record => {
    const name = record.food_item.name
    if (!foodCounts[name]) {
      foodCounts[name] = { count: 0, totalCalories: 0 }
    }
    foodCounts[name].count++
    foodCounts[name].totalCalories += Math.round(record.food_item.calories * record.food_item.quantity)
  })
  
  return Object.entries(foodCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

onMounted(() => {
  foodStore.loadFromStorage()
})
</script>

<style scoped>
.analytics-view {
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.stats-cards {
  padding: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.nutrition-distribution,
.frequent-foods {
  margin: 20px;
}

.nutrition-chart {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.nutrition-pie {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  /* 背景将由动态样式设置 */
}

.nutrition-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.protein-color {
  background-color: #4CAF50;
}

.carbs-color {
  background-color: #2196F3;
}

.fat-color {
  background-color: #FF9800;
}
</style>