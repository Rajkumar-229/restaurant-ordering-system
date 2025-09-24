"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, CreditCard, Smartphone, Wallet, Shield, CheckCircle, Loader2, ArrowLeft, Lock } from "lucide-react"
import { useOrder } from "@/lib/order-context"

interface PaymentGatewayProps {
  onClose: () => void
  onPaymentSuccess: () => void
}

export function PaymentGateway({ onClose, onPaymentSuccess }: PaymentGatewayProps) {
  const { state } = useOrder()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [upiId, setUpiId] = useState("")

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate order ID
    const orderId = `GMC${Date.now().toString().slice(-6)}`

    setIsProcessing(false)
    onPaymentSuccess()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Payment
            </CardTitle>
            <CardDescription>Complete your order payment</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto">
          {/* Order Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Table #{state.tableNumber}</span>
              <Badge variant="secondary">{state.items.length} items</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet
              </TabsTrigger>
            </TabsList>

            {/* Card Payment */}
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* UPI Payment */}
            <TabsContent value="upi" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col gap-1 bg-transparent">
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <span className="text-xs">PhonePe</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1 bg-transparent">
                    <div className="w-8 h-8 bg-purple-600 rounded"></div>
                    <span className="text-xs">Paytm</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1 bg-transparent">
                    <div className="w-8 h-8 bg-green-600 rounded"></div>
                    <span className="text-xs">GPay</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Wallet Payment */}
            <TabsContent value="wallet" className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full h-16 flex items-center justify-between bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Amazon Pay</div>
                      <div className="text-sm text-muted-foreground">Balance: ₹2,450</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </Button>
                <Button variant="outline" className="w-full h-16 flex items-center justify-between bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Paytm Wallet</div>
                      <div className="text-sm text-muted-foreground">Balance: ₹1,200</div>
                    </div>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay ₹{total}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
