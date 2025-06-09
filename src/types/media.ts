export interface CreateMediaItem {
    type: 'book' | 'music' | 'tv_film' | 'other'
    title: string
    author_artist: string
    rating: number
    review: string
    notes: string
    completed: boolean
    is_public: boolean
  }
  
  export interface MediaFormData extends CreateMediaItem {
    // Form-specific fields can be added here if needed
  }
  
  export const MEDIA_TYPES = [
    { value: 'book', label: 'Book' },
    { value: 'music', label: 'Music' },
    { value: 'tv_film', label: 'TV/Film' },
    { value: 'other', label: 'Other' }
  ] as const