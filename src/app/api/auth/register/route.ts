import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      )
    }

    const user = new User({
      username,
      password
    })

    await user.save()

    const userResponse = {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt
    }

    return NextResponse.json(
      { message: 'User created successfully', user: userResponse },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      )
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}