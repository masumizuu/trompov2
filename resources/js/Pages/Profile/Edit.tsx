"use client"

import type React from "react"
import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import Layout from "@/Layouts/DashboardLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Upload } from "lucide-react"
import { router, usePage } from "@inertiajs/react"

interface User {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
}

export default function EditProfile({ user, errors, status }: { user: User; errors: any; status?: string }) {
  const { data, setData, post, processing } = useForm({
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    avatar: null as File | null,
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { route } = usePage().props

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData("avatar", file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(
      route("profile.update"),
      {
        ...data,
        _method: "put",
      },
      {
        forceFormData: true,
      },
    )
  }

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(route("password.update"), data)
  }

  return (
    <Layout>
      <Head title="Edit Profile" />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        {status && (
          <Alert className="mb-4">
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Update Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account's profile information and email address.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={handleAvatarChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="w-full"
                      required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      className="w-full"
                      required
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={data.bio}
                      onChange={(e) => setData("bio", e.target.value)}
                      className="w-full min-h-[100px]"
                    />
                    {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                  </div>

                  <Button type="submit" disabled={processing}>
                    {processing ? "Saving..." : "Save"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={data.current_password}
                      onChange={(e) => setData("current_password", e.target.value)}
                      className="w-full"
                      required
                    />
                    {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      className="w-full"
                      required
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData("password_confirmation", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={processing}>
                    {processing ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
