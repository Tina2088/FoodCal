<template>
  <div class="settings-view">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="Tina卡路里助手" 
      left-text="返回" 
      left-arrow 
      @click-left="$router.back()"
    />

    <!-- 用户信息 -->
    <van-cell-group inset>
      <van-cell title="用户信息" is-link @click="showUserInfo = true" />
    </van-cell-group>

    <!-- 目标设置 -->
    <van-cell-group inset>
      <van-cell title="每日目标" />
      <van-cell 
        title="大卡目标" 
        :value="`${userProfile.daily_calorie_target}大卡`"
        is-link
        @click="showCalorieTarget = true"
      />
      <van-cell 
        title="蛋白质目标" 
        :value="`${userProfile.daily_protein_target}g`"
        is-link
        @click="showProteinTarget = true"
      />
      <van-cell 
        title="碳水化合物目标" 
        :value="`${userProfile.daily_carbs_target}g`"
        is-link
        @click="showCarbsTarget = true"
      />
      <van-cell 
        title="脂肪目标" 
        :value="`${userProfile.daily_fat_target}g`"
        is-link
        @click="showFatTarget = true"
      />
    </van-cell-group>

    <!-- 数据管理 -->
    <van-cell-group inset>
      <van-cell title="数据管理" />
      <van-cell title="导出数据" is-link @click="exportData" />
      <van-cell title="清除所有数据" is-link @click="clearAllData" />
    </van-cell-group>

    <!-- 关于 -->
    <van-cell-group inset>
      <van-cell title="关于" />
      <van-cell title="版本" value="1.0.0" />
    </van-cell-group>

    <!-- 用户信息弹窗 -->
    <van-popup 
      v-model:show="showUserInfo" 
      position="bottom" 
      :style="{ height: '60%' }"
    >
      <div class="popup-content">
        <van-nav-bar title="用户信息" @click-right="saveUserInfo">
          <template #right>保存</template>
        </van-nav-bar>
        
        <van-form @submit="saveUserInfo">
          <van-cell-group inset>
            <van-field
              v-model="tempProfile.name"
              label="姓名"
              placeholder="请输入姓名"
            />
            <van-field
              v-model="tempProfile.age"
              type="number"
              label="年龄"
              placeholder="请输入年龄"
            />
            <van-field
              v-model="tempProfile.weight"
              type="number"
              label="体重(kg)"
              placeholder="请输入体重"
            />
            <van-field
              v-model="tempProfile.height"
              type="number"
              label="身高(cm)"
              placeholder="请输入身高"
            />
          </van-cell-group>
          
          <van-cell-group inset>
            <van-field label="活动水平">
              <template #input>
                <van-radio-group v-model="tempProfile.activity_level">
                  <van-radio name="sedentary">久坐</van-radio>
                  <van-radio name="light">轻度活动</van-radio>
                  <van-radio name="moderate">中度活动</van-radio>
                  <van-radio name="active">高度活动</van-radio>
                  <van-radio name="very_active">非常活跃</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </van-cell-group>
          
          <van-cell-group inset>
            <van-field label="目标">
              <template #input>
                <van-radio-group v-model="tempProfile.goal">
                  <van-radio name="lose">减重</van-radio>
                  <van-radio name="maintain">维持</van-radio>
                  <van-radio name="gain">增重</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
      </div>
    </van-popup>

    <!-- 目标设置弹窗 -->
    <van-popup v-model:show="showCalorieTarget" position="bottom">
      <div class="popup-content">
        <van-nav-bar title="大卡目标" @click-right="saveCalorieTarget">
          <template #right>保存</template>
        </van-nav-bar>
        <van-field
          v-model="tempCalorieTarget"
          type="number"
          label="每日大卡目标"
          placeholder="请输入目标值"
          class="calorie-input-field"
          :border="true"
        >
          <template #right-icon>
            <span class="input-unit">大卡</span>
          </template>
        </van-field>
      </div>
    </van-popup>

    <van-popup v-model:show="showProteinTarget" position="bottom">
      <div class="popup-content">
        <van-nav-bar title="蛋白质目标" @click-right="saveProteinTarget">
          <template #right>保存</template>
        </van-nav-bar>
        <van-field
          v-model="tempProteinTarget"
          type="number"
          label="每日蛋白质目标(g)"
          placeholder="请输入目标值"
        />
      </div>
    </van-popup>

    <van-popup v-model:show="showCarbsTarget" position="bottom">
      <div class="popup-content">
        <van-nav-bar title="碳水化合物目标" @click-right="saveCarbsTarget">
          <template #right>保存</template>
        </van-nav-bar>
        <van-field
          v-model="tempCarbsTarget"
          type="number"
          label="每日碳水化合物目标(g)"
          placeholder="请输入目标值"
        />
      </div>
    </van-popup>

    <van-popup v-model:show="showFatTarget" position="bottom">
      <div class="popup-content">
        <van-nav-bar title="脂肪目标" @click-right="saveFatTarget">
          <template #right>保存</template>
        </van-nav-bar>
        <van-field
          v-model="tempFatTarget"
          type="number"
          label="每日脂肪目标(g)"
          placeholder="请输入目标值"
        />
      </div>
    </van-popup>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { showToast, showConfirmDialog } from 'vant'
