import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-123';

// This would be your database in production
let users: any[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    }
];

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 400 }
            );
        }

        // In production, hash the password with bcrypt
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: String(users.length + 1),
            name,
            email,
            password // In production, store hashedPassword
        };

        users.push(newUser);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}