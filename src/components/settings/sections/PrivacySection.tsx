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

interface PrivacySectionProps {
  userSite: UserSite | null
  onUpdate: (updatedSite: UserSite) => void
}

export function PrivacySection({ userSite, onUpdate }: PrivacySectionProps) {
  const [privacySetting, setPrivacySetting] = useState(userSite?.privacy_setting || 'public')
  const [saving, setSaving] = useState(false)

  const handleSavePrivacy = async () => {
    if (!userSite) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_sites')
        .update({ privacy_setting: privacySetting })
        .eq('id', userSite.id)

      if (error) throw error
      
      onUpdate({ ...userSite, privacy_setting: privacySetting })
      alert('Privacy settings saved!')
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      alert('Error saving privacy settings')
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
        Privacy & Security
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
              Who can view your archive?
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacySetting === 'public'}
                  onChange={(e) => setPrivacySetting(e.target.value)}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    Public
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Anyone can discover and view your archive
                  </div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="privacy"
                  value="members"
                  checked={privacySetting === 'members'}
                  onChange={(e) => setPrivacySetting(e.target.value)}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    Archive& Members Only
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Only registered users can view your archive
                  </div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacySetting === 'private'}
                  onChange={(e) => setPrivacySetting(e.target.value)}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    Private
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Only you can view your archive
                  </div>
                </div>
              </label>
            </div>
          </div>

          <SettingsButton
            onClick={handleSavePrivacy}
            loading={saving}
            style={{ alignSelf: 'flex-start' }}
          >
            Save Privacy Settings
          </SettingsButton>
        </div>
      </SettingsCard>
    </div>
  )
}