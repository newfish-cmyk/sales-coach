# 销售对练系统

基于MongoDB的销售培训平台，通过对话式练习帮助销售人员提升沟通技能。

## 🚀 Quick Start

### 1. 环境配置

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
```

在 `.env.local` 中配置MongoDB连接：
```
MONGODB_URI=mongodb://localhost:27017/sales-coach
```

### 2. 初始化数据

```bash
# 初始化数据库数据
npx tsx scripts/initMockData.ts
```

### 3. 启动开发

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建部署

```bash
npm run build
npm run start
```

## 🔧 主要功能

- 用户注册/登录系统
- 6个不同类型的客户对练场景
- 进度追踪和解锁机制
- 对话式界面交互

## 📊 技术栈

- Next.js 15 + TypeScript
- MongoDB + Mongoose
- Chakra UI v3
- Cookie认证