"use client"

import { useState, useEffect } from "react"
import { route } from "ziggy-js"
import { Bell } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Badge } from "@/Components/ui/badge"
import { ScrollArea } from "@/Components/ui/scroll-area"
import axios from "axios"
import { router, usePage } from "@inertiajs/react"
import { format } from "date-fns"

interface Notification {
  id: string
  type: string
  title: string
  content: string
  isRead: boolean
  data: any
  createdAt: string
}

export default function ChatNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { route } = usePage().props

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(route("notifications.get"))
      setNotifications(response.data.notifications)
      setUnreadCount(response.data.notifications.filter((n: Notification) => !n.isRead).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(route("messages.unread"))
      setUnreadCount(response.data.unreadCount)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Set up polling for notifications
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    try {
      await axios.post(route("notifications.read"), {
        notificationId: notification.id,
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }

    // Navigate based on notification type
    if (notification.type === "MESSAGE" && notification.data) {
      const data = typeof notification.data === "string" ? JSON.parse(notification.data) : notification.data
      router.get(route("messages.show", data.conversationId))
    } else if (notification.type === "DISPUTE" && notification.data) {
      const data = typeof notification.data === "string" ? JSON.parse(notification.data) : notification.data
      router.get(route("disputes.show", data.disputeId))
    } else if (notification.type === "VERIFICATION" && notification.data) {
      router.get(route("profile.edit"))
    } else {
      // Default action for other notification types
      router.get(route("dashboard"))
    }

    setIsOpen(false)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a")
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d")
    }

    // Otherwise show full date
    return format(date, "MMM d, yyyy")
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="py-4 px-2 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-2 p-3 cursor-pointer ${!notification.isRead ? "bg-muted/50" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {notification.type === "MESSAGE"
                      ? "M"
                      : notification.type === "DISPUTE"
                        ? "D"
                        : notification.type === "VERIFICATION"
                          ? "V"
                          : "N"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.content}</p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium" onClick={() => router.get(route("messages.index"))}>
          View all messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}