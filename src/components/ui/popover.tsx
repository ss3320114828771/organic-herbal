'use client'

import React from 'react'

// Super simple Popover
export default function Popover({ trigger, children }: any) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          padding: '16px',
          zIndex: 50,
          minWidth: '200px'
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Super simple Tooltip
export function Tooltip({ children, text }: any) {
  const [show, setShow] = React.useState(false)

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: '#1f2937',
          color: 'white',
          fontSize: '12px',
          borderRadius: '4px',
          padding: '4px 8px',
          whiteSpace: 'nowrap',
          zIndex: 50
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

// Super simple Menu
export function Menu({ trigger, items }: any) {
  return (
    <Popover trigger={trigger}>
      <div style={{ minWidth: '160px' }}>
        {items.map((item: any, i: number) => (
          <div key={i}>
            {item.divider ? (
              <div style={{ margin: '8px 0', borderTop: '1px solid #e5e7eb' }} />
            ) : (
              <button
                onClick={item.onClick}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </Popover>
  )
}

// Super simple User Menu
export function UserMenu({ user, onLogout }: any) {
  const items = [
    { label: 'Profile', onClick: () => console.log('profile') },
    { label: 'Settings', onClick: () => console.log('settings') },
    { divider: true },
    { label: 'Logout', onClick: onLogout }
  ]

  return (
    <Menu
      trigger={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <span>{user?.name || 'User'}</span>
        </div>
      }
      items={items}
    />
  )
}

// Super simple Notification Bell
export function NotificationBell({ count = 0 }: any) {
  return (
    <Popover
      trigger={
        <button style={{ padding: '8px', position: 'relative', cursor: 'pointer' }}>
          🔔
          {count > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {count}
            </span>
          )}
        </button>
      }
    >
      <div style={{ width: '250px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Notifications</h3>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>No new notifications</p>
      </div>
    </Popover>
  )
}

// Super simple hook
export function usePopover() {
  const [isOpen, setIsOpen] = React.useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  return { isOpen, open, close, toggle }
}