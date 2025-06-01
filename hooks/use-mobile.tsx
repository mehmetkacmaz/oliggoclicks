"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // İlk yükleme kontrolü
    checkIfMobile()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkIfMobile)

    // Temizlik
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}
