'use client'

import { useRef, useState } from 'react'

// Downscale + re-encode to JPEG entirely in the browser (no library, no
// network) so large phone photos and HEIC files upload reliably. Falls back to
// the original file if the browser can't decode it.
async function compress(
  file: File,
  maxSize = 1600,
  quality = 0.85,
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image',
    })
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) return file
    const base = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export function ImageUpload({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setBusy(true)
    try {
      const optimized = await compress(file)
      const dt = new DataTransfer()
      dt.items.add(optimized)
      if (ref.current) ref.current.files = dt.files
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className={className}
      />
      {busy && (
        <span className="mt-1 block text-xs text-zinc-500">Optimizing…</span>
      )}
    </>
  )
}
