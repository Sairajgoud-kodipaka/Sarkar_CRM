import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.support_tickets.deleteMany();
  await prisma.sales.deleteMany();
  await prisma.products.deleteMany();
  await prisma.customers.deleteMany();
  await prisma.users.deleteMany();
  await prisma.floors.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.stores.deleteMany();

  // Create stores
  console.log('🏪 Creating stores...');
  const store1 = await prisma.stores.create({
    data: {
      name: 'Sarkar Jewellers - Main Store',
      address: '123 MG Road, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 80 1234 5678',
      email: 'main@sarkarjewellers.com',
      website: 'https://sarkarjewellers.com',
      description: 'Premium jewellery store in Bangalore',
      is_active: true,
    },
  });

  const store2 = await prisma.stores.create({
    data: {
      name: 'Sarkar Jewellers - Mall Branch',
      address: '456 Commercial Street, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560002',
      phone: '+91 80 8765 4321',
      email: 'mall@sarkarjewellers.com',
      website: 'https://sarkarjewellers.com',
      description: 'Modern jewellery store in mall',
      is_active: true,
    },
  });

  // Create categories
  console.log('📂 Creating categories...');
  const goldCategory = await prisma.categories.create({
    data: {
      name: 'Gold Jewellery',
      description: 'Traditional and modern gold jewellery',
      store_id: store1.id,
      is_active: true,
    },
  });

  const diamondCategory = await prisma.categories.create({
    data: {
      name: 'Diamond Jewellery',
      description: 'Premium diamond jewellery',
      store_id: store1.id,
      is_active: true,
    },
  });

  const silverCategory = await prisma.categories.create({
    data: {
      name: 'Silver Jewellery',
      description: 'Elegant silver jewellery',
      store_id: store1.id,
      is_active: true,
    },
  });

  // Create floors
  console.log('🏢 Creating floors...');
  const floor1 = await prisma.floors.create({
    data: {
      name: 'Ground Floor',
      number: 1,
      description: 'Gold and Diamond section',
      store_id: store1.id,
      is_active: true,
    },
  });

  const floor2 = await prisma.floors.create({
    data: {
      name: 'First Floor',
      number: 2,
      description: 'Silver and Platinum section',
      store_id: store1.id,
      is_active: true,
    },
  });

  // Create users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.users.create({
    data: {
      name: 'Business Admin',
      email: 'admin@sarkarjewellers.com',
      password: hashedPassword,
      role: 'BUSINESS_ADMIN',
      store_id: store1.id,
      is_active: true,
    },
  });

  const managerUser = await prisma.users.create({
    data: {
      name: 'Floor Manager',
      email: 'manager@sarkarjewellers.com',
      password: hashedPassword,
      role: 'FLOOR_MANAGER',
      store_id: store1.id,
      floor_id: floor1.id,
      is_active: true,
    },
  });

  const salesUser = await prisma.users.create({
    data: {
      name: 'Sales Person',
      email: 'sales@sarkarjewellers.com',
      password: hashedPassword,
      role: 'FLOOR_MANAGER',
      store_id: store1.id,
      floor_id: floor2.id,
      is_active: true,
    },
  });

  // Create salesperson users
  const salesperson1 = await prisma.users.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@sarkarjewellers.com',
      password: hashedPassword,
      role: 'SALESPERSON',
      store_id: store1.id,
      floor_id: floor1.id,
      is_active: true,
    },
  });

  const salesperson2 = await prisma.users.create({
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@sarkarjewellers.com',
      password: hashedPassword,
      role: 'SALESPERSON',
      store_id: store1.id,
      floor_id: floor2.id,
      is_active: true,
    },
  });

  const salesperson3 = await prisma.users.create({
    data: {
      name: 'Emma Wilson',
      email: 'emma.wilson@sarkarjewellers.com',
      password: hashedPassword,
      role: 'SALESPERSON',
      store_id: store2.id,
      floor_id: floor1.id,
      is_active: true,
    },
  });

  // Create customers
  console.log('👤 Creating customers...');
  const customer1 = await prisma.customers.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      gender: 'FEMALE',
      status: 'ACTIVE',
      address: '456 Park Street, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560003',
      store_id: store1.id,
      floor_id: floor1.id,
      assigned_to_id: managerUser.id,
    },
  });

  const customer2 = await prisma.customers.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 87654 32109',
      gender: 'MALE',
      status: 'PROSPECT',
      address: '789 Lake Road, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560004',
      store_id: store1.id,
      floor_id: floor2.id,
      assigned_to_id: salesUser.id,
    },
  });

  // Create products
  console.log('💍 Creating products...');
  const product1 = await prisma.products.create({
    data: {
      name: '22K Gold Necklace',
      sku: 'GN-001',
      description: 'Traditional 22K gold necklace with intricate design',
      price: 150000.00,
      cost_price: 120000.00,
      weight: 25.5,
      material: 'Gold',
      gemstone: 'None',
      purity: '22K',
      images: ['necklace1.jpg', 'necklace2.jpg'],
      specifications: { length: '18 inches', design: 'Traditional' },
      is_active: true,
      store_id: store1.id,
      category_id: goldCategory.id,
    },
  });

  const product2 = await prisma.products.create({
    data: {
      name: 'Diamond Ring',
      sku: 'DR-001',
      description: 'Solitaire diamond ring in white gold setting',
      price: 250000.00,
      cost_price: 200000.00,
      weight: 5.2,
      material: 'White Gold',
      gemstone: 'Diamond',
      purity: '18K',
      images: ['ring1.jpg', 'ring2.jpg'],
      specifications: { carat: '1.5', clarity: 'VS1', color: 'D' },
      is_active: true,
      store_id: store1.id,
      category_id: diamondCategory.id,
    },
  });

  // Create sales
  console.log('💰 Creating sales...');
  await prisma.sales.create({
    data: {
      amount: 150000.00,
      quantity: 1,
      discount: 5000.00,
      total_amount: 145000.00,
      payment_method: 'CARD',
      status: 'COMPLETED',
      notes: 'Wedding purchase',
      store_id: store1.id,
      floor_id: floor1.id,
      customer_id: customer1.id,
      product_id: product1.id,
      user_id: managerUser.id,
    },
  });

  await prisma.sales.create({
    data: {
      amount: 250000.00,
      quantity: 1,
      discount: 10000.00,
      total_amount: 240000.00,
      payment_method: 'CASH',
      status: 'COMPLETED',
      notes: 'Engagement ring',
      store_id: store1.id,
      floor_id: floor2.id,
      customer_id: customer2.id,
      product_id: product2.id,
      user_id: salesUser.id,
    },
  });

  // Create support tickets - REAL JEWELLERY BUSINESS SCENARIOS
  console.log('🎫 Creating real jewellery business support tickets...');
  
  // Real customer complaint about product quality
  await prisma.support_tickets.create({
    data: {
      title: 'Customer complaint about gold purity',
      description: 'Customer Priya Sharma is complaining that the 22K gold necklace she purchased last week appears to be of lower purity than advertised. She wants a refund or replacement.',
      priority: 'HIGH',
      status: 'OPEN',
      category: 'COMPLAINT',
      customer_name: 'Priya Sharma',
      customer_email: 'priya.sharma@email.com',
      customer_phone: '+91 98765 43210',
      assigned_to_id: adminUser.id,
      store_id: store1.id,
      floor_id: floor1.id,
      created_by_id: managerUser.id,
    },
  });

  // Real inventory management request
  await prisma.support_tickets.create({
    data: {
      title: 'New diamond collection inventory update',
      description: 'Need to add 50 new diamond rings from the latest collection to the inventory system. Includes various carat weights and settings.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      category: 'PRODUCT',
      customer_name: 'Inventory Manager',
      customer_email: 'inventory@sarkarjewellers.com',
      customer_phone: '+91 80 1234 5678',
      assigned_to_id: managerUser.id,
      store_id: store1.id,
      floor_id: floor1.id,
      created_by_id: adminUser.id,
    },
  });

  // Real technical system issue
  await prisma.support_tickets.create({
    data: {
      title: 'POS system integration issue',
      description: 'The point of sale system is not properly syncing with the inventory database. Sales are being recorded but stock levels are not updating automatically.',
      priority: 'HIGH',
      status: 'RESOLVED',
      category: 'TECHNICAL',
      customer_name: 'Sales Team',
      customer_email: 'sales@sarkarjewellers.com',
      customer_phone: '+91 80 1234 5679',
      assigned_to_id: adminUser.id,
      store_id: store1.id,
      floor_id: floor2.id,
      created_by_id: salesUser.id,
      resolved_at: new Date(),
    },
  });

  // Real billing system issue
  await prisma.support_tickets.create({
    data: {
      title: 'GST calculation error in billing',
      description: 'The billing system is calculating GST incorrectly for jewellery items. It should be 3% but showing 5%. Affecting all transactions.',
      priority: 'URGENT',
      status: 'OPEN',
      category: 'BILLING',
      customer_name: 'Accounts Department',
      customer_email: 'accounts@sarkarjewellers.com',
      customer_phone: '+91 80 1234 5680',
      assigned_to_id: adminUser.id,
      store_id: store1.id,
      floor_id: floor1.id,
      created_by_id: adminUser.id,
    },
  });

  // Real customer service request
  await prisma.support_tickets.create({
    data: {
      title: 'Customer wants to exchange wedding ring',
      description: 'Customer Amit Patel wants to exchange his wedding ring for a different design. Ring was purchased 3 days ago, still has receipt and original packaging.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      category: 'SALES',
      customer_name: 'Amit Patel',
      customer_email: 'amit.patel@email.com',
      customer_phone: '+91 87654 32109',
      assigned_to_id: managerUser.id,
      store_id: store1.id,
      floor_id: floor2.id,
      created_by_id: salesUser.id,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:', {
    stores: 2,
    users: 6, // 1 BUSINESS_ADMIN + 2 FLOOR_MANAGER + 3 SALES_TEAM users
    customers: 2,
    products: 2,
    sales: 2,
    supportTickets: 5, // Real jewellery business scenarios
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 