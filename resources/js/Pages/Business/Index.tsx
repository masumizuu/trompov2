import { Head, Link , usePage } from "@inertiajs/react"
import { route } from "ziggy-js"
import Layout from "@/Layouts/DashboardLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent } from "@/Components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Badge } from "@/Components/ui/badge"
import { Star, MapPin, Plus, Search } from "lucide-react"

interface Business {
  id: string
  name: string
  description: string
  category: string
  location: string
  rating: number
  verified: boolean
  image: string
}

interface BusinessIndexProps {
  businesses: Business[]
  categories: string[]
  locations: string[]
}

export default function BusinessIndex({ businesses, categories, locations }: BusinessIndexProps) {
  const { route } = usePage().props

  return (
    <Layout>
      <Head title="Businesses" />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Businesses</h1>
          <Button asChild className="mt-2 sm:mt-0">
            <Link href={route("businesses.create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search businesses..." className="pl-10" />
            </div>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
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
                <SelectItem value="low">$ - Low</SelectItem>
                <SelectItem value="medium">$ - Medium</SelectItem>
                <SelectItem value="high">$$ - High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={business.image || "/placeholder.jpg"}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                {business.verified && <Badge className="absolute top-2 right-2 bg-green-500">Verified</Badge>}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">
                    <Link href={route("businesses.show", business.id)} className="hover:text-primary">
                      {business.name}
                    </Link>
                  </h2>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{business.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{business.location}</span>
                </div>
                <Badge variant="outline" className="mt-2">
                  {business.category}
                </Badge>
                <p className="mt-3 text-sm line-clamp-2 text-gray-600">{business.description}</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={route("businesses.show", business.id)}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
