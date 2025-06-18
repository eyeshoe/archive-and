export function SettingsHeader() {
    return (
      <header style={{
        backgroundColor: 'white',
        borderBottom: '2px solid #e5e7eb',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontFamily: 'serif',
          color: '#374151',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 'normal'
        }}>
          Settings
        </h1>
        
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            color: '#6b7280',
            padding: '12px 24px',
            fontSize: '12px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          ← Back to Dashboard
        </button>
      </header>
    )
  }