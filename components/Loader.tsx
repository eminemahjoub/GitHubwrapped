'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function Loader() {
  const { themeConfig } = useTheme()
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div 
          className="absolute top-0 left-0 w-full h-full border-4 rounded-full"
          style={{ borderColor: `${themeConfig.colors.primary}30` }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-full h-full border-4 rounded-full border-t-transparent animate-spin"
          style={{ borderColor: themeConfig.colors.primary }}
        ></div>
      </div>
      <p 
        className="mt-4 font-medium"
        style={{ color: themeConfig.colors.textSecondary }}
      >
        Loading your GitHub data...
      </p>
    </div>
  )
}

