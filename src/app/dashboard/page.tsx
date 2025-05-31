'use client'
import { useState } from 'react'
import SignUpForm from '@/components/SignUpForm'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafaf9', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'monospace' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem', 
          color: '#292524',
          fontFamily: 'serif'
        }}>
          ARCHIVE<span style={{ color: '#78716c' }}>&</span>
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#57534e', 
          maxWidth: '28rem', 
          margin: '0 auto', 
          lineHeight: '1.75' 
        }}>
          Create your personal media consumption archive. Track books, music, films, and more in your own curated space.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginBottom: '4rem' 
      }}>
        <button 
          onClick={() => setShowSignUp(true)}
          style={{ 
            backgroundColor: '#44403c', 
            color: 'white', 
            padding: '12px 32px', 
            fontSize: '14px', 
            border: 'none', 
            width: '192px',
            fontFamily: 'monospace',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          SIGN UP
        </button>
        <button 
          onClick={() => setShowLogin(true)}
          style={{ 
            border: '1px solid #a8a29e', 
            backgroundColor: 'white', 
            color: '#44403c',
            padding: '12px 32px', 
            fontSize: '14px', 
            width: '192px',
            fontFamily: 'monospace',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          LOG IN
        </button>
      </div>

      {/* About Section */}
      <div style={{ 
        maxWidth: '32rem', 
        textAlign: 'center', 
        fontSize: '14px', 
        color: '#57534e', 
        lineHeight: '1.75' 
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Archive& is a platform for thoughtful media consumption. Create your personal archive 
          with reviews, notes, and curated recommendations.
        </p>
        <p>
          Each user gets their own subdomain (username.archiveand.com) to share their taste 
          and discoveries with others.
        </p>
      </div>

      {/* Footer */}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        fontSize: '12px', 
        color: '#a8a29e' 
      }}>
        "And all you touch and all you see is all your life will ever be" — Pink Floyd
      </div>

      {/* Sign Up Form */}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}

      {/* Login Form */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
}