<template>
  <div class="food-scan-view">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="Tina卡路里助手" 
      left-text="返回" 
      left-arrow 
      @click-left="$router.back()"
    />

    <!-- 扫描结果展示 -->
    <div v-if="scanResult" class="scan-result">
      <div class="result-header">
        <h3>识别结果 ({{ scanResult.length }}项)</h3>
        <p class="tip">点击食物项可以选中/取消，调整数量后确认添加</p>
      </div>

      <van-cell-group inset>
        <van-cell 
          v-for="food in scanResult" 
          :key="food.id"
          :title="food.name"
          :label="getFoodLabel(food)"
          clickable
          @click="selectFood(food)"
          :class="{ 'selected': isSelected(food.id) }"
        >
          <template #icon>
            <van-icon 
              :name="isSelected(food.id) ? 'checked' : 'circle'" 
              :color="isSelected(food.id) ? '#1989fa' : '#c8c9cc'"
            />
          </template>
          
          <template #extra>
            <van-button 
              size="mini" 
              type="default" 
              @click.stop="replaceFoodItem(food)"
            >
              替换
            </van-button>
          </template>
          
          <template #right-icon>
            <div class="food-info">
              <div class="nutrition-info">
                <div class="calories">{{ Math.round(food.calories * food.quantity) }}大卡</div>
                <div class="macros">
                  蛋白{{ Math.round(food.protein * food.quantity) }}g 
                  碳水{{ Math.round(food.carbs * food.quantity) }}g 
                  脂肪{{ Math.round(food.fat * food.quantity) }}g
                </div>
                <div class="weight-info">
                  {{ getWeightDisplay(food.name, food.quantity, food) }}
                </div>
              </div>
              <van-stepper 
                v-model="food.quantity" 
                :min="0.1" 
                :step="getStepSize(food.name)"
                :disabled="!isSelected(food.id)"
                @change="updateFoodQuantity(food, $event)"
                button-size="22px"
                input-width="50px"
              />
            </div>
          </template>
        </van-cell>
      </van-cell-group>


      <!-- 手动添加更多食物 -->
      <div class="add-more">
        <van-button 
          type="default" 
          size="small" 
          icon="plus"
          @click="showAddMore = true"
        >
          添加其他食物
        </van-button>
      </div>

      <!-- 营养总计 -->
      <div class="nutrition-summary" v-if="selectedFoods.length">
        <van-cell-group inset>
          <van-cell title="营养总计">
            <template #label>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="value">{{ totalNutrition.calories }}</span>
                  <span class="unit">大卡</span>
                </div>
                <div class="summary-item">
                  <span class="value">{{ totalNutrition.protein }}</span>
                  <span class="unit">蛋白质(g)</span>
                </div>
                <div class="summary-item">
                  <span class="value">{{ totalNutrition.carbs }}</span>
                  <span class="unit">碳水(g)</span>
                </div>
                <div class="summary-item">
                  <span class="value">{{ totalNutrition.fat }}</span>
                  <span class="unit">脂肪(g)</span>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>



      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button 
          type="warning" 
          size="large" 
          @click="confirmFoodDirect"
          :disabled="!selectedFoods.length"
          class="confirm-button"
        >
          确认添加 ({{ selectedFoods.length }}项)
        </van-button>
        <van-button 
          type="default" 
          size="large" 
          @click="retryScanning"
        >
          重新识别
        </van-button>
      </div>
    </div>

    <!-- 相机/上传界面 -->
    <div v-else class="camera-section">
      <!-- 预览图片 -->
      <div v-if="previewImage" class="image-preview">
        <img :src="previewImage" alt="预览" />
        <van-loading v-if="isScanning" color="#1989fa" />
      </div>

      <!-- 使用指导 -->
      <div v-else class="usage-guide">
      
        <!-- 拍照/上传按钮 -->
        <div class="upload-section">
        <van-uploader
          v-model="fileList"
          accept="image/*"
          :max-count="1"
          :after-read="handleImageUpload"
          :show-upload="!isScanning"
        >
          <van-button 
            icon="photograph" 
            type="primary" 
            size="large"
            :loading="isScanning"
            class="photo-button"
          >
            {{ isScanning ? '识别中...' : '拍照识别' }}
          </van-button>
        </van-uploader>
        
        <div class="upload-tips">
          <p>📸 拍照建议：</p>
          <ul>
            <li>• 光线充足，食物清晰可见</li>
            <li>• 尽量平拍，避免倾斜角度</li>
            <li>• 食物分开摆放，便于识别</li>
            <li>• 如识别错误，可点击"替换"按钮纠正</li>
          </ul>
        </div>
      </div>

      <!-- 手动搜索 -->
      <div class="manual-search">
        <van-divider>或者</van-divider>
        <van-search
          v-model="searchKeyword"
          placeholder="手动搜索食物"
          @search="searchFood"
          @clear="clearSearch"
        />
        
        <!-- 提示文字 -->
        <div class="search-tip">
          可输入食物名称，查询卡路里
        </div>
        
        <!-- 搜索结果 -->
        <van-cell-group v-if="searchResults.length" inset>
          <van-cell 
            v-for="food in searchResults" 
            :key="food.id"
            :title="food.name"
            :label="`${food.calories}大卡/100g`"
            clickable
            @click="addManualFood(food)"
          />
        </van-cell-group>
        </div>
      </div>
    </div>

    <!-- 添加更多食物的弹窗 -->
    <van-popup 
      v-model:show="showAddMore" 
      position="bottom" 
      :style="{ height: '60%' }"
    >
      <div class="popup-content">
        <van-nav-bar title="添加更多食物" @click-right="showAddMore = false">
          <template #right>完成</template>
        </van-nav-bar>
        
        <van-search
          v-model="searchKeyword"
          placeholder="搜索食物名称"
          @search="searchFood"
          @clear="clearSearch"
        />
        
        <!-- 提示文字 -->
        <div class="search-tip">
          可输入食物名称，查询卡路里
        </div>
        
        <!-- 搜索结果 -->
        <van-cell-group v-if="searchResults.length" inset>
          <van-cell 
            v-for="food in searchResults" 
            :key="food.id"
            :title="food.name"
            :label="`${food.calories}大卡/100g`"
            clickable
            @click="addFoodToScanResult(food)"
          />
        </van-cell-group>
      </div>
    </van-popup>

    <!-- 食物替换弹窗 -->
    <van-popup 
      v-model:show="showReplaceFood" 
      position="bottom" 
      :style="{ height: '70%' }"
    >
      <div class="popup-content">
        <van-nav-bar :title="`替换 ${replacingFood?.name || ''}`" @click-right="showReplaceFood = false">
          <template #right>取消</template>
        </van-nav-bar>
        
        <div class="replacement-tip">
          <van-notice-bar 
            color="#1989fa" 
            background="#ecf9ff" 
            left-icon="info-o"
          >
            如果AI识别错误，请选择正确的食物进行替换
          </van-notice-bar>
        </div>
        
        <van-search
          v-model="replaceSearchKeyword"
          placeholder="搜索正确的食物名称"
          @search="searchReplaceFood"
          @clear="clearReplaceSearch"
        />
        
        <!-- 食物分类 -->
        <van-tabs v-model:active="replaceCategory" sticky>
          <van-tab title="全部" name="all">
            <FoodCategoryList 
              :foods="allFoods" 
              @select="confirmReplaceFood" 
            />
          </van-tab>
          <van-tab title="肉类" name="protein">
            <FoodCategoryList 
              :foods="proteinFoods" 
              @select="confirmReplaceFood" 
            />
          </van-tab>
          <van-tab title="蔬菜" name="vegetable">
            <FoodCategoryList 
              :foods="vegetableFoods" 
              @select="confirmReplaceFood" 
            />
          </van-tab>
          <van-tab title="主食" name="carbs">
            <FoodCategoryList 
              :foods="carbsFoods" 
              @select="confirmReplaceFood" 
            />
          </van-tab>
          <van-tab title="豆类" name="beans">
            <FoodCategoryList 
              :foods="beansFoods" 
              @select="confirmReplaceFood" 
            />
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useFoodStore } from '@/stores/foodStore'
import { recognizeFood, searchFoodByName, getPopularFoods } from '@/api/foodRecognition'
import type { FoodItem } from '@/types'
import { showToast, showConfirmDialog, showDialog } from 'vant'
import { useRouter } from 'vue-router'
import FoodCategoryList from '@/components/FoodCategoryList.vue'

