'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SignUpFormProps {
  onClose: () => void
}

export default function SignUpForm({ onClose }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
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
        return
      }

      alert('Sign up successful! Please check your email to confirm your account.')
      onClose()
    } catch (error) {
      console.error('Sign up error:', error)
      alert('An error occurred during sign up')
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
              {loading ? 'creating...' : 'create account'}
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