import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCategoryRanking, fetchCategories, type RakutenRecipe } from '@/lib/rakuten-recipe';
import { estimateTotalCost } from '@/lib/ingredient-prices';
import RecipeCard from '../RecipeCard';

type Props = { params: Promise<{ categoryId: string }> };

const CATEGORY_IDS = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '30'];

export function generateStaticParams() {
  return CATEGORY_IDS.map((categoryId) => ({ categoryId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params;
  return {
    title: `レシピ一覧 (カテゴリ:${categoryId}) | 時短レシピ支援`,
    description: '楽天レシピの人気ランキング。材料と金額概算をすぐ確認。',
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  let recipes: RakutenRecipe[] = [];
  let categoryName = 'レシピ一覧';
  let error = '';

  try {
    const [ranking, cats] = await Promise.all([
      fetchCategoryRanking(categoryId),
      fetchCategories(),
    ]);
    recipes = ranking;
    const cat = [...cats.large, ...cats.medium, ...cats.small].find(
      c => c.categoryId === categoryId
    );
    if (cat) categoryName = cat.categoryName;
  } catch (caughtError: unknown) {
    error = caughtError instanceof Error ? caughtError.message : 'レシピ取得に失敗しました';
  }

  // 時短・節約でソート済みバリアントも計算
  const quickRecipes = [...recipes].sort(
    (a, b) =>
      (parseInt(a.recipeIndication?.match(/\d+/)?.[0] || '99')) -
      (parseInt(b.recipeIndication?.match(/\d+/)?.[0] || '99'))
  );
  const cheapRecipes = [...recipes].sort(
    (a, b) => estimateTotalCost(a.recipeMaterial) - estimateTotalCost(b.recipeMaterial)
  );

  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/tools/recipe" className="text-orange-100 text-sm hover:text-white mb-3 inline-flex items-center gap-1">
            ← レシピトップに戻る
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            🍽️ {categoryName}
          </h1>
          <p className="text-orange-100 text-sm mt-1">楽天レシピ 人気ランキング Top{recipes.length}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 統計バー */}
        {recipes.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-500">{recipes.length}</div>
              <div className="text-xs text-gray-500 mt-1">レシピ数</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-500">
                {quickRecipes[0]?.recipeIndication || '-'}
              </div>
              <div className="text-xs text-gray-500 mt-1">最短調理時間</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-yellow-500">
                ¥{cheapRecipes.length > 0 ? estimateTotalCost(cheapRecipes[0].recipeMaterial) : 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">最安概算</div>
            </div>
          </div>
        )}

        {/* レシピグリッド */}
        {recipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🍽️</div>
            <p>レシピが見つかりませんでした</p>
          </div>
        )}
      </div>
    </main>
  );
}
