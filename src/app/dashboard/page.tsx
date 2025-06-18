'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { AddMediaModal } from '@/components/media/AddMediaModal'
import { MediaDetailModal } from '@/components/media/MediaDetailModal'
import type { CreateMediaItem } from '@/types/media'
import type { UpdateMediaData } from '@/types/mediaDetail'
import { colorThemes } from '@/lib/colorThemes'

interface UserSite {
  id: string
  username: string
  color_theme: string
  welcome_message: string
  quote: string
  current_favorites: any
  user_id: string
  created_at: string
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
  is_public: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [userSite, setUserSite] = useState<UserSite | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  // Get theme colors
  const theme = userSite ? colorThemes[userSite.color_theme as keyof typeof colorThemes] || colorThemes.dusty_rose : colorThemes.dusty_rose

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      await fetchUserSite(user.id)
      await fetchMediaItems(user.id)
    }
    setLoading(false)
  }

  const fetchUserSite = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_sites')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setUserSite(data)
    }
  }

  const fetchMediaItems = async (userId: string) => {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      setMediaItems(data)
    }
  }

  const handleAddMedia = async (mediaData: CreateMediaItem) => {
    if (!user) return false

    const { error } = await supabase
      .from('media_items')
      .insert({
        ...mediaData,
        user_id: user.id,
        added_date: new Date().toISOString(),
        completed_date: mediaData.completed ? new Date().toISOString() : null
      })

    if (!error) {
      console.log('Media item added successfully')
      await fetchMediaItems(user.id)
      return true
    }
    console.error('Error adding media item:', error)
    return false
  }

  const handleUpdateMedia = async (mediaId: string, updates: UpdateMediaData) => {
    if (!user) return false

    const { error } = await supabase
      .from('media_items')
      .update(updates)
      .eq('id', mediaId)
      .eq('user_id', user.id)

    if (!error) {
      await fetchMediaItems(user.id)
      return true
    }
    console.error('Error updating media item:', error)
    return false
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getArchivingSinceDate = () => {
    if (!userSite?.created_at) return ''
    const date = new Date(userSite.created_at)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return '#c08a8a'
      case 'music': return '#a67373'
      case 'tv_film': return '#b57d7d'
      case 'other': return '#8f6666'
      default: return theme.main
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: theme.background,
        fontFamily: 'monospace',
        color: theme.main
      }}>
        Loading your archive...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: theme.background,
        fontFamily: 'monospace',
        color: theme.main
      }}>
        Please log in to access your dashboard.
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      fontFamily: 'monospace'
    }}>
      {/* Beautiful Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: `3px solid ${theme.main}`,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontFamily: 'serif',
            color: theme.main,
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Archive Dashboard
          </h1>
          {userSite && (
            <p style={{
              fontSize: '12px',
              color: '#a8a29e',
              margin: 0,
              fontFamily: 'monospace',
              letterSpacing: '0.5px'
            }}>
              archiving since {getArchivingSinceDate()}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Future buttons placeholder */}
          <button
            disabled
            style={{
              backgroundColor: theme.light,
              border: `1px solid ${theme.light}`,
              color: '#a8a29e',
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'not-allowed',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            create digest
          </button>
          
          <button
            onClick={() => window.location.href = '/settings'}
            style={{
              backgroundColor: theme.light,
              border: `1px solid ${theme.main}`,
              color: theme.main,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.main
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = theme.light
              e.currentTarget.style.color = theme.main
            }}
          >
            settings
          </button>

          {userSite && (
            <button
              onClick={() => window.location.href = `/${userSite.username}`}
              style={{
                backgroundColor: theme.light,
                border: `1px solid ${theme.main}`,
                color: theme.main,
                padding: '10px 16px',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.main
                e.currentTarget.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.light
                e.currentTarget.style.color = theme.main
              }}
            >
              view site
            </button>
          )}
          
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${theme.main}`,
              color: theme.main,
              padding: '10px 16px',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.main
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = theme.main
            }}
          >
            sign out
          </button>
        </div>
      </header>

      <div style={{ padding: '32px' }}>
        {/* Beautiful Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'books', count: mediaItems.filter(item => item.type === 'book').length, color: '#c08a8a' },
            { label: 'music', count: mediaItems.filter(item => item.type === 'music').length, color: '#a67373' },
            { label: 'tv & films', count: mediaItems.filter(item => item.type === 'tv_film').length, color: '#b57d7d' },
            { label: 'other', count: mediaItems.filter(item => item.type === 'other').length, color: '#8f6666' }
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: 'white',
              border: `2px solid ${stat.color}`,
              padding: '24px',
              textAlign: 'center',
              transition: 'transform 0.2s ease',
              cursor: 'default'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: stat.color,
                marginBottom: '8px',
                fontFamily: 'serif'
              }}>
                {stat.count}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'monospace'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div style={{
          backgroundColor: 'white',
          border: `2px solid ${theme.main}`,
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'serif',
              color: theme.main,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Recent Activity
            </h2>
            
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: theme.main,
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                fontSize: '12px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              + add media
            </button>
          </div>

          {/* Clickable Media Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mediaItems.slice(0, 8).map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedMedia(item)}
                style={{
                  padding: '20px',
                  border: `2px solid ${theme.light}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.main
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = theme.light
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      backgroundColor: getTypeColor(item.type),
                      color: 'white',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {item.type.replace('_', ' & ')}
                    </span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '16px',
                    fontFamily: 'serif',
                    margin: '0 0 4px 0',
                    color: '#1f2937'
                  }}>
                    {item.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 4px 0',
                    fontFamily: 'monospace'
                  }}>
                    {item.author_artist}
                  </p>
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#a8a29e',
                    margin: 0,
                    fontFamily: 'monospace'
                  }}>
                    added {new Date(item.added_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ color: getTypeColor(item.type), fontSize: '14px' }}>
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </div>
                  {item.completed && (
                    <span style={{ 
                      color: '#a8a29e', 
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}>
                      ✓ completed
                    </span>
                  )}
                  <span style={{ 
                    color: theme.main, 
                    fontSize: '16px',
                    fontFamily: 'monospace'
                  }}>
                    →
                  </span>
                </div>
              </div>
            ))}
            
            {mediaItems.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                  No media added yet
                </p>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Click "Add Media" to start building your archive!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        theme={theme}
        onSubmit={handleAddMedia}
      />

      {/* Media Detail Modal */}
      {selectedMedia && (
        <MediaDetailModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          media={selectedMedia}
          theme={theme}
          onUpdate={handleUpdateMedia}
          isOwner={true}
        />
      )}
    </div>
  )
}