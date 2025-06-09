import type { MediaItem, Theme } from '@/types/archive'

interface MediaSectionProps {
  items: MediaItem[]
  type: string
  theme: Theme
  onItemClick?: (item: MediaItem) => void
}

export function MediaSection({ items, type, theme, onItemClick }: MediaSectionProps) {
  if (items.length === 0) {
    return (
      <p style={{ 
        color: '#a8a29e', 
        fontStyle: 'italic', 
        textAlign: 'center', 
        padding: '2rem',
        fontFamily: 'monospace'
      }}>
        No {type} added yet.
      </p>
    )
  }

  // Find the most recent item (highlight it)
  const mostRecent = items.reduce((latest, current) => 
    new Date(current.added_date) > new Date(latest.added_date) ? current : latest
  )

  const getTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'book': return '#c08a8a'        // Main dusty rose
      case 'music': return '#a67373'       // Deeper dusty rose
      case 'tv_film': return '#b57d7d'     // Medium dusty rose
      case 'other': return '#8f6666'       // Darkest dusty rose
      default: return theme.main
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px'
    }}>
      {items.map((item) => {
        const isRecent = item.id === mostRecent.id
        
        return (
          <div 
            key={item.id} 
            onClick={() => onItemClick?.(item)}
            style={{
              backgroundColor: 'white',
              border: `2px solid ${isRecent ? theme.main : theme.light}`,
              borderRadius: '0',
              padding: '24px',
              fontFamily: 'monospace',
              cursor: onItemClick ? 'pointer' : 'default',
              position: 'relative',
              transition: 'all 0.2s ease',
              boxShadow: isRecent ? `0 4px 12px rgba(0,0,0,0.1)` : 'none'
            }}
            onMouseEnter={(e) => {
              if (onItemClick) {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                e.currentTarget.style.borderColor = theme.main
              }
            }}
            onMouseLeave={(e) => {
              if (onItemClick) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = isRecent ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                e.currentTarget.style.borderColor = isRecent ? theme.main : theme.light
              }
            }}
          >
            {/* Recent Badge */}
            {isRecent && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '16px',
                backgroundColor: theme.main,
                color: 'white',
                padding: '4px 8px',
                fontSize: '10px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Recent
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <span style={{
                backgroundColor: getTypeColor(item.type),
                color: 'white',
                padding: '4px 8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                textTransform: 'uppercase'
              }}>
                {item.type.replace('_', ' & ')}
              </span>
              <div style={{ color: theme.main, fontSize: '14px' }}>
                {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
              </div>
            </div>
            
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
                margin: '0 0 16px 0',
                fontFamily: 'monospace'
              }}>
                {item.author_artist}
              </p>
            )}
            
            {item.review && (
              <p style={{
                fontSize: '14px',
                color: '#44403c',
                lineHeight: '1.6',
                margin: '0 0 16px 0',
                fontFamily: 'monospace'
              }}>
                {item.review.length > 100 
                  ? `${item.review.substring(0, 100)}...` 
                  : item.review
                }
              </p>
            )}
            
            <div style={{
              fontSize: '12px',
              color: '#a8a29e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace'
            }}>
              <span>Added: {new Date(item.added_date).toLocaleDateString()}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {item.completed && <span style={{ color: '#a8a29e', fontSize: '11px' }}>✓ Completed</span>}
                {onItemClick && <span>→</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}