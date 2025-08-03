'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestRealtimePage() {
  const [realtimeStatus, setRealtimeStatus] = useState<string>('Connecting...')
  const [events, setEvents] = useState<any[]>([])
  const [testData, setTestData] = useState<any>(null)

  useEffect(() => {
    // Test real-time connection
    const testRealtime = async () => {
      try {
        // Subscribe to sales changes
        const salesSubscription = supabase
          .channel('sales_realtime')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'sales' 
            }, 
            (payload) => {
              console.log('Sales change:', payload)
              setEvents(prev => [...prev, { type: 'sales', ...payload }])
              setRealtimeStatus('✅ Real-time working! Sales updates received')
            }
          )
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'customers' 
            }, 
            (payload) => {
              console.log('Customer change:', payload)
              setEvents(prev => [...prev, { type: 'customers', ...payload }])
              setRealtimeStatus('✅ Real-time working! Customer updates received')
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status)
            if (status === 'SUBSCRIBED') {
              setRealtimeStatus('✅ Real-time connected! Waiting for changes...')
            } else if (status === 'CHANNEL_ERROR') {
              setRealtimeStatus('❌ Real-time connection failed')
            }
          })

        // Note: Storage real-time events are not directly supported in this way
        // Storage changes are typically handled through database triggers or manual polling

        return () => {
          salesSubscription.unsubscribe()
        }
      } catch (error) {
        console.error('Real-time error:', error)
        setRealtimeStatus('❌ Real-time connection failed')
      }
    }

    testRealtime()
  }, [])

  const testStorageUpload = async () => {
    try {
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const { data, error } = await supabase.storage
        .from('store-assets')
        .upload(`test-${Date.now()}.txt`, testFile)

      if (error) {
        console.error('Storage upload error:', error)
      } else {
        console.log('Storage upload success:', data)
        setTestData(data)
      }
    } catch (error) {
      console.error('Storage test error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Real-Time Test Dashboard</h1>
        
        {/* Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Status</h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{realtimeStatus}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Operations</h2>
          <div className="space-y-4">
            <button
              onClick={testStorageUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Test Storage Upload
            </button>
            
            {testData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Storage Test Result:</h3>
                <pre className="text-sm text-green-700">{JSON.stringify(testData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-Time Events</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500">No real-time events received yet...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {event.type} - {event.eventType || 'change'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(event, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 