import { useState } from 'react'
import type { UserSite, Theme } from '@/types/archive'

interface FavoritesSectionProps {
  userSite: UserSite
  isOwner: boolean
  theme: Theme
  onUpdate: (updates: Partial<UserSite>) => Promise<boolean>
}

export function FavoritesSection({ userSite, isOwner, theme, onUpdate }: FavoritesSectionProps) {
  const [editing, setEditing] = useState(false)
  
  const currentFavorites = userSite.current_favorites || {}
  const [tempFavorites, setTempFavorites] = useState({
    book: currentFavorites.book || 'Diary of a Wimpy Kid: Rodrick Rules - Jeff Kinney',
    music: currentFavorites.music || 'Heavy Metal Drummer - Wilco',
    tv_movies: currentFavorites.tv_movies || 'Fleabag - Phoebe Waller-Bridge',
    other: currentFavorites.other || 'The Daily - The New York Times'
  })

  const handleSave = async () => {
    const success = await onUpdate({
      current_favorites: tempFavorites
    })
    
    if (success) {
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setTempFavorites({
      book: currentFavorites.book || 'Diary of a Wimpy Kid: Rodrick Rules - Jeff Kinney',
      music: currentFavorites.music || 'Heavy Metal Drummer - Wilco',
      tv_movies: currentFavorites.tv_movies || 'Fleabag - Phoebe Waller-Bridge',
      other: currentFavorites.other || 'The Daily - The New York Times'
    })
    setEditing(false)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${theme.main}`,
      padding: '40px 48px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontFamily: 'serif',
          color: theme.main,
          margin: '0',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Current Favorites
        </h3>
        {isOwner && (
          <button
            onClick={() => setEditing(true)}
            style={{
              backgroundColor: theme.light,
              border: `1px solid ${theme.light}`,
              color: theme.main,
              padding: '8px 16px',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.main
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.light
              e.currentTarget.style.color = theme.main
            }}
          >
            Edit
          </button>
        )}
      </div>

      {editing && isOwner ? (
        <div>
          {[
            { key: 'book', label: 'Book:', placeholder: 'Your favorite book' },
            { key: 'music', label: 'Music:', placeholder: 'Your favorite song/album' },
            { key: 'tv_movies', label: 'TV/Movies:', placeholder: 'Your favorite show/movie' },
            { key: 'other', label: 'Other:', placeholder: 'Podcast, newsletter, etc.' }
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#44403c', fontFamily: 'monospace', fontSize: '14px' }}>
                {label}
              </label>
              <input
                value={tempFavorites[key as keyof typeof tempFavorites]}
                onChange={(e) => setTempFavorites({...tempFavorites, [key]: e.target.value})}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: `2px solid ${theme.main}`,
                  fontSize: '16px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: theme.main,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${theme.main}`,
                color: theme.main,
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '18px', lineHeight: '2', color: '#44403c', fontFamily: 'monospace' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px 64px',
            marginBottom: '40px'
          }}>
            <p style={{ margin: '0' }}>
              <strong style={{ color: theme.main }}>Book:</strong><br />
              <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{tempFavorites.book}</span>
            </p>
            <p style={{ margin: '0' }}>
              <strong style={{ color: theme.main }}>Music:</strong><br />
              <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{tempFavorites.music}</span>
            </p>
            <p style={{ margin: '0' }}>
              <strong style={{ color: theme.main }}>TV/Movies:</strong><br />
              <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{tempFavorites.tv_movies}</span>
            </p>
            <p style={{ margin: '0' }}>
              <strong style={{ color: theme.main }}>Other:</strong><br />
              <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{tempFavorites.other}</span>
            </p>
          </div>
          <p style={{ fontSize: '12px', color: '#a8a29e', margin: '0' }}>
            Last updated: {userSite.updated_at ? new Date(userSite.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}