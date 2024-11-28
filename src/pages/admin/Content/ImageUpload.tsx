'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  currentImage: string
  onImageChange: (imageUrl: string) => void
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
        onImageChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <Label htmlFor="image" className="cursor-pointer">
          <Label htmlFor="image" className="cursor-pointer">
            <Button type="button" variant="outline">
              Resim Seç
            </Button>
          </Label>
        </Label>
        {previewImage && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setPreviewImage(null)
              onImageChange('')
            }}
          >
            Resmi Kaldır
          </Button>
        )}
      </div>
      {previewImage && (
        <div className="mt-4">
          <img 
            src={previewImage} 
            alt="Etkinlik görseli" 
            className="max-w-xs h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

