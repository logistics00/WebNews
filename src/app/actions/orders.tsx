"use server"

import db from "@/db/db"
import logging from "@/lib/logging"

export async function userOrderExists(email: string, productId: string) {
  logging({rootPath:"actions/orders.tsx[7]",func:"userOrderExists"})
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
