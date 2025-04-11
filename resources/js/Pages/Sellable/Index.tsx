import { Head, Link, usePage } from "@inertiajs/react"
import Layout from "@/Layouts/DashboardLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent } from "@/Components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Badge } from "@/Components/ui/badge"
import { Search, Plus, ShoppingBag } from "lucide-react"

interface Sellable {
  id: string
  name: string
  description: string
  price: number
  available: boolean
  image: string
  business: {
    id: string
    name: string
    verified: boolean
  }
}

interface SellableIndexProps {
  sellables: Sellable[]
  businesses: {
    id: string
    name: string
  }[]
  isOwner: boolean
}

export default function SellableIndex({ sellables, businesses, isOwner }: SellableIndexProps) {
  const { route } = usePage().props

  return (
    <Layout>
      <Head title="Sellables" />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Sellables</h1>
          {isOwner && (
            <Button asChild className="mt-2 sm:mt-0">
              <Link href={route("sellables.create")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sellable
              </Link>
            </Button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search sellables..." className="pl-10" />
            </div>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500+">$500+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellables.map((sellable) => (
            <Card key={sellable.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={sellable.image || "/placeholder.jpg"}
                  alt={sellable.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${sellable.available ? "bg-green-500" : "bg-red-500"}`}>
                  {sellable.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">
                    <Link href={route("sellables.show", sellable.id)} className="hover:text-primary">
                      {sellable.name}
                    </Link>
                  </h2>
                  <span className="font-bold">${sellable.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Link href={route("businesses.show", sellable.business.id)} className="hover:text-primary">
                    {sellable.business.name}
                  </Link>
                  {sellable.business.verified && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-sm line-clamp-2 text-gray-600">{sellable.description}</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={route("sellables.show", sellable.id)}>View Details</Link>
                  </Button>
                  {sellable.available && (
                    <Button size="sm" className="flex-1">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Buy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
