'use client'

import { useState, FormEvent } from 'react'

interface InputFormProps {
  onSubmit: (username: string) => void
  isLoading: boolean
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
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
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GitHub Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your GitHub username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Loading...' : 'Generate My Wrapped'}
        </button>
      </form>
    </div>
  )
}