const router = useRouter()
const foodStore = useFoodStore()

// 状态管理
const fileList = ref([])
const previewImage = ref('')
const isScanning = ref(false)
const scanResult = ref<FoodItem[] | null>(null)
const selectedFoods = ref<FoodItem[]>([])
const searchKeyword = ref('')
const searchResults = ref<FoodItem[]>([])
const showAddMore = ref(false)
const showReplaceFood = ref(false)
const pendingFoods = ref<FoodItem[]>([])
const replacingFood = ref<FoodItem | null>(null)
const replaceSearchKeyword = ref('')
const replaceCategory = ref('all')


// 计算总营养
const totalNutrition = computed(() => {
  return selectedFoods.value.reduce(
    (total, food) => ({
      calories: total.calories + Math.round(food.calories * food.quantity),
      protein: total.protein + Math.round(food.protein * food.quantity),
      carbs: total.carbs + Math.round(food.carbs * food.quantity),
      fat: total.fat + Math.round(food.fat * food.quantity)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
})


// 检查食物是否被选中
const isSelected = (foodId: string) => {
  return selectedFoods.value.some(food => food.id === foodId)
}

// 获取食物标签信息
const getFoodLabel = (food: FoodItem) => {
  const confidence = `置信度: ${Math.round(food.confidence * 100)}%`
  const aiWeight = food.aiWeight ? `AI估算: ${food.aiWeight}g` : ''
  const serving = food.serving_size
  
  if (aiWeight) {
    return `${confidence} · ${aiWeight} · ${serving}`
  } else {
    return `${confidence} · ${serving}`
  }
}

// 食物分类
const allFoods = computed(() => {
  return getPopularFoods().concat(searchFoodByName('').slice(0, 20))
})

const proteinFoods = computed(() => {
  const proteins = ['鸡胸肉', '鸡腿肉', '牛肉', '瘦猪肉', '鱼肉', '虾', '白煮蛋', '水煮蛋', '鸡蛋']
  return proteins.map(name => searchFoodByName(name)[0]).filter(Boolean)
})

const vegetableFoods = computed(() => {
  const vegetables = ['西兰花', '胡萝卜', '菠菜', '白菜', '青椒', '番茄', '黄瓜', '小番茄']
  return vegetables.map(name => searchFoodByName(name)[0]).filter(Boolean)
})

const carbsFoods = computed(() => {
  const carbs = ['米饭', '大米', '面条', '面包', '土豆', '红薯', '紫薯', '粟米', '玉米']
  return carbs.map(name => searchFoodByName(name)[0]).filter(Boolean)
})

const beansFoods = computed(() => {
  const beans = ['豆腐', '黄豆', '黑豆', '绿豆', '红豆', '芸豆']
  return beans.map(name => searchFoodByName(name)[0]).filter(Boolean)
})

// 根据食物类型获取合适的调整步长
const getStepSize = (foodName: string): number => {
  // 小份量食物用小步长，大份量食物用大步长
  const smallPortionFoods = ['白煮蛋', '水煮蛋', '鸡蛋', '小番茄']
  const mediumPortionFoods = ['虾', '胡萝卜', '青椒', '黄豆', '黑豆', '绿豆', '红豆']
  const largePortionFoods = ['西兰花', '米饭', '土豆', '牛奶']
  
  if (smallPortionFoods.includes(foodName)) {
    return 0.1 // 10g步长
  } else if (mediumPortionFoods.includes(foodName)) {
    return 0.2 // 20g步长
  } else if (largePortionFoods.includes(foodName)) {
    return 0.5 // 50g步长
  } else {
    return 0.2 // 默认20g步长
  }
}

// 获取重量显示文本，提供直观的参考
const getWeightDisplay = (foodName: string, quantity: number, food?: FoodItem): string => {
  const weight = Math.round(quantity * 100)
  
  // 提供直观的重量参考
  const references: Record<string, string> = {
    '白煮蛋': weight <= 50 ? '约1个' : weight <= 100 ? '约2个' : `约${Math.round(weight/50)}个`,
    '水煮蛋': weight <= 50 ? '约1个' : weight <= 100 ? '约2个' : `约${Math.round(weight/50)}个`,
    '鸡蛋': weight <= 50 ? '约1个' : weight <= 100 ? '约2个' : `约${Math.round(weight/50)}个`,
    '小番茄': weight <= 20 ? '约1个' : weight <= 40 ? '约2个' : `约${Math.round(weight/20)}个`,
    '番茄': weight <= 100 ? '约半个' : weight <= 200 ? '约1个' : `约${Math.round(weight/200)}个`,
    '土豆': weight <= 100 ? '约半个' : weight <= 200 ? '约1个' : `约${Math.round(weight/200)}个`,
    '米饭': weight <= 100 ? '小半碗' : weight <= 150 ? '约1碗' : weight <= 250 ? '1碗多' : '大碗',
    '西兰花': weight <= 100 ? '小份' : weight <= 150 ? '中份' : '大份',
    '香蕉': weight <= 110 ? '约1根' : weight <= 220 ? '约2根' : `约${Math.round(weight/110)}根`,
    '苹果': weight <= 150 ? '约半个' : weight <= 300 ? '约1个' : `约${Math.round(weight/175)}个`,
    '玉米': weight <= 80 ? '小根' : weight <= 150 ? '中根' : '大根',
    '牛奶': `${weight}ml`
  }
  
  const reference = references[foodName]
  let result = reference ? `${weight}g (${reference})` : `${weight}g`
  
  // 如果有AI估算信息，添加AI标记
  if (food?.aiWeight && food.aiWeight !== weight) {
    result += ` [AI: ${food.aiWeight}g]`
  }
  
  return result
}


// 处理图片上传
const handleImageUpload = async (file: any) => {
  previewImage.value = file.content
  isScanning.value = true
  
  try {
    const response = await recognizeFood(file.file)
    if (response.success) {
      scanResult.value = response.data.foods
      selectedFoods.value = [...response.data.foods]
      showToast('AI识别成功！')
    } else {
      showToast('识别失败，请重试')
    }
  } catch (error: any) {
    console.error('Recognition error:', error)
    
    if (error.message.includes('API密钥')) {
      showToast('请先配置API密钥')
    } else if (error.message.includes('API请求失败')) {
      showToast('网络连接失败，使用回退识别')
    } else {
      showToast('AI识别失败，使用回退方案')
    }
  } finally {
    isScanning.value = false
  }
}

// 选择食物
const selectFood = (food: FoodItem) => {
  const index = selectedFoods.value.findIndex(f => f.id === food.id)
  if (index > -1) {
    selectedFoods.value.splice(index, 1)
    console.log(`取消选择食物: ${food.name}`)
  } else {
    selectedFoods.value.push(food)
    console.log(`选择食物: ${food.name}`)
  }
  console.log('当前选中食物数量:', selectedFoods.value.length)
}

// 更新食物数量
const updateFoodQuantity = (food: FoodItem, quantity: number) => {
  food.quantity = quantity
}


// 直接确认添加食物
const confirmFoodDirect = () => {
  console.log('=== 点击确认按钮 ===')
  console.log('选中食物数量:', selectedFoods.value.length)
  console.log('选中食物详情:', selectedFoods.value)
  console.log('按钮是否禁用:', selectedFoods.value.length === 0)
  
  try {
    if (selectedFoods.value.length === 0) {
      console.log('没有选中食物，显示提示')
      showToast('请选择要添加的食物')
      return
    }
    
    console.log('开始添加食物到foodStore')
    
    // 为这次识别生成唯一的会话ID
    const scanSessionId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('生成扫描会话ID:', scanSessionId)
    
    selectedFoods.value.forEach((food, index) => {
      console.log(`添加第${index + 1}个食物:`, food.name, '数量:', food.quantity)
      // 为同一次识别的所有食物分配相同的会话ID
      foodStore.addFoodRecord(food, 'snack', '', scanSessionId)
    })
    
    console.log('所有食物添加完成，显示成功弹窗')
    
    // 显示成功弹窗，点击返回首页
    showDialog({
      title: '添加成功！',
      message: '点击确定返回首页查看记录',
      confirmButtonText: '返回首页',
      confirmButtonColor: '#ff9500'
    }).then(() => {
      console.log('用户点击返回首页')
      router.push('/')
    }).catch(error => {
      console.error('Dialog被取消或出错:', error)
    })
    
  } catch (error) {
    console.error('添加食物过程中出错:', error)
    if (error instanceof Error && error.message.includes('存储空间不足')) {
      showDialog({
        title: '存储空间不足',
        message: '历史数据过多，建议到设置页面清理数据或已自动清理30天前的记录',
        confirmButtonText: '前往设置',
        confirmButtonColor: '#ff9500'
      }).then(() => {
        router.push('/settings')
      }).catch(() => {
        // 用户取消，不做任何操作
      })
    } else {
      showToast('添加失败，请重试')
    }
  }
}


// 重新扫描
const retryScanning = () => {
  scanResult.value = null
  selectedFoods.value = []
  previewImage.value = ''
  fileList.value = []
}

// 搜索食物
const searchFood = () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }
  
  searchResults.value = searchFoodByName(searchKeyword.value)
  if (searchResults.value.length === 0) {
    showToast('未找到相关食物')
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
}

// 添加手动选择的食物
const addManualFood = (food: FoodItem) => {
  const newFood = {
    ...food,
    id: Date.now().toString() + Math.random(),
    confidence: 1.0,
    quantity: 1
  }
  foodStore.addFoodRecord(newFood, 'snack', '')
  showToast(`已添加${food.name}`)
  router.push('/')
}

// 添加食物到扫描结果
const addFoodToScanResult = (food: FoodItem) => {
  if (scanResult.value) {
    const newFood = {
      ...food,
      id: Date.now().toString() + Math.random(),
      confidence: 1.0,
      quantity: 1
    }
    scanResult.value.push(newFood)
    selectedFoods.value.push(newFood)
  }
  showToast(`已添加${food.name}`)
  showAddMore.value = false
}

// 替换食物项
const replaceFoodItem = (food: FoodItem) => {
  replacingFood.value = food
  showReplaceFood.value = true
}

// 确认替换食物
const confirmReplaceFood = (newFood: FoodItem) => {
  if (!replacingFood.value || !scanResult.value) return
  
  const oldFoodIndex = scanResult.value.findIndex(f => f.id === replacingFood.value!.id)
  const selectedIndex = selectedFoods.value.findIndex(f => f.id === replacingFood.value!.id)
  
  if (oldFoodIndex > -1) {
    // 保持原来的数量和选择状态
    const wasSelected = selectedIndex > -1
    const originalQuantity = replacingFood.value.quantity
    
    const replacementFood = {
      ...newFood,
      id: replacingFood.value.id, // 保持原ID
      quantity: originalQuantity,
      confidence: 0.95 // 手动替换的置信度设为95%
    }
    
    scanResult.value[oldFoodIndex] = replacementFood
    
    if (wasSelected) {
      selectedFoods.value[selectedIndex] = replacementFood
    }
    
    showToast(`已将 ${replacingFood.value.name} 替换为 ${newFood.name}`)
  }
  
  showReplaceFood.value = false
  replacingFood.value = null
}

// 搜索替换食物
const searchReplaceFood = () => {
  // 这里可以实现搜索逻辑
  if (replaceSearchKeyword.value.trim()) {
    const results = searchFoodByName(replaceSearchKeyword.value)
    if (results.length > 0) {
      confirmReplaceFood(results[0])
    } else {
      showToast('未找到相关食物')
    }
  }
}

// 清除替换搜索
const clearReplaceSearch = () => {
  replaceSearchKeyword.value = ''
}


// 测试API连接
const testAPIConnection = async () => {
  isScanning.value = true
  
  // 创建一个简单的测试图片（1x1像素的base64图片）
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  
  try {
    console.log('正在测试API连接...')
    showToast('正在测试API连接...')
    
    // 直接调用API
    const response = await fetch(`${import.meta.env.VITE_SILICONFLOW_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/QVQ-72B-Preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请用中文简单说"API连接成功"'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${testImageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('API测试成功:', data)
      showToast('✅ API连接正常')
    } else {
      console.error('API测试失败:', response.status, response.statusText)
      showToast(`❌ API连接失败: ${response.status}`)
    }
    
  } catch (error) {
    console.error('API测试出错:', error)
    showToast('❌ API连接出错，请检查配置')
  } finally {
    isScanning.value = false
  }
}

// 模拟健康餐识别
const simulateHealthyMeal = async () => {
  isScanning.value = true
  previewImage.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWBpeW6t+mWkOiJsuiHquS9nOilv+a1i+WbvueJhzwvdGV4dD48L3N2Zz4='
  
  // 创建一个模拟的文件对象，包含多种食物关键词
  const mockFile = {
    name: '鸡胸肉西兰花玉米白煮蛋番茄健康餐.jpg',
    type: 'image/jpeg'
  } as File
  
  try {
    const response = await recognizeFood(mockFile)
    if (response.success) {
      scanResult.value = response.data.foods
      selectedFoods.value = [...response.data.foods]
      showToast('识别成功！发现多种食物')
    }
  } catch (error) {
    showToast('识别失败，请重试')
  } finally {
    isScanning.value = false
  }
}

</script>

<style scoped>
.food-scan-view {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.scan-result {
  padding: 20px;
}

.result-header {
  margin-bottom: 20px;
  text-align: center;
}

.result-header h3 {
  color: #333;
  margin-bottom: 8px;
}

.result-header .tip {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.van-cell.selected {
  background-color: #f0f9ff;
  border-left: 3px solid #1989fa;
}

.food-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 120px;
}

.nutrition-info {
  text-align: right;
}

.calories {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.macros {
  font-size: 12px;
  color: #666;
  line-height: 1.2;
}

.weight-info {
  font-size: 11px;
  color: #1989fa;
  margin-top: 2px;
  font-weight: 500;
}


.add-more {
  text-align: center;
  margin: 15px 0;
}

.nutrition-summary {
  margin: 20px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.summary-item {
  text-align: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

.summary-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.summary-item .unit {
  font-size: 12px;
  color: #666;
}



.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.confirm-button {
  background: linear-gradient(135deg, #ff9500, #ff6b35) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3) !important;
  font-weight: 600 !important;
}

.camera-section {
  padding: 20px;
}

.image-preview {
  position: relative;
  margin-bottom: 20px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.usage-guide {
  margin-bottom: 20px;
}

.upload-section {
  text-align: center;
  margin-bottom: 30px;
}

.upload-tips {
  margin-top: 20px;
  padding: 15px;
  background-color: #f7f8fa;
  border-radius: 8px;
  text-align: left;
}

.upload-tips p {
  margin: 0 0 10px 0;
  font-weight: bold;
  color: #333;
}

.upload-tips ul {
  margin: 0;
  padding-left: 20px;
}

.upload-tips li {
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.manual-search {
  margin-top: 20px;
}

.search-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 10px 0 20px 0;
  padding: 0 20px;
}

/* 拍照按钮样式 */
.photo-button {
  background: linear-gradient(135deg, #ff9500, #ff6b35) !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3) !important;
  font-weight: 600 !important;
  min-height: 50px !important;
  min-width: 160px !important;
  padding: 12px 24px !important;
  transition: all 0.3s ease !important;
}

.photo-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(255, 149, 0, 0.4) !important;
}

.photo-button:active {
  transform: translateY(0) !important;
}


.popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-content .van-search {
  margin: 10px;
}

</style>