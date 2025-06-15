import type { MediaItem, Theme } from '@/types/archive'

interface ArchivePageProps {
  mediaItems: MediaItem[]
  theme: Theme
  onItemClick: (item: MediaItem) => void
}

export function ArchivePage({ mediaItems, theme, onItemClick }: ArchivePageProps) {
  // Group items by month/year
  const groupedItems = mediaItems.reduce((acc, item) => {
    const date = new Date(item.added_date)
    const monthYear = date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    
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
      case 'other': return '#d49d9d'       // Lighter dusty rose
      default: return theme.main
    }
  }

  if (mediaItems.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        color: '#a8a29e'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
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
      {/* Remove both the header and the duplicate item count */}

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
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(192, 138, 138, 0.15)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: getTypeColor(item.type),
                  color: 'white',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {item.type === 'tv_film' ? 'TV/FILM' : item.type}
                </div>

                {/* Content */}
                <div style={{ paddingRight: '80px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0',
                    color: '#292524',
                    fontFamily: 'serif'
                  }}>
                    {item.title}
                  </h3>
                  
                  {item.author_artist && (
                    <p style={{
                      fontSize: '14px',
                      color: '#57534e',
                      margin: '0 0 12px 0',
                      fontFamily: 'monospace'
                    }}>
                      {item.author_artist}
                    </p>
                  )}

                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ color: getTypeColor(item.type), fontSize: '16px' }}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                    {/* Remove the completed status completely */}
                  </div>

                  {/* Preview of review/notes */}
                  {item.review && (
                    <p style={{
                      fontSize: '14px',
                      color: '#44403c',
                      lineHeight: '1.5',
                      margin: '0 0 12px 0',
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      "{item.review}"
                    </p>
                  )}

                  {/* Date */}
                  <div style={{
                    fontSize: '12px',
                    color: '#a8a29e',
                    fontFamily: 'monospace'
                  }}>
                    Added {new Date(item.added_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}