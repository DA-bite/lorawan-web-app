
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set up the listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern way to add listener
    mql.addEventListener("change", checkIsMobile)
    
    // Initial check
    checkIsMobile()
    
    // Cleanup
    return () => mql.removeEventListener("change", checkIsMobile)
  }, [])

  return !!isMobile
}
