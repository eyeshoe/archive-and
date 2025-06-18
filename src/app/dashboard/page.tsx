'use client'
import { useEffect, useState } from 'react'
import { useArchiveData } from '@/hooks/useArchiveData'

const charcoal = '#292524';
const borderColor = '#a8a29e';
const mainFont = 'serif';
const monoFont = 'monospace';

interface MediaItem {
  id: number | string
  type?: string
  title: string
  author_artist?: string
  rating?: number
  review?: string
  notes?: string
  completed?: boolean
  added_date?: string
  completed_date?: string
  is_public?: boolean
}

export default function Dashboard() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getMedia } = useArchiveData()

  // Replace with real user id and username from auth when available
  const userId = 1;
  const username = 'aishu';

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const items = await getMedia(userId)
        setMedia(items)
      } catch (err) {
        setError('Failed to load media')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Count stats
  const stats = {
    book: 0,
    music: 0,
    tv_film: 0,
    other: 0,
  }
  media.forEach(item => {
    if (item.type === 'book') stats.book++
    else if (item.type === 'music') stats.music++
    else if (item.type === 'tv_film') stats.tv_film++
    else stats.other++
  })

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: monoFont }}>
      {/* Header with all buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: `3px solid ${borderColor}`,
        padding: '1.5rem 2rem 1rem 2rem',
        background: 'white',
      }}>
        <div style={{
          fontFamily: mainFont,
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: charcoal,
        }}>
          aishu's archive dashboard
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Create Digest (disabled placeholder) */}
          <button
            disabled
            style={{
              backgroundColor: 'white',
              border: `1px solid ${borderColor}`,
              color: borderColor,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: monoFont,
              cursor: 'not-allowed',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.7
            }}
          >
            create digest
          </button>
          {/* Settings */}
          <button
            onClick={() => window.location.href = '/settings'}
            style={{
              backgroundColor: 'white',
              border: `1px solid ${charcoal}`,
              color: charcoal,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: monoFont,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = charcoal;
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = charcoal;
            }}
          >
            settings
          </button>
          {/* View Site */}
          <button
            onClick={() => window.location.href = `/${username}`}
            style={{
              backgroundColor: 'white',
              border: `1px solid ${charcoal}`,
              color: charcoal,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: monoFont,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = charcoal;
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = charcoal;
            }}
          >
            view site
          </button>
          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${charcoal}`,
              color: charcoal,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: monoFont,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = charcoal;
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = charcoal;
            }}
          >
            sign out
          </button>
        </div>
      </div>
      {/* Stat Cards */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        background: '#fafaf9',
        borderBottom: `2px solid ${borderColor}`,
        justifyContent: 'flex-start',
      }}>
        {[
          { label: 'BOOKS', value: stats.book },
          { label: 'MUSIC', value: stats.music },
          { label: 'TV & FILMS', value: stats.tv_film },
          { label: 'OTHER', value: stats.other },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1,
            background: 'white',
            border: `2px solid ${borderColor}`,
            borderRadius: '4px',
            padding: '2rem 0',
            textAlign: 'center',
            minWidth: 120,
          }}>
            <div style={{ fontSize: '2.5rem', color: charcoal, fontWeight: 'bold', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: '1rem', color: borderColor, letterSpacing: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Recent Activity */}
      <div style={{
        margin: '2rem',
        border: `2px solid ${borderColor}`,
        borderRadius: '4px',
        background: 'white',
        padding: '2rem',
      }}>
        <div style={{
          fontFamily: mainFont,
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: charcoal,
          marginBottom: '1.5rem',
        }}>
          RECENT ACTIVITY
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button style={{
            background: charcoal,
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            fontFamily: monoFont,
            fontWeight: 500,
            fontSize: '1rem',
            borderRadius: 2,
            cursor: 'pointer',
            letterSpacing: 1,
          }}>
            + ADD MEDIA
          </button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', color: charcoal }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
        ) : (
          <div>
            {media.length === 0 && <div style={{ color: borderColor, textAlign: 'center' }}>No media yet.</div>}
            {media.map((item, idx) => (
              <div key={item.id} style={{
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontFamily: mainFont, fontSize: '1.1rem' }}>{item.title}{item.author_artist ? ` - ${item.author_artist}` : ''}</div>
                  <div style={{ color: borderColor, fontSize: '0.95rem', marginTop: 2 }}>
                    {item.type?.replace('_', ' ') || 'Unknown'} • added {item.added_date ? new Date(item.added_date).toLocaleDateString() : ''}
                  </div>
                </div>
                <div style={{ color: charcoal, fontWeight: 'bold', fontSize: '1.1rem', fontFamily: monoFont }}>
                  {'★★★★★'.slice(0, item.rating || 0)}
                  {item.completed ? <span style={{ fontSize: '0.9rem', marginLeft: 8, color: borderColor }}>✓ completed</span> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}