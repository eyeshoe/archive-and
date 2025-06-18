import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SettingsCard, SettingsButton } from '@/components/settings/SettingsCard'

interface UserSite {
  id: string
  username: string
  color_theme: string
  privacy_setting: string
  notifications: any
}

interface AppearanceSectionProps {
  userSite: UserSite | null
  onUpdate: (updatedSite: UserSite) => void
}

export function AppearanceSection({ userSite, onUpdate }: AppearanceSectionProps) {
  const [selectedTheme, setSelectedTheme] = useState(userSite?.color_theme || 'dusty_rose')
  const [saving, setSaving] = useState(false)

  const themes = [
    { 
      name: 'Dusty Rose', 
      value: 'dusty_rose', 
      colors: { main: '#d4a574', light: '#f5e6d3', dark: '#8b7355' } 
    },
    { 
      name: 'Sage Green', 
      value: 'sage_green', 
      colors: { main: '#9caf88', light: '#e8f0e3', dark: '#6b7a5e' } 
    },
    { 
      name: 'Ocean Blue', 
      value: 'ocean_blue', 
      colors: { main: '#7ba8c4', light: '#e3f0f7', dark: '#547285' } 
    },
    { 
      name: 'Warm Grey', 
      value: 'warm_grey', 
      colors: { main: '#a8a29e', light: '#f5f4f2', dark: '#78716c' } 
    }
  ]

  const handleSaveTheme = async () => {
    if (!userSite) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_sites')
        .update({ color_theme: selectedTheme })
        .eq('id', userSite.id)

      if (error) throw error
      
      onUpdate({ ...userSite, color_theme: selectedTheme })
      alert('Theme saved successfully!')
    } catch (error) {
      console.error('Error saving theme:', error)
      alert('Error saving theme')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontFamily: 'serif',
        color: '#111827',
        margin: '0 0 32px 0',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'normal'
      }}>
        Theme & Appearance
      </h2>
      
      <SettingsCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#374151',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Choose Theme
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  style={{
                    padding: '20px',
                    border: selectedTheme === theme.value ? '2px solid #6b7280' : '1px solid #e5e7eb',
                    backgroundColor: selectedTheme === theme.value ? '#f9fafb' : 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.main,
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      fontWeight: 'normal',
                      color: '#111827',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {theme.name}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: theme.colors.light,
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: theme.colors.main,
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: theme.colors.dark,
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <SettingsButton
            onClick={handleSaveTheme}
            loading={saving}
            style={{ alignSelf: 'flex-start' }}
          >
            Save Theme
          </SettingsButton>
        </div>
      </SettingsCard>
    </div>
  )
}