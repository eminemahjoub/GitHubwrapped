'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Theme, getTheme } from '@/lib/themes'

export default function ThemeSelector() {
  const { theme, setTheme, themeConfig } = useTheme()
  const themes: Theme[] = ['coder', 'hacker', 'anime']

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className="backdrop-blur-sm rounded-lg shadow-lg p-2 border transition-all"
        style={{
          backgroundColor: theme === 'hacker' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: themeConfig.colors.border,
        }}
      >
        <p 
          className="text-xs mb-2 px-2 font-medium"
          style={{ color: themeConfig.colors.textSecondary }}
        >
          Choose Theme
        </p>
        <div className="flex gap-2">
          {themes.map((t) => {
            const isActive = theme === t
            const tConfig = getTheme(t)
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: isActive ? tConfig.colors.primary : 'transparent',
                  color: isActive 
                    ? (t === 'hacker' ? '#000' : '#fff')
                    : themeConfig.colors.textSecondary,
                  border: `2px solid ${isActive ? tConfig.colors.primary : themeConfig.colors.border}`,
                  boxShadow: isActive ? `0 0 10px ${tConfig.colors.primary}40` : 'none',
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

