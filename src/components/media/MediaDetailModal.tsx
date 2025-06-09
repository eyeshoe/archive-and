import { useState, useEffect } from 'react'
import type { Theme } from '@/types/archive'
import type { MediaDetailData, UpdateMediaData } from '@/types/mediaDetail'

interface MediaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  media: MediaDetailData | null
  theme: Theme
  onUpdate: (id: string, updates: UpdateMediaData) => Promise<boolean>
  isOwner: boolean
}

export function MediaDetailModal({ isOpen, onClose, media, theme, onUpdate, isOwner }: MediaDetailModalProps) {
  const [editingReview, setEditingReview] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [tempReview, setTempReview] = useState('')
  const [tempNotes, setTempNotes] = useState('')
  const [tempRating, setTempRating] = useState(5)
  const [tempCompleted, setTempCompleted] = useState(false)
  const [tempPublic, setTempPublic] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (media) {
      setTempReview(media.review || '')
      setTempNotes(media.notes || '')
      setTempRating(media.rating)
      setTempCompleted(media.completed)
      setTempPublic(media.is_public)
    }
  }, [media])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSaveReview = async () => {
    if (!media) return
    setIsSaving(true)
    
    const success = await onUpdate(media.id, { 
      review: tempReview,
      rating: tempRating 
    })
    
    if (success) {
      setEditingReview(false)
    }
    setIsSaving(false)
  }

  const handleSaveNotes = async () => {
    if (!media) return
    setIsSaving(true)
    
    const success = await onUpdate(media.id, { notes: tempNotes })
    
    if (success) {
      setEditingNotes(false)
    }
    setIsSaving(false)
  }

  const handleToggleCompleted = async () => {
    if (!media) return
    setIsSaving(true)
    
    const newCompleted = !tempCompleted
    const success = await onUpdate(media.id, { 
      completed: newCompleted,
      completed_date: newCompleted ? new Date().toISOString() : null
    })
    
    if (success) {
      setTempCompleted(newCompleted)
    }
    setIsSaving(false)
  }

  const handleTogglePublic = async () => {
    if (!media) return
    setIsSaving(true)
    
    const newPublic = !tempPublic
    const success = await onUpdate(media.id, { is_public: newPublic })
    
    if (success) {
      setTempPublic(newPublic)
    }
    setIsSaving(false)
  }

  if (!isOpen || !media) return null

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'book': return 'Book'
      case 'music': return 'Music'
      case 'tv_film': return 'TV/Film'
      case 'other': return 'Other'
      default: return type
    }
  }

  const getCreatorLabel = (type: string) => {
    switch (type) {
      case 'book': return 'Author'
      case 'music': return 'Artist'
      case 'tv_film': return 'Director/Creator'
      case 'other': return 'Creator'
      default: return 'Creator'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          border: `3px solid ${theme.main}`,
          borderRadius: '0',
          padding: '0',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: 'monospace'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          backgroundColor: theme.main,
          color: 'white',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              opacity: 0.9
            }}>
              {getTypeLabel(media.type)}
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontFamily: 'serif',
              margin: '0 0 8px 0',
              lineHeight: '1.2'
            }}>
              {media.title}
            </h1>
            {media.author_artist && (
              <div style={{
                fontSize: '16px',
                opacity: 0.9
              }}>
                {getCreatorLabel(media.type)}: {media.author_artist}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '28px',
              color: 'white',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '16px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Rating & Status */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: `2px solid ${theme.light}`
          }}>
            <div>
              {/* Rating */}
              {isOwner && editingReview ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTempRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        color: star <= tempRating ? theme.main : '#e5e7eb',
                        cursor: 'pointer'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '24px', color: theme.main }}>
                  {'★'.repeat(tempRating)}{'☆'.repeat(5 - tempRating)}
                </div>
              )}
            </div>

            {/* Status Toggles (Owner Only) */}
            {isOwner && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#57534e'
                }}>
                  <input
                    type="checkbox"
                    checked={tempCompleted}
                    onChange={handleToggleCompleted}
                    disabled={isSaving}
                    style={{ marginRight: '8px' }}
                  />
                  Completed
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#57534e'
                }}>
                  <input
                    type="checkbox"
                    checked={tempPublic}
                    onChange={handleTogglePublic}
                    disabled={isSaving}
                    style={{ marginRight: '8px' }}
                  />
                  Public
                </label>
              </div>
            )}
          </div>

          {/* Review Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'serif',
                color: theme.main,
                margin: '0'
              }}>
                Review
              </h3>
              {isOwner && !editingReview && (
                <button
                  onClick={() => setEditingReview(true)}
                  style={{
                    backgroundColor: theme.light,
                    border: `1px solid ${theme.light}`,
                    color: theme.main,
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.main
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.light
                    e.currentTarget.style.color = theme.main
                  }}
                >
                  Edit Review
                </button>
              )}
            </div>

            {editingReview && isOwner ? (
              <div>
                <textarea
                  value={tempReview}
                  onChange={(e) => setTempReview(e.target.value)}
                  placeholder="Write your review..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    border: `2px solid ${theme.main}`,
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    marginBottom: '16px'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSaveReview}
                    disabled={isSaving}
                    style={{
                      backgroundColor: theme.main,
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.6 : 1
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingReview(false)
                      setTempReview(media.review || '')
                      setTempRating(media.rating)
                    }}
                    disabled={isSaving}
                    style={{
                      backgroundColor: 'transparent',
                      border: `2px solid ${theme.main}`,
                      color: theme.main,
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: theme.background,
                padding: '20px',
                border: `1px solid ${theme.light}`,
                minHeight: '80px',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#44403c'
              }}>
                {tempReview || (
                  <span style={{ fontStyle: 'italic', color: '#a8a29e' }}>
                    No review yet
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'serif',
                color: theme.main,
                margin: '0'
              }}>
                Notes & Quotes
              </h3>
              {isOwner && !editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  style={{
                    backgroundColor: theme.light,
                    border: `1px solid ${theme.light}`,
                    color: theme.main,
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.main
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.light
                    e.currentTarget.style.color = theme.main
                  }}
                >
                  Edit Notes
                </button>
              )}
            </div>

            {editingNotes && isOwner ? (
              <div>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add your notes, quotes, and additional thoughts here..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    border: `2px solid ${theme.main}`,
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    marginBottom: '16px'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    style={{
                      backgroundColor: theme.main,
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.6 : 1
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingNotes(false)
                      setTempNotes(media.notes || '')
                    }}
                    disabled={isSaving}
                    style={{
                      backgroundColor: 'transparent',
                      border: `2px solid ${theme.main}`,
                      color: theme.main,
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: theme.background,
                padding: '20px',
                border: `1px solid ${theme.light}`,
                minHeight: '80px',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#44403c'
              }}>
                {tempNotes || (
                  <span style={{ fontStyle: 'italic', color: '#a8a29e' }}>
                    {isOwner ? 'Keep these notes private' : 'No notes available'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div style={{
            fontSize: '12px',
            color: '#a8a29e',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.light}`,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Added: {new Date(media.added_date).toLocaleDateString()}</span>
            {media.completed_date && (
              <span>Completed: {new Date(media.completed_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}