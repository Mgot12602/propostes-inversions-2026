import { NextResponse } from 'next/server';
import { InvestmentCategory } from '@/types/investment';
import { investmentData as initialData } from '@/data/investments';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NETLIFY === 'true';
const dataFilePath = path.join(process.cwd(), 'data', 'investments.json');

async function getDataFromBlobs() {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore('investments');
  const data = await store.get('data', { type: 'json' });
  
  if (!data) {
    await store.setJSON('data', initialData);
    return initialData;
  }
  
  return data;
}

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
    const data = isProduction ? await getDataFromBlobs() : getDataFromFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading investments:', error);
    return NextResponse.json(initialData);
  }
}

async function saveDataToBlobs(data: InvestmentCategory[]) {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore('investments');
  await store.setJSON('data', data);
}

function saveDataToFile(data: InvestmentCategory[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, ideaId, updatedIdea } = body;

    const data: InvestmentCategory[] = isProduction 
      ? await getDataFromBlobs() 
      : getDataFromFile();

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

    if (isProduction) {
      await saveDataToBlobs(data);
    } else {
      saveDataToFile(data);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}
