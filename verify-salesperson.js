const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifySalesperson() {
  try {
    console.log('🔍 Verifying SALESPERSON implementation...\n');

    // Check all users by role
    const usersByRole = await prisma.users.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    console.log('📊 Users by role:');
    usersByRole.forEach(group => {
      console.log(`  ${group.role}: ${group._count.role} users`);
    });

    // Get all users with their details
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
        store_id: true,
        floor_id: true
      },
      orderBy: {
        role: 'asc'
      }
    });

    console.log('\n👥 All users:');
    allUsers.forEach(user => {
      console.log(`  ${user.name} (${user.email}) - ${user.role} - Active: ${user.is_active}`);
    });

    // Check if support_tickets table exists and has data
    const supportTicketsCount = await prisma.support_tickets.count();
    console.log(`\n🎫 Support tickets count: ${supportTicketsCount}`);

    // Check if SALESPERSON role exists in the enum
    const salespersonUsers = await prisma.users.findMany({
      where: {
        role: 'SALESPERSON'
      }
    });

    console.log(`\n✅ SALESPERSON users found: ${salespersonUsers.length}`);
    if (salespersonUsers.length > 0) {
      console.log('SALESPERSON users:');
      salespersonUsers.forEach(user => {
        console.log(`  - ${user.name} (${user.email})`);
      });
    }

    // Check stores and floors
    const storesCount = await prisma.stores.count();
    const floorsCount = await prisma.floors.count();
    console.log(`\n🏪 Stores: ${storesCount}, Floors: ${floorsCount}`);

    console.log('\n✅ Verification completed successfully!');
    
    if (salespersonUsers.length > 0) {
      console.log('🎉 SALESPERSON role is working correctly!');
    } else {
      console.log('❌ No SALESPERSON users found - check the seed script');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySalesperson(); 