"use client";
import { useState } from 'react';
import { SettingsCard, SettingsButton } from './SettingsUI';

type NotificationKey = 'followers' | 'comments' | 'weekly';

const notificationOptions = [
  { label: 'New followers', key: 'followers' as NotificationKey },
  { label: 'Comments on my archive', key: 'comments' as NotificationKey },
  { label: 'Weekly summary email', key: 'weekly' as NotificationKey },
];

export default function NotificationsSection() {
  const [prefs, setPrefs] = useState<Record<NotificationKey, boolean>>({
    followers: true,
    comments: true,
    weekly: false,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: NotificationKey) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    // TODO: Add Supabase update logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <SettingsCard style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 18, marginBottom: 16 }}>Notification Preferences</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {notificationOptions.map(opt => (
          <label key={opt.key} style={{ fontFamily: 'monospace', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={prefs[opt.key]}
              onChange={() => handleToggle(opt.key)}
              style={{ marginRight: 8 }}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <SettingsButton onClick={handleSave} loading={loading}>Save Notifications</SettingsButton>
    </SettingsCard>
  );
} 