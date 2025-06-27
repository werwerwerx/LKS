interface CircularShadowProps {
  position?: 'left' | 'right' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CircularShadow({ 
  position = 'right', 
  size = 'md',
  className = '' 
}: CircularShadowProps) {
  const positionClasses = {
    left: 'left-0 lg:left-0',
    right: 'right-1/4 lg:right-1/5', 
    center: 'left-1/2 -translate-x-1/2'
  }

  const sizeClasses = {
    sm: 'w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]',
    md: 'w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]',
    lg: 'w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px]'
  }

  return (
    <div 
      className={`absolute top-1/2 -translate-y-1/2 shadow-bg pointer-events-none ${positionClasses[position]} ${sizeClasses[size]} ${className}`}
      style={{ zIndex: 1 }}
    />
  )
} 