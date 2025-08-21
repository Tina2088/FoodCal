# Calorie Tracker 卡路里识别器

A mobile calorie tracking application built with Vue 3 + Vant, similar to calai.app.

一个基于Vue 3 + Vant的移动端卡路里识别应用，类似于calai.app。

## Features 功能特性

- 📱 **Food Recognition 食物识别**: Upload food images for AI-powered food type and nutrition identification / 上传食物图片，AI识别食物类型和营养信息
- 📊 **Nutrition Tracking 营养追踪**: Record daily calories, protein, carbs, and fat intake / 记录每日卡路里、蛋白质、碳水化合物、脂肪摄入
- 📈 **Data Analysis 数据分析**: Weekly/monthly trend analysis and nutrient distribution charts / 周、月趋势分析，营养素分布图表
- ⚙️ **Personalization 个性化设置**: User profile, goals, and data management / 用户信息、目标设定、数据管理
- 💾 **Local Storage 本地存储**: Data saved locally with export support / 数据保存在本地，支持导出

## Tech Stack 技术栈

- **Frontend Framework 前端框架**: Vue 3 + TypeScript
- **Build Tool 构建工具**: Vite
- **UI Component Library UI组件库**: Vant 4
- **State Management 状态管理**: Pinia
- **Router 路由**: Vue Router 4

## Development Guide 开发指南

### Install Dependencies 安装依赖
```bash
npm install
```

### API Configuration API配置

#### Method 1: Using SiliconFlow 方法1: 使用硅基流动 (Recommended for beginners 推荐新手)
1. Copy `.env.example` to `.env.local` / 复制 `.env.example` 文件为 `.env.local`
2. Configure in `.env.local` / 在 `.env.local` 中配置：
```bash
# Select AI model / 选择AI模型
VITE_AI_MODEL_PROVIDER=siliconflow

# SiliconFlow configuration / 硅基流动配置
VITE_SILICONFLOW_API_KEY=sk-your_api_key_here
VITE_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

> 💡 **Get SiliconFlow API Key 获取硅基流动API密钥**: Visit [SiliconFlow Official Website](https://siliconflow.cn) to register and get API key / 访问 [硅基流动官网](https://siliconflow.cn) 注册账号并获取API密钥

#### Method 2: Using Google Gemini 方法2: 使用Google Gemini (Recommended for higher accuracy 推荐更高准确度)
```bash
# Select AI model / 选择AI模型
VITE_AI_MODEL_PROVIDER=gemini

# Gemini configuration / Gemini配置
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 **Get Gemini API Key 获取Gemini API密钥**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) for free API key / 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取免费API密钥

#### Method 3: Using OpenAI GPT-4V 方法3: 使用OpenAI GPT-4V (Highest accuracy, higher cost 最高准确度，成本较高)⚠️
```bash
# Select AI model / 选择AI模型  
VITE_AI_MODEL_PROVIDER=openai

# OpenAI configuration / OpenAI配置
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
```

> ⚠️ **Important Note 重要提示**: Due to browser CORS policy limitations, OpenAI API cannot be called directly from frontend. Production requires server-side proxy. **Recommend using Gemini model** for better experience. / 由于浏览器CORS政策限制，OpenAI API无法在前端直接调用。生产环境需要服务器端代理。**建议使用Gemini模型**获得更好的体验。

### Development Environment 开发环境
```bash
npm run dev
```

### Build for Production 构建生产版本
```bash
npm run build
```

### Type Checking 类型检查
```bash
npm run type-check
```

### Code Formatting 代码格式化
```bash
npm run format
```

## Project Structure 项目结构

```
src/
├── api/              # API interfaces API 接口
├── components/       # Shared components 公共组件
├── stores/          # Pinia state management Pinia 状态管理
├── types/           # TypeScript type definitions TypeScript 类型定义
├── views/           # Page components 页面组件
├── router/          # Router configuration 路由配置
└── main.ts          # Application entry 应用入口
```

## Page Features 页面功能

