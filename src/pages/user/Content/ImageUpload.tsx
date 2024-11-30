'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  currentImage: string | null
  onImageChange: (file: File | null) => void
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 transition-colors cursor-pointer group"
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Etkinlik Önizleme"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Etkinlik görseli yüklemek için tıklayın</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG veya GIF • Max 2MB</p>
          </div>
        )}
      </div>
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}