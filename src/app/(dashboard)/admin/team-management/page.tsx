'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Plus,
  Users,
  UserPlus,
  Building2,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  floor: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  performance: number;
  salesCount: number;
  totalRevenue: number;
  joinDate: string;
  avatar?: string;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalSales: number;
  totalRevenue: number;
  averagePerformance: number;
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for now - in real app, this would come from API
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'SALESPERSON',
          floor: 'Floor 1',
          phone: '+91 98765 43210',
          status: 'ACTIVE',
          performance: 95,
          salesCount: 45,
          totalRevenue: 125000,
          joinDate: '2023-01-15'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          role: 'FLOOR_MANAGER',
          floor: 'Floor 2',
          phone: '+91 98765 43211',
          status: 'ACTIVE',
          performance: 88,
          salesCount: 38,
          totalRevenue: 98000,
          joinDate: '2022-08-20'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike.davis@example.com',
          role: 'SALESPERSON',
          floor: 'Floor 1',
          phone: '+91 98765 43212',
          status: 'ACTIVE',
          performance: 92,
          salesCount: 42,
          totalRevenue: 115000,
          joinDate: '2023-03-10'
        },
        {
          id: '4',
          name: 'Emily Wilson',
          email: 'emily.wilson@example.com',
          role: 'SALESPERSON',
          floor: 'Floor 3',
          phone: '+91 98765 43213',
          status: 'ON_LEAVE',
          performance: 85,
          salesCount: 35,
          totalRevenue: 89000,
          joinDate: '2022-11-05'
        },
        {
          id: '5',
          name: 'David Brown',
          email: 'david.brown@example.com',
          role: 'FLOOR_MANAGER',
          floor: 'Floor 3',
          phone: '+91 98765 43214',
          status: 'ACTIVE',
          performance: 90,
          salesCount: 40,
          totalRevenue: 105000,
          joinDate: '2022-06-12'
        }
      ];

      const mockStats: TeamStats = {
        totalMembers: mockMembers.length,
        activeMembers: mockMembers.filter(m => m.status === 'ACTIVE').length,
        totalSales: mockMembers.reduce((sum, m) => sum + m.salesCount, 0),
        totalRevenue: mockMembers.reduce((sum, m) => sum + m.totalRevenue, 0),
        averagePerformance: Math.round(mockMembers.reduce((sum, m) => sum + m.performance, 0) / mockMembers.length)
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMembers(mockMembers);
      setStats(mockStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'FLOOR_MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'SALESPERSON':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMembers = members.filter(member => {
    if (roleFilter && roleFilter !== 'all' && member.role !== roleFilter) return false;
    if (floorFilter && floorFilter !== 'all' && member.floor !== floorFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <LoadingSpinner text="Loading team members..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage error={error} onRetry={fetchTeamMembers} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Team Management"
          description="Manage your sales team and track performance"
          breadcrumbs={true}
          actions={
            <Button onClick={() => window.location.href = '/admin/team-management/new'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeMembers} active members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSales}</div>
              <p className="text-xs text-muted-foreground">
                Combined sales count
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Team revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averagePerformance}%</div>
              <p className="text-xs text-muted-foreground">
                Team average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Showing {filteredMembers.length} team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                                     <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="FLOOR_MANAGER">Floor Manager</SelectItem>
                  <SelectItem value="SALESPERSON">Salesperson</SelectItem>
                </SelectContent>
              </Select>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent>
                                     <SelectItem value="all">All Floors</SelectItem>
                  <SelectItem value="Floor 1">Floor 1</SelectItem>
                  <SelectItem value="Floor 2">Floor 2</SelectItem>
                  <SelectItem value="Floor 3">Floor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Member</th>
                    <th className="text-left p-2 font-medium">Role</th>
                    <th className="text-left p-2 font-medium">Floor</th>
                    <th className="text-left p-2 font-medium">Performance</th>
                    <th className="text-left p-2 font-medium">Sales</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                          {member.floor}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{member.salesCount}</div>
                          <div className="text-sm text-gray-500">
                            ₹{member.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No team members found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 