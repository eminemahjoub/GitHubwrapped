'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Theme, getTheme } from '@/lib/themes'

interface ThemeSelectionScreenProps {
  onContinue: () => void
}

export default function ThemeSelectionScreen({ onContinue }: ThemeSelectionScreenProps) {
  const { theme, setTheme } = useTheme()
  const themes: Theme[] = ['coder', 'hacker', 'anime']

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4">
            GitHub Wrapped
          </h1>
          <p className="text-2xl mb-8">
            Choose Your Style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {themes.map((t) => {
            const tConfig = getTheme(t)
            const isSelected = theme === t
            
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`
                  relative p-8 rounded-2xl border-4 transition-all transform hover:scale-105
                  ${isSelected ? 'scale-105 shadow-2xl' : 'hover:shadow-lg'}
                `}
                style={{
                  backgroundColor: tConfig.colors.card,
                  borderColor: isSelected ? tConfig.colors.primary : tConfig.colors.border,
                  boxShadow: isSelected ? `0 0 30px ${tConfig.colors.primary}40` : 'none',
                }}
              >
                {isSelected && (
                  <div 
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: tConfig.colors.primary }}
                  >
                    ✓
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-6xl mb-4">{tConfig.emojis.code}</div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: tConfig.colors.primary }}
                  >
                    {tConfig.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: tConfig.colors.textSecondary }}
                  >
                    {t === 'coder' && 'Clean, professional developer aesthetic'}
                    {t === 'hacker' && 'Matrix-style terminal vibes'}
                    {t === 'anime' && 'Kawaii pink and purple magic ✨'}
                  </p>
                </div>

                <div className="mt-6 flex gap-2 justify-center">
                  <span style={{ color: tConfig.colors.primary }}>{tConfig.emojis.trophy}</span>
                  <span style={{ color: tConfig.colors.primary }}>{tConfig.emojis.fire}</span>
                  <span style={{ color: tConfig.colors.primary }}>{tConfig.emojis.star}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            style={{
              backgroundColor: getTheme(theme).colors.primary,
              color: theme === 'hacker' ? '#000' : '#fff',
            }}
          >
            Continue with {getTheme(theme).name} Theme →
          </button>
        </div>
      </div>
    </div>
  )
}

