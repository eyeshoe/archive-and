// src/components/PublicArchive.tsx
'use client'
import { useState } from 'react'
import { useArchiveData } from '@/hooks/useArchiveData'
import { Sidebar } from '@/components/archive/Sidebar'
import { WelcomeSection } from '@/components/archive/WelcomeSection'
import { FavoritesSection } from '@/components/archive/FavoritesSection'
import { MediaSection } from '@/components/archive/MediaSection'
import { ArchivePage } from '@/components/archive/ArchivePage'
import { AddMediaModal } from '@/components/media/AddMediaModal'
import { MediaDetailModal } from '@/components/media/MediaDetailModal'
import { colorThemes } from '@/lib/colorThemes'
import type { CreateMediaItem } from '@/types/media'
import type { MediaItem } from '@/types/archive'
import type { MediaDetailData, UpdateMediaData } from '@/types/mediaDetail'

// Constants for cleaner code
const SIDEBAR_WIDTH = '240px'
const HEADER_HEIGHT = '80px'

export default function PublicArchive({ username }: { username: string }) {
  const {
    userSite,
    mediaItems,
    loading,
    isOwner,
    updateUserSite,
    addMediaItem,
    updateMediaItem,
    refetch
  } = useArchiveData(username)

  const [activeSection, setActiveSection] = useState('home')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaDetailData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: '#faf8f8',
        color: '#c08a8a'
      }}>
        loading archive...
      </div>
    )
  }

  // Not found state
  if (!userSite) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace',
        backgroundColor: '#faf8f8',
        color: '#c08a8a'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Archive not found</h1>
        <p style={{ fontSize: '14px', color: '#a8a29e' }}>
          This archive doesn't exist or has been made private.
        </p>
      </div>
    )
  }

  const theme = colorThemes[userSite.color_theme as keyof typeof colorThemes] || colorThemes.dusty_rose

  // Helper functions
  const getMediaByType = (type: string) => {
    const filteredItems = mediaItems.filter(item => {
      if (type === 'reading') return item.type === 'book'
      if (type === 'music') return item.type === 'music'
      if (type === 'tv_film') return item.type === 'tv_film'
      if (type === 'other') return item.type === 'other'
      return false
    })
    
    return isOwner ? filteredItems : filteredItems.filter(item => item.is_public)
  }

  const handleItemClick = (item: MediaItem) => {
    setSelectedMedia(item as MediaDetailData)
    setShowDetailModal(true)
  }

  const handleUpdateMedia = async (id: string, updates: UpdateMediaData) => {
    return await updateMediaItem(id, updates)
  }

  const renderSectionHeader = (title: string, count: number, type: string) => (
    <div style={{ 
      marginBottom: '32px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${theme.light}`,
      textAlign: 'center'
    }}>
      <h2 style={{ 
        fontSize: '1.75rem', 
        fontFamily: 'serif', 
        color: theme.main, 
        margin: '0 0 8px 0',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {title}
      </h2>
      <p style={{ 
        fontSize: '14px', 
        color: '#a8a29e', 
        margin: '0',
        fontFamily: 'monospace'
      }}>
        {count} {type}
      </p>
    </div>
  )

  const renderMediaSection = (sectionType: string, title: string, typeLabel: string) => {
    const items = getMediaByType(sectionType)
    return (
      <div>
        {renderSectionHeader(title, items.length, typeLabel)}
        <MediaSection 
          items={items} 
          type={typeLabel} 
          theme={theme}
          onItemClick={handleItemClick}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      fontFamily: 'monospace',
      position: 'relative'
    }}>
      {/* Fixed Sidebar */}
      <div style={{
        width: SIDEBAR_WIDTH,
        backgroundColor: theme.sidebar,
        borderRight: `2px solid ${theme.main}`,
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 10
      }}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOwner={isOwner}
          theme={theme}
          onAddMedia={() => setShowAddModal(true)}
        />
      </div>

      {/* Main Content Container - Properly offset from sidebar */}
      <div style={{ 
        marginLeft: SIDEBAR_WIDTH,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: `3px solid ${theme.main}`,
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          height: HEADER_HEIGHT,
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          {/* Centered Logo - Pink Theme Adaptation */}
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontFamily: 'serif',
            margin: '0',
            fontWeight: 'bold',
            color: theme.main
          }}>
            ARCHIVE<span style={{ color: '#a67373' }}>&</span>
          </h1>
          
          {/* Admin Controls - Positioned absolute to top right */}
          {isOwner && (
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                position: 'absolute',
                right: '40px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: theme.main,
                border: `2px solid ${theme.main}`,
                color: 'white',
                padding: '8px 16px',
                fontSize: '11px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.2s ease',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = theme.main
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.main
                e.currentTarget.style.color = 'white'
              }}
            >
              Dashboard
            </button>
          )}
        </header>

        {/* Content Area - Properly spaced */}
        <main style={{ 
          flex: 1,
          padding: '40px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Home Section */}
          {activeSection === 'home' && (
            <>
              <WelcomeSection
                userSite={userSite}
                isOwner={isOwner}
                theme={theme}
                onUpdate={updateUserSite}
              />
              <FavoritesSection
                userSite={userSite}
                isOwner={isOwner}
                theme={theme}
                onUpdate={updateUserSite}
              />
            </>
          )}

          {/* Reading Section */}
          {activeSection === 'reading' && 
            renderMediaSection('reading', 'Reading', 'books')
          }

          {/* Music Section */}
          {activeSection === 'music' && 
            renderMediaSection('music', 'Music', 'tracks & albums')
          }

          {/* TV & Films Section */}
          {activeSection === 'tv_film' && 
            renderMediaSection('tv_film', 'TV & Films', 'shows & movies')
          }

          {/* Other Section */}
          {activeSection === 'other' && 
            renderMediaSection('other', 'Other', 'podcasts, newsletters & more')
          }

          {/* Archive Section */}
          {activeSection === 'archive' && (
            <div>
              <div style={{ 
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${theme.light}`,
                textAlign: 'center'
              }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontFamily: 'serif', 
                  color: theme.main, 
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Archive
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#a8a29e', 
                  margin: '0',
                  fontFamily: 'monospace'
                }}>
                  {mediaItems.length} items • chronological view of all media
                </p>
              </div>
              <ArchivePage
                mediaItems={isOwner ? mediaItems : mediaItems.filter(item => item.is_public)}
                theme={theme}
                onItemClick={handleItemClick}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMediaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        theme={theme}
        onSubmit={addMediaItem}
      />

      <MediaDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedMedia(null)
        }}
        media={selectedMedia}
        theme={theme}
        onUpdate={handleUpdateMedia}
        isOwner={isOwner}
      />
    </div>
  )
}