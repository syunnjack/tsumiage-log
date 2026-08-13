import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCategoryRanking, fetchCategories, type RakutenRecipe } from '@/lib/rakuten-recipe';
import { estimateTotalCost } from '@/lib/ingredient-prices';
import RecipeCard from '../RecipeCard';

type Props = { params: Promise<{ categoryId: string }> };

const CATEGORY_IDS = [
  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '20', '21', '22', '30', '31', '32', '33', '34', '35',
];

function buildFallbackRecipes(categoryId: string): RakutenRecipe[] {
  const base: RakutenRecipe[] = [
    {
      recipeId: Number(`${categoryId}001`),
      recipeTitle: '10分で作る たまごチャーハン',
      recipeUrl: 'https://recipe.rakuten.co.jp/',
      foodImageUrl: 'https://dummyimage.com/640x360/fde68a/78350f&text=Quick+Recipe',
      mediumImageUrl: 'https://dummyimage.com/320x180/fde68a/78350f&text=Quick+Recipe',
      smallImageUrl: 'https://dummyimage.com/160x90/fde68a/78350f&text=Quick+Recipe',
      recipeIndication: '約10分',
      recipeCost: '100〜300円',
      recipeDescription: '短時間で作れる定番レシピです。',
      recipeMaterial: ['ご飯', '卵', '長ねぎ', 'しょうゆ', '油'],
      rank: '1',
    },
    {
      recipeId: Number(`${categoryId}002`),
      recipeTitle: '節約 豚こま野菜炒め',
      recipeUrl: 'https://recipe.rakuten.co.jp/',
      foodImageUrl: 'https://dummyimage.com/640x360/fecaca/7f1d1d&text=Saving+Recipe',
      mediumImageUrl: 'https://dummyimage.com/320x180/fecaca/7f1d1d&text=Saving+Recipe',
      smallImageUrl: 'https://dummyimage.com/160x90/fecaca/7f1d1d&text=Saving+Recipe',
      recipeIndication: '約15分',
      recipeCost: '300〜500円',
      recipeDescription: '家計にやさしいボリュームおかず。',
      recipeMaterial: ['豚こま肉', 'キャベツ', 'もやし', 'にんじん', '焼肉のたれ'],
      rank: '2',
    },
    {
      recipeId: Number(`${categoryId}003`),
      recipeTitle: '包丁いらず うどんアレンジ',
      recipeUrl: 'https://recipe.rakuten.co.jp/',
      foodImageUrl: 'https://dummyimage.com/640x360/bbf7d0/14532d&text=Easy+Udon',
      mediumImageUrl: 'https://dummyimage.com/320x180/bbf7d0/14532d&text=Easy+Udon',
      smallImageUrl: 'https://dummyimage.com/160x90/bbf7d0/14532d&text=Easy+Udon',
      recipeIndication: '約8分',
      recipeCost: '100円以下',
      recipeDescription: '火を使う時間が短く、洗い物も少なめです。',
      recipeMaterial: ['冷凍うどん', '卵', 'めんつゆ', 'ごま油', 'きざみ海苔'],
      rank: '3',
    },
  ];
  return base;
}

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
  let isFallback = false;

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
    recipes = buildFallbackRecipes(categoryId);
    isFallback = true;
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm">
            ⚠️ 楽天APIが一時的に利用できないため、サンプルレシピを表示しています。({error})
          </div>
        )}

        {isFallback && (
          <p className="text-xs text-amber-700 mb-4">
            本データを表示するには有効な RAKUTEN_APP_ID の設定が必要です。
          </p>
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
