import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-123';

// Temporary in-memory storage (in production, use a database)
const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123' // In production, this should be hashed
    }
];

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log('Login attempt:', { email }); // Debug log

        const user = users.find(u => u.email === email);

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}