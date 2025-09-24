"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Download, Share2, Printer, CheckCircle, QrCode, MapPin, Clock, CreditCard } from "lucide-react"
import { useOrder } from "@/lib/order-context"

interface DigitalBillProps {
  onClose: () => void
}

export function DigitalBill({ onClose }: DigitalBillProps) {
  const { state } = useOrder()
  const [isDownloading, setIsDownloading] = useState(false)
  const billRef = useRef<HTMLDivElement>(null)

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax
  const currentDate = new Date()
  const billNumber = `BILL-${state.orderId}`

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would generate and download a PDF
    const billData = {
      billNumber,
      orderId: state.orderId,
      date: currentDate.toISOString(),
      customer: state.customerName,
      table: state.tableNumber,
      items: state.items,
      subtotal,
      tax,
      total,
      paymentMethod: state.paymentMethod || "Card",
    }

    const dataStr = JSON.stringify(billData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `GetMeChai_Bill_${state.orderId}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    setIsDownloading(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GetMeChai Bill - Order #${state.orderId}`,
          text: `Your bill for ₹${total} at GetMeChai, Table #${state.tableNumber}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `GetMeChai Bill - Order #${state.orderId}\nTotal: ₹${total}\nTable: #${state.tableNumber}`,
      )
      alert("Bill details copied to clipboard!")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Digital Bill
            </CardTitle>
            <CardDescription>Your order receipt and bill details</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto">
          {/* Bill Content */}
          <div ref={billRef} className="space-y-6 bg-white p-6 rounded-lg border print:shadow-none print:border-none">
            {/* Restaurant Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-primary">GetMeChai</h1>
              </div>
              <p className="text-sm text-muted-foreground">Smart Restaurant Ordering System</p>
              <p className="text-xs text-muted-foreground">
                123 Food Street, Gourmet District
                <br />
                Phone: +91 98765 43210 | Email: orders@getmechai.com
                <br />
                GSTIN: 29ABCDE1234F1Z5
              </p>
            </div>

            <Separator />

            {/* Bill Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Bill No:</p>
                  <p className="font-medium">{billNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order ID:</p>
                  <p className="font-medium">#{state.orderId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date & Time:</p>
                  <p className="font-medium">{currentDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{currentDate.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Table:</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />#{state.tableNumber}
                  </p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Customer Details</Badge>
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Name:</span> {state.customerName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone:</span> +91 ****-***-
                    {state.phoneNumber?.slice(-3) || "XXX"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Payment:</span> {state.paymentMethod || "Card"}{" "}
                    <CreditCard className="w-3 h-3 inline ml-1" />
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold">Order Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {state.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 text-sm">
                    <div className="col-span-6">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex gap-2 mt-1">
                        {item.isVeg && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Veg
                          </Badge>
                        )}
                        {item.spiceLevel && (
                          <Badge variant="outline" className="text-xs">
                            {item.spiceLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">₹{item.price}</div>
                    <div className="col-span-2 text-right font-medium">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Bill Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({state.items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>CGST (9%)</span>
                <span>₹{Math.round(tax / 2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>SGST (9%)</span>
                <span>₹{Math.round(tax / 2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Amount Paid: ₹{total} | Payment Status: <span className="text-green-600 font-medium">Completed</span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Order completed at {currentDate.toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Thank you for dining with GetMeChai!
                <br />
                Please rate your experience and visit us again.
              </p>
              <div className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                <p>This is a computer generated bill and does not require signature.</p>
                <p>For any queries, contact us at support@getmechai.com</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 print:hidden">
            <Button onClick={handleDownload} disabled={isDownloading} variant="outline" className="bg-transparent">
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloading ? "Saving..." : "Download"}
            </Button>

            <Button onClick={handleShare} variant="outline" className="bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button onClick={handlePrint} variant="outline" className="bg-transparent">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground print:hidden"
            size="lg"
          >
            Close Bill
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
