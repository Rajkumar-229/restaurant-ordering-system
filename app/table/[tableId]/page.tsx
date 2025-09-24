"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, ShoppingCart, MapPin, Users } from "lucide-react"
import { MenuDisplay } from "@/components/menu-display"
import { OrderSummary } from "@/components/order-summary"
import { useOrder } from "@/lib/order-context"
import { useState } from "react"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isVeg: boolean
  spiceLevel?: "mild" | "medium" | "hot"
}

export interface OrderItem extends MenuItem {
  quantity: number
}

const sampleMenu: MenuItem[] = [
  {
    id: "1",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with aromatic herbs and spices",
    price: 45,
    category: "Beverages",
    image: "/masala-chai-tea-cup.jpg",
    isVeg: true,
    spiceLevel: "mild",
  },
  {
    id: "2",
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken pieces",
    price: 285,
    category: "Main Course",
    image: "/butter-chicken-curry.png",
    isVeg: false,
    spiceLevel: "medium",
  },
  {
    id: "3",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in aromatic spices",
    price: 225,
    category: "Starters",
    image: "/paneer-tikka-grilled.jpg",
    isVeg: true,
    spiceLevel: "medium",
  },
  {
    id: "4",
    name: "Biryani",
    description: "Fragrant basmati rice with spices and your choice of protein",
    price: 320,
    category: "Main Course",
    image: "/chicken-biryani-rice.jpg",
    isVeg: false,
    spiceLevel: "hot",
  },
  {
    id: "5",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 35,
    category: "Starters",
    image: "/samosa-crispy-pastry.jpg",
    isVeg: true,
    spiceLevel: "mild",
  },
  {
    id: "6",
    name: "Kulfi",
    description: "Traditional Indian ice cream with cardamom and pistachios",
    price: 85,
    category: "Desserts",
    image: "/kulfi-indian-ice-cream.jpg",
    isVeg: true,
  },
]

// Table information lookup
const tableInfo = {
  "1": { section: "Garden", capacity: 2, server: "Raj" },
  "2": { section: "Garden", capacity: 4, server: "Raj" },
  "3": { section: "Indoor", capacity: 2, server: "Priya" },
  "4": { section: "Indoor", capacity: 4, server: "Priya" },
  "5": { section: "Indoor", capacity: 6, server: "Amit" },
  "12": { section: "VIP", capacity: 4, server: "Neha" },
  "15": { section: "Terrace", capacity: 8, server: "Vikram" },
}

export default function TablePage() {
  const params = useParams()
  const tableId = params.tableId as string
  const { state, dispatch } = useOrder()
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const currentTable = tableInfo[tableId as keyof typeof tableInfo] || {
    section: "Main",
    capacity: 4,
    server: "Staff",
  }

  useEffect(() => {
    // Set table number when component mounts
    dispatch({
      type: "SET_CUSTOMER_DETAILS",
      payload: { name: state.customerName, tableNumber: tableId },
    })
  }, [tableId, dispatch, state.customerName])

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">GetMeChai</h1>
                <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Table #{tableId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {currentTable.section}
                  </span>
                  <span>Server: {currentTable.server}</span>
                </div>
              </div>
            </div>
            {getTotalItems() > 0 && (
              <Button
                onClick={() => setShowOrderSummary(true)}
                className="relative bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Order
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">{getTotalItems()}</Badge>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Table Welcome Card */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Welcome to Table #{tableId}
            </CardTitle>
            <CardDescription>
              {currentTable.section} Section • Capacity: {currentTable.capacity} guests • Your server:{" "}
              {currentTable.server}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse our menu below and add items to your order. You can modify quantities and proceed to payment when
              ready.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-balance mb-2">Our Menu</h2>
          <p className="text-muted-foreground text-pretty">
            Authentic flavors crafted with love. All prices include taxes.
          </p>
        </div>

        <MenuDisplay menu={sampleMenu} />
      </div>

      {/* Order Summary Modal */}
      {showOrderSummary && <OrderSummary onClose={() => setShowOrderSummary(false)} />}

      {/* Floating Order Button */}
      {getTotalItems() > 0 && !showOrderSummary && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setShowOrderSummary(true)}
            size="lg"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />₹{getTotalPrice()}
            <Badge className="ml-2 bg-primary-foreground text-primary">{getTotalItems()}</Badge>
          </Button>
        </div>
      )}
    </div>
  )
}
