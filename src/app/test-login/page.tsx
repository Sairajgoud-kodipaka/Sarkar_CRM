'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@sarkarcrm.com');
  const [password, setPassword] = useState('admin123');
  const [status, setStatus] = useState('');
  const { login, user, isLoading } = useAuth();

  const handleTestLogin = async () => {
    setStatus('Logging in...');
    try {
      await login(email, password);
      setStatus(`✅ Login successful! User: ${user?.name} (${user?.role})`);
    } catch (error) {
      setStatus(`❌ Login failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Login System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button onClick={handleTestLogin} className="w-full">
            Test Login
          </Button>
          <div className="text-sm">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.name} (${user.role})` : 'None'}</p>
          </div>
          <div className="text-xs text-gray-600">
            <p><strong>Test Credentials:</strong></p>
            <p>admin@sarkarcrm.com / admin123</p>
            <p>manager@sarkarcrm.com / manager123</p>
            <p>sales@sarkarcrm.com / sales123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 