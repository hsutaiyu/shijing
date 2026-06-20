# 古诗研习录 · 诗境

一个按 Level 循序渐进学习 75 首小学必背古诗的 Web 应用。记录"理解 / 手写 / 背诵"三维进度，用新中式萌系风格让背诗变得轻松有趣。

## 功能

- 📚 **4 个 Level 渐进学习**：从易到难，75 首古诗
- 🎯 **三维进度追踪**：理解、手写、背诵，单独标记
- 🔊 **朗读功能**：支持单句和全诗朗读
- 📊 **学习统计**：总进度、各 Level 进度、连续学习天数
- 🔄 **复习抽背**：顺序复习 / 随机抽背，标记记得/模糊/忘记
- 💾 **数据本地存储**：使用 IndexedDB，进度保存在浏览器中
- 📱 **PWA 支持**：可添加到手机桌面，离线也能使用
- 🐼 **可爱熊猫 logo**：点击会朗读欢迎语

## 技术栈

- [Vite](https://vitejs.dev/) - 构建工具
- [petite-vue](https://github.com/vuejs/petite-vue) - 轻量响应式框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)（via [idb](https://github.com/jakearchibald/idb)）- 本地数据存储
- [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) - 中文字体

## 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/shijing.git
cd shijing

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器会自动打开 http://localhost:5173

## 构建与预览

```bash
# 生产构建，输出到 dist/ 目录
npm run build

# 本地预览生产构建
npm run preview
```

## 项目结构

```
shijing/
├── index.html              # 应用入口
├── public/                 # 静态资源
│   ├── panda.png
│   └── data/poems.json     # 75 首古诗数据
├── src/
│   ├── main.js             # 初始化
│   ├── router.js           # 路由
│   ├── store.js            # 全局状态
│   ├── db.js               # IndexedDB 存储
│   ├── pages/              # 页面组件
│   ├── components/         # 可复用组件
│   ├── styles/             # 样式
│   └── utils/              # 工具函数
└── vite.config.js
```

## 数据隐私说明

学习进度保存在浏览器本地的 IndexedDB 中，不会上传到任何服务器。你可以通过统计页的"导出进度"功能备份自己的学习数据。

## 致谢

- 字体：[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)
