import { cookies } from 'next/headers'
import connectDB from '@/lib/mongodb'
import User, { IUser } from '@/models/User'

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return null
    }

    await connectDB()
    const user = await User.findById(userId).select('-password')
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export function isAuthenticated(user: IUser | null): user is IUser {
  return user !== null
}

export async function requireAdminAuth(): Promise<IUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return user
}

export function isAdmin(user: IUser | null): boolean {
  return user !== null && user.role === 'admin'
}