import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found. Database features will be disabled.')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
  adminInitialized?: boolean
}

let cached = global.mongoose as MongooseCache

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, adminInitialized: false }
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Please add it to your environment variables.')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // 维护最多10个连接
      serverSelectionTimeoutMS: 5000, // 5秒连接超时
      socketTimeoutMS: 45000, // 45秒套接字超时
      family: 4, // 使用IPv4，跳过IPv6
      maxIdleTimeMS: 30000, // 30秒后关闭空闲连接
      compressors: ['zlib' as const], // 启用压缩
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✓ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection failed:', e)
    throw e
  }

  // 只初始化一次管理员用户，避免重复检查
  if (!cached.adminInitialized) {
    await initializeAdmin()
    cached.adminInitialized = true
  }

  return cached.conn
}

async function initializeAdmin() {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      console.warn('ADMIN_PASSWORD not found. Admin user will not be created.')
      return
    }

    // 动态导入User模型以避免循环依赖
    const { default: User } = await import('../models/User')
    
    // 检查是否已经存在root用户
    const existingAdmin = await User.findOne({ username: 'root' })
    
    if (existingAdmin) {
      // 如果存在但不是管理员，更新为管理员
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin'
        await existingAdmin.save()
        console.log('✓ Updated existing root user to admin role')
      }
      return
    }
    
    // 创建root管理员用户
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const adminUser = new User({
      username: 'root',
      password: hashedPassword,
      role: 'admin'
    })
    
    await adminUser.save()
    console.log('✓ Admin user "root" created successfully')
    
  } catch (error) {
    console.error('Error initializing admin user:', error)
  }
}

export default connectDB