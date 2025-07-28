# GitHub上传指南

## 方法一：使用Personal Access Token

1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 生成新的token，选择repo权限
3. 使用token进行认证：

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Winner12ai/Marcal-Calendar.git
git push origin main
```

## 方法二：手动上传

1. 访问 https://github.com/Winner12ai/Marcal-Calendar
2. 点击 "uploading an existing file"
3. 拖拽项目文件到页面
4. 提交更改

## 方法三：GitHub CLI

```bash
gh auth login
gh repo create Winner12ai/Marcal-Calendar --public
git push origin main
```

## 项目文件清单

核心文件：
- README.md - 项目说明
- package.json - 项目配置
- vercel.json - 部署配置
- client/ - 前端代码
- server/ - 后端代码
- electron/ - 桌面版配置

配置文件：
- .env.example - 环境变量模板
- tsconfig.json - TypeScript配置
- vite.config.ts - 构建配置
- tailwind.config.ts - 样式配置

文档文件：
- VERCEL_DEPLOYMENT_GUIDE.md - Vercel部署指南
- DEPLOYMENT_README.md - 完整部署文档
- PROJECT_SUMMARY.md - 项目总结