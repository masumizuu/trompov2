import type React from "react"
import { Link } from "@inertiajs/react"
import type { User } from "@/types"
import { Home, Store, Package, MessageSquare, AlertTriangle, LogOut, Menu } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import { route } from "@/Utils/route"
import ChatNotification from "@/Components/ChatNotification"

interface Props {
  user: User
  children: React.ReactNode
}

export default function DashboardLayout({ user, children }: Props) {
  const navigation = [
    { name: "Dashboard", href: route("dashboard"), icon: Home },
    { name: "Businesses", href: route("businesses.index"), icon: Store },
    { name: "Sellables", href: route("sellables.index"), icon: Package },
    { name: "Messages", href: route("messages.index"), icon: MessageSquare },
    { name: "Disputes", href: route("disputes.index"), icon: AlertTriangle },
  ]

  const userNavigation = [
    { name: "Your Profile", href: route("profile.edit") },
    { name: "Settings", href: "#" },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={user.profile_image} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent"
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <div className="space-y-1">
                {userNavigation.map((item) => (
                  <Link key={item.name} href={item.href} className="block px-3 py-2 text-sm rounded-md hover:bg-accent">
                    {item.name}
                  </Link>
                ))}
                <form method="POST" action={route("logout")}>
                  <input
                    type="hidden"
                    name="_token"
                    value={document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""}
                  />
                  <button
                    type="submit"
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                  >
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold">Trompo</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent"
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src={user.profile_image} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-background border-b">
          <div className="flex flex-1 justify-between px-4 md:px-6">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              <ChatNotification userId={user.id} />

              <form method="POST" action={route("logout")} className="hidden md:block">
                <input
                  type="hidden"
                  name="_token"
                  value={document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""}
                />
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