### Home Page 主页 (HomeView)
- Today/yesterday calorie intake overview / 今日/昨日卡路里摄入概览
- Nutrient progress bars / 营养素进度条
- Food record list / 食物记录列表
- Bottom navigation bar / 底部导航栏

### Scan Page 扫描页 (FoodScanView)
- Camera photo recognition / 相机拍照识别
- Image upload recognition / 图片上传识别
- Manual food search / 手动搜索食物
- Quantity adjustment and confirmation / 数量调整和确认

### Analytics Page 分析页 (AnalyticsView)
- Weekly/monthly trend charts / 周/月趋势图表
- Nutrient distribution / 营养素分布
- Statistical data / 统计数据
- Most consumed foods ranking / 常吃食物排行

### Settings Page 设置页 (SettingsView)
- User profile management / 用户信息管理
- Daily goal settings / 每日目标设定
- Data export/clear / 数据导出/清除
- App information / 应用信息

## Data Management 数据管理

- **User Configuration 用户配置**: Stored in localStorage 'userProfile' / 存储在 localStorage 的 'userProfile'
- **Food Records 食物记录**: Stored in localStorage 'foodRecords' / 存储在 localStorage 的 'foodRecords'
- **Export Support 支持导出**: JSON format data export / JSON格式导出所有数据

## AI Image Recognition AI图像识别

### Supported AI Models 支持的AI模型

This app supports multiple AI vision models: / 本应用支持多种AI视觉模型：

#### 1. SiliconFlow - Qwen/QVQ-72B-Preview ⭐ (Currently using 当前使用)
- ✅ **Chinese-friendly 中文友好**: Optimized for Chinese / 专门针对中文优化
- ✅ **Lower cost 成本较低**: Relatively affordable / 相对便宜的调用费用
- ❌ **Food recognition accuracy 食物识别精度**: General model, may lack food specialization / 通用模型，食物识别可能不够专业
- ❌ **Weight estimation 重量估算**: Limited weight estimation accuracy / 重量估算准确度有限

#### 2. Google Gemini 1.5 Flash 🔥 (Recommended 推荐)
- ✅ **Strong visual understanding 视觉理解强**: Excellent image comprehension / 在图像理解方面表现优秀
- ✅ **Accurate food recognition 食物识别准确**: High recognition rate for common foods, especially healthy meal combinations / 对常见食物识别率高，特别是健康餐组合
- ✅ **Good weight estimation 重量估算好**: Accurate weight estimation based on object size relationships / 基于物体大小关系估算重量较准确
- ✅ **Large free quota 免费额度大**: Sufficient free calls per month / 每月有足够的免费调用次数
- ✅ **Fast response 响应速度快**: Quick processing speed / 处理速度较快
- ❌ **Chinese support 中文支持**: Requires English prompts but can output correct Chinese food names / 需要英文提示，但能正确输出中文食物名称

#### 3. OpenAI GPT-4V 💰
- ✅ **Accurate recognition 识别准确**: High food recognition accuracy / 食物识别准确度很高
- ✅ **Strong reasoning 推理能力强**: Can infer food information contextually / 能结合上下文推理食物信息
- ✅ **Good multilingual 多语言好**: Good support for both Chinese and English / 中英文支持都很好
- ❌ **Highest cost 成本最高**: Expensive API calls / 调用费用昂贵
- ❌ **API limitations API限制**: Rate limiting restrictions / 有调用频率限制

### Model Selection Recommendations 模型选择建议

**New users 新手用户**: Recommend SiliconFlow for low cost and Chinese-friendly / 建议使用硅基流动，成本低且中文友好  
**For accuracy 追求准确度**: Recommend Google Gemini for large free quota and good recognition / 建议使用Google Gemini，免费额度大且识别效果好  
**Professional users 专业用户**: Choose OpenAI GPT-4V for highest accuracy but higher cost / 可选择OpenAI GPT-4V，准确度最高但成本较高

