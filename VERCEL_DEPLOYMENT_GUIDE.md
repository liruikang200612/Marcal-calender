# Vercel部署指南 - 解决404问题

## 问题诊断

当前Vercel部署显示404错误的原因是：
1. 缺少必要的环境变量配置
2. 服务器无法启动，导致所有请求返回404

## 解决步骤

### 1. 在Vercel中配置环境变量

登录Vercel控制台，进入项目设置，添加以下环境变量：

#### 必需的环境变量：
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
SESSION_SECRET=your-random-session-secret
NODE_ENV=production
```

#### 获取Supabase配置：
1. 访问 [supabase.com](https://supabase.com)
2. 登录并选择你的项目
3. 进入 Settings > API
4. 复制 Project URL 和 anon public key

#### 获取AI API密钥：
- **DeepSeek**: 访问 [api.aihubmix.com](https://api.aihubmix.com) 获取API密钥
- **OpenAI**: 访问 [openai.com](https://openai.com) 获取API密钥

### 2. 重新部署

配置环境变量后，触发重新部署：
1. 在Vercel控制台点击 "Redeploy"
2. 或者推送新的代码到GitHub仓库

### 3. 验证部署

部署完成后：
1. 访问你的Vercel域名
2. 检查是否能正常加载应用
3. 测试API端点：`https://your-domain.vercel.app/api/regions`

## 本地测试

在部署到Vercel之前，建议先在本地测试：

1. 复制 `.env.example` 为 `.env`
2. 填入正确的环境变量
3. 运行：
   ```bash
   npm run build
   npm start
   ```
4. 访问 `http://localhost:5000` 验证应用正常运行

## 常见问题

### Q: 仍然显示404
A: 检查Vercel函数日志，确认环境变量是否正确配置

### Q: API请求失败
A: 检查Supabase数据库连接和API密钥是否有效

### Q: 构建失败
A: 检查依赖是否完整，运行 `npm install` 重新安装

## 数据库设置

确保Supabase数据库已正确设置：
1. 运行 `supabase_setup.sql` 中的SQL语句
2. 确认所有表已创建
3. 检查RLS（行级安全）策略是否正确

## 联系支持

如果问题仍然存在，请提供：
1. Vercel部署日志
2. 环境变量配置截图（隐藏敏感信息）
3. 错误信息详情