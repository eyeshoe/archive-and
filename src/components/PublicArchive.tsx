'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface UserSite {
  username: string
  color_theme: string
  welcome_message: string
  quote: string
  current_favorites: any
  user_id: string
}

interface MediaItem {
  id: string
  type: string
  title: string
  author_artist: string
  rating: number
  review: string
  notes: string
  completed: boolean
  added_date: string
  completed_date: string
}

const colorThemes = {
  dusty_rose: {
    main: '#c08a8a',
    light: '#f0e6e6',
    background: '#faf8f8',
    sidebar: '#e6d4d4'
  },
  sage: {
    main: '#8b9a7a',
    light: '#e8ede4',
    background: '#fafbf9',
    sidebar: '#d4e0cb'
  },
  charcoal: {
    main: '#6b7280',
    light: '#e5e7eb',
    background: '#fafafa',
    sidebar: '#d1d5db'
  },
  warm_beige: {
    main: '#a3906f',
    light: '#f0ede6',
    background: '#fdfcfa',
    sidebar: '#e6dcc9'
  },
  muted_blue: {
    main: '#7a8eb5',
    light: '#e4e8f1',
    background: '#fafbfc',
    sidebar: '#d1dce8'
  },
  lavender: {
    main: '#9d8db5',
    light: '#ede8f1',
    background: '#fbfafc',
    sidebar: '#e0d6e8'
  }
}

