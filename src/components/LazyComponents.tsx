import { lazy } from 'react'

// 管理员组件懒加载
export const AdminDashboard = lazy(() => import('@/app/admin/(protected)/dashboard/page'))
export const AdminCases = lazy(() => import('@/app/admin/(protected)/cases/page'))
export const AdminDataset = lazy(() => import('@/app/admin/(protected)/dataset/page'))

// 详情页懒加载
export const CaseDetail = lazy(() => import('@/app/detail/[id]/page'))

// 认证页面懒加载
export const LoginPage = lazy(() => import('@/app/login/page'))
export const RegisterPage = lazy(() => import('@/app/register/page'))
export const AdminLoginPage = lazy(() => import('@/app/admin/login/page'))