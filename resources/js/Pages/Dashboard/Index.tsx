import { Head } from "@inertiajs/react"
import Layout from "@/Layouts/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Building2, ShoppingBag, MessageSquare, Star, AlertTriangle, Users } from "lucide-react"

interface DashboardProps {
  stats: {
    businesses: number
    sellables: number
    messages: number
    reviews: number
    disputes: number
    verifications: number
  }
  user: {
    name: string
    role: string
  }
}

export default function Dashboard({ stats, user }: DashboardProps) {
  return (
    <Layout user={user}>
      <Head title="Dashboard" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Businesses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.businesses}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "admin" ? "Total businesses" : "Your businesses"}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sellables</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sellables}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "admin" ? "Total sellables" : "Your sellables"}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviews}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "admin" ? "Total reviews" : "Reviews for your businesses"}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Reviews
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.disputes}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "admin" ? "Active disputes" : "Your active disputes"}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Disputes
              </Button>
            </CardContent>
          </Card>

          {user.role === "admin" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verifications}</div>
                <p className="text-xs text-muted-foreground">Pending verifications</p>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  View Verifications
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
