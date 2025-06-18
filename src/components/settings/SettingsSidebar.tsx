interface SettingsSidebarProps {
    activeSection: string
    onSectionChange: (section: string) => void
  }
  
  export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
    const sections = [
      { id: 'account', label: 'Account Information' },
      { id: 'appearance', label: 'Theme & Appearance' },
      { id: 'privacy', label: 'Privacy & Security' },
      { id: 'notifications', label: 'Notifications' }
    ]
  
    return (
      <nav style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        minHeight: 'calc(100vh - 80px)',
        padding: '32px 0'
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sections.map((section) => (
            <li key={section.id} style={{ marginBottom: '4px' }}>
              <button
                onClick={() => onSectionChange(section.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px 32px',
                  border: 'none',
                  backgroundColor: activeSection === section.id ? '#f9fafb' : 'transparent',
                  color: activeSection === section.id ? '#111827' : '#6b7280',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: activeSection === section.id ? '3px solid #9ca3af' : '3px solid transparent',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#374151'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }
                }}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }