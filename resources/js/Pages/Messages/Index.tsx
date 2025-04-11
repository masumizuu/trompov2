"use client"

import React, { useState, useEffect, useRef } from "react"
import { Head, router } from "@inertiajs/react"
import { route } from "ziggy-js"
import DashboardLayout from "@/Layouts/DashboardLayout"
import { Paperclip, Send, Search, User, Users, ChevronLeft } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { format } from "date-fns"
import Echo from "laravel-echo"

interface UserType {
  user_id: string
  first_name: string
  last_name: string
  profile_picture: string | null
}

interface ReadReceipt {
  id: string
  userId: string
  readAt: string
  user: UserType
}

interface Message {
  message_id: string
  content: string
  timestamp: string
  senderId: string
  recipientId: string | null
  sender: UserType
  readBy: ReadReceipt[]
  media?: any
}

interface ConversationParticipant {
  id: string
  userId: string
  joinedAt: string
  lastSeen: string
  user: UserType
}

interface Conversation {
  id: string
  title: string | null
  isGroup: boolean
  participants: ConversationParticipant[]
  messages: Message[]
  createdAt: string
  updatedAt: string
  unread_count: number
}

interface PageProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
}

export default function Index({ conversations, currentConversation }: PageProps) {
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredConversations, setFilteredConversations] = useState(conversations)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter((conversation) => {
        // For group chats, search in the title
        if (conversation.isGroup && conversation.title) {
          return conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
        }

        // For direct messages, search in the other participant's name
        const otherParticipants = conversation.participants.filter(
          (participant) => participant.user.user_id !== (window as any).auth?.user?.user_id,
        )

        return otherParticipants.some((participant) =>
          `${participant.user.first_name} ${participant.user.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      })

      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations])

  // Scroll to bottom of messages when conversation changes or new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentConversation])

  // Listen for new messages with Laravel Echo
  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.MIX_PUSHER_APP_KEY,
      cluster: process.env.MIX_PUSHER_APP_CLUSTER,
      forceTLS: true,
    })

    const userId = (window as any).auth?.user?.user_id

    if (userId) {
      echo.private(`user.${userId}`).listen("NewMessage", (e: any) => {
        // Refresh the page to get the new message
        // In a production app, you might want to update the state instead
        router.reload()
      })
    }

    return () => {
      echo.leave(`user.${userId}`)
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !currentConversation) return

    router.post(
      route("messages.store", currentConversation.id),
      {
        content: message,
      },
      {
        preserveScroll: true,
        onSuccess: () => setMessage(""),
      },
    )
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const userId = (window as any).auth?.user?.user_id
    return conversation.participants.find((p) => p.userId !== userId)?.user
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "h:mm a")
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    return format(date, "MMM d, yyyy")
  }

  return (
    <DashboardLayout>
      <Head title="Messages" />

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Conversation List */}
        <div className={`w-full md:w-80 border-r ${currentConversation ? "hidden md:block" : "block"}`}>
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Messages</h1>
            <div className="mt-2 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No conversations found</div>
            ) : (
              <div>
                {filteredConversations
                  .filter((conv) => activeTab === "all" || conv.unread_count > 0)
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((conversation) => {
                    const otherUser = getOtherParticipant(conversation)
                    const lastMessage = conversation.messages[conversation.messages.length - 1]

                    return (
                      <div
                        key={conversation.id}
                        className={`p-3 border-b hover:bg-muted cursor-pointer ${
                          currentConversation?.id === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => router.get(route("messages.show", conversation.id))}
                      >
                        <div className="flex items-center gap-3">
                          {conversation.isGroup ? (
                            <Avatar>
                              <AvatarFallback>
                                <Users className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar>
                              {otherUser?.profile_picture ? (
                                <AvatarImage src={otherUser.profile_picture} />
                              ) : (
                                <AvatarFallback>
                                  {otherUser?.first_name.charAt(0)}
                                  {otherUser?.last_name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}

                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">
                                {conversation.isGroup
                                  ? conversation.title
                                  : `${otherUser?.first_name} ${otherUser?.last_name}`}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(lastMessage.timestamp)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage?.content || "No messages yet"}
                              </p>

                              {conversation.unread_count > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Conversation Area */}
        <div className={`flex-1 flex flex-col ${!currentConversation ? "hidden md:flex" : "flex"}`}>
          {currentConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => router.get(route("messages.index"))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {currentConversation.isGroup ? (
                  <Avatar>
                    <AvatarFallback>
                      <Users className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    {getOtherParticipant(currentConversation)?.profile_picture ? (
                      <AvatarImage src={getOtherParticipant(currentConversation)?.profile_picture || ""} />
                    ) : (
                      <AvatarFallback>
                        {getOtherParticipant(currentConversation)?.first_name.charAt(0)}
                        {getOtherParticipant(currentConversation)?.last_name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}

                <div>
                  <h2 className="font-bold">
                    {currentConversation.isGroup
                      ? currentConversation.title
                      : `${getOtherParticipant(currentConversation)?.first_name} ${getOtherParticipant(currentConversation)?.last_name}`}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.isGroup
                      ? `${currentConversation.participants.length} participants`
                      : "Active now"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {currentConversation.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No messages yet</h3>
                      <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentConversation.messages.map((msg, index) => {
                      const isCurrentUser = msg.senderId === (window as any).auth?.user?.user_id
                      const showDate =
                        index === 0 ||
                        formatDate(currentConversation.messages[index - 1].timestamp) !== formatDate(msg.timestamp)

                      return (
                        <React.Fragment key={msg.message_id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <div className="bg-muted px-3 py-1 rounded-full text-xs">{formatDate(msg.timestamp)}</div>
                            </div>
                          )}

                          <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            <div className="flex gap-2 max-w-[80%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  {msg.sender.profile_picture ? (
                                    <AvatarImage src={msg.sender.profile_picture} />
                                  ) : (
                                    <AvatarFallback>
                                      {msg.sender.first_name.charAt(0)}
                                      {msg.sender.last_name.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              )}

                              <div>
                                <div
                                  className={`rounded-lg p-3 ${
                                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}
                                >
                                  <p>{msg.content}</p>
                                </div>

                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                  <span>{formatTime(msg.timestamp)}</span>
                                  {isCurrentUser && (
                                    <span className="ml-2">{msg.readBy.length > 0 ? "Read" : "Delivered"}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />

                  <Button type="submit" className="shrink-0" disabled={!message.trim()}>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}