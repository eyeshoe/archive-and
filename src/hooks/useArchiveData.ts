import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase' // Only needed for auth
import type { UserSite, MediaItem } from '@/types/archive'
import type { CreateMediaItem } from '@/types/media'
import type { UpdateMediaData } from '@/types/mediaDetail'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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
    // You can keep Supabase for auth if needed
    // const { data: { user } } = await supabase.auth.getUser()
    // if (user && userSite && user.id === userSite.user_id) {
    //   setIsOwner(true)
    //   console.log('User is owner of this archive')
    // } else {
    //   console.log('User is not owner')
    // }
  }

  const fetchUserSite = async () => {
    // You may want to update this to use your backend as well
    setLoading(false)
  }

  const fetchMediaItems = async () => {
    if (!userSite) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/media?user_id=${userSite.user_id}`);
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  }

  const updateUserSite = async (updates: Partial<UserSite>) => {
    if (!userSite) return false
    // You may want to update this to use your backend as well
    return false
  }

  const addMediaItem = async (mediaData: CreateMediaItem) => {
    if (!userSite) return false;
    try {
      const res = await fetch(`${BACKEND_URL}/api/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userSite.user_id,
          title: mediaData.title,
          description: mediaData.notes || '',
          file_path: '/uploads/placeholder.jpg',
          file_type: 'other',
          file_size: 0,
          privacy_setting: mediaData.is_public ? 'public' : 'private',
          metadata: {
            type: mediaData.type,
            author_artist: mediaData.author_artist,
            rating: mediaData.rating,
            review: mediaData.review,
            completed: mediaData.completed,
            notes_public: mediaData.notes_public
          }
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add media');
      }
      await fetchMediaItems(); // Refresh list
      return true;
    } catch (error) {
      console.error('Error adding media item:', error);
      return false;
    }
  }

  const updateMediaItem = async (mediaId: string, updates: UpdateMediaData) => {
    if (!userSite) return false
    // You may want to update this to use your backend as well
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