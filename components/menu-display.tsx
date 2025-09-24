"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Leaf, Flame } from "lucide-react"
import type { MenuItem } from "@/app/page"
import { useOrder } from "@/lib/order-context"

interface MenuDisplayProps {
  menu: MenuItem[]
}

export function MenuDisplay({ menu }: MenuDisplayProps) {
  const { state, dispatch } = useOrder()
  const categories = Array.from(new Set(menu.map((item) => item.category)))

  const getItemQuantity = (itemId: string) => {
    const orderItem = state.items.find((item) => item.id === itemId)
    return orderItem ? orderItem.quantity : 0
  }

  const getSpiceLevelColor = (level?: string) => {
    switch (level) {
      case "mild":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hot":
        return "text-red-600"
      default:
        return "text-gray-400"
    }
  }

  const addToOrder = (item: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromOrder = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId })
  }

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="text-sm">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu
              .filter((item) => item.category === category)
              .map((item) => {
                const quantity = getItemQuantity(item.id)
                return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.isVeg && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            <Leaf className="w-3 h-3 mr-1" />
                            Veg
                          </Badge>
                        )}
                        {item.spiceLevel && (
                          <Badge variant="outline" className="bg-white/90">
                            <Flame className={`w-3 h-3 mr-1 ${getSpiceLevelColor(item.spiceLevel)}`} />
                            {item.spiceLevel}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <span className="text-lg font-bold text-primary">₹{item.price}</span>
                      </div>
                      <CardDescription className="text-sm text-pretty">{item.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {quantity === 0 ? (
                        <Button
                          onClick={() => addToOrder(item)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Order
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromOrder(item.id)}
                            className="w-10 h-10 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-semibold px-4">{quantity}</span>
                          <Button
                            size="sm"
                            onClick={() => addToOrder(item)}
                            className="w-10 h-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
