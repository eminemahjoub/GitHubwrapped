'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Language {
  name: string
  color: string
  percentage: number
}

interface LanguageChartProps {
  languages: Language[]
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const { themeConfig } = useTheme()
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([])
  const topLanguages = languages.slice(0, 8)

  useEffect(() => {
    // Animate percentages from 0 to actual value
    const timer = setTimeout(() => {
      setAnimatedPercentages(topLanguages.map(() => 0))
      topLanguages.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedPercentages((prev) => {
            const newPercents = [...prev]
            newPercents[index] = topLanguages[index].percentage
            return newPercents
          })
        }, index * 100)
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [languages])

  return (
    <div 
      className="w-full rounded-2xl p-8 shadow-2xl border-2 transition-all hover:shadow-3xl"
      style={{
        backgroundColor: themeConfig.colors.card,
        borderColor: themeConfig.colors.border,
        boxShadow: `0 20px 40px ${themeConfig.colors.primary}15`,
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 
          className="text-3xl font-bold"
          style={{ 
            color: themeConfig.colors.primary,
            fontFamily: themeConfig.fonts.heading,
          }}
        >
          Top Languages 💻
        </h3>
        <div 
          className="text-sm font-medium px-4 py-2 rounded-full"
          style={{
            backgroundColor: `${themeConfig.colors.primary}20`,
            color: themeConfig.colors.primary,
          }}
        >
          {topLanguages.length} Languages
        </div>
      </div>

      <div className="space-y-6">
        {topLanguages.map((lang, index) => {
          const animatedPercent = animatedPercentages[index] || 0
          const isTopThree = index < 3
          
          return (
            <div 
              key={lang.name}
              className="group transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {isTopThree && (
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: lang.color || themeConfig.colors.primary,
                      boxShadow: `0 0 10px ${lang.color || themeConfig.colors.primary}60`,
                    }}
                  />
                  <span 
                    className="text-lg font-bold"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {lang.name}
                  </span>
                </div>
                <span 
                  className="text-xl font-extrabold"
                  style={{ 
                    color: themeConfig.colors.primary,
                    textShadow: `0 0 10px ${themeConfig.colors.primary}30`,
                  }}
                >
                  {animatedPercent.toFixed(1)}%
                </span>
              </div>
              
              <div 
                className="h-4 rounded-full overflow-hidden relative"
                style={{
                  backgroundColor: `${themeConfig.colors.border}40`,
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: `${animatedPercent}%`,
                    backgroundColor: lang.color || themeConfig.colors.primary,
                    boxShadow: `0 0 20px ${lang.color || themeConfig.colors.primary}50`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {topLanguages.length === 0 && (
        <div className="text-center py-12">
          <p 
            className="text-lg"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            No language data available
          </p>
        </div>
      )}
    </div>
  )
}

