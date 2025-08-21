import type { FoodRecognitionResponse, FoodItem } from '@/types'

// AI模型配置
const AI_PROVIDER = import.meta.env.VITE_AI_MODEL_PROVIDER || 'siliconflow'

// 硅基流动配置
const SILICONFLOW_API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY
const SILICONFLOW_BASE_URL = import.meta.env.VITE_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'

// Gemini配置
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// OpenAI配置
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// 扩展的食物数据库
const FOOD_DATABASE: Record<string, Omit<FoodItem, 'id' | 'confidence' | 'quantity'>> = {
  // 主食类
  '米饭': {
    name: '米饭',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    serving_size: '100g'
  },
  '面条': {
    name: '面条',
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    fiber: 1.8,
    serving_size: '100g'
  },
  '面包': {
    name: '面包',
    calories: 265,
    protein: 9,
    carbs: 49,
    fat: 3.2,
    fiber: 2.7,
    serving_size: '100g'
  },
  '土豆': {
    name: '土豆',
    calories: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    fiber: 2.2,
    serving_size: '100g'
  },
  '红薯': {
    name: '红薯',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    serving_size: '100g'
  },
  
  // 肉类
  '鸡胸肉': {
    name: '鸡胸肉',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    serving_size: '100g'
  },
  '鸡腿肉': {
    name: '鸡腿肉',
    calories: 209,
    protein: 18.4,
    carbs: 0,
    fat: 15.3,
    fiber: 0,
    serving_size: '100g'
  },
  '牛肉': {
    name: '牛肉',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 17,
    fiber: 0,
    serving_size: '100g'
  },
  '瘦猪肉': {
    name: '瘦猪肉',
    calories: 143,
    protein: 20.9,
    carbs: 0,
    fat: 6.2,
    fiber: 0,
    serving_size: '100g'
  },
  '鱼肉': {
    name: '鱼肉',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    serving_size: '100g'
  },
  '虾': {
    name: '虾',
    calories: 99,
    protein: 18,
    carbs: 0.9,
    fat: 1.4,
    fiber: 0,
    serving_size: '100g'
  },
  
  // 豆类及豆制品
  '豆腐': {
    name: '豆腐',
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    fiber: 0.4,
    serving_size: '100g'
  },
  '黄豆': {
    name: '黄豆',
    calories: 446,
    protein: 36,
    carbs: 30,
    fat: 20,
    fiber: 9.3,
    serving_size: '100g'
  },
  '黑豆': {
    name: '黑豆',
    calories: 341,
    protein: 21.6,
    carbs: 33.6,
    fat: 15.9,
    fiber: 10.2,
    serving_size: '100g'
  },
  '绿豆': {
    name: '绿豆',
    calories: 347,
    protein: 21.6,
    carbs: 62,
    fat: 0.8,
    fiber: 6.4,
    serving_size: '100g'
  },
  '红豆': {
    name: '红豆',
    calories: 324,
    protein: 20.3,
    carbs: 58.7,
    fat: 0.6,
    fiber: 7.7,
    serving_size: '100g'
  },
  
  // 蔬菜类
  '西兰花': {
    name: '西兰花',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    serving_size: '100g'
  },
  '胡萝卜': {
    name: '胡萝卜',
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    fiber: 2.8,
    serving_size: '100g'
  },
  '菠菜': {
    name: '菠菜',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    serving_size: '100g'
  },
  '白菜': {
    name: '白菜',
    calories: 16,
    protein: 1.5,
    carbs: 3.2,
    fat: 0.2,
    fiber: 1,
    serving_size: '100g'
  },
  '青椒': {
    name: '青椒',
    calories: 20,
    protein: 0.9,
    carbs: 4.9,
    fat: 0.2,
    fiber: 1.7,
    serving_size: '100g'
  },
  '番茄': {
    name: '番茄',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    serving_size: '100g'
  },
  '黄瓜': {
    name: '黄瓜',
    calories: 16,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    fiber: 0.5,
    serving_size: '100g'
  },
  
  // 水果类
  '苹果': {
    name: '苹果',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    serving_size: '100g'
  },
  '香蕉': {
    name: '香蕉',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    serving_size: '100g'
  },
  '橙子': {
    name: '橙子',
    calories: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    fiber: 2.4,
    serving_size: '100g'
  },
  '葡萄': {
    name: '葡萄',
    calories: 62,
    protein: 0.6,
    carbs: 16,
    fat: 0.2,
    fiber: 0.9,
    serving_size: '100g'
  },
  
  // 蛋奶类
  '鸡蛋': {
    name: '鸡蛋',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    serving_size: '100g'
  },
  '牛奶': {
    name: '牛奶',
    calories: 42,
    protein: 3.4,
    carbs: 5,
    fat: 1,
    fiber: 0,
    serving_size: '100ml'
  },
  '酸奶': {
    name: '酸奶',
    calories: 59,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    fiber: 0,
    serving_size: '100ml'
  },
  
  // 补充常见健康食物
  '紫薯': {
    name: '紫薯',
    calories: 82,
    protein: 1.9,
    carbs: 18.4,
    fat: 0.2,
    fiber: 3.1,
    serving_size: '100g'
  },
  '大米': {
    name: '大米',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    serving_size: '100g'
  },
  '粟米': {
    name: '粟米',
    calories: 96,
    protein: 3.4,
    carbs: 19,
    fat: 1.5,
    fiber: 2.7,
    serving_size: '100g'
  },
  '芸豆': {
    name: '芸豆',
    calories: 127,
    protein: 8.7,
    carbs: 22.8,
    fat: 0.5,
    fiber: 6.4,
    serving_size: '100g'
  },
  '白煮蛋': {
    name: '白煮蛋',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    serving_size: '100g'
  },
  '水煮蛋': {
    name: '水煮蛋',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    serving_size: '100g'
  },
  '玉米': {
    name: '玉米',
    calories: 96,
    protein: 3.4,
    carbs: 19,
    fat: 1.5,
    fiber: 2.7,
    serving_size: '100g'
  },
  '小番茄': {
    name: '小番茄',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    serving_size: '100g'
  },
  '樱桃番茄': {
    name: '樱桃番茄',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    serving_size: '100g'
  },
  
  // 补充更多水果数据
  '西瓜': {
    name: '西瓜',
    calories: 30,
    protein: 0.6,
    carbs: 8,
    fat: 0.2,
    fiber: 0.4,
    serving_size: '100g'
  },
  '草莓': {
    name: '草莓',
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    fiber: 2,
    serving_size: '100g'
  },
  '猕猴桃': {
    name: '猕猴桃',
    calories: 61,
    protein: 1.1,
    carbs: 15,
    fat: 0.5,
    fiber: 3,
    serving_size: '100g'
  },
  '芒果': {
    name: '芒果',
    calories: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.4,
    fiber: 1.6,
    serving_size: '100g'
  }
}

