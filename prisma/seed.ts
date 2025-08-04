import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.sales.deleteMany()
  await prisma.customers.deleteMany()
  await prisma.products.deleteMany()
  await prisma.users.deleteMany()
  await prisma.stores.deleteMany()
  await prisma.floors.deleteMany()
  await prisma.categories.deleteMany()

  // Create stores first (required for categories and floors)
  const stores = await Promise.all([
    prisma.stores.create({
      data: {
        name: 'Royal Jewellers',
        email: 'royal@jewellers.com',
        phone: '+91-9876543210',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        is_active: true
      }
    }),
    prisma.stores.create({
      data: {
        name: 'Modern Gems',
        email: 'modern@gems.com',
        phone: '+91-9876543211',
        address: '456 Central Avenue',
        city: 'Delhi',
        state: 'NCR',
        pincode: '110001',
        is_active: true
      }
    }),
    prisma.stores.create({
      data: {
        name: 'Bridal Collection',
        email: 'bridal@collection.com',
        phone: '+91-9876543212',
        address: '789 Luxury Lane',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        is_active: true
      }
    })
  ])

  // Create categories (now with store_id)
  const categories = await Promise.all([
    prisma.categories.create({ data: { name: 'Gold Jewellery', description: 'Traditional gold jewellery', store_id: stores[0].id } }),
    prisma.categories.create({ data: { name: 'Diamond Jewellery', description: 'Premium diamond jewellery', store_id: stores[0].id } }),
    prisma.categories.create({ data: { name: 'Silver Jewellery', description: 'Elegant silver jewellery', store_id: stores[0].id } }),
    prisma.categories.create({ data: { name: 'Platinum Jewellery', description: 'Luxury platinum jewellery', store_id: stores[0].id } }),
    prisma.categories.create({ data: { name: 'Pearl Jewellery', description: 'Classic pearl jewellery', store_id: stores[0].id } })
  ])

  // Create floors for each store
  const floors: any[] = []
  for (const store of stores) {
    for (let i = 1; i <= 3; i++) {
      floors.push(
        await prisma.floors.create({
          data: {
            name: `Floor ${i}`,
            number: i,
            store_id: store.id,
            is_active: true
          }
        })
      )
    }
  }

  // Create users with hashed passwords
  const hashedPassword = await hash('password123', 12)
  
  const users = await Promise.all([
    // Business Admins
    prisma.users.create({
      data: {
        name: 'Business Admin - Royal',
        email: 'admin@royal.com',
        password: hashedPassword,
        role: 'BUSINESS_ADMIN',
        store_id: stores[0].id,
        is_active: true
      }
    }),
    prisma.users.create({
      data: {
        name: 'Business Admin - Modern',
        email: 'admin@modern.com',
        password: hashedPassword,
        role: 'BUSINESS_ADMIN',
        store_id: stores[1].id,
        is_active: true
      }
    }),
    // Floor Managers
    prisma.users.create({
      data: {
        name: 'Floor Manager - Royal F1',
        email: 'manager@royal.com',
        password: hashedPassword,
        role: 'FLOOR_MANAGER',
        store_id: stores[0].id,
        floor_id: floors[0].id,
        is_active: true
      }
    }),
    prisma.users.create({
      data: {
        name: 'Floor Manager - Royal F2',
        email: 'manager2@royal.com',
        password: hashedPassword,
        role: 'FLOOR_MANAGER',
        store_id: stores[0].id,
        floor_id: floors[1].id,
        is_active: true
      }
    })
  ])

  // Create customers
  const customerNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh', 'Vikram Malhotra',
    'Anjali Gupta', 'Rahul Verma', 'Sneha Reddy', 'Arjun Kapoor', 'Zara Khan',
    'Karan Johar', 'Deepika Padukone', 'Shah Rukh Khan', 'Aishwarya Rai', 'Hrithik Roshan',
    'Katrina Kaif', 'Ranbir Kapoor', 'Alia Bhatt', 'Akshay Kumar', 'Kajol Devgan'
  ]

  const customers = await Promise.all(
    customerNames.map((name, index) =>
      prisma.customers.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: `+91-98765${String(index + 10000).padStart(5, '0')}`,
          address: `${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][index % 5]}, India`,
          gender: ['MALE', 'FEMALE'][index % 2] as 'MALE' | 'FEMALE',
          status: ['ACTIVE', 'ACTIVE', 'PROSPECT', 'CONVERTED'][index % 4] as 'ACTIVE' | 'PROSPECT' | 'CONVERTED',
          store_id: stores[index % stores.length].id,
          floor_id: floors[index % floors.length].id
        }
      })
    )
  )

  // Create products
  const products = await Promise.all([
    // Gold Jewellery
    prisma.products.create({
      data: {
        name: '22K Gold Ring',
        sku: 'GR-22K-001',
        description: 'Traditional 22K gold ring with intricate design',
        price: 45000,
        images: ['gold-ring-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[0].id
      }
    }),
    prisma.products.create({
      data: {
        name: '18K Gold Necklace',
        sku: 'GN-18K-001',
        description: 'Elegant 18K gold necklace with pendant',
        price: 125000,
        images: ['gold-necklace-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[0].id
      }
    }),
    // Diamond Jewellery
    prisma.products.create({
      data: {
        name: 'Diamond Ring',
        sku: 'DR-001',
        description: 'Stunning diamond ring with 1 carat center stone',
        price: 250000,
        images: ['diamond-ring-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[1].id
      }
    }),
    prisma.products.create({
      data: {
        name: 'Diamond Necklace',
        sku: 'DN-001',
        description: 'Luxury diamond necklace with multiple stones',
        price: 350000,
        images: ['diamond-necklace-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[1].id
      }
    }),
    // Silver Jewellery
    prisma.products.create({
      data: {
        name: 'Silver Anklet',
        sku: 'SA-001',
        description: 'Beautiful silver anklet with traditional design',
        price: 8500,
        images: ['silver-anklet-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[2].id
      }
    }),
    // Platinum Jewellery
    prisma.products.create({
      data: {
        name: 'Platinum Ring',
        sku: 'PR-001',
        description: 'Premium platinum ring with diamond accents',
        price: 89000,
        images: ['platinum-ring-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[3].id
      }
    }),
    // Pearl Jewellery
    prisma.products.create({
      data: {
        name: 'Pearl Earrings',
        sku: 'PE-001',
        description: 'Classic pearl earrings with 18K gold setting',
        price: 22000,
        images: ['pearl-earrings-1.jpg'],
        is_active: true,
        store_id: stores[0].id,
        category_id: categories[4].id
      }
    })
  ])

    // Create sales
  const sales = await Promise.all([
    prisma.sales.create({
      data: {
        customer_id: customers[0].id,
        product_id: products[0].id,
        user_id: users[2].id, // Floor Manager 1
        amount: 45000,
        discount: 0,
        total_amount: 45000,
        status: 'COMPLETED',
        store_id: stores[0].id,
        floor_id: floors[0].id
      }
    }),
    prisma.sales.create({
      data: {
        customer_id: customers[1].id,
        product_id: products[1].id,
        user_id: users[2].id,
        amount: 125000,
        discount: 5000,
        total_amount: 120000,
        status: 'COMPLETED',
        store_id: stores[0].id,
        floor_id: floors[0].id
      }
    }),
    prisma.sales.create({
      data: {
        customer_id: customers[2].id,
        product_id: products[2].id,
        user_id: users[3].id, // Floor Manager 2
        amount: 250000,
        discount: 10000,
        total_amount: 240000,
        status: 'COMPLETED',
        store_id: stores[0].id,
        floor_id: floors[1].id
      }
    }),
    prisma.sales.create({
      data: {
        customer_id: customers[3].id,
        product_id: products[3].id,
        user_id: users[3].id,
        amount: 350000,
        discount: 0,
        total_amount: 350000,
        status: 'PENDING',
        store_id: stores[0].id,
        floor_id: floors[1].id
      }
    })
  ])

  console.log('✅ Database seeding completed!')
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${stores.length} stores`)
  console.log(`   - ${floors.length} floors`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${customers.length} customers`)
  console.log(`   - ${products.length} products`)
  console.log(`   - ${sales.length} sales`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 