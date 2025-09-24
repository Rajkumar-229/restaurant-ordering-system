"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, ChefHat, Bell, Download, Star } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { DigitalBill } from "./digital-bill"

interface OrderConfirmationProps {
  onClose: () => void
  onGenerateBill: () => void
}

export function OrderConfirmation({ onClose, onGenerateBill }: OrderConfirmationProps) {
  const { state } = useOrder()
  const [estimatedTime, setEstimatedTime] = useState(25)
  const [orderStatus, setOrderStatus] = useState<"confirmed" | "preparing" | "ready">("confirmed")
  const [showBill, setShowBill] = useState(false)

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  // Simulate order status progression
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setOrderStatus("preparing")
      setEstimatedTime(20)
    }, 3000)

    const timer2 = setTimeout(() => {
      setOrderStatus("ready")
      setEstimatedTime(0)
    }, 15000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const getStatusInfo = () => {
    switch (orderStatus) {
      case "confirmed":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: "Order Confirmed!",
          description: "Your order has been confirmed and sent to the kitchen",
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
        }
      case "preparing":
        return {
          icon: <ChefHat className="w-6 h-6 text-orange-600" />,
          title: "Being Prepared",
          description: "Our chefs are preparing your delicious meal",
          color: "text-orange-600",
          bgColor: "bg-orange-50 border-orange-200",
        }
      case "ready":
        return {
          icon: <Bell className="w-6 h-6 text-blue-600" />,
          title: "Order Ready!",
          description: "Your order is ready and will be served shortly",
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
        }
    }
  }

  const handleGenerateBill = () => {
    setShowBill(true)
  }

  if (showBill) {
    return <DigitalBill onClose={() => setShowBill(false)} />
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${statusInfo.bgColor}`}>
            {statusInfo.icon}
          </div>
          <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
          <CardDescription>{statusInfo.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto">
          {/* Order Status */}
          <div className={`p-4 rounded-lg border ${statusInfo.bgColor}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Order #{state.orderId}</span>
              <Badge variant="secondary">Table #{state.tableNumber}</Badge>
            </div>
            {estimatedTime > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {estimatedTime} minutes</span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Items</h3>
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
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
              <span>Total Paid</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer:</span>
              <span>{state.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Table:</span>
              <span>#{state.tableNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment:</span>
              <span className="capitalize">{state.paymentMethod || "Card"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleGenerateBill} variant="outline" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Bill
            </Button>

            <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Star className="w-4 h-4 mr-2" />
              Rate Your Experience
            </Button>
          </div>

          {/* Thank You Message */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for choosing GetMeChai!</p>
            <p>We hope you enjoy your meal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
