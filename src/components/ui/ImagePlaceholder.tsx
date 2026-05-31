interface ImagePlaceholderProps {
  label: string
  aspectRatio?: string
  className?: string
}

export function ImagePlaceholder({
  label,
  aspectRatio = 'aspect-video',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} ${className} bg-gradient-to-br from-sage/30 to-forest/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-sage/50`}
      role="img"
      aria-label={label}
    >
      <div className="text-center p-4">
        <div className="text-4xl mb-2">🌿</div>
        <p className="text-sm text-forest/60 font-medium">[Photo à remplacer]</p>
        <p className="text-xs text-brown/50 mt-1">{label}</p>
      </div>
    </div>
  )
}
