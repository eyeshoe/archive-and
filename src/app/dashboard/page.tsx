'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import AddMediaForm from '@/components/AddMediaForm'

interface UserSite {
  id: string
  username: string
  color_theme: string
  welcome_message: string
  quote: string
  current_favorites: any
}

interface MediaItem {
  id: string
  type: string
  title: string
  author_artist?: string
  rating?: number
  review?: string
  notes?: string
  completed: boolean
  added_date: string
  completed_date?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [userSite, setUserSite] = useState<UserSite | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showSiteSetup, setShowSiteSetup] = useState(false)
  const [showAddMedia, setShowAddMedia] = useState(false)

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (user) {
        setUser(user)
        
        // Check if user has a site
        const { data: siteData } = await supabase
          .from('user_sites')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (siteData) {
          setUserSite(siteData)
          
          // Load media items
          const { data: mediaData } = await supabase
            .from('media_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (mediaData) {
            setMediaItems(mediaData)
          }
        } else {
          // No site exists, show setup
          setShowSiteSetup(true)
        }
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: '#fafaf9'
      }}>
        loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: '#fafaf9'
      }}>
        <p>please log in to access your dashboard</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            marginTop: '1rem',
            backgroundColor: '#44403c',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            fontFamily: 'monospace',
            cursor: 'pointer'
          }}
        >
          back to home
        </button>
      </div>
    )
  }

  if (showSiteSetup || !userSite) {
    return <SiteSetup user={user} onSiteCreated={(site) => {
      setUserSite(site)
      setShowSiteSetup(false)
    }} />
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafaf9', 
      fontFamily: 'monospace',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          fontFamily: 'serif' 
        }}>
          {userSite.username}'s archive dashboard
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => window.open(`/${userSite.username}`, '_blank')}
            style={{
              backgroundColor: '#44403c',
              color: 'white',
              padding: '8px 16px',
              fontSize: '14px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            view site
          </button>
          <button 
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #a8a29e',
              padding: '8px 16px',
              fontSize: '14px',
              fontFamily: 'monospace',
              cursor: 'pointer'
            }}
          >
            sign out
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#44403c' }}>
            {mediaItems.filter(item => item.type === 'book').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>books</div>
        </div>
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#44403c' }}>
            {mediaItems.filter(item => item.type === 'music').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>music</div>
        </div>
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#44403c' }}>
            {mediaItems.filter(item => item.type === 'tv_film').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>tv & films</div>
        </div>
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#44403c' }}>
            {mediaItems.filter(item => item.type === 'other').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>other</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>recent activity</h2>
          <button
            onClick={() => setShowAddMedia(true)}
            style={{
              backgroundColor: '#44403c',
              color: 'white',
              padding: '8px 16px',
              fontSize: '14px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            + add media
          </button>
        </div>
        
        {mediaItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              no media entries yet
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              start building your archive by adding your first book, album, or film
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gap: '1rem'
          }}>
            {mediaItems.slice(0, 5).map(item => (
              <div key={item.id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {item.title} {item.author_artist && `- ${item.author_artist}`}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {item.type} • added {new Date(item.added_date).toLocaleDateString()}
                    {item.rating && ` • ${'★'.repeat(item.rating)}`}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {item.completed ? 'completed' : 'in progress'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Media Form */}
      {showAddMedia && (
        <AddMediaForm 
          userId={user.id}
          onClose={() => setShowAddMedia(false)}
          onMediaAdded={() => {
            // Refresh media items
            supabase
              .from('media_items')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .then(({ data }) => {
                if (data) setMediaItems(data)
              })
          }}
        />
      )}
    </div>
  )
}

// Site Setup Component
function SiteSetup({ user, onSiteCreated }: { 
  user: User, 
  onSiteCreated: (site: UserSite) => void 
}) {
  const [username, setUsername] = useState('')
  const [colorTheme, setColorTheme] = useState('dusty rose')
  const [loading, setLoading] = useState(false)

  const colorThemes = [
    { 
      name: 'dusty rose', 
      main: '#d4a5a5',
      light: '#f0e6e6',
      bg: '#faf8f8',
      preview: '#d4a5a5'
    },
    { 
      name: 'sage green', 
      main: '#a5b5a5',
      light: '#e8ebe8', 
      bg: '#f7f9f7',
      preview: '#a5b5a5'
    },
    { 
      name: 'charcoal', 
      main: '#6b6b6b',
      light: '#e5e5e5',
      bg: '#f8f8f8',
      preview: '#6b6b6b'
    },
    { 
      name: 'warm beige', 
      main: '#c4a888',
      light: '#f0ebe3',
      bg: '#faf9f7',
      preview: '#c4a888'
    },
    { 
      name: 'muted blue', 
      main: '#8fa5b5',
      light: '#e6ebf0',
      bg: '#f7f9fa',
      preview: '#8fa5b5'
    },
    { 
      name: 'lavender grey', 
      main: '#a59bb5',
      light: '#ebe8f0',
      bg: '#f9f7fa',
      preview: '#a59bb5'
    }
  ]

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('user_sites')
      .insert({
        user_id: user.id,
        username: username.toLowerCase(),
        color_theme: colorTheme
      })
      .select()
      .single()

    if (error) {
      alert(error.message)
    } else {
      onSiteCreated(data)
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafaf9', 
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid #e5e7eb'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          marginBottom: '1rem',
          fontFamily: 'serif'
        }}>
          create your archive
        </h1>
        <p style={{ 
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          let's set up your personal media archive. you'll get your own site at username.archiveand.com
        </p>

        <form onSubmit={handleCreateSite}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              choose your username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              placeholder="yourname"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.5rem' }}>
              {username && `${username.toLowerCase()}.archiveand.com`}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              pick a color theme
            </label>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              {colorThemes.map(theme => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setColorTheme(theme.name)}
                  style={{
                    padding: '1rem',
                    backgroundColor: theme.bg,
                    border: colorTheme === theme.name ? `2px solid ${theme.main}` : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}
                >
                  <div style={{ 
                    width: '100%',
                    height: '30px',
                    background: `linear-gradient(90deg, ${theme.main} 50%, ${theme.light} 50%)`,
                    margin: '0 auto 0.5rem',
                    border: '1px solid #e5e7eb'
                  }}></div>
                  <div style={{ fontSize: '12px' }}>{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            style={{
              width: '100%',
              backgroundColor: '#44403c',
              color: 'white',
              padding: '12px',
              border: 'none',
              fontFamily: 'monospace',
              cursor: 'pointer',
              opacity: loading || !username ? 0.5 : 1
            }}
          >
            {loading ? 'creating...' : 'create my archive'}
          </button>
        </form>
      </div>
    </div>
  )
}