'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      onClose()
      router.push('/dashboard')
    }
    setLoading(false)
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
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        fontFamily: 'monospace'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          log in to archive&
        </h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              border: '1px solid #a8a29e',
              fontFamily: 'monospace'
            }}
          />
          
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #a8a29e',
              fontFamily: 'monospace'
            }}
          />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#44403c',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                fontFamily: 'monospace',
                flex: 1
              }}
            >
              {loading ? 'logging in...' : 'log in'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #a8a29e',
                padding: '12px 24px',
                fontFamily: 'monospace'
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