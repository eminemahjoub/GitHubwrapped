'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import InputForm from '@/components/InputForm'
import SummaryPage from '@/components/SummaryPage'
import Loader from '@/components/Loader'
import ErrorDisplay from '@/components/ErrorDisplay'
import ThemeSelectionScreen from '@/components/ThemeSelectionScreen'
import ThemeSelector from '@/components/ThemeSelector'

interface User {
  login: string
  name: string
  avatarUrl: string
  location?: string | null
  country?: string | null
}

interface Summary {
  totalContributions: number
  totalCommits: number
  totalIssues: number
  totalPullRequests: number
  totalReviews: number
  longestStreak: number
  currentStreak: number
  totalStars: number
  reposUpdated: number
}

interface ContributionDay {
  date: string
  contributionCount: number
}

interface Language {
  name: string
  color: string
  percentage: number
}

interface Rankings {
  world: {
    rank: number
    percentile: number
    topPercent: number
  }
  country: {
    name: string
    rank: number
    percentile: number
    topPercent: number
  } | null
}

interface WrappedData {
  user: User
  summary: Summary
  calendar: ContributionDay[]
  languages: Language[]
  rankings: Rankings
}

type ViewState = 'theme' | 'input' | 'loading' | 'summary' | 'error'

export default function Home() {
  const { themeConfig } = useTheme()
  const [viewState, setViewState] = useState<ViewState>('theme')
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (username: string) => {
    setViewState('loading')
    setErrorMessage('')

    try {
      const response = await fetch(`/api/wrapped?username=${encodeURIComponent(username)}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch GitHub data')
      }

      const data = await response.json()
      setWrappedData(data)
      setViewState('summary')
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred')
      setViewState('error')
    }
  }

  const handleBack = () => {
    setViewState('input')
    setWrappedData(null)
    setErrorMessage('')
  }

  const handleRetry = () => {
    setViewState('input')
    setErrorMessage('')
  }

  return (
    <main 
      className="min-h-screen transition-all duration-300"
      style={{
        background: `linear-gradient(to bottom right, ${themeConfig.colors.background}, ${themeConfig.colors.card})`,
        color: themeConfig.colors.text,
      }}
    >
      {viewState !== 'theme' && <ThemeSelector />}
      
      {viewState === 'theme' && (
        <ThemeSelectionScreen onContinue={() => setViewState('input')} />
      )}

      {viewState === 'input' && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 
              className="text-6xl font-extrabold mb-4"
              style={{ 
                color: themeConfig.colors.primary,
                fontFamily: themeConfig.fonts.heading,
              }}
            >
              GitHub Wrapped
            </h1>
            <p 
              className="text-xl"
              style={{ color: themeConfig.colors.textSecondary }}
            >
              Discover your year in code • {new Date().getFullYear()}
            </p>
          </div>
          <InputForm onSubmit={handleSubmit} isLoading={false} />
        </div>
      )}

      {viewState === 'loading' && (
        <div className="container mx-auto px-4 py-16">
          <Loader />
        </div>
      )}

      {viewState === 'error' && (
        <div className="container mx-auto px-4 py-16 max-w-md">
          <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
        </div>
      )}

      {viewState === 'summary' && wrappedData && (
        <SummaryPage
          user={wrappedData.user}
          summary={wrappedData.summary}
          calendar={wrappedData.calendar}
          languages={wrappedData.languages}
          rankings={wrappedData.rankings}
          onBack={handleBack}
        />
      )}
    </main>
  )
}

