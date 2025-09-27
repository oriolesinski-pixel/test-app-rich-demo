import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // In production, verify JWT token from headers
        // const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        const order = {
            id: 'ORD' + Date.now(),
            ...body,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        return NextResponse.json(order);
    } catch (error) {
        console.error('Order error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}