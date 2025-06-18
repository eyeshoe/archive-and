import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { SettingsCard, SettingsInput, SettingsButton } from '@/components/settings/SettingsCard'

interface UserSite {
  id: string
  username: string
  color_theme: string
  privacy_setting: string
  notifications: any
}

interface AccountSectionProps {
  user: User
  userSite: UserSite | null
}

export function AccountSection({ user, userSite }: AccountSectionProps) {
  const [displayName, setDisplayName] = useState(user.user_metadata?.display_name || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSaveAccount = async () => {
    setSaving(true)
    try {
      const { error: profileError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      })

      if (profileError) throw profileError

      if (newPassword && newPassword === confirmPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        })
        if (passwordError) throw passwordError
        setNewPassword('')
        setConfirmPassword('')
        alert('Password updated successfully!')
      }

      alert('Account settings saved!')
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Error saving account settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
          Account Information
        </h2>
        
        <SettingsCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SettingsInput
              label="Display Name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="How your name appears to others"
            />

            <SettingsInput
              label="Email"
              value={user.email || ''}
              disabled
              helperText="Email cannot be changed"
            />

            <SettingsInput
              label="Username"
              value={userSite?.username || ''}
              disabled
              helperText="Username cannot be changed"
            />

            <SettingsButton
              onClick={handleSaveAccount}
              loading={saving}
              style={{ alignSelf: 'flex-start' }}
            >
              Save Changes
            </SettingsButton>
          </div>
        </SettingsCard>
      </div>

      <div>
        <h3 style={{
          fontSize: '20px',
          fontFamily: 'serif',
          color: '#111827',
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 'normal'
        }}>
          Change Password
        </h3>
        
        <SettingsCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SettingsInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <SettingsInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p style={{
                color: '#dc2626',
                fontSize: '12px',
                fontFamily: 'monospace',
                margin: 0
              }}>
                Passwords do not match
              </p>
            )}
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}