import type React from "react"
import DashboardLayout from "./DashboardLayout"

interface LayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
