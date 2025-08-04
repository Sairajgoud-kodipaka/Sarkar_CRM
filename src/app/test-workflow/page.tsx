'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { useWorkflow } from '@/lib/workflow';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function TestWorkflowPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState({
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+91 98765 43210',
    incomeRange: 'HIGH'
  });
  const [saleData, setSaleData] = useState({
    customerId: 'test-customer-id',
    productId: 'test-product-id',
    floorId: 'test-floor-id',
    amount: 75000
  });

  const { 
    isLoading, 
    error, 
    createApprovalRequest, 
    createCustomerWithWorkflow, 
    createSaleWithWorkflow,
    getPendingApprovals 
  } = useWorkflowAPI();

  const { requiresApproval, getApprovalPriority } = useWorkflow();

  const addTestResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const testWorkflowLogic = () => {
    addTestResult('Workflow Logic', 'success', 'Testing approval requirements...');
    
    // Test customer creation approval
    const customerRequiresApproval = requiresApproval('CUSTOMER_CREATE', {
      customerValue: 'HIGH_VALUE',
      ...customerData
    });
    
    addTestResult('Customer Approval Check', 
      customerRequiresApproval ? 'success' : 'error',
      customerRequiresApproval ? 'High-value customer requires approval' : 'Customer should require approval for high income'
    );

    // Test sale creation approval
    const saleRequiresApproval = requiresApproval('SALE_CREATE', saleData);
    
    addTestResult('Sale Approval Check', 
      saleRequiresApproval ? 'success' : 'error',
      saleRequiresApproval ? 'High-value sale requires approval' : 'Sale should require approval for amount > ₹50,000'
    );

    // Test priority calculation
    const priority = getApprovalPriority('SALE_CREATE', saleData);
    addTestResult('Priority Calculation', 'success', `Sale priority: ${priority}`);
  };

  const testCustomerCreation = async () => {
    try {
      addTestResult('Customer Creation', 'success', 'Creating customer with workflow...');
      
      const result = await createCustomerWithWorkflow(customerData, 'test-user-id');
      
      if (result.data?.approvalId) {
        addTestResult('Customer Creation Result', 'success', 
          'Customer creation requires approval', 
          { approvalId: result.data.approvalId, status: result.data.status }
        );
      } else {
        addTestResult('Customer Creation Result', 'success', 
          'Customer created directly', 
          result.data
        );
      }
    } catch (err: any) {
      addTestResult('Customer Creation Error', 'error', err.message);
    }
  };

  const testSaleCreation = async () => {
    try {
      addTestResult('Sale Creation', 'success', 'Creating sale with workflow...');
      
      const result = await createSaleWithWorkflow(saleData, 'test-user-id');
      
      if (result.data?.approvalId) {
        addTestResult('Sale Creation Result', 'success', 
          'Sale creation requires approval', 
          { approvalId: result.data.approvalId, status: result.data.status }
        );
      } else {
        addTestResult('Sale Creation Result', 'success', 
          'Sale created directly', 
          result.data
        );
      }
    } catch (err: any) {
      addTestResult('Sale Creation Error', 'error', err.message);
    }
  };

  const testApprovalRequest = async () => {
    try {
      addTestResult('Approval Request', 'success', 'Creating approval request...');
      
      const approvalData = {
        actionType: 'CUSTOMER_CREATE' as const,
        requesterId: 'test-user-id',
        requestData: customerData,
        approvalNotes: 'Test approval request',
        priority: 'HIGH' as const
      };
      
      const result = await createApprovalRequest(approvalData);
      addTestResult('Approval Request Result', 'success', 
        'Approval request created successfully', 
        result
      );
    } catch (err: any) {
      addTestResult('Approval Request Error', 'error', err.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflow API Integration Test</h1>
          <p className="text-gray-600">Testing the workflow system integration</p>
        </div>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run workflow tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testWorkflowLogic} 
              disabled={isLoading}
              className="w-full"
            >
              Test Workflow Logic
            </Button>
            
            <Button 
              onClick={testCustomerCreation} 
              disabled={isLoading}
              className="w-full"
            >
              Test Customer Creation
            </Button>
            
            <Button 
              onClick={testSaleCreation} 
              disabled={isLoading}
              className="w-full"
            >
              Test Sale Creation
            </Button>
            
            <Button 
              onClick={testApprovalRequest} 
              disabled={isLoading}
              className="w-full"
            >
              Test Approval Request
            </Button>
          </CardContent>
        </Card>

        {/* Test Data */}
        <Card>
          <CardHeader>
            <CardTitle>Test Data</CardTitle>
            <CardDescription>Sample data for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Customer Data</Label>
              <Textarea 
                value={JSON.stringify(customerData, null, 2)}
                onChange={(e) => {
                  try {
                    setCustomerData(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="text-xs"
              />
            </div>
            
            <div>
              <Label>Sale Data</Label>
              <Textarea 
                value={JSON.stringify(saleData, null, 2)}
                onChange={(e) => {
                  try {
                    setSaleData(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Results from workflow tests</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No test results yet. Run a test to see results here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { useWorkflow } from '@/lib/workflow';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function TestWorkflowPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState({
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+91 98765 43210',
    incomeRange: 'HIGH'
  });
  const [saleData, setSaleData] = useState({
    customerId: 'test-customer-id',
    productId: 'test-product-id',
    floorId: 'test-floor-id',
    amount: 75000
  });

  const { 
    isLoading, 
    error, 
    createApprovalRequest, 
    createCustomerWithWorkflow, 
    createSaleWithWorkflow,
    getPendingApprovals 
  } = useWorkflowAPI();

  const { requiresApproval, getApprovalPriority } = useWorkflow();

  const addTestResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const testWorkflowLogic = () => {
    addTestResult('Workflow Logic', 'success', 'Testing approval requirements...');
    
    // Test customer creation approval
    const customerRequiresApproval = requiresApproval('CUSTOMER_CREATE', {
      customerValue: 'HIGH_VALUE',
      ...customerData
    });
    
    addTestResult('Customer Approval Check', 
      customerRequiresApproval ? 'success' : 'error',
      customerRequiresApproval ? 'High-value customer requires approval' : 'Customer should require approval for high income'
    );

    // Test sale creation approval
    const saleRequiresApproval = requiresApproval('SALE_CREATE', saleData);
    
    addTestResult('Sale Approval Check', 
      saleRequiresApproval ? 'success' : 'error',
      saleRequiresApproval ? 'High-value sale requires approval' : 'Sale should require approval for amount > ₹50,000'
    );

    // Test priority calculation
    const priority = getApprovalPriority('SALE_CREATE', saleData);
    addTestResult('Priority Calculation', 'success', `Sale priority: ${priority}`);
  };

  const testCustomerCreation = async () => {
    try {
      addTestResult('Customer Creation', 'success', 'Creating customer with workflow...');
      
      const result = await createCustomerWithWorkflow(customerData, 'test-user-id');
      
      if (result.data?.approvalId) {
        addTestResult('Customer Creation Result', 'success', 
          'Customer creation requires approval', 
          { approvalId: result.data.approvalId, status: result.data.status }
        );
      } else {
        addTestResult('Customer Creation Result', 'success', 
          'Customer created directly', 
          result.data
        );
      }
    } catch (err: any) {
      addTestResult('Customer Creation Error', 'error', err.message);
    }
  };

  const testSaleCreation = async () => {
    try {
      addTestResult('Sale Creation', 'success', 'Creating sale with workflow...');
      
      const result = await createSaleWithWorkflow(saleData, 'test-user-id');
      
      if (result.data?.approvalId) {
        addTestResult('Sale Creation Result', 'success', 
          'Sale creation requires approval', 
          { approvalId: result.data.approvalId, status: result.data.status }
        );
      } else {
        addTestResult('Sale Creation Result', 'success', 
          'Sale created directly', 
          result.data
        );
      }
    } catch (err: any) {
      addTestResult('Sale Creation Error', 'error', err.message);
    }
  };

  const testApprovalRequest = async () => {
    try {
      addTestResult('Approval Request', 'success', 'Creating approval request...');
      
      const approvalData = {
        actionType: 'CUSTOMER_CREATE' as const,
        requesterId: 'test-user-id',
        requestData: customerData,
        approvalNotes: 'Test approval request',
        priority: 'HIGH' as const
      };
      
      const result = await createApprovalRequest(approvalData);
      addTestResult('Approval Request Result', 'success', 
        'Approval request created successfully', 
        result
      );
    } catch (err: any) {
      addTestResult('Approval Request Error', 'error', err.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflow API Integration Test</h1>
          <p className="text-gray-600">Testing the workflow system integration</p>
        </div>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run workflow tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testWorkflowLogic} 
              disabled={isLoading}
              className="w-full"
            >
              Test Workflow Logic
            </Button>
            
            <Button 
              onClick={testCustomerCreation} 
              disabled={isLoading}
              className="w-full"
            >
              Test Customer Creation
            </Button>
            
            <Button 
              onClick={testSaleCreation} 
              disabled={isLoading}
              className="w-full"
            >
              Test Sale Creation
            </Button>
            
            <Button 
              onClick={testApprovalRequest} 
              disabled={isLoading}
              className="w-full"
            >
              Test Approval Request
            </Button>
          </CardContent>
        </Card>

        {/* Test Data */}
        <Card>
          <CardHeader>
            <CardTitle>Test Data</CardTitle>
            <CardDescription>Sample data for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Customer Data</Label>
              <Textarea 
                value={JSON.stringify(customerData, null, 2)}
                onChange={(e) => {
                  try {
                    setCustomerData(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="text-xs"
              />
            </div>
            
            <div>
              <Label>Sale Data</Label>
              <Textarea 
                value={JSON.stringify(saleData, null, 2)}
                onChange={(e) => {
                  try {
                    setSaleData(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Results from workflow tests</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No test results yet. Run a test to see results here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 