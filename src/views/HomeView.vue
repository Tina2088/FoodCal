<template>
  <div class="home-view">
    <!-- 导航栏 -->
    <van-nav-bar title="Tina卡路里助手" />
    
    <!-- 标签页切换 -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="今天" name="today">
        <DaySummary :summary="todaySummary" />
      </van-tab>
      <van-tab title="昨天" name="yesterday">
        <DaySummary :summary="yesterdaySummary" />
      </van-tab>
    </van-tabs>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" fixed>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/scan">扫描</van-tabbar-item>
      <van-tabbar-item icon="bar-chart-o" to="/analytics">分析</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>

    <!-- 悬浮扫描按钮 -->
    <van-floating-bubble 
      icon="plus" 
      @click="$router.push('/scan')"
      :style="{ right: '20px', bottom: '80px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFoodStore } from '@/stores/foodStore'
import { useUserStore } from '@/stores/userStore'
import DaySummary from '@/components/DaySummary.vue'

const foodStore = useFoodStore()
const userStore = useUserStore()

const activeTab = ref('today')
const activeTabbar = ref(0)

const todaySummary = computed(() => foodStore.getTodaySummary)
const yesterdaySummary = computed(() => foodStore.getYesterdaySummary)

onMounted(() => {
  foodStore.loadFromStorage()
  userStore.loadFromStorage()
})
</script>

<style scoped>
.home-view {
  padding-bottom: 60px;
}
</style>