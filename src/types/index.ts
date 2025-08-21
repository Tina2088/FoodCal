// 食物识别结果
export interface FoodItem {
  id: string
  name: string
  confidence: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  serving_size: string
  quantity: number
  aiWeight?: number // AI估算的原始重量
  aiCount?: number  // AI识别的食物数量
  aiUnitWeight?: number // AI估算的单个重量
}

// 食物记录
export interface FoodRecord {
  id: string
  food_item: FoodItem
  timestamp: Date
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  image_url?: string
  scan_session_id?: string // 同一次扫描识别的会话ID
}

// 用户信息
export interface UserProfile {
  id: string
  name: string
  age: number
  weight: number
  height: number
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose' | 'maintain' | 'gain'
  daily_calorie_target: number
  daily_protein_target: number
  daily_carbs_target: number
  daily_fat_target: number
}

// 每日汇总
export interface DailySummary {
  date: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  remaining_calories: number
  food_records: FoodRecord[]
}

// 图像识别API响应
export interface FoodRecognitionResponse {
  success: boolean
  data: {
    foods: FoodItem[]
    image_id: string
  }
  error?: string
}