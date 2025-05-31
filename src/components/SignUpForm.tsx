'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignUpForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone,
        }
      }
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for confirmation!')
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
            sign up for archive&
        </h2>
        
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            placeholder="Password"
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
              {loading ? 'creating...' : 'create account'}
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