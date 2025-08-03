'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('stores')
          .select('count')
          .limit(1)
        
        if (error) {
          if (error.code === 'PGRST116') {
            setConnectionStatus('✅ Connected to Supabase! Table "stores" does not exist yet (expected)')
          } else {
            setConnectionStatus('❌ Connection failed')
            setError(error.message)
          }
        } else {
          setConnectionStatus('✅ Connected to Supabase! Database is accessible')
        }
      } catch (err) {
        setConnectionStatus('❌ Connection failed')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold text-gray-800 mb-2">Connection Status:</h2>
            <p className="text-sm">{connectionStatus}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Project Info:</h3>
            <p className="text-sm text-blue-700">
              <strong>URL:</strong> https://mdwpqkrbmjwmfqygxuag.supabase.co<br />
              <strong>Status:</strong> Configuration loaded
            </p>
          </div>

          <div className="mt-6">
            <a 
              href="/" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 