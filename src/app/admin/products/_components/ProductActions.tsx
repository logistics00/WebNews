"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { deleteProduct, toggleProductAvailability } from "../../_actions/products"
import { useRouter } from "next/navigation"
import logging from "@/lib/logging"

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase
}: {
  id: string,
  isAvailableForPurchase: boolean
}){
  logging({rootPath:"admin/products/_components/ProductActions.tsx[16]",func:"ActiveToggleDropdownItem"})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase)
          router.refresh()
        })
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({
   id,
   disabled
  }: {
    id: string,
    disabled: boolean
  }){
  logging({rootPath:"admin/products/_components/ProductActions.tsx[41]",func:"DeleteDropdownItem"})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id)
          router.refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}
