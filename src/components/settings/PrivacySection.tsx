"use client";
import { useState } from 'react';
import { SettingsCard, SettingsButton } from './SettingsUI';

const options = [
  { label: 'Public (anyone can find it)', value: 'public' },
  { label: 'Members only (only Archive& users can view)', value: 'members' },
  { label: 'Private (just you)', value: 'private' },
];

export default function PrivacySection() {
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // TODO: Add Supabase update logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <SettingsCard style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 18, marginBottom: 16 }}>Privacy Controls</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {options.map(opt => (
          <label key={opt.value} style={{ fontFamily: 'monospace', fontSize: 14 }}>
            <input
              type="radio"
              name="visibility"
              value={opt.value}
              checked={visibility === opt.value}
              onChange={() => setVisibility(opt.value)}
              style={{ marginRight: 8 }}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <SettingsButton onClick={handleSave} loading={loading}>Save Privacy</SettingsButton>
    </SettingsCard>
  );
} 