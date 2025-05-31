'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AddMediaFormProps {
  userId: string
  onClose: () => void
  onMediaAdded: () => void
}

export default function AddMediaForm({ userId, onClose, onMediaAdded }: AddMediaFormProps) {
  const [type, setType] = useState('book')
  const [title, setTitle] = useState('')
  const [authorArtist, setAuthorArtist] = useState('')
  const [addedDate, setAddedDate] = useState(new Date().toISOString().split('T')[0])
  const [rating, setRating] = useState<number | null>(null)
  const [review, setReview] = useState('')
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const mediaTypes = [
    { value: 'book', label: 'Book/Reading' },
    { value: 'music', label: 'Music' },
    { value: 'tv_film', label: 'TV & Films' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('media_items')
      .insert({
        user_id: userId,
        type,
        title,
        author_artist: authorArtist || null,
        rating,
        review: review || null,
        completed,
        added_date: addedDate,
        completed_date: completed ? addedDate : null
      })

    if (error) {
      alert(error.message)
    } else {
      onMediaAdded()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <div style={{
        backgroundColor: '#f0e6e6', // dusty rose light
        padding: '2rem',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '2px solid #d4a5a5' // dusty rose main
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
          letterSpacing: '0.1em'
        }}>
          ADD NEW ENTRY
        </h2>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Media Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {mediaTypes.map(mediaType => (
                <option key={mediaType.value} value={mediaType.value}>
                  {mediaType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Author/Artist */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Author/Artist/Director"
              value={authorArtist}
              onChange={(e) => setAuthorArtist(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Date Added */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              Rating:
            </label>
            <select
              value={rating || ''}
              onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">☆ Select rating</option>
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>
          </div>

          {/* Review */}
          <div style={{ marginBottom: '1.5rem' }}>
            <textarea
              placeholder="Your thoughts and review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid black',
                backgroundColor: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Completed Checkbox */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              Completed
            </label>
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              disabled={loading || !title}
              style={{
                backgroundColor: '#d4a5a5', // dusty rose main
                color: 'black',
                padding: '14px 32px',
                border: '2px solid black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: loading || !title ? 0.5 : 1
              }}
            >
              {loading ? 'Adding...' : 'Add Entry'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '14px 32px',
                border: '2px solid black',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}