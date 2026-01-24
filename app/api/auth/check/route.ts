import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ isAuthenticated: session.isAuthenticated || false });
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
