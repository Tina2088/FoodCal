import { defineStore } from 'pinia'
import type { UserProfile } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {
      id: '1',
      name: '用户',
      age: 25,
      weight: 65,
      height: 170,
      activity_level: 'moderate',
      goal: 'maintain',
      daily_calorie_target: 1500,
      daily_protein_target: 150,
      daily_carbs_target: 250,
      daily_fat_target: 67
    } as UserProfile
  }),

  actions: {
    updateProfile(newProfile: Partial<UserProfile>) {
      this.profile = { ...this.profile, ...newProfile }
      this.saveToStorage()
    },

    loadFromStorage() {
      const stored = localStorage.getItem('userProfile')
      if (stored) {
        this.profile = JSON.parse(stored)
      }
    },

    saveToStorage() {
      localStorage.setItem('userProfile', JSON.stringify(this.profile))
    },

    calculateDailyTargets() {
      // 基础代谢率计算 (Harris-Benedict 公式)
      const bmr = this.profile.age < 30 
        ? 88.362 + (13.397 * this.profile.weight) + (4.799 * this.profile.height) - (5.677 * this.profile.age)
        : 88.362 + (13.397 * this.profile.weight) + (4.799 * this.profile.height) - (5.677 * this.profile.age)
      
      // 活动因子
      const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      }
      
      // 目标调整
      const goalFactors = {
        lose: 0.85,
        maintain: 1.0,
        gain: 1.15
      }
      
      const dailyCalories = bmr * activityFactors[this.profile.activity_level] * goalFactors[this.profile.goal]
      
      this.profile.daily_calorie_target = Math.round(dailyCalories)
      this.profile.daily_protein_target = Math.round(this.profile.weight * 1.8) // 1.8g/kg
      this.profile.daily_carbs_target = Math.round(dailyCalories * 0.5 / 4) // 50%大卡来自碳水
      this.profile.daily_fat_target = Math.round(dailyCalories * 0.3 / 9) // 30%大卡来自脂肪
      
      this.saveToStorage()
    }
  }
})