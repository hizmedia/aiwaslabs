'use client'

import Image from 'next/image'
import { UploadButton } from '@/lib/uploadthing'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ value, onChange }: Props) {
  const filled = value.filter(Boolean)

  function remove(i: number) {
    onChange(filled.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      {/* Thumbnails */}
      {filled.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {filled.map((url, i) => (
            <div key={url} className="group relative h-[72px] w-[72px] overflow-hidden rounded-[10px] border border-[#dde4f0]">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(0,0,0,.55)] text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,.4)] py-[2px] text-center font-poppins text-[8px] text-white opacity-0 transition group-hover:opacity-100">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <UploadButton
        endpoint="productImage"
        onClientUploadComplete={res => {
          onChange([...filled, ...res.map(f => f.ufsUrl)])
        }}
        onUploadError={err => alert(`Upload error: ${err.message}`)}
        appearance={{
          button:
            'rounded-[10px] border border-[#dde4f0] bg-[#F7F6FC] px-4 py-2 font-poppins text-[12px] font-semibold text-[#02034a] hover:border-[#00B4D8] hover:text-[#00B4D8] transition after:hidden ut-uploading:bg-[rgba(0,180,216,.08)] ut-uploading:border-[#00B4D8]',
          allowedContent: 'hidden',
          container: 'w-fit',
        }}
        content={{
          button({ ready, isUploading }) {
            if (isUploading) return 'Uploading…'
            if (ready) return filled.length === 0 ? '+ Upload images' : '+ Add more images'
            return 'Loading…'
          },
        }}
      />

      <p className="mt-1.5 font-poppins text-[10.5px] text-[#a0aec0]">
        JPG, PNG or WebP · max 4 MB each · up to 6 images
      </p>
    </div>
  )
}
