import React from 'react';

// Settings Card Component
interface SettingsCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
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
  );
}

// Settings Input Component
interface SettingsInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
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
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#232323',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
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
          padding: '10px 14px',
          border: '1px solid #d1d5db',
          backgroundColor: disabled ? '#f9fafb' : 'white',
          color: '#232323',
          fontSize: '15px',
          fontFamily: 'monospace',
          outline: 'none',
          borderRadius: 4,
          marginBottom: 0,
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#232323';
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#d1d5db';
          }
        }}
      />
      {helperText && (
        <p style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#888',
          margin: '6px 0 0 0',
          textTransform: 'lowercase',
        }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

// Settings Button Component
interface SettingsButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function SettingsButton({
  children,
  onClick,
  loading = false,
  variant = 'primary',
  style,
  disabled = false
}: SettingsButtonProps) {
  const baseStyle = {
    padding: '8px 20px',
    fontSize: '15px',
    fontFamily: 'monospace',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid #232323',
    borderRadius: 4,
    backgroundColor: variant === 'primary' ? '#232323' : 'transparent',
    color: variant === 'primary' ? '#fff' : '#232323',
    marginRight: variant === 'primary' ? 12 : 0,
    transition: 'background 0.2s, color 0.2s, border 0.2s',
    outline: 'none',
    opacity: loading || disabled ? 0.6 : 1,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    ...style
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={baseStyle}
      onMouseOver={e => {
        if (!loading && !disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#111';
          } else {
            e.currentTarget.style.backgroundColor = '#f6f5f2';
            e.currentTarget.style.color = '#232323';
          }
        }
      }}
      onMouseOut={e => {
        if (!loading && !disabled) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#232323';
          } else {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#232323';
          }
        }
      }}
    >
      {loading ? 'Saving...' : children}
    </button>
  );
} 