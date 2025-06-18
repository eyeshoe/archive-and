"use client";
import AccountSection from './settings/AccountSection';
import ThemeSection from './settings/ThemeSection';
import PrivacySection from './settings/PrivacySection';
import NotificationsSection from './settings/NotificationsSection';
import SecuritySection from './settings/SecuritySection';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  return (
    <div style={{ background: '#f6f5f2', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', maxWidth: 600, width: '100%', margin: '0 auto', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', borderRadius: 12 }}>
        {/* Close button */}
        <button
          aria-label="Close settings"
          onClick={() => router.push('/dashboard')}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: 'none',
            fontSize: 24,
            color: '#232323',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          &times;
        </button>
        <h1 style={{ fontFamily: 'monospace', fontSize: 32, color: '#232323', marginBottom: 32, textAlign: 'center', fontWeight: 700 }}>Settings</h1>
        <AccountSection />
        <ThemeSection />
        <PrivacySection />
        <NotificationsSection />
        <SecuritySection />
      </div>
    </div>
  );
}