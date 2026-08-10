import { NextRequest, NextResponse } from 'next/server';
import { fetchCategories, fetchCategoryRanking } from '@/lib/rakuten-recipe';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'categories';
  const categoryId = searchParams.get('categoryId') || '30';

  try {
    if (type === 'categories') {
      const data = await fetchCategories();
      return NextResponse.json(data);
    }
    if (type === 'ranking') {
      const recipes = await fetchCategoryRanking(categoryId);
      return NextResponse.json({ recipes });
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
