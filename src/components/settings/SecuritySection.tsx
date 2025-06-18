"use client";
import { useState } from 'react';
import { SettingsCard, SettingsInput, SettingsButton } from './SettingsUI';

export default function SecuritySection() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // TODO: Add Supabase update logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <SettingsCard style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 18, marginBottom: 16 }}>Login & Security</h2>
      <SettingsInput label="New Password" value={password} onChange={setPassword} type="password" placeholder="Enter new password" />
      <SettingsButton onClick={handleSave} loading={loading} style={{ marginTop: 16 }}>Change Password</SettingsButton>
      {/* Placeholder for login activity */}
      <div style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        <em>Login activity review coming soon.</em>
      </div>
    </SettingsCard>
  );
} 