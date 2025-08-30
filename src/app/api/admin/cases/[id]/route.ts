import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Case from '@/models/Case'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    await connectDB()

    const { id } = await params
    const caseItem = await Case.findById(id)
    
    if (!caseItem) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      case: {
        id: caseItem._id,
        customerName: caseItem.customerName,
        intro: caseItem.intro,
        avatar: caseItem.avatar,
        orderIndex: caseItem.orderIndex,
        metaData: caseItem.metaData,
        script: caseItem.script,
        createdAt: caseItem.createdAt
      }
    })
  } catch (error) {
    console.error('Get case error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    await connectDB()

    const { id } = await params
    const data = await request.json()
    
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
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
        },
        script: data.script
      },
      { new: true, runValidators: true }
    )

    if (!updatedCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Case updated successfully',
      case: {
        id: updatedCase._id,
        customerName: updatedCase.customerName,
        intro: updatedCase.intro,
        avatar: updatedCase.avatar,
        orderIndex: updatedCase.orderIndex,
        metaData: updatedCase.metaData,
        script: updatedCase.script,
        createdAt: updatedCase.createdAt
      }
    })
  } catch (error) {
    console.error('Update case error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Order index must be unique' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    await connectDB()

    const { id } = await params
    const deletedCase = await Case.findByIdAndDelete(id)
    
    if (!deletedCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Case deleted successfully'
    })
  } catch (error) {
    console.error('Delete case error:', error)
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    )
  }
}