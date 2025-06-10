import { useEffect, useState } from 'react'
import type { Theme } from '@/types/archive'
import type { CreateMediaItem } from '@/types/media'
import { AddMediaForm } from './AddMediaForm'

interface AddMediaModalProps {
  isOpen: boolean
  onClose: () => void
  theme: Theme
  onSubmit: (data: CreateMediaItem) => Promise<boolean>
}

export function AddMediaModal({ isOpen, onClose, theme, onSubmit }: AddMediaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmit = async (data: CreateMediaItem) => {
    setIsSubmitting(true)
    try {
      const success = await onSubmit(data)
      if (success) {
        onClose()
      }
      return success
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose} // Close when clicking backdrop
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
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div style={{
          backgroundColor: theme.main,
          color: 'white',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `2px solid ${theme.main}`
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontFamily: 'serif',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Add Media
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '28px',
              color: 'white',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              padding: '0',
              opacity: isSubmitting ? 0.6 : 1,
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px 40px 32px 40px' }}>
          <AddMediaForm
            theme={theme}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}