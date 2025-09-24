"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingCart, User, MapPin } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { PaymentGateway } from "./payment-gateway"
import { OTPVerification } from "./otp-verification"
import { OrderConfirmation } from "./order-confirmation"

interface OrderSummaryProps {
  onClose: () => void
}

export function OrderSummary({ onClose }: OrderSummaryProps) {
  const { state, dispatch } = useOrder()
  const [customerName, setCustomerName] = useState(state.customerName)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + tax

  const handleProceedToPayment = () => {
    if (!customerName.trim()) {
      alert("Please enter your name")
      return
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    dispatch({
      type: "SET_CUSTOMER_DETAILS",
      payload: { name: customerName, tableNumber: state.tableNumber, phoneNumber },
    })

    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    // Generate order ID and proceed to OTP verification
    const orderId = `GMC${Date.now().toString().slice(-6)}`
    dispatch({ type: "SET_ORDER_ID", payload: orderId })
    dispatch({ type: "SET_ORDER_STATUS", payload: "confirmed" })

    setShowPayment(false)
    setShowOTP(true)
  }

  const handleOTPSuccess = () => {
    setShowOTP(false)
    setShowConfirmation(true)
  }

  const handleGenerateBill = () => {
    // This will be handled in the next task
    console.log("Generating digital bill...")
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
  }

  if (showConfirmation) {
    return <OrderConfirmation onClose={onClose} onGenerateBill={handleGenerateBill} />
  }

  if (showOTP) {
    return <OTPVerification onVerificationSuccess={handleOTPSuccess} onClose={() => setShowOTP(false)} />
  }

  if (showPayment) {
    return <PaymentGateway onClose={() => setShowPayment(false)} onPaymentSuccess={handlePaymentSuccess} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </CardTitle>
            <CardDescription>Review your order before proceeding</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Details
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                />
              </div>
              <div>
                <Label htmlFor="tableNumber">Table Number</Label>
                <div className="flex items-center gap-2">
                  <Input id="tableNumber" value={`Table #${state.tableNumber}`} disabled className="bg-muted" />
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Confirmed
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Order Items ({state.items.reduce((total, item) => total + item.quantity, 0)} items)
            </h3>
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-semibold w-16 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Bill Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <Button
            onClick={handleProceedToPayment}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
