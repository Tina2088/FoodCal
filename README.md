# 卡路里识别器

一个基于Vue 3 + Vant的移动端卡路里识别应用，类似于calai.app。

## 功能特性

- 📱 **食物识别**：上传食物图片，AI识别食物类型和营养信息
- 📊 **营养追踪**：记录每日卡路里、蛋白质、碳水化合物、脂肪摄入
- 📈 **数据分析**：周、月趋势分析，营养素分布图表
- ⚙️ **个性化设置**：用户信息、目标设定、数据管理
- 💾 **本地存储**：数据保存在本地，支持导出

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI组件库**：Vant 4
- **状态管理**：Pinia
- **路由**：Vue Router 4

## 开发指南

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 配置API密钥

#### 方法1: 使用硅基流动（推荐新手）
1. 复制 `.env.example` 文件为 `.env.local`
2. 在 `.env.local` 中配置：
\`\`\`bash
# 选择AI模型
VITE_AI_MODEL_PROVIDER=siliconflow

# 硅基流动配置
VITE_SILICONFLOW_API_KEY=sk-your_api_key_here
VITE_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
\`\`\`

> 💡 **获取硅基流动API密钥**: 访问 [硅基流动官网](https://siliconflow.cn) 注册账号并获取API密钥

#### 方法2: 使用Google Gemini（推荐更高准确度）
\`\`\`bash
# 选择AI模型
VITE_AI_MODEL_PROVIDER=gemini

# Gemini配置
VITE_GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

> 💡 **获取Gemini API密钥**: 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取免费API密钥

#### 方法3: 使用OpenAI GPT-4V（最高准确度，成本较高）⚠️
\`\`\`bash
# 选择AI模型  
VITE_AI_MODEL_PROVIDER=openai

# OpenAI配置
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
\`\`\`

> ⚠️ **重要提示**: 由于浏览器CORS政策限制，OpenAI API无法在前端直接调用。生产环境需要服务器端代理。**建议使用Gemini模型**获得更好的体验。

### 开发环境
\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

### 类型检查
\`\`\`bash
npm run type-check
\`\`\`

### 代码格式化
\`\`\`bash
npm run format
\`\`\`

## 项目结构

\`\`\`
src/
├── api/              # API 接口
├── components/       # 公共组件
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型定义
├── views/           # 页面组件
├── router/          # 路由配置
└── main.ts          # 应用入口
\`\`\`

## 页面功能

### 主页 (HomeView)
- 今日/昨日卡路里摄入概览
- 营养素进度条
- 食物记录列表
- 底部导航栏

### 扫描页 (FoodScanView)
- 相机拍照识别
- 图片上传识别
- 手动搜索食物
- 数量调整和确认

### 分析页 (AnalyticsView)
- 周/月趋势图表
- 营养素分布
- 统计数据
- 常吃食物排行

### 设置页 (SettingsView)
- 用户信息管理
- 每日目标设定
- 数据导出/清除
- 应用信息

## 数据管理

- **用户配置**：存储在 localStorage 的 'userProfile'
- **食物记录**：存储在 localStorage 的 'foodRecords'
- **支持导出**：JSON格式导出所有数据

## AI图像识别

### 支持的AI模型

本应用支持多种AI视觉模型：

#### 1. 硅基流动 - Qwen/QVQ-72B-Preview ⭐ (当前使用)
- ✅ **中文友好**：专门针对中文优化
- ✅ **成本较低**：相对便宜的调用费用
- ❌ **食物识别精度**：通用模型，食物识别可能不够专业
- ❌ **重量估算**：重量估算准确度有限

#### 2. Google Gemini 1.5 Flash 🔥 (推荐)
- ✅ **视觉理解强**：在图像理解方面表现优秀
- ✅ **食物识别准确**：对常见食物识别率高，特别是健康餐组合
- ✅ **重量估算好**：基于物体大小关系估算重量较准确
- ✅ **免费额度大**：每月有足够的免费调用次数
- ✅ **响应速度快**：处理速度较快
- ❌ **中文支持**：需要英文提示，但能正确输出中文食物名称

#### 3. OpenAI GPT-4V 💰
- ✅ **识别准确**：食物识别准确度很高
- ✅ **推理能力强**：能结合上下文推理食物信息
- ✅ **多语言好**：中英文支持都很好
- ❌ **成本最高**：调用费用昂贵
- ❌ **API限制**：有调用频率限制

### 模型选择建议

**新手用户**: 建议使用硅基流动，成本低且中文友好  
**追求准确度**: 建议使用Google Gemini，免费额度大且识别效果好  
**专业用户**: 可选择OpenAI GPT-4V，准确度最高但成本较高

### 健康餐热量标准
- **早餐**：300-500大卡（如：燕麦+水果+坚果）
- **午餐**：400-600大卡（如：鸡胸肉+蔬菜+主食）  
- **晚餐**：350-550大卡（如：鱼肉+沙拉+少量主食）
- **加餐**：100-200大卡（如：酸奶+坚果）

### 识别效果示例
- 上传香蕉图片 → 识别出"香蕉，约120g"
- 上传健康餐图片 → 识别出"鸡胸肉120g、西兰花150g、玉米100g"
- 支持中文食物名称和智能重量估算

## 注意事项

1. **API密钥配置**：首次使用需要配置硅基流动API密钥，详见上方配置说明
2. 营养数据库为简化版本，生产环境建议使用更完整的食物营养数据库  
3. 应用针对移动端设计，最佳体验宽度为414px（iPhone 6/7/8 Plus）
4. AI识别失败时会自动回退到基于文件名的识别方案

## 部署到 Vercel

### 准备工作
确保项目已经推送到 GitHub 仓库。

### 部署步骤

1. **访问 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择你的卡路里识别器项目仓库
   - 点击 "Import"

3. **配置设置**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (根目录)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **部署**
   - 点击 "Deploy" 开始部署
   - 等待构建完成，通常需要1-3分钟

### 自动部署
每次推送代码到 GitHub，Vercel 会自动重新部署应用。

### 环境变量
如果需要配置环境变量，在 Vercel 项目设置中添加：
- `NODE_ENV=production`

### 性能优化
项目已配置：
- 代码分割（Vue、Vant 单独打包）
- 静态资源缓存优化
- SPA 路由支持

### 访问应用
部署完成后，Vercel 会提供一个 `.vercel.app` 域名，可以直接访问你的卡路里识别应用。

## TODO

- [ ] 接入真实的食物识别API（如Google Vision API）
- [ ] 集成完整的营养数据库
- [ ] 添加更多图表类型
- [ ] 实现数据云同步
- [ ] 添加社交分享功能