import type { UserProfile } from '@/types'

const userStore = useUserStore()
const foodStore = useFoodStore()

const activeTabbar = ref(3)

// 弹窗状态
const showUserInfo = ref(false)
const showCalorieTarget = ref(false)
const showProteinTarget = ref(false)
const showCarbsTarget = ref(false)
const showFatTarget = ref(false)

// 临时数据
const tempProfile = reactive<UserProfile>({ ...userStore.profile })
const tempCalorieTarget = ref(userStore.profile.daily_calorie_target)
const tempProteinTarget = ref(userStore.profile.daily_protein_target)
const tempCarbsTarget = ref(userStore.profile.daily_carbs_target)
const tempFatTarget = ref(userStore.profile.daily_fat_target)

const userProfile = computed(() => userStore.profile)

// 保存用户信息
const saveUserInfo = () => {
  userStore.updateProfile(tempProfile)
  userStore.calculateDailyTargets()
  showUserInfo.value = false
  showToast('用户信息已保存')
}

// 保存目标设置
const saveCalorieTarget = () => {
  userStore.updateProfile({ daily_calorie_target: Number(tempCalorieTarget.value) })
  showCalorieTarget.value = false
  showToast('大卡目标已保存')
}

const saveProteinTarget = () => {
  userStore.updateProfile({ daily_protein_target: Number(tempProteinTarget.value) })
  showProteinTarget.value = false
  showToast('蛋白质目标已保存')
}

const saveCarbsTarget = () => {
  userStore.updateProfile({ daily_carbs_target: Number(tempCarbsTarget.value) })
  showCarbsTarget.value = false
  showToast('碳水化合物目标已保存')
}

const saveFatTarget = () => {
  userStore.updateProfile({ daily_fat_target: Number(tempFatTarget.value) })
  showFatTarget.value = false
  showToast('脂肪目标已保存')
}

// 导出数据
const exportData = () => {
  const data = {
    profile: userStore.profile,
    foodRecords: foodStore.foodRecords
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `calorie-tracker-data-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
  showToast('数据导出成功')
}

// 清除所有数据
const clearAllData = async () => {
  try {
    await showConfirmDialog({
      title: '清除数据',
      message: '确定要清除所有数据吗？此操作不可恢复！'
    })
    
    localStorage.removeItem('userProfile')
    localStorage.removeItem('foodRecords')
    
    // 重置store
    foodStore.foodRecords = []
    
    showToast('数据已清除')
  } catch {
    // 用户取消
  }
}


onMounted(() => {
  // 同步临时数据
  Object.assign(tempProfile, userStore.profile)
  tempCalorieTarget.value = userStore.profile.daily_calorie_target
  tempProteinTarget.value = userStore.profile.daily_protein_target
  tempCarbsTarget.value = userStore.profile.daily_carbs_target
  tempFatTarget.value = userStore.profile.daily_fat_target
})
</script>

<style scoped>
.settings-view {
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.popup-content {
  padding: 0;
}

.popup-content .van-cell-group {
  margin: 20px;
}

/* 大卡目标输入框特殊样式 */
.calorie-input-field {
  background-color: #fff7e6;
  border: 2px solid #ff9500;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 149, 0, 0.15);
  margin: 20px;
}

.calorie-input-field :deep(.van-field__control) {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b35;
  text-align: center;
}

.calorie-input-field :deep(.van-field__label) {
  font-weight: 600;
  color: #ff6b35;
}

.input-unit {
  font-size: 14px;
  font-weight: 600;
  color: #ff9500;
  background-color: #fff2e6;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ff9500;
}
</style>