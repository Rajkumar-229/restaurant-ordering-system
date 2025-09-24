"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Scan, ArrowRight, MapPin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [tableNumber, setTableNumber] = useState("")
  const router = useRouter()

  const handleTableAccess = () => {
    if (!tableNumber.trim()) {
      alert("Please enter a table number")
      return
    }
    router.push(`/table/${tableNumber}`)
  }

  const quickAccessTables = ["1", "2", "3", "4", "5", "12", "15"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-primary-foreground">GetMeChai</h1>
                <p className="text-sm text-primary-foreground/80">Smart Restaurant Ordering</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Welcome Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-balance">Welcome to GetMeChai</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Scan the QR code at your table or enter your table number to start ordering
            </p>
          </div>

          {/* QR Code Simulation */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2">
                <Scan className="w-6 h-6 text-primary" />
                QR Code Access
              </CardTitle>
              <CardDescription>In a real restaurant, you would scan the QR code at your table</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Manual Table Entry */}
              <div className="space-y-4">
                <Label htmlFor="tableNumber" className="text-base font-medium">
                  Enter Table Number
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="tableNumber"
                    placeholder="e.g., 12"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="text-center text-lg"
                    onKeyPress={(e) => e.key === "Enter" && handleTableAccess()}
                  />
                  <Button
                    onClick={handleTableAccess}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Access Tables */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Or try these demo tables:</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAccessTables.map((table) => (
                    <Button
                      key={table}
                      variant="outline"
                      onClick={() => router.push(`/table/${table}`)}
                      className="h-12 text-base font-semibold hover:bg-primary hover:text-primary-foreground"
                    >
                      #{table}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center p-6">
              <CardHeader>
                <QrCode className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Contactless Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Scan QR code at your table for a safe, contactless experience
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Table Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Orders are automatically linked to your table number</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Quick & Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Browse menu, order, and pay - all from your phone</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
