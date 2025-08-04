'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Target,
  Star,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function FloorManagerTeamManagement() {
  const [currentFloor] = useState('Floor 1');

  // Mock team data
  const teamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Sales Associate',
      status: 'ON_DUTY',
      performance: 95,
      avatar: '/avatars/sarah.jpg',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@store.com',
      shift: '9 AM - 5 PM',
      salesToday: 3,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Sales Associate',
      status: 'ON_BREAK',
      performance: 87,
      avatar: '/avatars/mike.jpg',
      phone: '+1 (555) 234-5678',
      email: 'mike.chen@store.com',
      shift: '10 AM - 6 PM',
      salesToday: 2,
      rating: 4.5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Junior Sales Associate',
      status: 'ON_DUTY',
      performance: 92,
      avatar: '/avatars/emily.jpg',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@store.com',
      shift: '11 AM - 7 PM',
      salesToday: 1,
      rating: 4.2
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Sales Associate',
      status: 'OFF_DUTY',
      performance: 89,
      avatar: '/avatars/david.jpg',
      phone: '+1 (555) 456-7890',
      email: 'david.kim@store.com',
      shift: '12 PM - 8 PM',
      salesToday: 0,
      rating: 4.6
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_DUTY':
        return 'bg-green-100 text-green-800';
      case 'ON_BREAK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OFF_DUTY':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ON_DUTY':
        return 'On Duty';
      case 'ON_BREAK':
        return 'On Break';
      case 'OFF_DUTY':
        return 'Off Duty';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <PageHeader
          title={`${currentFloor} Team Management`}
          description="Manage your floor staff, schedules, and performance"
          breadcrumbs={true}
          actions={
            <div className="flex gap-2">
              <Button
                onClick={() => console.log('Add staff member')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log('View schedule')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </div>
          }
        />

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.filter(m => m.status === 'ON_DUTY').length} on duty
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3.2%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.reduce((sum, m) => sum + m.salesToday, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all staff members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Floor Staff</CardTitle>
            <CardDescription>
              Manage your team members and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                      <div className="text-xs text-gray-400 flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {member.shift}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.salesToday} sales today
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">{member.performance}%</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    
                    <Badge className={getStatusColor(member.status)}>
                      {getStatusText(member.status)}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage staff schedules and shifts
              </p>
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitor team performance metrics
              </p>
              <Button className="w-full">
                <Target className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage training and development
              </p>
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Training Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 