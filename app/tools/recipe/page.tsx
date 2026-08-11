import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCategories } from '@/lib/rakuten-recipe';

export const metadata: Metadata = {
  title: '時短レシピ支援 | 積み上げログ',
  description: '楽天レシピから時短料理を選んで、必要材料・金額概算をすぐに確認。今日の夕飯を素早く決めよう。',
  alternates: { canonical: '/tools/recipe' },
};

// カテゴリの説明・アイコン
const CATEGORY_ICONS: Record<string, string> = {
  '10': '🥩', '11': '🐟', '12': '🥬', '13': '🍳', '14': '🍜',
  '15': '🍚', '16': '🍞', '17': '🥗', '18': '🍲', '19': '🧁',
  '20': '🥤', '21': '🥡', '22': '🎉', '30': '🍱', '31': '👶',
  '32': '🏥', '33': '⏱️', '34': '💰', '35': '🌏',
};

export default async function RecipePage() {
  let categories: Awaited<ReturnType<typeof fetchCategories>> = { large: [], medium: [], small: [] };
  let error = '';

  try {
    categories = await fetchCategories();
  } catch (caughtError: unknown) {
    error = caughtError instanceof Error ? caughtError.message : 'カテゴリ取得に失敗しました';
  }

  // 時短・節約系カテゴリを優先表示
  const quickCategories = categories.large.filter(c =>
    ['10','11','12','13','14','15','16','17','18','19','20'].includes(c.categoryId)
  );

  return (
    <main className="min-h-screen bg-orange-50">
      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-orange-400 to-red-500 text-white py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-orange-100 text-sm font-semibold tracking-widest mb-3">🍳 TIME-SAVING RECIPE</p>
          <h1 className="text-3xl font-bold mb-4">時短レシピ支援</h1>
          <p className="text-orange-50 text-lg leading-relaxed">
            楽天レシピから今日の料理を選ぶだけ。<br />
            必要な材料と<strong>金額の目安</strong>をすぐに確認できます。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            ⚠️ APIエラー: {error}。環境変数 RAKUTEN_APP_ID を設定してください。
          </div>
        )}

        {/* 使い方 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { step: '1', icon: '🗂️', text: 'カテゴリを選ぶ' },
            { step: '2', icon: '📋', text: 'レシピを選ぶ' },
            { step: '3', icon: '🛒', text: '材料・金額を確認' },
          ].map(({ step, icon, text }) => (
            <div key={step} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xs font-bold text-orange-500 mb-1">STEP {step}</div>
              <div className="text-sm font-semibold text-gray-700">{text}</div>
            </div>
          ))}
        </div>

        {/* カテゴリ一覧 */}
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          📂 カテゴリから選ぶ
        </h2>
        {quickCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {quickCategories.map((cat) => (
              <Link
                key={cat.categoryId}
                href={`/tools/recipe/${cat.categoryId}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:bg-orange-50 transition-all group border border-orange-100"
              >
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat.categoryId] || '🍽️'}</div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {cat.categoryName}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { id: '30', name: '人気ランキング', icon: '🏆' },
              { id: '10', name: '肉料理', icon: '🥩' },
              { id: '11', name: '魚料理', icon: '🐟' },
              { id: '12', name: '野菜料理', icon: '🥬' },
              { id: '15', name: 'ご飯もの', icon: '🍚' },
              { id: '14', name: '麺類', icon: '🍜' },
              { id: '13', name: '卵料理', icon: '🥚' },
              { id: '17', name: 'サラダ', icon: '🥗' },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/tools/recipe/${cat.id}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:bg-orange-50 transition-all group border border-orange-100"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* フッターノート */}
        <p className="text-center text-xs text-gray-400 mt-10">
          レシピデータは<a href="https://recipe.rakuten.co.jp/" target="_blank" rel="noopener" className="underline">楽天レシピ</a>より提供。
          金額はあくまで概算です。
        </p>
      </div>
    </main>
  );
}
