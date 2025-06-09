export interface MediaDetailData {
    id: string
    title: string
    author_artist: string
    type: string
    rating: number
    review: string
    notes: string
    completed: boolean
    is_public: boolean
    added_date: string
    completed_date: string | null
    user_id: string
  }
  
  export interface UpdateMediaData {
    rating?: number
    review?: string
    notes?: string
    completed?: boolean
    is_public?: boolean
    completed_date?: string | null
  }