'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTransition } from 'react'
import { deleteWebNews } from '../../_actions/webnews'
import { useRouter } from 'next/navigation'

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteWebNews(id)
          router.refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}
