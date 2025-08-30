import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Case from '@/models/Case'
import { requireAdminAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminAuth()
    await connectDB()

    const cases = await Case.find().sort({ orderIndex: 1 })
    
    return NextResponse.json({
      cases: cases.map(caseItem => ({
        id: caseItem._id,
        customerName: caseItem.customerName,
        intro: caseItem.intro,
        avatar: caseItem.avatar,
        orderIndex: caseItem.orderIndex,
        metaData: caseItem.metaData,
        createdAt: caseItem.createdAt
      }))
    })
  } catch (error) {
    console.error('Get cases error:', error)
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()
    await connectDB()

    const data = await request.json()
    
    const newCase = new Case({
      customerName: data.customerName,
      intro: data.intro,
      avatar: data.avatar,
      orderIndex: data.orderIndex,
      metaData: {
        budget: data.metaData.budget,
        decision_level: data.metaData.decision_level,
        personality: data.metaData.personality,
        points: data.metaData.points,
        background: data.metaData.background
      }
    })

    const savedCase = await newCase.save()
    
    return NextResponse.json({
      message: 'Case created successfully',
      case: {
        id: savedCase._id,
        customerName: savedCase.customerName,
        intro: savedCase.intro,
        avatar: savedCase.avatar,
        orderIndex: savedCase.orderIndex,
        metaData: savedCase.metaData,
        createdAt: savedCase.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create case error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    )
  }
}