### Healthy Meal Calorie Standards 健康餐热量标准
- **Breakfast 早餐**: 300-500 kcal (e.g., oats + fruits + nuts) / 300-500大卡（如：燕麦+水果+坚果）
- **Lunch 午餐**: 400-600 kcal (e.g., chicken breast + vegetables + staple food) / 400-600大卡（如：鸡胸肉+蔬菜+主食）  
- **Dinner 晚餐**: 350-550 kcal (e.g., fish + salad + small amount of staple food) / 350-550大卡（如：鱼肉+沙拉+少量主食）
- **Snacks 加餐**: 100-200 kcal (e.g., yogurt + nuts) / 100-200大卡（如：酸奶+坚果）

### Recognition Examples 识别效果示例
- Upload banana image → Recognizes "Banana, about 120g" / 上传香蕉图片 → 识别出"香蕉，约120g"
- Upload healthy meal image → Recognizes "Chicken breast 120g, broccoli 150g, corn 100g" / 上传健康餐图片 → 识别出"鸡胸肉120g、西兰花150g、玉米100g"
- Supports Chinese food names and smart weight estimation / 支持中文食物名称和智能重量估算

## Important Notes 注意事项

1. **API Key Configuration API密钥配置**: First-time use requires SiliconFlow API key configuration, see above for details / 首次使用需要配置硅基流动API密钥，详见上方配置说明
2. Nutrition database is simplified, production environment recommends using more complete food nutrition database / 营养数据库为简化版本，生产环境建议使用更完整的食物营养数据库  
3. App designed for mobile, best experience width is 414px (iPhone 6/7/8 Plus) / 应用针对移动端设计，最佳体验宽度为414px（iPhone 6/7/8 Plus）
4. AI recognition failures automatically fall back to filename-based recognition / AI识别失败时会自动回退到基于文件名的识别方案

## Deploy to Vercel 部署到 Vercel

### Prerequisites 准备工作
Ensure the project is already pushed to a GitHub repository. / 确保项目已经推送到 GitHub 仓库。

### Deployment Steps 部署步骤

1. **Visit Vercel 访问 Vercel**
   - Go to [vercel.com](https://vercel.com) / 前往 [vercel.com](https://vercel.com)
   - Login with GitHub account / 使用 GitHub 账号登录

2. **Create New Project 创建新项目**
   - Click "New Project" / 点击 "New Project"
   - Select your calorie tracker repository / 选择你的卡路里识别器项目仓库
   - Click "Import" / 点击 "Import"

3. **Configure Settings 配置设置**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root directory 根目录)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy 部署**
   - Click "Deploy" to start deployment / 点击 "Deploy" 开始部署
   - Wait for build completion, usually takes 1-3 minutes / 等待构建完成，通常需要1-3分钟

### Auto Deployment 自动部署
Every push to GitHub will automatically redeploy the app on Vercel. / 每次推送代码到 GitHub，Vercel 会自动重新部署应用。

### Environment Variables 环境变量
If environment variables are needed, add in Vercel project settings: / 如果需要配置环境变量，在 Vercel 项目设置中添加：
- `NODE_ENV=production`

### Performance Optimization 性能优化
Project has been configured with: / 项目已配置：
- Code splitting (Vue, Vant separately bundled) / 代码分割（Vue、Vant 单独打包）
- Static asset cache optimization / 静态资源缓存优化
- SPA routing support / SPA 路由支持

### Access App 访问应用
After deployment, Vercel will provide a `.vercel.app` domain to directly access your calorie tracker app. / 部署完成后，Vercel 会提供一个 `.vercel.app` 域名，可以直接访问你的卡路里识别应用。

## TODO

- [ ] Integrate real food recognition API (e.g., Google Vision API) / 接入真实的食物识别API（如Google Vision API）
- [ ] Integrate complete nutrition database / 集成完整的营养数据库
- [ ] Add more chart types / 添加更多图表类型
- [ ] Implement cloud data sync / 实现数据云同步
- [ ] Add social sharing features / 添加社交分享功能