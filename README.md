# 销售对练系统

一个基于AI驱动的销售培训平台，通过闯关模式帮助销售人员提升技能。

## ✨ 特性

- 🎯 **闯关式对练** - 游戏化的销售训练体验
- 🤖 **AI智能客户** - 模拟真实客户场景和反应
- 📊 **进度追踪** - 星级评分和学习进度监控
- 👥 **多样化客户类型** - 6种不同性格的客户挑战
- 📱 **响应式设计** - 支持桌面端和移动端
- 🎨 **现代化UI** - 基于Chakra UI的精美界面

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
src/
├── app/                  # Next.js 13+ App Router
│   ├── page.tsx         # 首页落地页
│   ├── list/            # 路线图列表页
│   ├── detail/[id]/     # 客户详情页
│   └── not-found.tsx    # 404页面
├── components/          # 可复用组件
├── lib/                 # 工具函数和数据
├── types/               # TypeScript类型定义
└── hooks/               # 自定义React Hooks

public/
├── avatars/             # 客户头像图片
└── *.svg               # 图标文件
```

## 🎮 功能说明

### 首页
- 产品介绍和价值主张
- 功能特色展示
- 使用流程说明
- 用户评价和统计数据

### 路线图页面
- 6个不同难度的客户挑战
- 进度统计（完成关卡、获得星星、完成度）
- 左右交替的路径式布局
- 锁定/解锁状态管理

### 详情页面
- 详细的客户档案信息
- 聊天式的对话界面  
- 实时评分显示
- 继续对话和重新开始功能

## 🛠 技术栈

- **框架**: Next.js 15 (App Router)
- **UI库**: Chakra UI 3.x
- **图标**: React Icons (Feather Icons)
- **语言**: TypeScript
- **样式**: Emotion (Chakra UI内置)

## 📱 客户类型

1. **友好的张先生** (初级) - 友善的新客户
2. **挑剔的李女士** (初级) - 注重细节的质量总监  
3. **犹豫的王总** (中级) - 谨慎的决策者
4. **急躁的陈经理** (中级) - 时间敏感型客户
5. **专业的刘博士** (高级) - 技术专家型客户
6. **苛刻的周总监** (高级) - 挑战型大客户

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📄 许可证

MIT License