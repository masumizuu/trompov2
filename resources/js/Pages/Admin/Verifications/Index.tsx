"use client"

import React from "react"
import { Head, Link, router } from "@inertiajs/react"
import { route } from "ziggy-js"
import Layout from "@/Layouts/AdminLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Label } from "@/Components/ui/label"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"

interface Verification {
  id: string
  type: "user" | "business"
  status: "pending" | "approved" | "denied"
  created_at: string
  entity: {
    id: string
    name: string
    email?: string
  }
  documents: {
    id: string
    name: string
    url: string
  }[]
}

interface VerificationsIndexProps {
  userVerifications: Verification[]
  businessVerifications: Verification[]
}

export default function VerificationsIndex({ userVerifications, businessVerifications }: VerificationsIndexProps) {
  const [selectedVerification, setSelectedVerification] = React.useState<Verification | null>(null)
  const [denialReason, setDenialReason] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const approveVerification = (verification: Verification) => {
    router.post(route(`admin.verifications.${verification.type}.approve`, { id: verification.id }))
  }

  const denyVerification = () => {
    if (!selectedVerification) return

    router.post(route(`admin.verifications.${selectedVerification.type}.deny`, { id: selectedVerification.id }), {
      reason: denialReason,
    })

    setIsDialogOpen(false)
    setDenialReason("")
    setSelectedVerification(null)
  }

  const handleDenyClick = (verification: Verification) => {
    setSelectedVerification(verification)
    setIsDialogOpen(true)
  }

  const renderVerificationTable = (verifications: Verification[], type: "user" | "business") => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {type === "user" && <TableHead>Email</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((verification) => (
            <TableRow key={verification.id}>
              <TableCell className="font-medium">
                <Link href={route(`admin.${type}s.show`, { id: verification.entity.id })} className="hover:text-primary">
                  {verification.entity.name}
                </Link>
              </TableCell>
              {type === "user" && <TableCell>{verification.entity.email}</TableCell>}
              <TableCell>
                <Badge
                  variant={
                    verification.status === "pending"
                      ? "outline"
                      : verification.status === "approved"
                        ? "success"
                        : "destructive"
                  }
                >
                  {verification.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(verification.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{verification.documents.length} documents</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={route(`admin.verifications.${type}.show`, { id: verification.id })}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>

                  {verification.status === "pending" && (
                    <>
                      <Button variant="default" size="sm" onClick={() => approveVerification(verification)}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDenyClick(verification)}>
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Deny</span>
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Layout>
      <Head title="Verifications" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Verifications</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search verifications..." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="user">User Verifications</TabsTrigger>
            <TabsTrigger value="business">Business Verifications</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            {userVerifications.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center text-gray-500">
                No user verification requests found.
              </div>
            ) : (
              renderVerificationTable(userVerifications, "user")
            )}
          </TabsContent>

          <TabsContent value="business">
            {businessVerifications.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center text-gray-500">
                No business verification requests found.
              </div>
            ) : (
              renderVerificationTable(businessVerifications, "business")
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for denying this verification request. This will be sent to the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for denial</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for denial..."
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={denyVerification} disabled={!denialReason.trim()}>
              Deny Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
