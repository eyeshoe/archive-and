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
  const [formData, setFormData] = useState<MediaFormData>({
    type: 'book',
    title: '',
    author_artist: '',
    rating: 5,
    review: '',
    notes: '',
    completed: false,
    is_public: true
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
        is_public: true
      })
    }
  }

  const updateField = (field: keyof MediaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: `2px solid ${theme.main}`,
    fontSize: '14px',
    fontFamily: 'monospace',
    marginBottom: '16px'
  }

  const labelStyle = {
    display: 'block' as const,
    marginBottom: '8px',
    fontWeight: 'bold' as const,
    color: '#44403c',
    fontFamily: 'monospace'
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {/* Media Type */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => updateField('type', e.target.value)}
          style={inputStyle}
        >
          {MEDIA_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Title: *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter title..."
          style={inputStyle}
          required
        />
      </div>

      {/* Author/Artist */}
      <div style={{ marginBottom: '16px' }}>
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
          placeholder="Enter name..."
          style={inputStyle}
        />
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Rating:</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => updateField('rating', star)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: star <= formData.rating ? theme.main : '#e5e7eb',
                cursor: 'pointer'
              }}
            >
              ★
            </button>
          ))}
          <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: '#57534e' }}>
            {formData.rating}/5
          </span>
        </div>
      </div>

      {/* Review */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Review:</label>
        <textarea
          value={formData.review}
          onChange={(e) => updateField('review', e.target.value)}
          placeholder="Write your thoughts..."
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical' as const
          }}
        />
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Private Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Personal notes (only you can see these)..."
          style={{
            ...inputStyle,
            minHeight: '60px',
            resize: 'vertical' as const
          }}
        />
      </div>

      {/* Checkboxes */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.completed}
            onChange={(e) => updateField('completed', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Completed
        </label>
        
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.is_public}
            onChange={(e) => updateField('is_public', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Show on public archive
        </label>
      </div>

      {/* Submit Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            backgroundColor: 'transparent',
            border: `2px solid ${theme.main}`,
            color: theme.main,
            padding: '12px 24px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!formData.title.trim() || isSubmitting}
          style={{
            backgroundColor: theme.main,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '14px',
            fontFamily: 'monospace',
            cursor: (!formData.title.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
            opacity: (!formData.title.trim() || isSubmitting) ? 0.6 : 1
          }}
        >
          {isSubmitting ? 'Adding...' : 'Add Media'}
        </button>
      </div>
    </form>
  )
}


