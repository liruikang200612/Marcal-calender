const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建Vercel部署版本...');

try {
  // 1. 构建前端和后端
  console.log('构建应用...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Vercel构建完成！');
  console.log('前端文件位置: dist/public/');
  console.log('后端文件位置: dist/index.js');
} catch (error) {
  console.error('构建失败:', error.message);
  process.exit(1);
}