// 健康餐常见食物组合模板 - 增强版
const HEALTHY_MEAL_PATTERNS = [
  {
    name: '经典健身餐',
    foods: ['鸡胸肉', '西兰花', '紫薯', '白煮蛋'],
    weights: [0.9, 0.95, 0.85, 0.8]
  },
  {
    name: '完整营养餐',
    foods: ['鸡胸肉', '西兰花', '玉米', '番茄', '白煮蛋'],
    weights: [0.9, 0.95, 0.9, 0.85, 0.8]
  },
  {
    name: '蔬菜蛋白餐',
    foods: ['鸡胸肉', '番茄', '黄瓜', '大米', '西兰花'],
    weights: [0.85, 0.9, 0.85, 0.75, 0.9]
  },
  {
    name: '豆类营养餐',
    foods: ['芸豆', '水煮蛋', '玉米', '西兰花', '胡萝卜'],
    weights: [0.85, 0.9, 0.9, 0.95, 0.85]
  },
  {
    name: '彩虹健康餐',
    foods: ['鸡胸肉', '胡萝卜', '西兰花', '小番茄', '紫薯', '玉米'],
    weights: [0.85, 0.9, 0.95, 0.85, 0.8, 0.9]
  },
  {
    name: '高蛋白轻食',
    foods: ['白煮蛋', '鸡胸肉', '黄瓜', '番茄', '西兰花'],
    weights: [0.95, 0.85, 0.9, 0.85, 0.9]
  },
  {
    name: '玉米蔬菜餐',
    foods: ['玉米', '西兰花', '鸡胸肉', '胡萝卜', '白煮蛋'],
    weights: [0.9, 0.95, 0.85, 0.85, 0.8]
  },
  {
    name: '均衡营养餐',
    foods: ['瘦猪肉', '土豆', '胡萝卜', '西兰花', '玉米'],
    weights: [0.8, 0.85, 0.9, 0.95, 0.9]
  },
  {
    name: '素食健康餐',
    foods: ['豆腐', '菠菜', '玉米', '红薯', '西兰花'],
    weights: [0.9, 0.85, 0.9, 0.8, 0.95]
  },
  {
    name: '海鲜蔬菜餐',
    foods: ['鱼肉', '西兰花', '红薯', '小番茄', '玉米'],
    weights: [0.9, 0.95, 0.8, 0.85, 0.9]
  }
]

