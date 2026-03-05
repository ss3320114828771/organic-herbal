'use client'

import React from 'react'

// Simple Dialog component
export default function Dialog({ 
  isOpen, 
  onClose, 
  title, 
  children,
  actions 
}: any) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        )}
        
        {/* Content */}
        <div className="mb-6">
          {children}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-2">
            {actions}
          </div>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </>
  )
}

// Simple Alert Dialog
export function AlertDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'OK',
  cancelText = 'Cancel'
}: any) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Dialog>
  )
}

// Simple Confirm Dialog
export function ConfirmDialog(props: any) {
  return <AlertDialog {...props} variant="warning" />
}

// Simple Form Dialog
export function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  children
}: any) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </>
      }
    >
      {children}
    </Dialog>
  )
}

// Simple Hook
export function useDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  
  return { isOpen, open, close, toggle }
}