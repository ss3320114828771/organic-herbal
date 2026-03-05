// lib/websocket.ts

// Super simple WebSocket client - NO ERRORS
export class WebSocketClient {
  private ws: WebSocket | null = null
  private messageHandlers: Map<string, Function[]> = new Map()

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('Connected')
        resolve()
      }

      this.ws.onerror = (error) => {
        reject(error)
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const handlers = this.messageHandlers.get(data.type) || []
          handlers.forEach(handler => handler(data.payload))
        } catch (e) {
          console.error('Message error:', e)
        }
      }
    })
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  on(type: string, handler: Function) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}

// Simple React hook - FIXED
import { useState, useEffect, useRef } from 'react'

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const wsRef = useRef<WebSocketClient | null>(null)

  useEffect(() => {
    const ws = new WebSocketClient()
    wsRef.current = ws

    ws.connect(url).then(() => {
      setIsConnected(true)
    })

    ws.on('message', (data: any) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      ws.disconnect()
    }
  }, [url])

  const send = (type: string, payload: any) => {
    wsRef.current?.send(type, payload)
  }

  return { isConnected, messages, send }
}