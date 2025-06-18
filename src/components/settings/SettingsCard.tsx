import React from 'react'

// Settings Card Component
interface SettingsCardProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function SettingsCard({ children, style }: SettingsCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      padding: '32px',
      ...style
    }}>
      {children}
    </div>
  )
}

// Settings Input Component
interface SettingsInputProps {
  label: string
  value: string
  onChange?: (value: string) => void
  type?: string
  disabled?: boolean
  placeholder?: string
  helperText?: string
}

export function SettingsInput({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  disabled = false, 
  placeholder, 
  helperText 
}: SettingsInputProps) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#374151',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          backgroundColor: disabled ? '#f9fafb' : 'white',
          color: disabled ? '#9ca3af' : '#111827',
          fontSize: '14px',
          fontFamily: 'monospace',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#6b7280'
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#d1d5db'
          }
        }}
      />
      
      {helperText && (
        <p style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#9ca3af',
          margin: '6px 0 0 0'
        }}>
          {helperText}
        </p>
      )}
    </div>
  )
}

// Settings Button Component
interface SettingsButtonProps {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary'
  style?: React.CSSProperties
}

export function SettingsButton({ 
  children, 
  onClick, 
  loading = false, 
  variant = 'primary',
  style 
}: SettingsButtonProps) {
  const baseStyle = {
    padding: '12px 24px',
    fontSize: '12px',
    fontFamily: 'monospace',
    cursor: loading ? 'not-allowed' : 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
    opacity: loading ? 0.6 : 1,
    border: '1px solid',
    ...style
  }

  const variantStyles = {
    primary: {
      backgroundColor: '#111827',
      borderColor: '#111827',
      color: 'white'
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: '#d1d5db',
      color: '#6b7280'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        ...baseStyle,
        ...variantStyles[variant]
      }}
      onMouseOver={(e) => {
        if (!loading) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#374151'
          } else {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.borderColor = '#9ca3af'
          }
        }
      }}
      onMouseOut={(e) => {
        if (!loading) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#111827'
          } else {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = '#d1d5db'
          }
        }
      }}
    >
      {loading ? 'Saving...' : children}
    </button>
  )
}