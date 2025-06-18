"use client";
import { useState } from 'react';
import { SettingsCard } from './SettingsUI';

const themes = [
  { name: 'Dusty Rose', value: 'dusty-rose' },
  { name: 'Sage Green', value: 'sage-green' },
  { name: 'Charcoal', value: 'charcoal' },
  { name: 'Ivory', value: 'ivory' },
];

export default function ThemeSection() {
  const [selected, setSelected] = useState('dusty-rose');

  return (
    <SettingsCard style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 18, marginBottom: 16 }}>Theme Selection</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        {themes.map(theme => (
          <label key={theme.value} style={{ fontFamily: 'monospace', fontSize: 14 }}>
            <input
              type="radio"
              name="theme"
              value={theme.value}
              checked={selected === theme.value}
              onChange={() => setSelected(theme.value)}
              style={{ marginRight: 8 }}
              disabled
            />
            {theme.name}
          </label>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Theme changing coming soon.</p>
    </SettingsCard>
  );
} 