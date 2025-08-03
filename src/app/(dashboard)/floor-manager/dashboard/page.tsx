'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  TrendingUp, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Mail,
  ChevronDown
} from 'lucide-react';

// Mock data for floor manager dashboard
const visitorMetrics = {
  today: 45,
  thisWeek: 234,
  thisMonth: 892
};

const salesMetrics = {
  today: 125000,
  thisWeek: 450000,
  thisMonth: 1850000
};

const floorCustomers = {
  floor1: [
    { name: 'Priya Sharma', number: '+91 98765 43210', interest: 'Gold Necklace' },
    { name: 'Amit Patel', number: '+91 87654 32109', interest: 'Diamond Ring' },
    { name: 'Kavya Singh', number: '+91 76543 21098', interest: 'Silver Bracelet' },
    { name: 'Rahul Verma', number: '+91 65432 10987', interest: 'Platinum Chain' }
  ],
  floor2: [
    { name: 'Neha Gupta', number: '+91 54321 09876', interest: 'Pearl Set' },
    { name: 'Vikram Malhotra', number: '+91 43210 98765', interest: 'Ruby Earrings' },
    { name: 'Sneha Reddy', number: '+91 32109 87654', interest: 'Emerald Ring' },
    { name: 'Rajesh Kumar', number: '+91 21098 76543', interest: 'Sapphire Necklace' }
  ],
  floor3: [
    { name: 'Anjali Desai', number: '+91 10987 65432', interest: 'Gold Bangle' },
    { name: 'Mohan Singh', number: '+91 09876 54321', interest: 'Diamond Pendant' },
    { name: 'Pooja Sharma', number: '+91 98765 43210', interest: 'Silver Ring' },
    { name: 'Arjun Mehta', number: '+91 87654 32109', interest: 'Platinum Earrings' }
  ]
};

export default function FloorManagerDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout userRole="FLOOR_MANAGER" userFloor="Floor 1">
      <PageHeader
        title="Floor Manager Dashboard"
        description="Manage your floor operations and track performance"
        breadcrumbs={true}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        }
      />

      {/* 3x3 Grid Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Row - Visitor Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">How many people visited today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">{visitorMetrics.today}</div>
              <p className="text-sm text-gray-600 mt-2">Unique visitors</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">How many people visited this week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">{visitorMetrics.thisWeek}</div>
              <p className="text-sm text-gray-600 mt-2">Weekly visitors</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">How many people visited this month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">{visitorMetrics.thisMonth}</div>
              <p className="text-sm text-gray-600 mt-2">Monthly visitors</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Row - Sales Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(salesMetrics.today)}</div>
              <p className="text-sm text-gray-600 mt-2">Daily revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales this week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(salesMetrics.thisWeek)}</div>
              <p className="text-sm text-gray-600 mt-2">Weekly revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales this month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(salesMetrics.thisMonth)}</div>
              <p className="text-sm text-gray-600 mt-2">Monthly revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Row - Floor Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Floor 1 customers</CardTitle>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 flex justify-between">
                  <span>Name</span>
                  <span>Number</span>
                  <span>Interest</span>
                </div>
                {floorCustomers.floor1.map((customer, index) => (
                  <div key={index} className="text-sm flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-gray-600">{customer.number}</span>
                    <span className="text-gray-500">{customer.interest}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Floor 2 customers</CardTitle>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 flex justify-between">
                  <span>Name</span>
                  <span>Number</span>
                  <span>Interest</span>
                </div>
                {floorCustomers.floor2.map((customer, index) => (
                  <div key={index} className="text-sm flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-gray-600">{customer.number}</span>
                    <span className="text-gray-500">{customer.interest}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Floor 3 customers</CardTitle>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 flex justify-between">
                  <span>Name</span>
                  <span>Number</span>
                  <span>Interest</span>
                </div>
                {floorCustomers.floor3.map((customer, index) => (
                  <div key={index} className="text-sm flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-gray-600">{customer.number}</span>
                    <span className="text-gray-500">{customer.interest}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </DashboardLayout>
  );
} 