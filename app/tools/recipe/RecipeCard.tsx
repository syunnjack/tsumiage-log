'use client';
import { useState } from 'react';
import type { RakutenRecipe } from '@/lib/rakuten-recipe';
import { estimateIngredientPrice, estimateTotalCost } from '@/lib/ingredient-prices';

export default function RecipeCard({ recipe }: { recipe: RakutenRecipe }) {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const totalCost = estimateTotalCost(recipe.recipeMaterial);
  const apiCostRange = recipe.recipeCost || '';

  // 時間に応じた色
  const timeMinutes = parseInt(recipe.recipeIndication?.match(/\d+/)?.[0] || '30');
  const timeColor = timeMinutes <= 10 ? 'text-green-600 bg-green-50' : timeMinutes <= 20 ? 'text-orange-500 bg-orange-50' : 'text-gray-600 bg-gray-50';

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* サムネイル */}
      {recipe.foodImageUrl && (
        <div className="relative">
          <img src={recipe.foodImageUrl} alt={recipe.recipeTitle} className="w-full h-44 object-cover" />
          <div className={`absolute top-3 right-3 ${timeColor} text-xs font-bold px-2.5 py-1 rounded-full`}>
            ⏱ {recipe.recipeIndication}
          </div>
        </div>
      )}

      <div className="p-5">
        {/* タイトル */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {recipe.recipeTitle}
        </h3>

        {/* コスト表示 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-600 text-xs font-semibold">概算</span>
            <span className="text-yellow-700 font-bold text-sm">¥{totalCost}</span>
          </div>
          {apiCostRange && (
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              楽天表示: {apiCostRange}
            </div>
          )}
        </div>

        {/* 説明 */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{recipe.recipeDescription}</p>

        {/* 材料チェックリスト */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left flex items-center justify-between bg-orange-50 hover:bg-orange-100 rounded-xl px-4 py-3 transition-colors"
        >
          <span className="text-sm font-semibold text-orange-700">
            🛒 材料を確認する ({recipe.recipeMaterial.length}品目)
          </span>
          <span className="text-orange-500 text-lg">{expanded ? '▲' : '▼'}</span>
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {recipe.recipeMaterial.map((mat, idx) => {
              const price = estimateIngredientPrice(mat);
              const id = `${recipe.recipeId}-${idx}`;
              return (
                <label
                  key={id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${checked[id] ? 'bg-green-50 opacity-60 line-through' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!checked[id]}
                      onChange={() => setChecked(c => ({ ...c, [id]: !c[id] }))}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-800">{mat}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">約¥{price}</span>
                </label>
              );
            })}

            {/* チェック進捗 */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>買い物リスト進捗</span>
                <span className="font-semibold">{checkedCount}/{recipe.recipeMaterial.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-orange-400 h-2 rounded-full transition-all"
                  style={{ width: `${(checkedCount / recipe.recipeMaterial.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 楽天レシピで詳細を見る */}
            <a
              href={recipe.recipeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              📖 楽天レシピで作り方を見る
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
