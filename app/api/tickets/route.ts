import { NextRequest, NextResponse } from 'next/server';
import { ticketRepository } from '@/data/repositories';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const ticketData = {
      installationId: body.installationId,
      type: body.type,
      priority: body.priority,
      status: 'open' as const,
      title: body.title,
      description: body.description,
      assignedTechnicianId: null,
    };

    const ticket = await ticketRepository.create(ticketData);
    
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Error al crear el ticket' },
      { status: 500 }
    );
  }
}
