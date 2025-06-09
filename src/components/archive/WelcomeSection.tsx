import { useState } from 'react'
import type { UserSite, Theme } from '@/types/archive'

interface WelcomeSectionProps {
  userSite: UserSite
  isOwner: boolean
  theme: Theme
  onUpdate: (updates: Partial<UserSite>) => Promise<boolean>
}

export function WelcomeSection({ userSite, isOwner, theme, onUpdate }: WelcomeSectionProps) {
  const [editing, setEditing] = useState(false)
  const [tempWelcome, setTempWelcome] = useState(userSite.welcome_message || '')
  const [tempQuote, setTempQuote] = useState(userSite.quote || '')

  const handleSave = async () => {
    const success = await onUpdate({
      welcome_message: tempWelcome,
      quote: tempQuote
    })
    
    if (success) {
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setTempWelcome(userSite.welcome_message || '')
    setTempQuote(userSite.quote || '')
    setEditing(false)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${theme.main}`,
      padding: '40px 48px',
      marginBottom: '32px'
    }}>
      {editing && isOwner ? (
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#44403c', fontFamily: 'monospace', fontSize: '14px' }}>
              Welcome Message:
            </label>
            <textarea
              value={tempWelcome}
              onChange={(e) => setTempWelcome(e.target.value)}
              placeholder="Write your welcome message here..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                border: `2px solid ${theme.main}`,
                fontSize: '16px',
                fontFamily: 'monospace',
                resize: 'vertical',
                lineHeight: '1.6'
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#44403c', fontFamily: 'monospace', fontSize: '14px' }}>
              Quote:
            </label>
            <input
              value={tempQuote}
              onChange={(e) => setTempQuote(e.target.value)}
              placeholder="Add your favorite quote..."
              style={{
                width: '100%',
                padding: '16px',
                border: `2px solid ${theme.main}`,
                fontSize: '16px',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: theme.main,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${theme.main}`,
                color: theme.main,
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'serif',
              color: theme.main,
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Welcome to {userSite.username}'s Archive
            </h2>
            {isOwner && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  backgroundColor: theme.light,
                  border: `1px solid ${theme.light}`,
                  color: theme.main,
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '24px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.main
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.light
                  e.currentTarget.style.color = theme.main
                }}
              >
                Edit
              </button>
            )}
          </div>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#44403c',
            marginBottom: '32px',
            fontFamily: 'monospace',
            maxWidth: '85%'
          }}>
            {userSite.welcome_message || 'Welcome to my personal archive of media, thoughts, and discoveries.'}
          </p>
          <p style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: theme.main,
            fontFamily: 'monospace',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            {userSite.quote || '"The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion." - Albert Camus'}
          </p>
        </>
      )}
    </div>
  )
}