// 将图片转换为base64编码
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // 提取base64数据部分（去掉data:image/...;base64,前缀）
      const base64Data = result.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 调用Gemini API进行图像识别
const callGeminiAPI = async (imageBase64: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('请先在 .env.local 文件中配置 VITE_GEMINI_API_KEY')
  }

  const prompt = `As a professional nutritionist, please analyze this food image carefully and identify all visible foods with accurate weight estimation.

**Analysis Requirements:**
1. Identify ALL visible foods in the image
2. Carefully observe the quantity, size, and portion of each food
3. Estimate weight based on these reference standards:

**Weight Reference Standards:**
- **Fruits:** Banana 1 piece ≈110g, Apple 1 piece ≈175g, Orange 1 piece ≈130g
- **Proteins:** Chicken breast palm-size ≈120g, Egg 1 piece ≈50g, Tofu 1 block ≈100g  
- **Vegetables:** Broccoli 1 floret ≈40g, Tomato 1 medium ≈125g, Carrot 1 piece ≈100g, Corn 1 piece ≈150g
- **Staples:** Rice 1 bowl ≈175g, Sweet potato 1 piece ≈200g, Purple sweet potato 1 piece ≈180g

**Common Healthy Meal Combinations:**
Healthy meals usually contain: Protein (chicken/egg) + Vegetables (broccoli/carrot) + Staples (corn/sweet potato)

**Output Requirements:**
Please return in this exact JSON format:
{
  "foods": [
    {
      "name": "Specific food name in Chinese",
      "weight": estimated_total_weight_in_grams,
      "count": number_of_items,
      "unit_weight": weight_per_item_in_grams,
      "confidence": recognition_confidence_0_to_1
    }
  ]
}

**Requirements:**
1. Use accurate Chinese food names (香蕉, 鸡胸肉, 西兰花, etc.)
2. Return standard JSON format only
3. Do not miss any food in the image
4. If uncertain about a food, set lower confidence but still identify it
5. If multiple same foods, calculate total weight correctly

Please analyze carefully and return only the JSON response.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini API返回数据:', data)
      throw new Error('Gemini API返回数据格式错误')
    }

    const aiContent = data.candidates[0].content.parts[0].text
    console.log('Gemini完整响应:', aiContent)
    
    return aiContent
  } catch (error) {
    console.error('调用Gemini API失败:', error)
    throw error
  }
}

// 调用OpenAI API进行图像识别
const callOpenAIAPI = async (imageBase64: string): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('请先在 .env.local 文件中配置 VITE_OPENAI_API_KEY')
  }

  const prompt = `You are a professional nutritionist. Analyze this food image and identify all visible foods with accurate weight estimation.

