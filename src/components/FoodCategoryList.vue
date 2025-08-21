<template>
  <div class="food-category-list">
    <van-cell-group>
      <van-cell 
        v-for="food in foods" 
        :key="food.id"
        :title="food.name"
        :label="`${food.calories}大卡 · 蛋白质${food.protein}g · ${food.serving_size}`"
        clickable
        @click="$emit('select', food)"
      >
        <template #right-icon>
          <div class="nutrition-preview">
            <span class="calories">{{ food.calories }}大卡</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import type { FoodItem } from '@/types'

interface Props {
  foods: FoodItem[]
}

defineProps<Props>()
defineEmits<{
  select: [food: FoodItem]
}>()
</script>

<style scoped>
.food-category-list {
  padding: 10px;
}

.nutrition-preview {
  text-align: right;
}

.calories {
  font-size: 14px;
  font-weight: bold;
  color: #1989fa;
}
</style>