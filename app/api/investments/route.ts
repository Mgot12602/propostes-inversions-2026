import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { InvestmentCategory } from '@/types/investment';

const dataFilePath = path.join(process.cwd(), 'data', 'investments.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading investments:', error);
    return NextResponse.json({ error: 'Failed to read investments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, ideaId, updatedIdea } = body;

    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data: InvestmentCategory[] = JSON.parse(fileContents);

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

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}
