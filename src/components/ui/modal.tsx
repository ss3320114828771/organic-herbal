'use client'

import React from 'react'

// Super simple Modal
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: any) {
  if (!isOpen) return null

  return (
    <div>
      {/* Background overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}
        onClick={onClose}
      />
      
      {/* Modal box */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 1001,
          maxWidth: '500px',
          width: '90%'
        }}
      >
        {title && <h3 style={{ marginBottom: '15px' }}>{title}</h3>}
        <div>{children}</div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Confirm dialog
export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message 
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm">
      <p>{message || 'Are you sure?'}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={onClose} style={{ padding: '8px 16px' }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: '8px 16px', background: 'red', color: 'white' }}>Confirm</button>
      </div>
    </Modal>
  )
}

// Alert dialog
export function AlertDialog({ 
  isOpen, 
  onClose, 
  message 
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alert">
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', background: 'green', color: 'white' }}>OK</button>
      </div>
    </Modal>
  )
}

// Simple hook
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  return { isOpen, open, close }
}