**Analysis Requirements:**
1. Identify ALL visible foods in the image
2. Carefully observe quantity, size, and portion of each food
3. Estimate weight based on standard portion sizes

**Weight Standards:**
- Fruits: Banana 1pc ≈110g, Apple 1pc ≈175g, Orange 1pc ≈130g
- Proteins: Chicken breast palm-size ≈120g, Egg 1pc ≈50g, Tofu 1 block ≈100g
- Vegetables: Broccoli 1 floret ≈40g, Tomato 1 medium ≈125g, Carrot 1pc ≈100g, Corn 1 piece ≈150g
- Staples: Rice 1 bowl ≈175g, Sweet potato 1pc ≈200g, Purple sweet potato 1pc ≈180g

**Output in JSON format:**
{
  "foods": [
    {
      "name": "Food name in Chinese",
      "weight": estimated_total_weight_in_grams,
      "count": number_of_items,
      "unit_weight": weight_per_item_in_grams,
      "confidence": recognition_confidence_0_to_1
    }
  ]
}

Requirements:
1. Use accurate Chinese food names (香蕉, 鸡胸肉, 西兰花, etc.)
2. Return standard JSON format only
3. Don't miss any food in the image
4. If uncertain, set lower confidence but still identify it
5. Calculate total weight correctly for multiple same foods`

  try {
    // 注意：直接从浏览器调用OpenAI API会遇到CORS问题
    // 生产环境建议使用服务器端代理或者使用其他模型
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('OpenAI API返回数据:', data)
      throw new Error('OpenAI API返回数据格式错误')
    }

    const aiContent = data.choices[0].message.content
    console.log('OpenAI完整响应:', aiContent)
    
    return aiContent
  } catch (error: any) {
    console.error('调用OpenAI API失败:', error)
    
    // 检查是否是CORS错误
    if (error.message?.includes('CORS') || error.name === 'TypeError') {
      throw new Error('OpenAI API调用被浏览器CORS政策阻止，建议使用Gemini或SiliconFlow模型')
    }
    
    throw error
  }
}

// 调用硅基流动API进行图像识别
const callSiliconFlowAPI = async (imageBase64: string): Promise<string> => {
  if (!SILICONFLOW_API_KEY || SILICONFLOW_API_KEY === '请在这里输入你的硅基流动API密钥') {
    throw new Error('请先在 .env.local 文件中配置 VITE_SILICONFLOW_API_KEY')
  }

  const prompt = `作为专业的食物营养师，请仔细分析这张图片中的所有食物并准确识别。

**重要说明：**
- 请逐一仔细观察图片中的每种食物
- 不要遗漏任何可见的食物
- 如果看到多个相同食物，请正确计算总数量和总重量

**识别步骤：**
1. 从左到右、从上到下扫描整张图片
2. 识别每种不同的食物类型
3. 计算每种食物的数量
4. 根据食物大小估算重量

**健康餐重量控制原则：**
⚠️ **重要：健康餐总热量应控制在400-600大卡范围内**

**重量参考标准（健康餐份量）：**
- **蛋白质类：** 鸡胸肉80-100g(130-165大卡)，鸡蛋1个50g(78大卡)，豆腐80g(61大卡)
- **蔬菜类：** 西兰花100-150g(34-51大卡)，番茄80g(14大卡)，胡萝卜60g(25大卡)
- **主食类：** 玉米80-120g(77-115大卡)，紫薯100-150g(82-123大卡)，米饭100g(130大卡)
- **水果类：** 香蕉半根50g(45大卡)，苹果半个80g(42大卡)

**健康餐组合示例：**
- 鸡胸肉100g + 西兰花150g + 玉米100g + 番茄80g = 约350大卡
- 鸡蛋1个 + 鸡胸肉80g + 西兰花120g + 紫薯100g = 约380大卡

