import { NextResponse } from 'next/server';
import { InvestmentCategory } from '@/types/investment';
import { investmentData as initialData } from '@/data/investments';
import fs from 'fs';
import path from 'path';

const isLocal = process.env.NODE_ENV === 'development';
const dataFilePath = path.join(process.cwd(), 'data', 'investments.json');

let cachedData: InvestmentCategory[] | null = null;

function getDataFromFile() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileContents);
    }
    return initialData;
  } catch (error) {
    console.error('Error reading file:', error);
    return initialData;
  }
}

export async function GET() {
  try {
    if (isLocal) {
      return NextResponse.json(getDataFromFile());
    }
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    cachedData = initialData;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error('Error reading investments:', error);
    return NextResponse.json(initialData);
  }
}

function saveDataToFile(data: InvestmentCategory[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, ideaId, updatedIdea } = body;

    const data: InvestmentCategory[] = isLocal ? getDataFromFile() : (cachedData || initialData);

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

    if (isLocal) {
      saveDataToFile(data);
    } else {
      cachedData = data;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}
