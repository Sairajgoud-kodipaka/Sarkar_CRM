import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customers.findUnique({
      where: { id: params.id }
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Fetch related data separately
    const [floor, assignedTo] = await Promise.all([
      customer.floor_id ? prisma.floors.findUnique({
        where: { id: customer.floor_id },
        select: { id: true, name: true }
      }) : null,
      customer.assigned_to_id ? prisma.users.findUnique({
        where: { id: customer.assigned_to_id },
        select: { id: true, name: true }
      }) : null
    ]);

    const customerWithRelations = {
      ...customer,
      floor,
      assignedTo
    };

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customerWithRelations
    });
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.customers.findUnique({
      where: { id: params.id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Update customer
    const updatedCustomer = await prisma.customers.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        date_of_birth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        occupation: body.occupation,
        income_range: body.incomeRange,
        social_circle: body.socialCircle,
        occasions: body.occasions,
        budget_range: body.budgetRange,
        notes: body.notes,
        status: body.status,
        floor_id: body.floorId,
        assigned_to_id: body.assignedToId
      }
    });

    // Fetch related data for updated customer
    const [floor, assignedTo] = await Promise.all([
      updatedCustomer.floor_id ? prisma.floors.findUnique({
        where: { id: updatedCustomer.floor_id },
        select: { id: true, name: true }
      }) : null,
      updatedCustomer.assigned_to_id ? prisma.users.findUnique({
        where: { id: updatedCustomer.assigned_to_id },
        select: { id: true, name: true }
      }) : null
    ]);

    const updatedCustomerWithRelations = {
      ...updatedCustomer,
      floor,
      assignedTo
    };

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomerWithRelations
    });
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if customer exists
    const existingCustomer = await prisma.customers.findUnique({
      where: { id: params.id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Delete customer
    await prisma.customers.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 