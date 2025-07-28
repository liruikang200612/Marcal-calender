# Marcal 跨区域营销日历

专为Winner12足球预测产品定制的AI驱动营销日历应用

## 项目概述

Marcal是一款智能跨区域营销日历应用，专门为Winner12足球预测产品的全球营销推广而设计。通过AI技术，为12个足球文化重点区域提供精准的节日推荐和营销策略。

## 核心功能

### 🤖 AI智能推荐
- **专业身份设定**: AI扮演Winner12产品宣传人员
- **足球文化导向**: 专注足球相关节日和营销机会
- **多区域支持**: 覆盖中国、美国、加拿大、欧洲、日本、韩国、越南、印尼、泰国、巴西、阿根廷、墨西哥

### 📅 营销日历管理
- 跨区域节日展示
- 自定义营销事件
- 智能冲突检测
- 季节性营销提醒

### 🌍 多平台支持
- **网页版**: 基于React的现代化Web应用
- **桌面版**: Electron打包的跨平台桌面应用
- **云部署**: 支持Vercel等云平台部署

## 技术架构

### 前端技术栈
- **React 18**: 现代化UI框架
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **Radix UI**: 高质量组件库
- **Wouter**: 轻量级路由库

### 后端技术栈
- **Node.js + Express**: 服务器框架
- **Supabase**: 后端即服务平台
- **PostgreSQL**: 关系型数据库
- **Drizzle ORM**: 类型安全的ORM

### AI服务
- **DeepSeek API**: 主要AI推荐服务
- **OpenAI API**: 备用AI服务
- **自定义提示词**: 专为足球营销优化

### 桌面应用
- **Electron**: 跨平台桌面应用框架
- **自动更新**: 支持应用自动更新
- **原生集成**: 系统通知和托盘支持

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- PostgreSQL 数据库（或Supabase账户）

### 安装依赖
```bash
npm install
```

### 环境配置
复制 `.env.example` 为 `.env` 并配置：
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
SESSION_SECRET=your-session-secret
```

### 数据库设置
```bash
# 运行数据库迁移
npm run db:push
```

### 开发模式
```bash
# 启动开发服务器
npm run dev
```

### 生产构建
```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

### 桌面版打包
```bash
# 打包桌面应用
npm run electron:pack
```

## 部署指南

### Vercel部署
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

详细步骤请参考 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

### 本地部署
详细步骤请参考 [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)

## AI推荐系统

### 专业定位
- **身份**: Winner12产品宣传人员
- **目标**: 足球预测产品营销推广
- **策略**: 基于足球文化的精准营销

### 支持区域
| 区域 | 足球文化特点 | 主要节日类型 |
|------|-------------|-------------|
| 中国 | 新兴足球市场 | 传统节日+体育赛事 |
| 美国 | 多元体育文化 | 超级碗+足球赛季 |
| 欧洲 | 足球发源地 | 欧洲杯+联赛 |
| 巴西 | 足球王国 | 嘉年华+世界杯 |
| 阿根廷 | 足球热土 | 马拉多纳纪念日 |
| 日本 | 亚洲足球强国 | J联赛+亚洲杯 |

### 推荐算法
- 基于区域足球文化分析
- 结合历史数据和趋势
- 考虑竞争对手活动
- 优化营销时机选择

## 项目结构

```
DocumentBuilder/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── hooks/         # 自定义Hook
│   │   ├── lib/           # 工具库
│   │   └── pages/         # 页面组件
├── server/                # 后端服务
│   ├── routes.ts          # API路由
│   ├── storage.ts         # 数据库操作
│   └── services/          # 外部服务
│       ├── deepseek.ts    # DeepSeek AI服务
│       └── openai.ts      # OpenAI服务
├── shared/                # 共享类型和模式
├── electron/              # 桌面应用
└── dist/                  # 构建输出
```

## 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构

### 测试
```bash
# 类型检查
npm run check

# 构建测试
npm run build
```

## 常见问题

### Q: Vercel部署显示404
A: 检查环境变量配置，确保Supabase连接正常

### Q: AI推荐不准确
A: 检查API密钥配置，确认提示词设置

### Q: 桌面版打包失败
A: 确保所有依赖已安装，检查Electron配置

## 更新日志

### v1.0.0 (2024-12)
- ✅ 初始版本发布
- ✅ AI推荐系统优化
- ✅ 多平台支持
- ✅ Vercel部署配置

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系我们

- 项目主页: https://github.com/Winner12ai/Marcal
- 问题反馈: https://github.com/Winner12ai/Marcal/issues
- 邮箱: support@winner12.ai

---

**Marcal** - 让足球营销更智能 ⚽️