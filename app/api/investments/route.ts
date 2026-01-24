import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { InvestmentCategory } from '@/types/investment';
import { investmentData as initialData } from '@/data/investments';

export async function GET() {
  try {
    const store = getStore('investments');
    const data = await store.get('data', { type: 'json' });
    
    if (!data) {
      await store.setJSON('data', initialData);
      return NextResponse.json(initialData);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading investments:', error);
    return NextResponse.json(initialData);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, ideaId, updatedIdea } = body;

    const store = getStore('investments');
    const data: InvestmentCategory[] = await store.get('data', { type: 'json' }) || initialData;

    const categoryIndex = data.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const ideaIndex = data[categoryIndex].ideas.findIndex(idea => idea.id === ideaId);
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    data[categoryIndex].ideas[ideaIndex] = {
      ...data[categoryIndex].ideas[ideaIndex],
      ...updatedIdea,
    };

    await store.setJSON('data', data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}
