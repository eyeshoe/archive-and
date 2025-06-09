import type { Theme } from '@/types/archive'

interface AdminHeaderProps {
  isOwner: boolean
  theme: Theme
}

export function AdminHeader({ isOwner, theme }: AdminHeaderProps) {
  if (!isOwner) return null

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      backgroundColor: theme.main,
      color: 'white',
      padding: '8px 16px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      ADMIN MODE
      <button
        onClick={() => window.location.href = '/dashboard'}
        style={{
          marginLeft: '12px',
          backgroundColor: 'white',
          color: theme.main,
          border: 'none',
          padding: '4px 8px',
          fontSize: '12px',
          fontFamily: 'monospace',
          cursor: 'pointer'
        }}
      >
        Dashboard
      </button>
    </div>
  )
}