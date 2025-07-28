# MarCal 跨区域营销日历 - 部署指南

## 项目概述

MarCal是一款专为Winner12足球预测产品设计的跨区域营销日历应用，集成了AI推荐功能，支持多个足球文化区域的营销节日推荐。

### 支持的区域
- 中国 (ID: 1)
- 美国 (ID: 2) 
- 加拿大 (ID: 3)
- 欧洲 (ID: 4)
- 日本 (ID: 5)
- 韩国 (ID: 6)
- 越南 (ID: 7)
- 印度尼西亚 (ID: 8)
- 泰国 (ID: 9)
- 巴西 (ID: 10)
- 阿根廷 (ID: 11)
- 墨西哥 (ID: 12)

## AI推荐功能优化

### Winner12产品定位
- **产品名称**: Winner12 AI足球预测
- **核心功能**: AI驱动的足球比赛结果预测
- **目标用户**: 足球爱好者、体育投注者、数据分析师
- **营销重点**: 足球相关节日和赛事营销机会

### 提示词优化特点
1. **专业身份设定**: AI助手被设定为Winner12产品的营销推广专家
2. **足球文化适配**: 针对不同区域的足球文化特色进行定制化推荐
3. **高转化率导向**: 优先推荐具有商业价值的足球相关营销时机
4. **区域化策略**: 结合当地热门球队和足球传统进行精准营销

## 部署方式

### 1. 桌面版 (Electron)

#### 开发环境运行
```bash
# 安装依赖
npm install

# 启动开发模式
npm run electron:dev
```

#### 打包桌面应用
```bash
# 构建并打包
npm run electron:build-and-pack

# 仅打包（需要先构建）
npm run electron:pack
```

打包后的应用将在 `electron/dist` 目录中。

### 2. 网页版 (Vercel部署)

#### 环境变量配置
在Vercel中设置以下环境变量：
```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

#### 部署步骤
1. 将代码推送到GitHub仓库
2. 在Vercel中连接GitHub仓库
3. 配置环境变量
4. 部署应用

#### 本地构建测试
```bash
# 构建Vercel版本
npm run build:vercel

# 本地测试
npm run start
```

## 数据库设置 (Supabase)

### 1. 创建Supabase项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目URL和API密钥

### 2. 数据库初始化
运行提供的SQL脚本：
```sql
-- 执行 supabase_setup.sql 中的所有SQL语句
```

### 3. 推送数据库架构
```bash
npm run db:push
```

## AI服务配置

### DeepSeek API
- 获取API密钥：[aihubmix.com](https://api.aihubmix.com)
- 模型：DeepSeek-V3-Fast
- 用途：主要的AI推荐服务

### OpenAI API (备用)
- 获取API密钥：[openai.com](https://openai.com)
- 模型：GPT-4o
- 用途：备用AI推荐服务

## 功能特性

### 核心功能
1. **多区域营销日历**: 支持12个主要足球文化区域
2. **AI智能推荐**: 基于Winner12产品特性的足球营销节日推荐
3. **事件管理**: 创建、编辑、删除营销事件
4. **节日集成**: 自动获取各地区传统节日信息
5. **数据分析**: 营销效果跟踪和分析

### Winner12专属功能
1. **足球赛事营销**: 重大足球赛事期间的营销推荐
2. **区域化策略**: 基于当地足球文化的定制化建议
3. **高转化率推荐**: 优先推荐具有商业价值的营销机会
4. **AI预测整合**: 结合足球预测产品特性的营销建议

## 使用说明

### 桌面版
1. 启动应用
2. 选择目标区域
3. 查看AI推荐的足球营销节日
4. 创建和管理营销事件
5. 导出营销日历

### 网页版
1. 访问部署的网站
2. 注册/登录账户
3. 选择营销区域
4. 使用AI推荐功能
5. 管理营销日历

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Vite

### 后端
- Node.js
- Express
- Supabase (PostgreSQL)
- Drizzle ORM

### 桌面版
- Electron
- Electron Builder

### AI服务
- DeepSeek API
- OpenAI API

## 故障排除

### 常见问题
1. **数据库连接失败**: 检查Supabase配置和网络连接
2. **AI推荐不工作**: 验证API密钥配置
3. **桌面版启动失败**: 确保所有依赖已正确安装
4. **Vercel部署失败**: 检查环境变量和构建配置

### 日志查看
- 桌面版：打开开发者工具查看控制台
- 网页版：查看Vercel函数日志
- 服务器：检查应用日志文件

## 支持与维护

如需技术支持或功能改进建议，请联系开发团队。

---

**注意**: 本应用专为Winner12足球预测产品的营销推广而设计，所有AI推荐都围绕足球文化和赛事进行优化。