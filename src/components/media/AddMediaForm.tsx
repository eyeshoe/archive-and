import { useState } from 'react'
import type { Theme } from '@/types/archive'
import type { MediaFormData, CreateMediaItem } from '@/types/media'
import { MEDIA_TYPES } from '@/types/media'

interface AddMediaFormProps {
  theme: Theme
  onSubmit: (data: CreateMediaItem) => Promise<boolean>
  onCancel: () => void
  isSubmitting: boolean
}

export function AddMediaForm({ theme, onSubmit, onCancel, isSubmitting }: AddMediaFormProps) {
  // Add a fallback theme in case theme is undefined
  const safeTheme = theme || {
    main: '#c08a8a',
    light: '#f0e6e6',
    background: '#faf8f8',
    sidebar: '#e6d4d4'
  }
  const [formData, setFormData] = useState<MediaFormData>({
    type: 'book',
    title: '',
    author_artist: '',
    rating: 5,
    review: '',
    notes: '',
    completed: false,
    is_public: true,
    notes_public: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    const success = await onSubmit(formData)
    if (success) {
      // Reset form on successful submission
      setFormData({
        type: 'book',
        title: '',
        author_artist: '',
        rating: 5,
        review: '',
        notes: '',
        completed: false,
        is_public: true,
        notes_public: true
      })
    }
  }

  const updateField = (field: keyof MediaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${safeTheme.main}`,
    fontSize: '16px',
    fontFamily: 'monospace',
    marginBottom: '16px',
    backgroundColor: 'white',
    borderRadius: '0'
  }

  const labelStyle = {
    display: 'block' as const,
    marginBottom: '8px',
    fontWeight: 'bold' as const,
    color: '#44403c',
    fontFamily: 'monospace',
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Media Type */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => updateField('type', e.target.value)}
          style={{
            ...inputStyle,
            height: '48px',
            cursor: 'pointer'
          }}
        >
          {MEDIA_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Title: *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter the full title..."
          style={{
            ...inputStyle,
            height: '48px'
          }}
          required
        />
      </div>

      {/* Author/Artist */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          {formData.type === 'book' ? 'Author:' : 
           formData.type === 'music' ? 'Artist:' : 
           formData.type === 'tv_film' ? 'Director/Creator:' : 
           'Creator:'}
        </label>
        <input
          type="text"
          value={formData.author_artist}
          onChange={(e) => updateField('author_artist', e.target.value)}
          placeholder="Enter the creator's name..."
          style={{
            ...inputStyle,
            height: '48px'
          }}
        />
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Rating:</label>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center', 
          marginBottom: '8px',
          padding: '8px 0'
        }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => updateField('rating', star)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: star <= formData.rating ? safeTheme.main : '#e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ★
            </button>
          ))}
          <span style={{ 
            marginLeft: '8px', 
            fontFamily: 'monospace', 
            color: '#57534e',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {formData.rating}/5
          </span>
        </div>
      </div>

      {/* Review */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Review:</label>
        <textarea
          value={formData.review}
          onChange={(e) => updateField('review', e.target.value)}
          placeholder="Share your thoughts, what you loved, what you didn't..."
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical' as const,
            lineHeight: '1.5'
          }}
        />
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Notes & Quotes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Personal notes, quotes, thoughts..."
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical' as const,
            lineHeight: '1.5'
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#57534e'
          }}>
            <input
              type="checkbox"
              checked={!formData.notes_public}
              onChange={(e) => updateField('notes_public', !e.target.checked)}
              style={{ 
                marginRight: '6px',
                width: '14px',
                height: '14px',
                accentColor: safeTheme.main
              }}
            />
            Keep these notes private
          </label>
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          marginBottom: '12px',
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#44403c'
        }}>
          <input
            type="checkbox"
            checked={formData.completed}
            onChange={(e) => updateField('completed', e.target.checked)}
            style={{ 
              marginRight: '8px',
              width: '16px',
              height: '16px',
              accentColor: safeTheme.main
            }}
          />
          I've completed this
        </label>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#44403c'
        }}>
          <input
            type="checkbox"
            checked={formData.is_public}
            onChange={(e) => updateField('is_public', e.target.checked)}
            style={{ 
              marginRight: '8px',
              width: '16px',
              height: '16px',
              accentColor: safeTheme.main
            }}
          />
          Show on my public archive
        </label>
      </div>

      {/* Submit Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        borderTop: `1px solid ${safeTheme.light}`,
        paddingTop: '20px'
      }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            backgroundColor: 'transparent',
            border: `2px solid ${safeTheme.main}`,
            color: safeTheme.main,
            padding: '12px 24px',
            fontSize: '13px',
            fontFamily: 'monospace',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!formData.title.trim() || isSubmitting}
          style={{
            backgroundColor: safeTheme.main,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '13px',
            fontFamily: 'monospace',
            cursor: (!formData.title.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
            opacity: (!formData.title.trim() || isSubmitting) ? 0.6 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}
        >
          {isSubmitting ? 'Adding...' : 'Add to Archive'}
        </button>
      </div>
    </form>
  )
}