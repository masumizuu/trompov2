import { Head, Link, usePage } from "@inertiajs/react"
import { route } from "ziggy-js"
import Layout from "@/Layouts/DashboardLayout"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Heart,
  MessageSquare,
  Edit,
  AlertTriangle,
  ShoppingBag,
  Plus,
} from "lucide-react"

interface Business {
  id: string
  name: string
  description: string
  category: string
  location: string
  phone: string
  email: string
  website: string
  hours: string
  rating: number
  verified: boolean
  image: string
  owner_id: string
}

interface Sellable {
  id: string
  name: string
  description: string
  price: number
  available: boolean
  image: string
}

interface Review {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  rating: number
  comment: string
  created_at: string
}

interface BusinessShowProps {
  business: Business
  sellables: Sellable[]
  reviews: Review[]
  isOwner: boolean
  isSaved: boolean
}

export default function BusinessShow({ business, sellables, reviews, isOwner, isSaved }: BusinessShowProps) {
  const { auth } = usePage().props as any

  return (
    <Layout>
      <Head title={business.name} />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {business.name}
              {business.verified && <Badge className="ml-2 bg-green-500">Verified</Badge>}
            </h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>
                  {business.rating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{business.location}</span>
              </div>
            </div>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-2">
            {isOwner ? (
              <Button asChild variant="outline">
                <Link href={route("businesses.edit", business.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Business
                </Link>
              </Button>
            ) : (
              <>
                <Button variant={isSaved ? "default" : "outline"}>
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-200 h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={business.image || "/placeholder.jpg"}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="sellables">Sellables</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About {business.name}</h2>
                    <p className="text-gray-700 mb-6">{business.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Phone</h3>
                          <p className="text-gray-600">{business.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-gray-600">{business.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Globe className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Website</h3>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {business.website}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Business Hours</h3>
                          <p className="text-gray-600">{business.hours}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellables">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Sellables</h2>
                      {isOwner && (
                        <Button asChild size="sm">
                          <Link href={route("sellables.create", { business_id: business.id })}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sellable
                          </Link>
                        </Button>
                      )}
                    </div>

                    {sellables.length === 0 ? (
                      <p className="text-gray-500">No sellables available.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sellables.map((sellable) => (
                          <div key={sellable.id} className="border rounded-lg overflow-hidden flex">
                            <div className="w-1/3 bg-gray-200">
                              <img
                                src={sellable.image || "/placeholder.jpg"}
                                alt={sellable.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold">{sellable.name}</h3>
                                <Badge variant={sellable.available ? "success" : "destructive"}>
                                  {sellable.available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{sellable.description}</p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="font-bold">${sellable.price.toFixed(2)}</span>
                                <Button size="sm" disabled={!sellable.available}>
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                  Buy
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Reviews</h2>
                      {auth.user && !isOwner && (
                        <Button asChild size="sm">
                          <Link href={route("reviews.create", { business_id: business.id })}>
                            <Star className="h-4 w-4 mr-2" />
                            Write a Review
                          </Link>
                        </Button>
                      )}
                    </div>

                    {reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start">
                              <img
                                src={review.user.avatar || "/placeholder.jpg"}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full mr-4"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-semibold">{review.user.name}</h3>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Business</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{business.email}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{business.location}</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {!isOwner && auth.user && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Report an Issue</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    If you've encountered a problem with this business, you can file a dispute.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={route("disputes.create", { business_id: business.id })}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      File a Dispute
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {!business.verified && isOwner && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Get Verified</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Verified businesses gain more trust from customers and appear higher in search results.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href={route("business.verification.request", business.id)}>
                      Request Verification
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
