'use client';

import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

export default function TestDB() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test the connection by trying to get stores
        const stores = await prisma.store.findMany({
          take: 5
        });
        
        setStatus('✅ Database connection successful!');
        setData(stores);
      } catch (error: any) {
        setStatus(`❌ Database connection failed: ${error.message}`);
        console.error('Database test error:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className="mb-4">
        <strong>Status:</strong> {status}
      </div>
      
      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stores in Database:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 