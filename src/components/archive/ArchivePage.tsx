import type { MediaItem, Theme } from '@/types/archive'

interface ArchivePageProps {
  mediaItems: MediaItem[]
  theme: Theme
  onItemClick: (item: MediaItem) => void
}

export function ArchivePage({ mediaItems, theme, onItemClick }: ArchivePageProps) {
  // Group items by month/year for better organization
  const groupedItems = mediaItems.reduce((acc, item) => {
    const date = new Date(item.added_date)
    const monthYear = `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getFullYear()}`
    
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(item)
    return acc
  }, {} as Record<string, MediaItem[]>)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return '#c08a8a'        // Main dusty rose
      case 'music': return '#a67373'       // Deeper dusty rose
      case 'tv_film': return '#b57d7d'     // Medium dusty rose
      case 'other': return '#8f6666'       // Darkest dusty rose
      default: return theme.main
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'book': return 'Book'
      case 'music': return 'Music'
      case 'tv_film': return 'TV/Film'
      case 'other': return 'Other'
      default: return type
    }
  }

  if (mediaItems.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        color: '#a8a29e',
        fontStyle: 'italic'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>📚</div>
        <div style={{ fontSize: '18px', fontFamily: 'serif' }}>
          Your archive is empty
        </div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          Start adding some media to see your timeline
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: '2rem', 
        fontFamily: 'serif', 
        color: theme.main, 
        marginBottom: '32px' 
      }}>
        ARCHIVE TIMELINE
      </h2>
      
      <div style={{ fontSize: '14px', color: '#a8a29e', marginBottom: '32px' }}>
        {mediaItems.length} items 
      </div>

      {Object.entries(groupedItems).map(([monthYear, items]) => (
        <div key={monthYear} style={{ marginBottom: '48px' }}>
          {/* Month/Year Header */}
          <div style={{
            fontSize: '18px',
            fontFamily: 'serif',
            color: theme.main,
            marginBottom: '24px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${theme.light}`,
            fontWeight: 'bold'
          }}>
            {monthYear}
          </div>

          {/* Items for this month */}
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick(item)}
                style={{
                  backgroundColor: 'white',
                  border: `2px solid ${theme.light}`,
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.main
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.light
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Type Indicator */}
                <div style={{
                  backgroundColor: getTypeColor(item.type),
                  color: 'white',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold',
                  minWidth: '80px',
                  textAlign: 'center'
                }}>
                  {getTypeLabel(item.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontFamily: 'serif',
                      margin: '0',
                      color: '#292524',
                      fontWeight: 'bold'
                    }}>
                      {item.title}
                    </h3>
                    <div style={{
                      fontSize: '16px',
                      color: theme.main,
                      marginLeft: '16px'
                    }}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  </div>

                  {item.author_artist && (
                    <div style={{
                      fontSize: '14px',
                      color: '#57534e',
                      marginBottom: '8px',
                      fontFamily: 'monospace'
                    }}>
                      {item.author_artist}
                    </div>
                  )}

                  {item.review && (
                    <div style={{
                      fontSize: '14px',
                      color: '#44403c',
                      lineHeight: '1.5',
                      marginBottom: '8px',
                      fontFamily: 'monospace'
                    }}>
                      {item.review.length > 150 
                        ? `${item.review.substring(0, 150)}...` 
                        : item.review
                      }
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#a8a29e',
                    fontFamily: 'monospace'
                  }}>
                    <span>
                      Added {new Date(item.added_date).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {item.completed && (
                        <span style={{ color: '#059669' }}>✓ Completed</span>
                      )}
                      {!item.is_public && (
                        <span style={{ color: '#dc2626' }}>🔒 Private</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Click indicator */}
                <div style={{
                  fontSize: '18px',
                  color: '#a8a29e',
                  marginLeft: '8px'
                }}>
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}