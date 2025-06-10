'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { AddMediaModal } from '@/components/media/AddMediaModal'
import type { CreateMediaItem } from '@/types/media'
import { colorThemes } from '@/lib/colorThemes'

interface UserSite {
  id: string
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
  is_public: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [userSite, setUserSite] = useState<UserSite | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

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
      // Refresh media items to show the new addition
      await fetchMediaItems(user.id)
      return true
    }
    console.error('Error adding media item:', error)
    return false
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'monospace' }}>Loading...</div>
  }

  if (!user) {
    return <div style={{ padding: '2rem', fontFamily: 'monospace' }}>Please log in to access your dashboard.</div>
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: `2px solid ${theme.main}`,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontFamily: 'serif',
          color: theme.main,
          margin: 0
        }}>
          {userSite?.username}'s archive dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {userSite && (
            <button
              onClick={() => window.location.href = `/${userSite.username}`}
              style={{
                backgroundColor: theme.light,
                border: `1px solid ${theme.main}`,
                color: theme.main,
                padding: '8px 16px',
                fontSize: '12px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px'
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
              padding: '8px 16px',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            sign out
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'books', count: mediaItems.filter(item => item.type === 'book').length },
            { label: 'music', count: mediaItems.filter(item => item.type === 'music').length },
            { label: 'tv & films', count: mediaItems.filter(item => item.type === 'tv_film').length },
            { label: 'other', count: mediaItems.filter(item => item.type === 'other').length }
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: 'white',
              border: `2px solid ${theme.light}`,
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: theme.main,
                marginBottom: '0.5rem'
              }}>
                {stat.count}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '1px'
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
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontFamily: 'serif',
              color: theme.main,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              recent activity
            </h2>
            
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: theme.main,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '14px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              + add media
            </button>
          </div>

          {/* Media Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mediaItems.slice(0, 5).map((item) => (
              <div key={item.id} style={{
                padding: '1rem',
                border: `1px solid ${theme.light}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontFamily: 'serif',
                    margin: '0 0 0.25rem 0',
                    color: '#1f2937'
                  }}>
                    {item.title} - {item.author_artist}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {item.type.replace('_', ' & ')} • added {new Date(item.added_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ color: theme.main, fontSize: '0.875rem' }}>
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </div>
                  {item.completed && (
                    <span style={{ 
                      color: '#a8a29e', 
                      fontSize: '0.75rem' 
                    }}>
                      ✓ completed
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {mediaItems.length === 0 && (
              <p style={{
                color: '#6b7280',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '2rem'
              }}>
                No media added yet. Click "Add Media" to get started!
              </p>
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
    </div>
  )
}