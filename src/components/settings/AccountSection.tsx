"use client";
import { useState } from 'react';
import { SettingsCard, SettingsInput, SettingsButton } from './SettingsUI';

export default function AccountSection() {
  const [displayName, setDisplayName] = useState('Aishu Sivamurugan');
  const [email, setEmail] = useState('aishu22126@gmail.com');
  const [password, setPassword] = useState('');
  const [siteName, setSiteName] = useState('aishu');
  const [siteNameStatus, setSiteNameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [loading, setLoading] = useState(false);

  // Simulate async site name check (replace with Supabase logic)
  const checkSiteName = async (name: string) => {
    setSiteNameStatus('checking');
    // TODO: Replace with Supabase query
    await new Promise(r => setTimeout(r, 600));
    if (name === 'taken' || name.length < 3) {
      setSiteNameStatus('taken');
    } else {
      setSiteNameStatus('available');
    }
  };

  const handleSiteNameChange = (val: string) => {
    setSiteName(val);
    if (val.length > 2) {
      checkSiteName(val);
    } else {
      setSiteNameStatus('idle');
    }
  };

  const handleSave = () => {
    setLoading(true);
    // TODO: Add Supabase update logic here for displayName, email, password, siteName
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <SettingsCard style={{ marginBottom: 32, marginLeft: 'auto', marginRight: 'auto' }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 20, marginBottom: 16, textTransform: 'uppercase', color: '#232323', letterSpacing: 1, fontWeight: 700 }}>Account Information</h2>
      <SettingsInput label="Display Name" value={displayName} onChange={setDisplayName} type="text" />
      <SettingsInput label="Email" value={email} onChange={setEmail} type="email" />
      <SettingsInput label="Password" value={password} onChange={setPassword} type="password" placeholder="New password" helperText="leave blank to keep current password" />
      <SettingsInput label="Site Name" value={siteName} onChange={handleSiteNameChange} type="text" helperText={
        siteNameStatus === 'checking' ? 'checking availability...'
        : siteNameStatus === 'available' ? `available! your site: ${siteName}.archiveand.com`
        : siteNameStatus === 'taken' ? 'this site name is taken or invalid.'
        : 'your public site url (min 3 characters)'
      } />
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: 24 }}>
        <SettingsButton
          onClick={handleSave}
          loading={loading}
          disabled={siteNameStatus === 'taken' || siteName.length < 3}
        >
          Save Changes
        </SettingsButton>
      </div>
    </SettingsCard>
  );
} 