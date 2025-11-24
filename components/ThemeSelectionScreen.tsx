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
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-6xl font-extrabold mb-4 animate-bounce-slow">
            GitHub Wrapped
          </h1>
          <p className="text-2xl mb-8 animate-fadeIn animate-delay-200">
            Choose Your Style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {themes.map((t, index) => {
            const tConfig = getTheme(t)
            const isSelected = theme === t
            
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`
                  relative p-8 rounded-2xl border-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2
                  ${isSelected ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'}
                  animate-scaleIn
                `}
                style={{
                  backgroundColor: tConfig.colors.card,
                  borderColor: isSelected ? tConfig.colors.primary : tConfig.colors.border,
                  boxShadow: isSelected ? `0 0 30px ${tConfig.colors.primary}40` : 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {isSelected && (
                  <div 
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xl animate-bounce-slow"
                    style={{ backgroundColor: tConfig.colors.primary }}
                  >
                    ✓
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-float">{tConfig.emojis.code}</div>
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
                  <span className="animate-bounce-slow" style={{ color: tConfig.colors.primary, animationDelay: '0s' }}>{tConfig.emojis.trophy}</span>
                  <span className="animate-bounce-slow" style={{ color: tConfig.colors.primary, animationDelay: '0.2s' }}>{tConfig.emojis.fire}</span>
                  <span className="animate-bounce-slow" style={{ color: tConfig.colors.primary, animationDelay: '0.4s' }}>{tConfig.emojis.star}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center animate-fadeInUp animate-delay-500">
          <button
            onClick={onContinue}
            className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg transform"
            style={{
              backgroundColor: getTheme(theme).colors.primary,
              color: theme === 'hacker' ? '#000' : '#fff',
            }}
          >
            Continue with {getTheme(theme).name} Theme →
          </button>
        </div>
        
        <div 
          className="text-center text-sm mt-12 pt-6 border-t animate-fadeIn animate-delay-600"
          style={{
            borderColor: getTheme(theme).colors.border,
          }}
        >
          <p 
            style={{ color: getTheme(theme).colors.textSecondary }}
          >
            Created by{' '}
            <a
              href="https://github.com/eminemahjoub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition-all hover:underline"
              style={{ 
                color: getTheme(theme).colors.primary,
              }}
            >
              Amine Mahjoub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

