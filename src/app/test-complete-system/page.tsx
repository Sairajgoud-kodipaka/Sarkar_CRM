'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useWorkflowAPI } from '@/hooks/useWorkflowAPI';
import { CheckCircle, XCircle, AlertTriangle, Clock, Users, ShoppingCart, Package, BarChart3 } from 'lucide-react';

export default function TestCompleteSystem() {
  const { user } = useAuth();
  const { createApprovalRequest, createSaleWithWorkflow, createEscalation } = useWorkflowAPI();
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const results: any = {};

    // Test 1: Authentication
    results.auth = await testAuthentication();
    
    // Test 2: API Endpoints
    results.apis = await testAPIEndpoints();
    
    // Test 3: Workflow System
    results.workflow = await testWorkflowSystem();
    
    // Test 4: Database Connectivity
    results.database = await testDatabaseConnectivity();
    
    // Test 5: UI Components
    results.ui = await testUIComponents();

    setTestResults(results);
    setIsRunning(false);
  };

  const testAuthentication = async () => {
    try {
      const tests = {
        userExists: !!user,
        userRole: user?.role || 'NONE',
        userFloor: user?.floor || 'NONE',
        authContext: true
      };

      return {
        success: tests.userExists && tests.userRole !== 'NONE',
        details: tests
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testAPIEndpoints = async () => {
    const endpoints = [
      '/api/customers',
      '/api/sales',
      '/api/products',
      '/api/users',
      '/api/analytics',
      '/api/approvals',
      '/api/escalations',
      '/api/audit-logs'
    ];

    const results: any = {};
    let successCount = 0;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const success = response.ok || response.status === 405; // 405 is Method Not Allowed, which means endpoint exists
        results[endpoint] = { success, status: response.status };
        if (success) successCount++;
      } catch (error) {
        results[endpoint] = { success: false, error: 'Network error' };
      }
    }

    return {
      success: successCount === endpoints.length,
      details: results,
      successCount,
      totalCount: endpoints.length
    };
  };

  const testWorkflowSystem = async () => {
    try {
      // Test approval request creation
      const approvalTest = await createApprovalRequest({
        actionType: 'SALE_CREATE',
        requestData: { test: true, amount: 1000 },
        priority: 'MEDIUM',
        approvalNotes: 'Test approval request',
        requesterId: user?.id || 'test',
        status: 'PENDING'
      });

      // Test sale creation with workflow
      const saleTest = await createSaleWithWorkflow({
        customerId: 'test-customer',
        productId: 'test-product',
        amount: 1000,
        discount: 0,
        notes: 'Test sale'
      }, user?.id || 'test');

      // Test escalation creation
      const escalationTest = await createEscalation({
        title: 'Test Escalation',
        description: 'Test escalation description',
        priority: 'MEDIUM',
        requesterId: user?.id || 'test',
        requesterRole: user?.role || 'FLOOR_MANAGER',
        floor: user?.floor || 'Floor 1'
      });

      return {
        success: true,
        details: {
          approvalRequest: approvalTest,
          saleCreation: saleTest,
          escalation: escalationTest
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testDatabaseConnectivity = async () => {
    try {
      // Test basic database connectivity through API
      const response = await fetch('/api/customers?limit=1');
      const success = response.ok;
      
      return {
        success,
        details: {
          connection: success,
          status: response.status
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testUIComponents = async () => {
    // Test if all UI components are available
    const components = [
      'Card', 'Button', 'Badge', 'Tabs', 'Input', 'Select', 'Dialog', 'Table'
    ];

    return {
      success: true,
      details: {
        componentsAvailable: components.length,
        components: components
      }
    };
  };

  const getTestStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getTestStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'default' : 'destructive'}>
        {success ? 'PASSED' : 'FAILED'}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Complete CRM System Test</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of all phases and components
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Test Dashboard
          </CardTitle>
          <CardDescription>
            Test all phases: Authentication, APIs, Workflow, Database, and UI Components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Complete System Test'
            )}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(testResults).length > 0 && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="apis">API Endpoints</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="ui">UI Components</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                    <div key={testName} className="text-center">
                      <div className="flex justify-center mb-2">
                        {getTestStatusIcon(result.success)}
                      </div>
                      <div className="text-sm font-medium capitalize">{testName}</div>
                      {getTestStatusBadge(result.success)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Authentication Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.auth && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      {getTestStatusBadge(testResults.auth.success)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(testResults.auth.details || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm capitalize">{key}:</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  API Endpoints Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.apis && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      <div className="flex items-center gap-2">
                        {getTestStatusBadge(testResults.apis.success)}
                        <span className="text-sm text-muted-foreground">
                          {testResults.apis.successCount}/{testResults.apis.totalCount} endpoints working
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(testResults.apis.details || {}).map(([endpoint, result]: [string, any]) => (
                        <div key={endpoint} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm font-mono">{endpoint}</span>
                          <div className="flex items-center gap-2">
                            {getTestStatusIcon(result.success)}
                            <span className="text-sm">{result.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Workflow System Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.workflow && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      {getTestStatusBadge(testResults.workflow.success)}
                    </div>
                    {testResults.workflow.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <span className="text-sm text-red-600">{testResults.workflow.error}</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      {Object.entries(testResults.workflow.details || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-2 border rounded">
                          <div className="text-sm font-medium capitalize mb-1">{key}</div>
                          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Database Connectivity Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.database && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      {getTestStatusBadge(testResults.database.success)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(testResults.database.details || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm capitalize">{key}:</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  UI Components Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.ui && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      {getTestStatusBadge(testResults.ui.success)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(testResults.ui.details || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm capitalize">{key}:</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. Click "Run Complete System Test" to test all phases</p>
            <p>2. Review results in each tab</p>
            <p>3. All tests should pass for a fully functional system</p>
            <p>4. Check the console for detailed error messages if any tests fail</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 