import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER';
  storeId?: string;
  floorId?: string;
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user details from the users table
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, store_id, floor_id')
      .eq('id', user.id)
      .single();

    if (userError || !userDetails) {
      return null;
    }

    return {
      id: userDetails.id,
      email: userDetails.email,
      name: userDetails.name,
      role: userDetails.role,
      storeId: userDetails.store_id,
      floorId: userDetails.floor_id,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return handler(request, user);
  };
}

export function requireRole(role: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER') {
  return (handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) => {
    return requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
      if (user.role !== role) {
        return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return handler(request, user);
    });
  };
} 