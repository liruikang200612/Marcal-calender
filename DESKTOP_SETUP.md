# MarCal 桌面应用设置指南

## 概述
MarCal 是一个跨区域营销日历应用，现在支持桌面版本。本指南将帮助您设置和运行桌面版本。

## 项目结构
```
DocumentBuilder/
├── client/                 # React前端代码
├── server/                 # Express后端代码  
├── electron/              # Electron桌面应用
│   ├── main.js           # 主进程文件
│   ├── preload.js        # 预加载脚本
│   └── package.json      # Electron配置
├── package.json          # 主项目配置
├── start-electron.bat    # Windows启动脚本
└── build-electron.bat    # Windows构建脚本
```

## 快速开始

### 方法1: 使用批处理脚本 (Windows)
1. 双击 `start-electron.bat` 启动开发模式
2. 双击 `build-electron.bat` 构建桌面应用

### 方法2: 使用命令行
1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发模式:
   ```bash
   npm run electron:dev
   ```

3. 构建桌面应用:
   ```bash
   npm run electron:pack
   ```

## 可用脚本

- `npm run electron:dev` - 启动开发模式（同时运行Web服务器和Electron）
- `npm run electron:pack` - 构建并打包桌面应用
- `npm run electron:dist` - 构建分发版本
- `npm run build` - 仅构建Web应用
- `npm run dev` - 仅启动Web开发服务器

## 环境要求

- Node.js 16+ 
- npm 或 yarn
- Windows 10/11 (推荐)

## 配置说明

### Supabase配置
确保在 `.env` 文件中配置了正确的Supabase连接信息：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Electron配置
主要配置文件位于 `electron/package.json`，包含：
- 应用信息（名称、版本、描述）
- 构建配置（图标、目标平台）
- 安装程序设置

## 功能特性

### 桌面应用特性
- 🖥️ 原生桌面窗口
- 📱 响应式界面
- 🔄 自动更新支持（可扩展）
- 🎨 系统主题集成
- ⌨️ 键盘快捷键支持

### 营销日历功能
- 📅 日历视图和管理
- 🌍 多区域支持
- 📊 数据分析和报表
- 🔐 用户认证和权限
- 💾 云端数据同步

## 故障排除

### 常见问题

1. **Electron启动失败**
   - 检查Node.js版本是否为16+
   - 删除 `node_modules` 文件夹并重新安装依赖
   - 确保端口5173没有被占用

2. **构建失败**
   - 检查网络连接（需要下载Electron二进制文件）
   - 确保有足够的磁盘空间
   - 检查防病毒软件是否阻止了文件操作

3. **应用无法连接到Supabase**
   - 检查 `.env` 文件配置
   - 确保网络连接正常
   - 验证Supabase项目状态

### 调试模式
开发模式下，按 `Ctrl+Shift+I` 打开开发者工具进行调试。

## 部署

构建完成后，可执行文件将位于：
- Windows: `electron/dist/MarCal Setup.exe`
- 便携版: `electron/dist/win-unpacked/MarCal.exe`

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Express.js + Node.js
- **数据库**: Supabase (PostgreSQL)
- **桌面框架**: Electron
- **构建工具**: electron-builder

## 开发注意事项

1. **安全性**: 应用使用了上下文隔离和预加载脚本确保安全
2. **性能**: 开发模式下会加载本地服务器，生产模式使用静态文件
3. **更新**: 可以集成 electron-updater 实现自动更新功能

## 支持

如果遇到问题，请：
1. 查看控制台错误信息
2. 检查网络连接和配置
3. 参考本文档的故障排除部分
4. 联系开发团队获取支持

---

**MarCal Desktop v1.0.0**  
构建时间: 2024年