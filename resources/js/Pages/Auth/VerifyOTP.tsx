"use client"

import type React from "react"
import { Link, useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import Layout from "@/Layouts/AuthLayout"
import { route } from "@/Utils/route"

export default function VerifyOTP({ errors, status, email }: { errors: any; status?: string; email: string }) {
  const { data, setData, post, processing } = useForm({
    otp: "",
    email: email || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("verify.otp"))
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
            <CardDescription>Enter the OTP sent to your email</CardDescription>
          </CardHeader>
          <CardContent>
            {status && (
              <Alert className="mb-4">
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={data.otp}
                  onChange={(e) => setData("otp", e.target.value)}
                  className="w-full"
                  required
                />
                {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={route("login")} className="text-sm text-blue-600 hover:underline">
              Back to login
            </Link>
            <Button
              variant="outline"
              onClick={() => post(route("resend.otp", { email: data.email }))}
              disabled={processing}
            >
              Resend OTP
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
