'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ImageAsset } from '@/lib/invitation-config'
import { cn } from '@/lib/utils'

type ArtworkProps = {
  asset: ImageAsset | null
  className?: string
  imageClassName?: string
  sizes: string
  priority?: boolean
  /** Rendered when the asset is missing or fails to load, so layouts never show broken images. */
  fallback?: React.ReactNode
}

export function Artwork({ asset, className, imageClassName, sizes, priority, fallback }: ArtworkProps) {
  const [failed, setFailed] = useState(false)

  if (!asset || failed) {
    return (
      <div className={cn('relative overflow-hidden', className)} aria-hidden="true">
        {fallback ?? <SunStripeFallback />}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={asset.src || '/placeholder.svg'}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn('object-cover', imageClassName)}
      />
    </div>
  )
}

function SunStripeFallback() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-[3] bg-sun" />
      <div className="flex-[2] bg-sea" />
      <div className="h-6 bg-olive" />
    </div>
  )
}
