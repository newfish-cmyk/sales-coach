import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Case from '../src/models/Case'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const mockCases = [
  {
    customerName: '友好的张先生',
    intro: '一位友善的初次购买客户，容易建立信任关系',
    avatar: '/avatars/friendly-businessman-avatar.png',
    orderIndex: 1,
    metaData: {
      budget: '10-50万',
      decision_level: '部门经理',
      personality: ['友善', '健谈', '容易相处', '注重关系'],
      points: ['初次购买担心风险', '希望获得优质服务', '价格敏感度中等'],
      background: 'ABC公司采购部经理，负责公司办公设备采购，有3年采购经验，注重供应商的服务质量和后续支持。'
    }
  },
  {
    customerName: '挑剔的李女士',
    intro: '对产品细节要求较高，需要耐心解答',
    avatar: '/avatars/professional-businesswoman-avatar.png',
    orderIndex: 2,
    metaData: {
      budget: '20-80万',
      decision_level: '技术总监',
      personality: ['细致', '专业', '谨慎', '追求完美'],
      points: ['对产品技术规格要求严格', '需要详细的技术文档', '担心产品兼容性'],
      background: 'XYZ集团技术总监，负责公司IT系统建设，有10年技术背景，对产品的技术细节和兼容性要求极高。'
    }
  },
  {
    customerName: '犹豫的王总',
    intro: '决策谨慎，需要更多说服和价值展示',
    avatar: '/avatars/executive-businessman-avatar.png',
    orderIndex: 3,
    metaData: {
      budget: '50-200万',
      decision_level: '公司总经理',
      personality: ['谨慎', '理性', '注重ROI', '决策慢'],
      points: ['投资回报率不明确', '担心实施风险', '需要董事会批准'],
      background: 'DEF企业总经理，负责公司重大投资决策。注重成本控制和投资回报，每个决策都需要充分论证和风险评估。'
    }
  },
  {
    customerName: '急躁的陈经理',
    intro: '时间紧迫，需要快速抓住重点',
    avatar: '/avatars/busy-manager-avatar.png',
    orderIndex: 4,
    metaData: {
      budget: '30-100万',
      decision_level: '业务部门负责人',
      personality: ['急躁', '效率优先', '直接', '时间敏感'],
      points: ['项目时间紧迫', '需要快速上线', '不喜欢冗长的介绍'],
      background: '项目经理，负责公司数字化转型项目。项目时间紧迫，需要在3个月内完成系统上线，对供应商的响应速度要求很高。'
    }
  },
  {
    customerName: '专业的刘博士',
    intro: '技术专家，需要深度的专业知识交流',
    avatar: '/avatars/professional-doctor-avatar.png',
    orderIndex: 5,
    metaData: {
      budget: '100-500万',
      decision_level: '首席技术官',
      personality: ['学术性强', '逻辑严密', '专业', '追求创新'],
      points: ['技术方案的先进性', '系统架构的合理性', '未来扩展能力'],
      background: '计算机博士，首席技术官，负责公司技术战略规划。对新技术敏感，要求解决方案具有前瞻性和技术领先性。'
    }
  },
  {
    customerName: '苛刻的周总监',
    intro: '要求极高，对价格和服务都很挑剔',
    avatar: '/avatars/stern-supervisor-avatar.png',
    orderIndex: 6,
    metaData: {
      budget: '80-300万',
      decision_level: '采购总监',
      personality: ['严厉', '挑剔', '经验丰富', '谈判高手'],
      points: ['价格必须有优势', '服务标准要求严格', '合同条款苛刻'],
      background: '资深采购总监，有15年采购经验，见过各种供应商。对价格极其敏感，要求服务标准明确，合同条款严格。'
    }
  }
]

async function initMockData() {
  try {
    // 连接数据库
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // 清空现有数据
    await Case.deleteMany({})
    console.log('Cleared existing cases')

    // 插入模拟数据
    const cases = await Case.insertMany(mockCases)
    console.log(`Inserted ${cases.length} cases:`)
    cases.forEach(case_ => {
      console.log(`- ${case_.customerName} (Order: ${case_.orderIndex})`)
    })

    console.log('Mock data initialization completed successfully!')
    
  } catch (error) {
    console.error('Error initializing mock data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initMockData()
}

export default initMockData