import { useState } from 'react'
// import { supabase } from '@/lib/supabase' // Only needed for auth
import { media } from '@/lib/api'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface MediaItem {
  id: number
  title: string
  file_path: string
  file_type: string
  file_size: number
  description?: string
  privacy_setting: 'public' | 'private'
  created_at: string
  type?: string
  author_artist?: string
  rating?: number
  review?: string
  completed?: boolean
  notes_public?: string
  notes?: string
  metadata?: {
    type?: string
    author_artist?: string
    rating?: number
    review?: string
    completed?: boolean
    notes_public?: string
  }
}

interface UserSite {
  username: string
  user_id?: number
  media: MediaItem[]
}

export function useArchiveData() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPublicSite = async (username: string): Promise<UserSite | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await media.getPublic(username)

      if (error) {
        throw new Error(error)
      }

      // Add default privacy_setting for public media
      const mediaWithPrivacy = (data || []).map(item => ({
        ...item,
        privacy_setting: 'public' as const
      }))

      return {
        username,
        media: mediaWithPrivacy,
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch site data')
      return null
    } finally {
      setLoading(false)
    }
  }

  const addMedia = async (
    title: string,
    file_path: string,
    file_type: string,
    file_size: number,
    description?: string,
    privacy_setting: 'public' | 'private' = 'public'
  ): Promise<number | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await media.add({
        title,
        file_path,
        file_type,
        file_size,
        description,
        privacy_setting,
      })

      if (error) {
        throw new Error(error)
      }

      return data?.id || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add media')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getMedia = async (userId: number): Promise<MediaItem[]> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await media.get(userId)

      if (error) {
        throw new Error(error)
      }

      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media')
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getPublicSite,
    addMedia,
    getMedia,
  }
}

// This hook will use fetch to interact with the backend API instead of Supabase
// Add your data fetching logic here as needed for your app

// Example usage:
// export async function getPublicMedia(username: string) {
//   const res = await fetch(`/api/media/public/${username}`);
//   return res.json();
// }