**重量估算要求：**
1. 确保整餐总热量在400-600大卡之间
2. 蛋白质占比30-40%，蔬菜占比40-50%，主食占比20-30%
3. 如果AI估算的重量导致总热量超过600大卡，请按比例缩减所有食物重量

**输出要求：**
请严格按照以下JSON格式返回：
{
  "foods": [
    {
      "name": "具体食物名称",
      "weight": 估算总重量,
      "count": 食物个数,
      "unit_weight": 单个重量,
      "confidence": 识别置信度
    }
  ]
}

请务必：
1. 使用准确的中文食物名称
2. 返回标准JSON格式
3. 不要遗漏图片中的任何食物
4. 如果不确定某个食物，置信度设低一些但仍要识别出来`

  try {
    const response = await fetch(`${SILICONFLOW_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-VL-72B-Instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('API返回数据:', data)
      throw new Error('API返回数据格式错误')
    }

    const aiContent = data.choices[0].message.content
    console.log('AI完整响应:', aiContent)
    
    return aiContent
  } catch (error) {
    console.error('调用硅基流动API失败:', error)
    throw error
  }
}

// 解析AI识别结果
const parseAIResponse = (aiResponse: string): Array<{name: string, weight: number, confidence: number, count?: number, unit_weight?: number}> => {
  try {
    console.log('开始解析AI响应:', aiResponse.substring(0, 200) + '...')
    
    // 多种JSON提取方式
    let jsonStr = ''
    
    // 方法1: 寻找被```json包围的内容
    const codeBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1]
      console.log('使用代码块提取JSON')
    } else {
      // 方法2: 寻找第一个完整的JSON对象
      const jsonMatch = aiResponse.match(/\{[\s\S]*?\}(?=\s*$|[\s\S]*$)/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
        console.log('使用正则提取JSON')
      } else {
        throw new Error('无法找到JSON格式的响应')
      }
    }

    console.log('提取到的JSON字符串:', jsonStr)
    const parsed = JSON.parse(jsonStr)
    
    if (!parsed.foods || !Array.isArray(parsed.foods)) {
      console.error('解析后的数据结构:', parsed)
      throw new Error('AI响应格式不正确，缺少foods数组')
    }

    const validFoods = parsed.foods.filter(food => 
      food.name && 
      typeof food.weight === 'number' && 
      typeof food.confidence === 'number'
    ).map(food => {
      // 记录AI估算的详细信息
      console.log(`✅ AI识别成功: ${food.name}`, {
        总重量: food.weight + 'g',
        数量: food.count || '未知',
        单个重量: food.unit_weight ? food.unit_weight + 'g' : '未知',
        置信度: Math.round(food.confidence * 100) + '%'
      })
      
      return {
        name: food.name,
        weight: food.weight,
        confidence: food.confidence,
        count: food.count,
        unit_weight: food.unit_weight
      }
    })

    console.log(`成功解析${validFoods.length}种食物`)
    return validFoods

  } catch (error) {
    console.error('解析AI响应失败:', error)
    console.error('原始响应:', aiResponse)
    
    // 智能回退：尝试从文本中提取食物和数量信息
    const foodPatterns = [
      { pattern: /(\d+)根?\s*香蕉/g, name: '香蕉', unitWeight: 110 },
      { pattern: /(\d+)个?\s*苹果/g, name: '苹果', unitWeight: 175 },
      { pattern: /(\d+)个?\s*橙子/g, name: '橙子', unitWeight: 130 },
      { pattern: /(\d+)碗?\s*米饭/g, name: '米饭', unitWeight: 175 },
      { pattern: /(\d+)片?\s*面包/g, name: '面包', unitWeight: 30 },
      { pattern: /(\d+)个?\s*鸡蛋/g, name: '鸡蛋', unitWeight: 50 }
    ]
    
    const detectedFoods: Array<{name: string, weight: number, confidence: number}> = []
    
    for (const { pattern, name, unitWeight } of foodPatterns) {
      const matches = aiResponse.matchAll(pattern)
      for (const match of matches) {
        const count = parseInt(match[1]) || 1
        const totalWeight = count * unitWeight
        detectedFoods.push({
          name,
          weight: totalWeight,
          confidence: 0.7
        })
        console.log(`文本解析: ${name} x${count} = ${totalWeight}g`)
      }
    }
    
    if (detectedFoods.length > 0) {
      return detectedFoods
    }
    
    // 简单关键词匹配回退
    const commonFoods = ['香蕉', '苹果', '橙子', '米饭', '面包', '鸡蛋', '西兰花', '番茄', '鸡胸肉']
    const foundFoods = commonFoods.filter(food => aiResponse.includes(food))
    
    if (foundFoods.length > 0) {
      return foundFoods.map(name => {
        // 根据食物类型给出合理的默认重量
        const defaultWeights = {
          '香蕉': 110, '苹果': 175, '橙子': 130, '米饭': 175, 
          '面包': 60, '鸡蛋': 50, '西兰花': 150, '番茄': 125, '鸡胸肉': 120
        }
        return {
          name,
          weight: defaultWeights[name] || 100,
          confidence: 0.6
        }
      })
    }
    
    // 最后的回退方案
    return [{
      name: '未知食物',
      weight: 100,
      confidence: 0.3
    }]
  }
}

