import type { Theme } from '@/types/archive'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isOwner: boolean
  theme: Theme
  onAddMedia?: () => void
}

export function Sidebar({ activeSection, setActiveSection, isOwner, theme, onAddMedia }: SidebarProps) {
  const sections = [
    { id: 'home', label: 'HOME' },
    { id: 'reading', label: 'READING' },
    { id: 'music', label: 'MUSIC' },
    { id: 'tv_film', label: 'TV & FILMS' },
    { id: 'other', label: 'OTHER' },
    { id: 'archive', label: 'ARCHIVE' }
  ]

  return (
    <div style={{
      width: '280px',
      backgroundColor: theme.sidebar,
      borderRight: `2px solid ${theme.main}`,
      padding: '48px 0',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    }}>

      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          style={{
            width: '100%',
            backgroundColor: activeSection === section.id ? theme.main : 'transparent',
            color: activeSection === section.id ? 'white' : theme.main,
            border: 'none',
            padding: '18px 32px',
            fontSize: '16px',
            fontFamily: 'monospace',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: activeSection === section.id ? 'bold' : 'normal',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.currentTarget.style.backgroundColor = theme.light
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== section.id) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          {section.label}
        </button>
      ))}

      {/* Add Media Button */}
      {isOwner && (
        <div style={{ padding: '32px', marginTop: '48px' }}>
          <button
            onClick={onAddMedia}
            style={{
              backgroundColor: theme.main,
              color: 'white',
              border: 'none',
              padding: '16px',
              fontSize: '20px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              borderRadius: '50%',
              height: '64px',
              width: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}