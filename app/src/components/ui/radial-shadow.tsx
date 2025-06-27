interface RadialShadowProps {
  position?: 'left' | 'right' | 'center'
  size?: number
  opacity?: number
  className?: string
}

export function RadialShadow({ 
  position = 'right', 
  size = 1000, 
  opacity = 0.15,
  className = '' 
}: RadialShadowProps) {
  const positionClasses = {
    left: 'left-0 -translate-x-1/2',
    right: 'right-0 translate-x-1/2', 
    center: 'left-1/2 -translate-x-1/2'
  }

  return (
    <div 
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${positionClasses[position]} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsl(var(--primary) / ${opacity}) 0%, transparent 70%)`,
        filter: 'blur(100px)'
      }}
    />
  )
} 