export default function PublicArchive({ username }: { username: string }) {
  const [userSite, setUserSite] = useState<UserSite | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWelcome, setEditingWelcome] = useState(false)
  const [editingFavorites, setEditingFavorites] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [tempWelcome, setTempWelcome] = useState('')
  const [tempQuote, setTempQuote] = useState('')
  const [tempTitle, setTempTitle] = useState('')
  const [tempFavorites, setTempFavorites] = useState({
    book: '',
    music: '',
    tv_movies: ''
  })
  const [activeSection, setActiveSection] = useState('home')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchUserSite()
    fetchMediaItems()
    checkIfOwner()
  }, [username])

  const checkIfOwner = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && userSite && user.id === userSite.user_id) {
      setIsOwner(true)
    }
  }

  const fetchUserSite = async () => {
    const { data, error } = await supabase
      .from('user_sites')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Error fetching user site:', error)
    } else {
      setUserSite(data)
      setTempWelcome(data.welcome_message)
      setTempQuote(data.quote)
      setTempTitle(`${data.username}'s Archive`)
      
      // Set default favorites if not set
      const favorites = data.current_favorites || {}
      setTempFavorites({
        book: favorites.book || 'Diary of a Wimpy Kid: Rodrick Rules - Jeff Kinney',
        music: favorites.music || 'Heavy Metal Drummer - Wilco',
        tv_movies: favorites.tv_movies || 'Fleabag - Phoebe Waller-Bridge'
      })
    }
    setLoading(false)
  }

  const fetchMediaItems = async () => {
    const { data: siteData } = await supabase
      .from('user_sites')
      .select('user_id')
      .eq('username', username)
      .single()

    if (siteData) {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('user_id', siteData.user_id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (data && !error) {
        setMediaItems(data)
      }
    }
  }

  const updateTitle = async () => {
    if (!userSite) return

    const { error } = await supabase
      .from('user_sites')
      .update({ 
        username: tempTitle.replace("'s Archive", "")
      })
      .eq('username', username)

    if (!error) {
      setUserSite({
        ...userSite,
        username: tempTitle.replace("'s Archive", "")
      })
      setEditingTitle(false)
    }
  }

  const updateWelcomeMessage = async () => {
    if (!userSite) return

    const { error } = await supabase
      .from('user_sites')
      .update({ 
        welcome_message: tempWelcome,
        quote: tempQuote 
      })
      .eq('username', username)

    if (!error) {
      setUserSite({
        ...userSite,
        welcome_message: tempWelcome,
        quote: tempQuote
      })
      setEditingWelcome(false)
    }
  }

  const updateFavorites = async () => {
    if (!userSite) return

    const { error } = await supabase
      .from('user_sites')
      .update({ 
        current_favorites: tempFavorites
      })
      .eq('username', username)

    if (!error) {
      setUserSite({
        ...userSite,
        current_favorites: tempFavorites
      })
      setEditingFavorites(false)
    }
  }

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
        loading archive...
      </div>
    )
  }

  if (!userSite) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: '#fafaf9'
      }}>
        archive not found
      </div>
    )
  }

  const theme = colorThemes[userSite.color_theme as keyof typeof colorThemes] || colorThemes.dusty_rose

  const getMediaByType = (type: string) => {
    return mediaItems.filter(item => {
      if (type === 'reading') return item.type === 'book'
      if (type === 'music') return item.type === 'music'
      if (type === 'tv_film') return item.type === 'tv_film'
      if (type === 'other') return item.type === 'other'
      return false
    })
  }

  const MediaSection = ({ items, type }: { items: MediaItem[], type: string }) => (
    <div>
      {items.length === 0 ? (
        <p style={{ 
          color: '#a8a29e', 
          fontStyle: 'italic', 
          textAlign: 'center', 
          padding: '2rem',
          fontFamily: 'monospace'
        }}>
          No {type} added yet.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              backgroundColor: 'white',
              border: `2px solid ${theme.light}`,
              borderRadius: '0',
              padding: '24px',
              fontFamily: 'monospace'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <span style={{
                  backgroundColor: theme.main,
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
                  {item.review}
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
                {item.completed && <span>✓ Completed</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const AdminHeader = () => (
    isOwner && (
      <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        backgroundColor: theme.main,
        color: 'white',
        padding: '8px 16px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000
      }}>
        ADMIN MODE
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            marginLeft: '12px',
            backgroundColor: 'white',
            color: theme.main,
            border: 'none',
            padding: '4px 8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            cursor: 'pointer'
          }}
        >
          Dashboard
        </button>
      </div>
    )
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      fontFamily: 'monospace',
      display: 'flex'
    }}>
      <AdminHeader />
      
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: theme.sidebar,
        borderRight: `2px solid ${theme.main}`,
        padding: '32px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: theme.main,
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            NAVIGATION
          </h2>
        </div>

        {[
          { id: 'home', label: 'HOME' },
          { id: 'reading', label: 'READING' },
          { id: 'music', label: 'MUSIC' },
          { id: 'tv_film', label: 'TV & FILMS' },
          { id: 'other', label: 'OTHER' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              width: '100%',
              backgroundColor: activeSection === section.id ? theme.main : 'transparent',
              color: activeSection === section.id ? 'white' : theme.main,
              border: 'none',
              padding: '12px 24px',
              fontSize: '14px',
              fontFamily: 'monospace',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: activeSection === section.id ? 'bold' : 'normal'
            }}
          >
            {section.label}
          </button>
        ))}

        {/* Add Media Button */}
        {isOwner && (
          <div style={{ padding: '24px', position: 'absolute', bottom: '0', width: '100%' }}>
            <button
              style={{
                width: '100%',
                backgroundColor: theme.main,
                color: 'white',
                border: 'none',
                padding: '12px',
                fontSize: '16px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                borderRadius: '50%',
                height: '50px'
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '200px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{
          borderBottom: `2px solid ${theme.main}`,
          backgroundColor: 'white',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {editingTitle && isOwner ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                style={{
                  fontSize: '2.5rem',
                  fontFamily: 'serif',
                  color: '#292524',
                  border: `2px solid ${theme.main}`,
                  padding: '8px',
                  textAlign: 'center',
                  backgroundColor: 'white'
                }}
              />
              <button
                onClick={updateTitle}
                style={{
                  backgroundColor: theme.main,
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false)
                  setTempTitle(`${userSite.username}'s Archive`)
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${theme.main}`,
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                fontFamily: 'serif',
                color: '#292524',
                margin: '0'
              }}>
                {userSite.username}'s archive
              </h1>
              {isOwner && (
                <button
                  onClick={() => setEditingTitle(true)}
                  style={{
                    position: 'absolute',
                    right: '32px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.main}`,
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: theme.main,
                    fontFamily: 'monospace'
                  }}
                >
                  ✏️ Edit
                </button>
              )}
            </>
          )}
        </div>

        {/* Content */}
        {activeSection === 'home' && (
          <>
            {/* Welcome Section */}
            <div style={{
              backgroundColor: 'white',
              border: `2px solid ${theme.main}`,
              padding: '32px',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontFamily: 'serif',
                  color: theme.main,
                  margin: '0'
                }}>
                  Welcome to {userSite.username}'s Archive
                </h2>
                {isOwner && (
                  <button
                    onClick={() => setEditingWelcome(true)}
                    style={{
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.main}`,
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: theme.main,
                      fontFamily: 'monospace'
                    }}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editingWelcome ? (
                <div style={{ textAlign: 'left' }}>
                  <textarea
                    value={tempWelcome}
                    onChange={(e) => setTempWelcome(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: `2px solid ${theme.main}`,
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      marginBottom: '16px',
                      resize: 'vertical'
                    }}
                  />
                  <input
                    value={tempQuote}
                    onChange={(e) => setTempQuote(e.target.value)}
                    placeholder="Quote"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${theme.main}`,
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      marginBottom: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={updateWelcomeMessage}
                      style={{
                        backgroundColor: theme.main,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'monospace'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingWelcome(false)
                        setTempWelcome(userSite.welcome_message)
                        setTempQuote(userSite.quote)
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: `2px solid ${theme.main}`,
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'monospace'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#44403c',
                    marginBottom: '24px',
                    fontFamily: 'monospace'
                  }}>
                    {userSite.welcome_message}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: theme.main,
                    fontFamily: 'monospace'
                  }}>
                    {userSite.quote}
                  </p>
                </>
              )}
            </div>

            {/* Current Favorites */}
            <div style={{
              backgroundColor: 'white',
              border: `2px solid ${theme.main}`,
              padding: '32px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontFamily: 'serif',
                  color: theme.main,
                  margin: '0'
                }}>
                  CURRENT FAVORITES
                </h3>
                {isOwner && (
                  <button
                    onClick={() => setEditingFavorites(true)}
                    style={{
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.main}`,
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: theme.main,
                      fontFamily: 'monospace'
                    }}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editingFavorites ? (
                <div>
                  <input
                    value={tempFavorites.book}
                    onChange={(e) => setTempFavorites({...tempFavorites, book: e.target.value})}
                    placeholder="Book:"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${theme.main}`,
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      marginBottom: '12px'
                    }}
                  />
                  <input
                    value={tempFavorites.music}
                    onChange={(e) => setTempFavorites({...tempFavorites, music: e.target.value})}
                    placeholder="Music:"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${theme.main}`,
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      marginBottom: '12px'
                    }}
                  />
                  <input
                    value={tempFavorites.tv_movies}
                    onChange={(e) => setTempFavorites({...tempFavorites, tv_movies: e.target.value})}
                    placeholder="TV/Movies:"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${theme.main}`,
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      marginBottom: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={updateFavorites}
                      style={{
                        backgroundColor: theme.main,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'monospace'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingFavorites(false)}
                      style={{
                        backgroundColor: 'transparent',
                        border: `2px solid ${theme.main}`,
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'monospace'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#44403c', fontFamily: 'monospace' }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Book:</strong> {tempFavorites.book}
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Music:</strong> {tempFavorites.music}
                  </p>
                  <p style={{ margin: '0 0 16px 0' }}>
                    <strong>TV/Movies:</strong> {tempFavorites.tv_movies}
                  </p>
                  <p style={{ fontSize: '12px', color: '#a8a29e', margin: '0' }}>
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'reading' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              READING
            </h2>
            <MediaSection items={getMediaByType('reading')} type="books" />
          </div>
        )}

        {activeSection === 'music' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              MUSIC
            </h2>
            <MediaSection items={getMediaByType('music')} type="music" />
          </div>
        )}

        {activeSection === 'tv_film' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              TV & FILMS
            </h2>
            <MediaSection items={getMediaByType('tv_film')} type="TV & films" />
          </div>
        )}

        {activeSection === 'other' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              OTHER
            </h2>
            <MediaSection items={getMediaByType('other')} type="other media" />
          </div>
        )}
      </div>
    </div>
  )
}