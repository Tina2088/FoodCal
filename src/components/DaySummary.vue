<template>
  <div class="day-summary">
    <!-- 大卡进度环 -->
    <div class="calorie-progress">
      <van-circle
        v-model:current-rate="calorieProgress"
        :rate="calorieProgress"
        :speed="100"
        :size="120"
        :stroke-width="8"
        color="#ff6b6b"
        layer-color="#f0f0f0"
        text=""
      >
        <div class="progress-content">
          <div class="remaining">{{ remainingCalories }}</div>
          <div class="label">剩余大卡</div>
          <div class="defense-line">控制总摄入：{{ userStore.profile.daily_calorie_target }}</div>
        </div>
      </van-circle>
    </div>

    <!-- 营养素统计 -->
    <div class="nutrition-stats">
      <div class="nutrition-item">
        <div class="nutrition-bar">
          <van-progress 
            :percentage="proteinPercentage" 
            color="#4CAF50"
            track-color="#f0f0f0"
          />
        </div>
        <div class="nutrition-label">
          <span>蛋白质</span>
          <span>{{ Math.round(summary.total_protein) }}g</span>
        </div>
      </div>
      
      <div class="nutrition-item">
        <div class="nutrition-bar">
          <van-progress 
            :percentage="carbsPercentage" 
            color="#2196F3"
            track-color="#f0f0f0"
          />
        </div>
        <div class="nutrition-label">
          <span>碳水化合物</span>
          <span>{{ Math.round(summary.total_carbs) }}g</span>
        </div>
      </div>
      
      <div class="nutrition-item">
        <div class="nutrition-bar">
          <van-progress 
            :percentage="fatPercentage" 
            color="#FF9800"
            track-color="#f0f0f0"
          />
        </div>
        <div class="nutrition-label">
          <span>脂肪</span>
          <span>{{ Math.round(summary.total_fat) }}g</span>
        </div>
      </div>
    </div>

    <!-- 今日食物记录 -->
    <div class="food-records">
      <!-- 按图片分组显示 -->
      <div v-for="group in groupedFoodRecords" :key="group.key" class="food-group">
        <van-cell-group inset>
          <!-- 餐次标题行 -->
          <van-cell 
            class="group-header"
            :label="getGroupLabel(group)"
          >
            <template #title>
              <div class="group-title">
                <img 
                  v-if="group.image_url"
                  :src="group.image_url" 
                  :alt="`第${group.meal_sequence}餐`"
                  class="group-image"
                />
                <div v-else class="meal-icon">🍽️</div>
                <div class="group-info">
                  <div class="meal-name">第{{ group.meal_sequence }}餐</div>
                  <div class="food-count">共{{ group.records.length }}种食物</div>
                </div>
              </div>
            </template>
            
            <template #right-icon>
              <div class="group-total">
                <div class="total-calories">{{ group.totalCalories }}大卡</div>
              </div>
            </template>
          </van-cell>
          
          <!-- 食物详情列表 -->
          <van-cell 
            v-for="record in group.records" 
            :key="record.id"
            :title="record.food_item.name"
            :label="getFoodItemLabel(record)"
            clickable
            @click="showFoodDetail(record)"
            class="food-item"
          >
            <template #right-icon>
              <div class="food-actions">
                <span class="food-calories">{{ Math.round(record.food_item.calories * record.food_item.quantity) }}大卡</span>
                <van-icon name="delete" @click.stop="deleteFoodRecord(record.id)" />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 无图片的单独食物 -->
      <van-cell-group v-if="singleFoodRecords.length > 0" inset>
        <van-cell 
          v-for="record in singleFoodRecords" 
          :key="record.id"
          :title="record.food_item.name"
          :label="getFoodRecordLabel(record)"
          clickable
          @click="showFoodDetail(record)"
        >
          <template #icon>
            <van-icon name="food-o" size="32" color="#999" />
          </template>
          
          <template #right-icon>
            <van-icon name="delete" @click.stop="deleteFoodRecord(record.id)" />
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 空状态 -->
      <van-cell-group v-if="summary.food_records.length === 0" inset>
        <van-cell 
          title="还没有记录"
          label="点击扫描按钮添加食物"
          center
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFoodStore } from '@/stores/foodStore'
import { useUserStore } from '@/stores/userStore'
import type { DailySummary, FoodRecord } from '@/types'
import { showConfirmDialog, showToast } from 'vant'

interface Props {
  summary: DailySummary
}

const props = defineProps<Props>()
const foodStore = useFoodStore()
const userStore = useUserStore()

// 计算大卡进度
const calorieProgress = computed(() => {
  const target = userStore.profile.daily_calorie_target
  const consumed = props.summary.total_calories
  return Math.min((consumed / target) * 100, 100)
})

const remainingCalories = computed(() => {
  const remaining = Math.floor(userStore.profile.daily_calorie_target - props.summary.total_calories)
  return remaining > 0 ? remaining : 0
})

