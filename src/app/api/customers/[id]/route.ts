import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/lib/services/customer.service';
// import { authenticateUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const customer = await CustomerService.getCustomerById(params.id);
    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const customer = await CustomerService.updateCustomer(params.id, body);
    
    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
    // const user = await authenticateUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await CustomerService.deleteCustomer(params.id);
    return NextResponse.json({ success: true, message: 'Customer deleted' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 