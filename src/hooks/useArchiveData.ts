import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserSite, MediaItem } from '@/types/archive'
import type { CreateMediaItem } from '@/types/media'
import type { UpdateMediaData } from '@/types/mediaDetail'

export function useArchiveData(username: string) {
  const [userSite, setUserSite] = useState<UserSite | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchUserSite()
    fetchMediaItems()
  }, [username])

  useEffect(() => {
    if (userSite) {
      checkIfOwner()
    }
  }, [userSite])

  const checkIfOwner = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && userSite && user.id === userSite.user_id) {
      setIsOwner(true)
      console.log('User is owner of this archive')
    } else {
      console.log('User is not owner')
    }
  }

  const fetchUserSite = async () => {
    console.log('Fetching user site for username:', username)
    
    const { data, error } = await supabase
      .from('user_sites')
      .select('*')
      .eq('username', username)
      .single()

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Error fetching user site:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      setUserSite(null)
    } else {
      console.log('Successfully fetched user site:', data)
      setUserSite(data)
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
        .order('added_date', { ascending: false })

      if (data && !error) {
        setMediaItems(data)
      }
    }
  }

  const updateUserSite = async (updates: Partial<UserSite>) => {
    if (!userSite) return false

    const { error } = await supabase
      .from('user_sites')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('username', username)

    if (!error) {
      setUserSite({ ...userSite, ...updates })
      console.log('User site updated successfully')
      return true
    }
    console.error('Error updating user site:', error)
    return false
  }

  const addMediaItem = async (mediaData: CreateMediaItem) => {
    if (!userSite) return false

    const { error } = await supabase
      .from('media_items')
      .insert({
        ...mediaData,
        user_id: userSite.user_id,
        added_date: new Date().toISOString(),
        completed_date: mediaData.completed ? new Date().toISOString() : null
      })

    if (!error) {
      console.log('Media item added successfully')
      // Refresh media items to show the new addition
      fetchMediaItems()
      return true
    }
    console.error('Error adding media item:', error)
    return false
  }

  const updateMediaItem = async (mediaId: string, updates: UpdateMediaData) => {
    if (!userSite) return false

    const { error } = await supabase
      .from('media_items')
      .update(updates)
      .eq('id', mediaId)
      .eq('user_id', userSite.user_id)

    if (!error) {
      console.log('Media item updated successfully')
      // Update local state
      setMediaItems(prev => 
        prev.map(item => 
          item.id === mediaId ? { ...item, ...updates } : item
        )
      )
      return true
    }
    console.error('Error updating media item:', error)
    return false
  }

  const refetch = () => {
    fetchUserSite()
    fetchMediaItems()
  }

  return {
    userSite,
    mediaItems,
    loading,
    isOwner,
    updateUserSite,
    addMediaItem,
    updateMediaItem,
    refetch
  }
}