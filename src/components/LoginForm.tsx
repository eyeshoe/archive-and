'use client'
import { useState } from 'react'
import { auth } from '@/lib/api'

interface LoginFormProps {
  onClose: () => void
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await auth.login(email, password)
      if (error) throw new Error(error)
      if (data?.token) {
        localStorage.setItem('token', data.token)
        onClose()
        window.location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fafaf9',
        padding: '3rem',
        width: '420px',
        maxWidth: '90vw',
        fontFamily: 'monospace',
        position: 'relative',
        border: '2px solid #a8a29e'
      }}>
        {/* Title - Centered */}
        <h2 style={{ 
          marginBottom: '2rem', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#292524'
        }}>
          log in to archive&
        </h2>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '14px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '1rem',
              border: '2px solid #a8a29e',
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '2rem',
              border: '2px solid #a8a29e',
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#44403c',
                color: 'white',
                padding: '16px 32px',
                border: 'none',
                fontFamily: 'monospace',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'logging in...' : 'log in'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #a8a29e',
                padding: '16px 32px',
                fontFamily: 'monospace',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#44403c'
              }}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}