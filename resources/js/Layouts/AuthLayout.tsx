import type React from "react"
import { Link } from "@inertiajs/react"

interface LayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center p-6">
        <Link href="/" className="text-2xl font-bold">
          Trompo
        </Link>
      </div>

      <main>{children}</main>

      <footer className="py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Trompo. All rights reserved.
      </footer>
    </div>
  )
}
