import { defineStore } from 'pinia'
import type { FoodRecord, DailySummary, FoodItem } from '@/types'

export const useFoodStore = defineStore('food', {
  state: () => ({
    foodRecords: [] as FoodRecord[],
    currentScan: null as FoodItem[] | null,
    isLoading: false
  }),

  getters: {
    getDailySummary: (state) => (date: string): DailySummary => {
      const dayRecords = state.foodRecords.filter(record => {
        // 使用本地时间格式化日期，避免时区问题
        const recordDate = record.timestamp
        const year = recordDate.getFullYear()
        const month = String(recordDate.getMonth() + 1).padStart(2, '0')
        const day = String(recordDate.getDate()).padStart(2, '0')
        const localDateStr = `${year}-${month}-${day}`
        return localDateStr === date
      })
      
      const totals = dayRecords.reduce(
        (acc, record) => ({
          calories: acc.calories + record.food_item.calories * record.food_item.quantity,
          protein: acc.protein + record.food_item.protein * record.food_item.quantity,
          carbs: acc.carbs + record.food_item.carbs * record.food_item.quantity,
          fat: acc.fat + record.food_item.fat * record.food_item.quantity
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )

      return {
        date,
        total_calories: totals.calories,
        total_protein: totals.protein,
        total_carbs: totals.carbs,
        total_fat: totals.fat,
        remaining_calories: 2000 - totals.calories, // 这里应该从用户设置获取
        food_records: dayRecords
      }
    },

    getTodaySummary(): DailySummary {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const todayStr = `${year}-${month}-${day}`
      return this.getDailySummary(todayStr)
    },

    getYesterdaySummary(): DailySummary {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const year = yesterday.getFullYear()
      const month = String(yesterday.getMonth() + 1).padStart(2, '0')
      const day = String(yesterday.getDate()).padStart(2, '0')
      const yesterdayStr = `${year}-${month}-${day}`
      return this.getDailySummary(yesterdayStr)
    }
  },

  actions: {
    addFoodRecord(foodItem: FoodItem, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', imageUrl?: string, scanSessionId?: string) {
      const record: FoodRecord = {
        id: Date.now().toString(),
        food_item: foodItem,
        timestamp: new Date(),
        meal_type: mealType,
        image_url: imageUrl,
        scan_session_id: scanSessionId
      }
      
      this.foodRecords.unshift(record)
      this.saveToStorage()
    },

    removeFoodRecord(recordId: string) {
      this.foodRecords = this.foodRecords.filter(record => record.id !== recordId)
      this.saveToStorage()
    },

    updateFoodRecord(recordId: string, updates: Partial<FoodRecord>) {
      const index = this.foodRecords.findIndex(record => record.id === recordId)
      if (index !== -1) {
        this.foodRecords[index] = { ...this.foodRecords[index], ...updates }
        this.saveToStorage()
      }
    },

    setScanResult(foods: FoodItem[]) {
      this.currentScan = foods
    },

    clearScanResult() {
      this.currentScan = null
    },

    loadFromStorage() {
      const stored = localStorage.getItem('foodRecords')
      if (stored) {
        const records = JSON.parse(stored)
        // 兼容新旧数据格式，将时间戳转换回Date对象
        this.foodRecords = records.map((record: any) => ({
          ...record,
          timestamp: typeof record.timestamp === 'number' 
            ? new Date(record.timestamp) 
            : new Date(record.timestamp)
        }))
        
        console.log(`加载了${this.foodRecords.length}条食物记录`)
      }
    },

    saveToStorage() {
      try {
        // 优化存储：移除不必要的字段和压缩数据
        const optimizedRecords = this.foodRecords.map(record => ({
          id: record.id,
          food_item: {
            id: record.food_item.id,
            name: record.food_item.name,
            calories: Math.round(record.food_item.calories * 100) / 100, // 保留2位小数
            protein: Math.round(record.food_item.protein * 100) / 100,
            carbs: Math.round(record.food_item.carbs * 100) / 100,
            fat: Math.round(record.food_item.fat * 100) / 100,
            quantity: Math.round(record.food_item.quantity * 100) / 100
            // 移除其他非必要字段如confidence, aiWeight等
          },
          timestamp: record.timestamp.getTime(), // 存储为时间戳数字，而不是Date对象
          meal_type: record.meal_type,
          // 图片URL通常很大，如果不是必须显示可以考虑移除
          ...(record.image_url ? { image_url: record.image_url } : {}),
          // 保存会话ID用于分组显示
          ...(record.scan_session_id ? { scan_session_id: record.scan_session_id } : {})
        }))
        
        const data = JSON.stringify(optimizedRecords)
        console.log(`存储数据大小: ${(data.length / 1024).toFixed(2)}KB`)
        localStorage.setItem('foodRecords', data)
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage空间已满，开始清理旧数据')
          this.cleanOldRecords()
          try {
            // 清理后重新尝试保存（使用优化后的格式）
            const optimizedRecords = this.foodRecords.map(record => ({
              id: record.id,
              food_item: {
                id: record.food_item.id,
                name: record.food_item.name,
                calories: Math.round(record.food_item.calories * 100) / 100,
                protein: Math.round(record.food_item.protein * 100) / 100,
                carbs: Math.round(record.food_item.carbs * 100) / 100,
                fat: Math.round(record.food_item.fat * 100) / 100,
                quantity: Math.round(record.food_item.quantity * 100) / 100
              },
              timestamp: record.timestamp.getTime(),
              meal_type: record.meal_type,
              ...(record.image_url ? { image_url: record.image_url } : {}),
              ...(record.scan_session_id ? { scan_session_id: record.scan_session_id } : {})
            }))
            const data = JSON.stringify(optimizedRecords)
            localStorage.setItem('foodRecords', data)
          } catch (retryError) {
            console.warn('清理旧数据后仍无法保存，尝试激进清理')
            try {
              // 激进清理：移除所有图片数据
              this.aggressiveClean()
              const optimizedRecords = this.foodRecords.map(record => ({
                id: record.id,
                food_item: {
                  id: record.food_item.id,
                  name: record.food_item.name,
                  calories: Math.round(record.food_item.calories * 100) / 100,
                  protein: Math.round(record.food_item.protein * 100) / 100,
                  carbs: Math.round(record.food_item.carbs * 100) / 100,
                  fat: Math.round(record.food_item.fat * 100) / 100,
                  quantity: Math.round(record.food_item.quantity * 100) / 100
                },
                timestamp: record.timestamp.getTime(),
                meal_type: record.meal_type,
                // 不再保存图片URL但保留会话ID
                ...(record.scan_session_id ? { scan_session_id: record.scan_session_id } : {})
              }))
              const data = JSON.stringify(optimizedRecords)
              localStorage.setItem('foodRecords', data)
              console.log('激进清理后保存成功')
            } catch (finalError) {
              console.error('激进清理后仍无法保存数据:', finalError)
              throw new Error('存储空间严重不足，请手动清除历史数据')
            }
          }
        } else {
          throw error
        }
      }
    },

    // 清理30天前的记录
    cleanOldRecords() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const originalCount = this.foodRecords.length
      this.foodRecords = this.foodRecords.filter(record => 
        record.timestamp >= thirtyDaysAgo
      )
      
      const cleanedCount = originalCount - this.foodRecords.length
      console.log(`清理了${cleanedCount}条30天前的记录`)
      
      // 如果清理后记录还是很多，进一步清理只保留最近15天
      if (this.foodRecords.length > 50) {
        const fifteenDaysAgo = new Date()
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
        
        const beforeSecondClean = this.foodRecords.length
        this.foodRecords = this.foodRecords.filter(record => 
          record.timestamp >= fifteenDaysAgo
        )
        
        const secondCleanCount = beforeSecondClean - this.foodRecords.length
        console.log(`进一步清理了${secondCleanCount}条15天前的记录`)
      }
    },

    // 激进清理：移除所有图片URL以节省空间
    aggressiveClean() {
      this.foodRecords.forEach(record => {
        if (record.image_url) {
          delete record.image_url
        }
      })
      console.log('已移除所有图片数据以节省空间')
    }
  }
})