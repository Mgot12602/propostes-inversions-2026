import { NextResponse } from 'next/server';
import { InvestmentCategory } from '@/types/investment';
import { investmentData as initialData } from '@/data/investments';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const isLocal = process.env.NODE_ENV === 'development';
const dataFilePath = path.join(process.cwd(), 'data', 'investments.json');

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

async function getDataFromSupabase() {
  if (!supabase) {
    return initialData;
  }

  try {
    const { data, error } = await supabase
      .from('investments')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      const { error: insertError } = await supabase
        .from('investments')
        .insert({ id: 'main', data: initialData });

      if (insertError) {
        console.error('Error inserting initial data:', insertError);
      }
      return initialData;
    }

    return data.data as InvestmentCategory[];
  } catch (error) {
    console.error('Error reading from Supabase:', error);
    return initialData;
  }
}

export async function GET() {
  try {
    const data = isLocal ? getDataFromFile() : await getDataFromSupabase();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading investments:', error);
    return NextResponse.json(initialData);
  }
}

function saveDataToFile(data: InvestmentCategory[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

async function saveDataToSupabase(data: InvestmentCategory[]) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('investments')
    .update({ data })
    .eq('id', 'main');

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, ideaId, updatedIdea } = body;

    const currentData: InvestmentCategory[] = isLocal 
      ? getDataFromFile() 
      : await getDataFromSupabase();

    const categoryIndex = currentData.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const ideaIndex = currentData[categoryIndex].ideas.findIndex(idea => idea.id === ideaId);
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    currentData[categoryIndex].ideas[ideaIndex] = {
      ...currentData[categoryIndex].ideas[ideaIndex],
      ...updatedIdea,
    };

    if (isLocal) {
      saveDataToFile(currentData);
    } else {
      await saveDataToSupabase(currentData);
    }

    return NextResponse.json({ success: true, data: currentData });
  } catch (error) {
    console.error('Error updating investment:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}
