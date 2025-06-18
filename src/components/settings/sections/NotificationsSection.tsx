import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SettingsCard, SettingsButton } from '@/components/settings/SettingsCard'

interface UserSite {
  id: string
  username: string
  color_theme: string
  privacy_setting: string
  notifications: {
    email_updates: boolean
    weekly_digest: boolean
    new_features: boolean
  }
}

interface NotificationsSectionProps {
  userSite: UserSite | null
  onUpdate: (updatedSite: UserSite) => void
}

export function NotificationsSection({ userSite, onUpdate }: NotificationsSectionProps) {
  const [notifications, setNotifications] = useState(userSite?.notifications || {
    email_updates: true,
    weekly_digest: false,
    new_features: true
  })
  const [saving, setSaving] = useState(false)

  const handleSaveNotifications = async () => {
    if (!userSite) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_sites')
        .update({ notifications })
        .eq('id', userSite.id)

      if (error) throw error
      
      onUpdate({ ...userSite, notifications })
      alert('Notification settings saved!')
    } catch (error) {
      console.error('Error saving notifications:', error)
      alert('Error saving notification settings')
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
        Notifications
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
              Email Preferences
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.email_updates}
                  onChange={(e) => setNotifications({...notifications, email_updates: e.target.checked})}
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
                    Product Updates
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Receive emails about new features and improvements
                  </div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.weekly_digest}
                  onChange={(e) => setNotifications({...notifications, weekly_digest: e.target.checked})}
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
                    Weekly Digest
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Summary of your archive activity and recommendations
                  </div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.new_features}
                  onChange={(e) => setNotifications({...notifications, new_features: e.target.checked})}
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
                    New Features
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Be the first to know about exciting new tools
                  </div>
                </div>
              </label>
            </div>
          </div>

          <SettingsButton
            onClick={handleSaveNotifications}
            loading={saving}
            style={{ alignSelf: 'flex-start' }}
          >
            Save Notification Settings
          </SettingsButton>
        </div>
      </SettingsCard>
    </div>
  )
}