// 智能重量估算 - 根据食物类型返回合理的健康餐份量(以100g为基准单位)
const estimatePortionSize = (foodName: string): number => {
  // 健康餐重量估算规则(倍数，以100g为基准) - 控制总热量在合理范围
  const healthyPortionSizes: Record<string, number> = {
    // 蛋白质类 - 健康餐适中份量
    '鸡胸肉': 0.9,    // 90g (约149大卡)
    '鸡腿肉': 0.8,    // 80g (约167大卡)
    '牛肉': 0.8,      // 80g (约200大卡)
    '瘦猪肉': 0.8,    // 80g (约114大卡)
    '鱼肉': 0.9,      // 90g (约185大卡)
    '虾': 0.8,        // 80g (约79大卡)
    '白煮蛋': 0.5,    // 50g (约78大卡)
    '水煮蛋': 0.5,    // 50g (约78大卡)
    '鸡蛋': 0.5,      // 50g (约78大卡)
    '豆腐': 0.8,      // 80g (约61大卡)
    
    // 蔬菜类 - 可以多一些，热量低
    '西兰花': 1.2,    // 120g (约41大卡)
    '胡萝卜': 0.6,    // 60g (约25大卡)
    '菠菜': 0.8,      // 80g (约18大卡)
    '白菜': 1.0,      // 100g (约16大卡)
    '青椒': 0.6,      // 60g (约12大卡)
    '番茄': 0.8,      // 80g (约14大卡)
    '小番茄': 0.6,    // 60g (约11大卡)
    '黄瓜': 0.8,      // 80g (约13大卡)
    
    // 主食类 - 控制份量，避免热量过高
    '大米': 0.6,      // 60g干重 (煮熟约150g，195大卡)
    '米饭': 1.0,      // 100g (约130大卡)
    '面条': 0.6,      // 60g干重 (约200大卡)
    '面包': 0.5,      // 50g (约133大卡)
    '土豆': 1.0,      // 100g (约77大卡)
    '红薯': 1.0,      // 100g (约86大卡)
    '紫薯': 1.0,      // 100g (约82大卡)
    '玉米': 1.0,      // 100g (约96大卡)
    '粟米': 1.0,      // 100g (约96大卡)
    
    // 豆类 - 适中份量
    '黄豆': 0.2,      // 20g干重 (约89大卡)
    '黑豆': 0.2,      // 20g干重 (约68大卡)
    '绿豆': 0.2,      // 20g干重 (约69大卡)
    '红豆': 0.2,      // 20g干重 (约65大卡)
    '芸豆': 0.6,      // 60g (约76大卡)
    
    // 奶制品 - 适量
    '牛奶': 1.5,      // 150ml (约63大卡)
    '酸奶': 0.8,      // 80ml (约47大卡)
    
    // 水果类 - 控制糖分摄入
    '香蕉': 0.6,      // 60g (约53大卡) - 约半根
    '苹果': 0.8,      // 80g (约42大卡) - 约半个
    '橙子': 0.8,      // 80g (约38大卡) - 约半个
    '葡萄': 0.6,      // 60g (约37大卡)
    '西瓜': 1.0,      // 100g (约30大卡)
    '草莓': 0.8,      // 80g (约26大卡)
    '猕猴桃': 0.6,    // 60g (约37大卡)
    '芒果': 0.8       // 80g (约48大卡)
  }
  
  return healthyPortionSizes[foodName] || 0.8 // 默认80g，比原来更保守
}