// 计算营养素百分比
const proteinPercentage = computed(() => {
  const percentage = Math.min((props.summary.total_protein / userStore.profile.daily_protein_target) * 100, 100)
  return Math.round(percentage * 100) / 100 // 保留2位小数
})

const carbsPercentage = computed(() => {
  const percentage = Math.min((props.summary.total_carbs / userStore.profile.daily_carbs_target) * 100, 100)
  return Math.round(percentage * 100) / 100 // 保留2位小数
})

const fatPercentage = computed(() => {
  const percentage = Math.min((props.summary.total_fat / userStore.profile.daily_fat_target) * 100, 100)
  return Math.round(percentage * 100) / 100 // 保留2位小数
})

// 餐次名称映射
const getMealTypeName = (mealType: string): string => {
  const mealTypeNames: Record<string, string> = {
    'breakfast': '早餐',
    'lunch': '午餐', 
    'dinner': '晚餐',
    'snack': '炫我嘴里'
  }
  return mealTypeNames[mealType] || mealType
}

// 按扫描会话ID分组食物记录
const groupedFoodRecords = computed(() => {
  const groups: Record<string, {
    key: string
    scan_session_id: string
    meal_sequence: number
    image_url?: string
    meal_type: string  
    records: FoodRecord[]
    totalCalories: number
    timestamp: Date
  }> = {}
  
  // 处理有会话ID的记录
  const recordsWithSession = props.summary.food_records.filter(record => record.scan_session_id)
  
  recordsWithSession.forEach(record => {
    const key = record.scan_session_id!
    
    if (!groups[key]) {
      groups[key] = {
        key,
        scan_session_id: record.scan_session_id!,
        meal_sequence: 0, // 稍后计算
        image_url: record.image_url,
        meal_type: record.meal_type,
        records: [],
        totalCalories: 0,
        timestamp: record.timestamp
      }
    }
    
    groups[key].records.push(record)
    groups[key].totalCalories += Math.round(record.food_item.calories * record.food_item.quantity)
    
    // 使用最新的图片URL（如果有的话）
    if (record.image_url && !groups[key].image_url) {
      groups[key].image_url = record.image_url
    }
  })
  
  // 按时间排序，并分配餐次序号
  const sortedGroups = Object.values(groups).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  
  // 分配餐次序号
  sortedGroups.forEach((group, index) => {
    group.meal_sequence = index + 1
  })
  
  return sortedGroups
})

// 无会话ID的单独食物记录（手动添加的食物）
const singleFoodRecords = computed(() => {
  return props.summary.food_records.filter(record => !record.scan_session_id)
})

// 获取分组标签
const getGroupLabel = (group: any): string => {
  const time = new Date(group.timestamp).toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  return `识别于 ${time}`
}

// 获取食物项标签（简化版，不包含餐次）
const getFoodItemLabel = (record: FoodRecord): string => {
  const calories = Math.round(record.food_item.calories * record.food_item.quantity)
  const weight = Math.round(record.food_item.quantity * 100)
  return `${weight}g`
}

// 获取食物记录标签（保留原函数用于无图片食物）
const getFoodRecordLabel = (record: FoodRecord): string => {
  const mealName = getMealTypeName(record.meal_type)
  const calories = Math.round(record.food_item.calories * record.food_item.quantity)
  const weight = Math.round(record.food_item.quantity * 100)
  
  return `${mealName} · ${calories}大卡 · ${weight}g`
}

// 删除食物记录
const deleteFoodRecord = async (recordId: string) => {
  try {
    await showConfirmDialog({
      title: '删除记录',
      message: '确定要删除这条食物记录吗？'
    })
    
    foodStore.removeFoodRecord(recordId)
    showToast('删除成功')
  } catch {
    // 用户取消
  }
}

// 显示食物详情
const showFoodDetail = (record: FoodRecord) => {
  showToast(`${record.food_item.name}: ${Math.round(record.food_item.calories * record.food_item.quantity)}大卡`)
}
</script>

<style scoped>
.day-summary {
  padding: 20px;
}

.calorie-progress {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.remaining {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  white-space: nowrap;
}

.defense-line {
  font-size: 11px;
  color: #ff9800;
  margin-top: 2px;
  font-weight: 500;
  white-space: nowrap;
}

.nutrition-stats {
  margin-bottom: 30px;
}

.nutrition-item {
  margin-bottom: 20px;
}

.nutrition-bar {
  margin-bottom: 8px;
}

.nutrition-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.food-records {
  margin-top: 20px;
}

.food-group {
  margin-bottom: 20px;
}

.group-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.meal-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 24px;
}

.group-info {
  flex: 1;
}

.meal-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.food-count {
  font-size: 12px;
  color: #666;
}

.group-total {
  text-align: right;
}

.total-calories {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
}

.food-item {
  padding-left: 24px;
  border-left: 3px solid #f0f9ff;
  background-color: #fafbfc;
}

.food-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.food-calories {
  font-size: 14px;
  font-weight: 600;
  color: #1989fa;
  min-width: 60px;
  text-align: right;
}
</style>