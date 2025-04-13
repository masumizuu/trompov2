import type React from "react"
import DashboardLayout from "./DashboardLayout"
import { usePage } from "@inertiajs/react"

interface LayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: LayoutProps) {
  const { auth } = usePage().props as any
  return <DashboardLayout user={auth.user}>{children}</DashboardLayout>
}
