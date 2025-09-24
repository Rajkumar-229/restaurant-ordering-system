"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { MenuItem, OrderItem } from "@/app/table/[tableId]/page"

interface OrderState {
  items: OrderItem[]
  customerName: string
  tableNumber: string
  phoneNumber: string
  orderStatus: "cart" | "payment" | "confirmed" | "preparing" | "ready" | "completed"
  orderId?: string
  otp?: string
  paymentMethod?: string
  paymentId?: string
}

type OrderAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "SET_CUSTOMER_DETAILS"; payload: { name: string; tableNumber: string; phoneNumber?: string } }
  | { type: "SET_ORDER_STATUS"; payload: OrderState["orderStatus"] }
  | { type: "SET_ORDER_ID"; payload: string }
  | { type: "SET_OTP"; payload: string }
  | { type: "SET_PAYMENT_DETAILS"; payload: { method: string; paymentId: string } }
  | { type: "CLEAR_ORDER" }

const initialState: OrderState = {
  items: [],
  customerName: "",
  tableNumber: "12",
  phoneNumber: "",
  orderStatus: "cart",
}

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case "REMOVE_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload)
      if (existingItem && existingItem.quantity > 1) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity === 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.itemId),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    }
    case "SET_CUSTOMER_DETAILS":
      return {
        ...state,
        customerName: action.payload.name,
        tableNumber: action.payload.tableNumber,
        phoneNumber: action.payload.phoneNumber || state.phoneNumber,
      }
    case "SET_ORDER_STATUS":
      return {
        ...state,
        orderStatus: action.payload,
      }
    case "SET_ORDER_ID":
      return {
        ...state,
        orderId: action.payload,
      }
    case "SET_OTP":
      return {
        ...state,
        otp: action.payload,
      }
    case "SET_PAYMENT_DETAILS":
      return {
        ...state,
        paymentMethod: action.payload.method,
        paymentId: action.payload.paymentId,
      }
    case "CLEAR_ORDER":
      return initialState
    default:
      return state
  }
}

const OrderContext = createContext<{
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
} | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  return <OrderContext.Provider value={{ state, dispatch }}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