// AI模型调度函数
const callAIAPI = async (imageBase64: string): Promise<string> => {
  console.log(`使用AI模型: ${AI_PROVIDER}`)
  
  switch (AI_PROVIDER.toLowerCase()) {
    case 'gemini':
      return await callGeminiAPI(imageBase64)
    case 'openai':
      return await callOpenAIAPI(imageBase64)
    case 'siliconflow':
    default:
      return await callSiliconFlowAPI(imageBase64)
  }
}

// 主要的食物识别API - 使用真实的AI图像识别
export async function recognizeFood(imageFile: File): Promise<FoodRecognitionResponse> {
  try {
    console.log('开始识别食物图片:', imageFile.name)
    console.log('当前AI模型配置:', AI_PROVIDER)
    
    // 1. 将图片转换为base64
    const imageBase64 = await fileToBase64(imageFile)
    
    // 2. 调用选定的AI API进行识别
    const aiResponse = await callAIAPI(imageBase64)
    console.log('AI识别响应:', aiResponse)
    
    // 3. 解析AI响应
    const detectedFoods = parseAIResponse(aiResponse)
    console.log('解析出的食物:', detectedFoods)
    
    // 4. 热量校验和重量调整
    const adjustWeightsForHealthyMeal = (foods: Array<{name: string, weight: number, confidence: number, count?: number, unit_weight?: number}>) => {
      // 计算预估总热量
      let totalCalories = 0
      const foodsWithCalories = foods.map(food => {
        const foodData = FOOD_DATABASE[food.name] || { calories: 50 } // 默认热量
        const calories = (foodData.calories * food.weight) / 100
        totalCalories += calories
        return { ...food, estimatedCalories: calories, caloriesPer100g: foodData.calories }
      })
      
      console.log(`健康餐总热量估算: ${Math.round(totalCalories)}大卡`)
      
      // 如果总热量超过600大卡，按比例缩减
      if (totalCalories > 600) {
        const scaleFactor = 500 / totalCalories // 目标500大卡
        console.log(`热量超标，缩减比例: ${(scaleFactor * 100).toFixed(1)}%`)
        
        return foodsWithCalories.map(food => ({
          ...food,
          weight: Math.round(food.weight * scaleFactor),
          adjustedWeight: true
        }))
      }
      
      // 如果总热量低于300大卡，可能识别有误，保持原重量但添加标记
      if (totalCalories < 300) {
        console.log(`热量偏低，可能需要检查识别结果`)
        return foodsWithCalories.map(food => ({
          ...food,
          lowCalorieWarning: true
        }))
      }
      
      return foodsWithCalories
    }
    
    const adjustedFoods = adjustWeightsForHealthyMeal(detectedFoods)

    // 5. 将识别结果转换为标准格式
    const recognizedFoods: FoodItem[] = adjustedFoods.map((detected, index) => {
      // 尝试在数据库中找到匹配的食物
      let foodData = FOOD_DATABASE[detected.name]
      
      // 如果没有找到完全匹配的，尝试模糊匹配
      if (!foodData) {
        const possibleMatches = Object.keys(FOOD_DATABASE).filter(key => 
          key.includes(detected.name) || detected.name.includes(key)
        )
        
        if (possibleMatches.length > 0) {
          foodData = FOOD_DATABASE[possibleMatches[0]]
          console.log(`使用模糊匹配: ${detected.name} -> ${possibleMatches[0]}`)
        }
      }
      
      // 如果还是没找到，使用默认营养值
      if (!foodData) {
        console.warn(`未找到食物数据: ${detected.name}，使用默认值`)
        foodData = {
          name: detected.name,
          calories: 50, // 默认大卡数
          protein: 2,   // 默认蛋白质
          carbs: 10,    // 默认碳水
          fat: 1,       // 默认脂肪  
          fiber: 1,     // 默认纤维
          serving_size: '100g'
        }
      }
      
      return {
        id: Date.now().toString() + index,
        ...foodData,
        confidence: detected.confidence,
        quantity: detected.weight / 100, // 转换为100g为单位的数量
        aiWeight: detected.weight, // 保存AI估算的原始重量
        aiCount: detected.count, // 保存AI识别的数量
        aiUnitWeight: detected.unit_weight // 保存AI估算的单个重量
      }
    })
    
    console.log('最终识别结果:', recognizedFoods)
    
    return {
      success: true,
      data: {
        foods: recognizedFoods,
        image_id: Date.now().toString()
      }
    }
    
  } catch (error) {
    console.error('食物识别失败:', error)
    
    // 如果AI识别失败，回退到基于文件名的识别
    return fallbackRecognition(imageFile)
  }
}

