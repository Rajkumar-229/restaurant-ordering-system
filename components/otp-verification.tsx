"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, RefreshCw, Shield, Smartphone } from "lucide-react"
import { useOrder } from "@/lib/order-context"

interface OTPVerificationProps {
  onVerificationSuccess: () => void
  onClose: () => void
}

export function OTPVerification({ onVerificationSuccess, onClose }: OTPVerificationProps) {
  const { state, dispatch } = useOrder()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [generatedOTP, setGeneratedOTP] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Generate OTP on component mount
  useEffect(() => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
    dispatch({ type: "SET_OTP", payload: newOTP })
    console.log("Generated OTP:", newOTP) // In real app, this would be sent via SMS
  }, [dispatch])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOTP = [...otp]
    newOTP[index] = value

    setOtp(newOTP)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits are entered
    if (newOTP.every((digit) => digit !== "") && newOTP.join("").length === 6) {
      handleVerifyOTP(newOTP.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async (otpToVerify?: string) => {
    const otpValue = otpToVerify || otp.join("")
    if (otpValue.length !== 6) return

    setIsVerifying(true)

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (otpValue === generatedOTP) {
      dispatch({ type: "SET_ORDER_STATUS", payload: "preparing" })
      setIsVerifying(false)
      onVerificationSuccess()
    } else {
      setIsVerifying(false)
      alert("Invalid OTP. Please try again.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResendOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
    dispatch({ type: "SET_OTP", payload: newOTP })
    setTimeLeft(300)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
    console.log("New OTP:", newOTP) // In real app, this would be sent via SMS
  }

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Order</CardTitle>
          <CardDescription>We've sent a 6-digit OTP to your phone number for order confirmation</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order #{state.orderId}</span>
              <Badge variant="secondary">Table #{state.tableNumber}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer</span>
              <span className="text-sm">{state.customerName}</span>
            </div>
          </div>

          {/* Phone Number Display */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>OTP sent to +91 ****-***-{state.phoneNumber?.slice(-3) || "XXX"}</span>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Demo OTP Display */}
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">Demo Mode</p>
              <p className="text-xs text-yellow-700">Use OTP: {generatedOTP}</p>
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="text-center space-y-3">
            {!canResend ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Resend OTP in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <Button variant="outline" onClick={handleResendOTP} className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="w-4 h-4" />
                Resend OTP
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerifyOTP()}
            disabled={otp.some((digit) => digit === "") || isVerifying}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Verify & Confirm Order
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>This OTP is valid for 5 minutes and ensures your order security</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
