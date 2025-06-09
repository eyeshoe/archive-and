// src/components/PublicArchive.tsx
'use client'
import { useState } from 'react'
import { useArchiveData } from '@/hooks/useArchiveData'
import { AdminHeader } from '@/components/archive/AdminHeader'
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
    const filteredItems = mediaItems.filter(item => {
      if (type === 'reading') return item.type === 'book'
      if (type === 'music') return item.type === 'music'
      if (type === 'tv_film') return item.type === 'tv_film'
      if (type === 'other') return item.type === 'other'
      return false
    })
    
    // Show only public items for non-owners
    return isOwner ? filteredItems : filteredItems.filter(item => item.is_public)
  }

  const handleItemClick = (item: MediaItem) => {
    setSelectedMedia(item as MediaDetailData)
    setShowDetailModal(true)
  }

  const handleUpdateMedia = async (id: string, updates: UpdateMediaData) => {
    const success = await updateMediaItem(id, updates)
    return success
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.background,
      fontFamily: 'monospace',
      display: 'flex'
    }}>
      <AdminHeader isOwner={isOwner} theme={theme} />
      
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOwner={isOwner}
        theme={theme}
        onAddMedia={() => setShowAddModal(true)}
      />

      <div style={{ marginLeft: '280px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px 32px',
          marginBottom: '32px',
          borderBottom: `2px solid ${theme.main}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'normal',
            fontFamily: 'monospace',
            color: '#292524',
            margin: '0',
            textTransform: 'lowercase',
            letterSpacing: '2px'
          }}>
            {userSite.username}'s archive
          </h1>
        </div>

        {/* Content Sections */}
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

        {activeSection === 'reading' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              READING
            </h2>
            <MediaSection 
              items={getMediaByType('reading')} 
              type="books" 
              theme={theme} 
              onItemClick={handleItemClick}
            />
          </div>
        )}

        {activeSection === 'music' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              MUSIC
            </h2>
            <MediaSection 
              items={getMediaByType('music')} 
              type="music" 
              theme={theme}
              onItemClick={handleItemClick}
            />
          </div>
        )}

        {activeSection === 'tv_film' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              TV & FILMS
            </h2>
            <MediaSection 
              items={getMediaByType('tv_film')} 
              type="TV & films" 
              theme={theme}
              onItemClick={handleItemClick}
            />
          </div>
        )}

        {activeSection === 'other' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'serif', color: theme.main, marginBottom: '24px' }}>
              OTHER
            </h2>
            <MediaSection 
              items={getMediaByType('other')} 
              type="other media" 
              theme={theme}
              onItemClick={handleItemClick}
            />
          </div>
        )}

        {activeSection === 'archive' && (
          <ArchivePage
            mediaItems={isOwner ? mediaItems : mediaItems.filter(item => item.is_public)}
            theme={theme}
            onItemClick={handleItemClick}
          />
        )}
      </div>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        theme={theme}
        onSubmit={addMediaItem}
      />

      {/* Media Detail Modal */}
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