// 回退识别方案 - 基于文件名
async function fallbackRecognition(imageFile: File): Promise<FoodRecognitionResponse> {
  console.log('使用回退识别方案')
  
  const fileName = imageFile.name.toLowerCase()
  
  // 简单的关键词匹配
  const foodKeywords = {
    '香蕉': ['香蕉', 'banana', '蕉'],
    '苹果': ['苹果', 'apple', '平果'], 
    '橙子': ['橙子', 'orange', '橘子'],
    '米饭': ['米饭', 'rice', '米'],
    '鸡蛋': ['鸡蛋', 'egg', '蛋'],
    '面包': ['面包', 'bread']
  }
  
  let detectedFood = '香蕉' // 默认识别为香蕉
  
  // 检查文件名中的关键词
  for (const [food, keywords] of Object.entries(foodKeywords)) {
    if (keywords.some(keyword => fileName.includes(keyword))) {
      detectedFood = food
      break
    }
  }
  
  const foodData = FOOD_DATABASE[detectedFood]
  
  return {
    success: true,
    data: {
      foods: [{
        id: Date.now().toString(),
        ...foodData,
        confidence: 0.6,
        quantity: estimatePortionSize(detectedFood)
      }],
      image_id: Date.now().toString()
    }
  }
}

// 根据食物名称搜索营养信息
export function searchFoodByName(name: string): FoodItem[] {
  const results: FoodItem[] = []
  
  Object.entries(FOOD_DATABASE).forEach(([key, food]) => {
    if (food.name.includes(name) || key.includes(name)) {
      results.push({
        id: Date.now().toString() + Math.random(),
        ...food,
        confidence: 1.0,
        quantity: estimatePortionSize(food.name)
      })
    }
  })
  
  return results
}

// 获取热门食物列表
export function getPopularFoods(): FoodItem[] {
  const popularNames = ['米饭', '鸡胸肉', '苹果', '香蕉', '鸡蛋']
  
  return popularNames.map(name => ({
    id: Date.now().toString() + Math.random(),
    ...FOOD_DATABASE[name],
    confidence: 1.0,
    quantity: estimatePortionSize(name)
  }))
}