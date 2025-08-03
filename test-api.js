// Simple API test script
const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`\n${method} ${endpoint}:`);
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Success');
      if (data.data) {
        console.log(`Data: ${Array.isArray(data.data) ? data.data.length : 'Object'} items`);
      }
    } else {
      console.log('❌ Error');
      console.log(`Error: ${data.error || 'Unknown error'}`);
    }

    return { success: response.ok, data };
  } catch (error) {
    console.log(`\n${method} ${endpoint}:`);
    console.log('❌ Network Error');
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  // Test 1: Database connection
  await testEndpoint('/api/test-db');

  // Test 2: Get customers
  await testEndpoint('/api/customers');

  // Test 3: Create a customer
  await testEndpoint('/api/customers', 'POST', {
    name: 'Test Customer',
    phone: '+919876543210',
    email: 'test@example.com',
    storeId: 'test-store-id',
    status: 'ACTIVE'
  });

  // Test 4: Get products
  await testEndpoint('/api/products');

  // Test 5: Create a product
  await testEndpoint('/api/products', 'POST', {
    name: 'Gold Ring',
    sku: 'GR001',
    price: 25000,
    storeId: 'test-store-id',
    categoryId: 'test-category-id',
    isActive: true
  });

  // Test 6: Get floors
  await testEndpoint('/api/floors');

  // Test 7: Get categories
  await testEndpoint('/api/categories');

  // Test 8: Get sales
  await testEndpoint('/api/sales');

  // Test 9: Get users
  await testEndpoint('/api/users');

  console.log('\n🎉 API Tests Completed!');
  console.log('\nTo view detailed results, visit: http://localhost:3000/test-api');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
} 