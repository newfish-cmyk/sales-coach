import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { requireAdminAuth } from '@/lib/auth'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()
    const body = await request.json()
    const { customerName, intro, personality, background, budget, decisionLevel } = body

    if (!customerName || !intro) {
      return NextResponse.json(
        { error: '客户名称和介绍不能为空' },
        { status: 400 }
      )
    }

    const fastgptApiUrl = process.env.FASTGPT_API_URL
    const fastgptApiKey = process.env.FASTGPT_API_KEY

    if (!fastgptApiUrl || !fastgptApiKey) {
      return NextResponse.json(
        { error: 'FastGPT API 配置缺失' },
        { status: 500 }
      )
    }

    // 构建提示词
    const personalityText = personality && personality.length > 0 
      ? personality.join('、') 
      : '未知性格'
    
    const prompt = `为销售场景生成一个对练剧本，要求如下：

客户信息：
- 客户姓名：${customerName}
- 客户介绍：${intro}
- 性格特征：${personalityText}
- 背景信息：${background || '无特殊背景'}
- 预算范围：${budget || '未知'}
- 决策级别：${decisionLevel || '未知'}

请生成一个完整的销售对练剧本，包含：
1. 开场白（销售员如何开始对话）
2. 客户可能的反应和问题
3. 销售员的应对策略和话术
4. 常见异议处理
5. 成交引导话术

剧本应该符合客户的性格特征，体现真实的销售场景对话。`

    // 生成一个简单的chatId
    const chatId = nanoid()

    // 调用FastGPT API
    const fastgptResponse = await axios.post(`${fastgptApiUrl}/v1/chat/completions`, {
      chatId,
      stream: false,
      detail: false,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${fastgptApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60秒超时
    })

    const script = fastgptResponse.data.choices?.[0]?.message?.content || fastgptResponse.data.text || '生成剧本失败'

    return NextResponse.json({ script })

  } catch (error) {
    console.error('Generate script error:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('FastGPT API Error:', error.response.data)
        return NextResponse.json(
          { error: 'AI服务调用失败，请稍后重试' },
          { status: 500 }
        )
      } else if (error.request) {
        console.error('Network Error:', error.message)
        return NextResponse.json(
          { error: '网络连接失败，请检查网络设置' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}