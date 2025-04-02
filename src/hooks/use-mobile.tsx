
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with undefined on server, then check on client
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // Skip effect on server
    if (typeof window === 'undefined') return

    // Use more efficient media query
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Initial check
    setIsMobile(mediaQuery.matches)
    
    // Handler
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }
    
    // Add listener - using modern API
    mediaQuery.addEventListener('change', handleResize)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  return isMobile
}
