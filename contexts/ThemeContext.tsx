'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, getTheme } from '@/lib/themes'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themeConfig: ReturnType<typeof getTheme>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('coder')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('github-wrapped-theme') as Theme
    if (savedTheme && ['coder', 'hacker', 'anime'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('github-wrapped-theme', newTheme)
  }

  const themeConfig = getTheme(theme)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig }}>
      <div className={`theme-${theme} min-h-screen`} style={{
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

