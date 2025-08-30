import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdminAuth()
  } catch (error) {
    redirect('/admin/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}