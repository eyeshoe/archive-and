export interface UserSite {
    username: string
    color_theme: string
    welcome_message: string
    quote: string
    current_favorites: any
    user_id: string
    updated_at?: string
  }
  
  export interface MediaItem {
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
  
  export interface Theme {
    main: string
    light: string
    background: string
    sidebar: string
  }