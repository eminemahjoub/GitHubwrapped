'use client'

import { useState, FormEvent } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface InputFormProps {
  onSubmit: (username: string) => void
  isLoading: boolean
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const { themeConfig } = useTheme()
  const [username, setUsername] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSubmit(username.trim())
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-2"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            GitHub Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your GitHub username"
            className="w-full px-4 py-3 rounded-lg outline-none transition-all"
            style={{
              backgroundColor: themeConfig.colors.card,
              border: `2px solid ${themeConfig.colors.border}`,
              color: themeConfig.colors.text,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = themeConfig.colors.primary
              e.target.style.boxShadow = `0 0 0 3px ${themeConfig.colors.primary}20`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = themeConfig.colors.border
              e.target.style.boxShadow = 'none'
            }}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: themeConfig.colors.primary,
            color: '#fff',
          }}
        >
          {isLoading ? 'Loading...' : 'Generate My Wrapped'}
        </button>
      </form>
    </div>
  )
}

