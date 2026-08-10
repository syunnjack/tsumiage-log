// 食材の1回使用量あたりの概算価格データベース
// 参考: スーパーの標準的な価格帯

export type IngredientPrice = {
  keyword: string;
  unitPrice: number;   // 1回使用量あたりの価格（円）
  unit: string;        // 使用単位の目安
};

export const INGREDIENT_PRICES: IngredientPrice[] = [
  // 肉類
  { keyword: '豚肉', unitPrice: 200, unit: '200g' },
  { keyword: '豚バラ', unitPrice: 200, unit: '200g' },
  { keyword: '豚ロース', unitPrice: 220, unit: '200g' },
  { keyword: '豚こま', unitPrice: 160, unit: '200g' },
  { keyword: '鶏肉', unitPrice: 180, unit: '250g' },
  { keyword: '鶏もも', unitPrice: 200, unit: '250g' },
  { keyword: '鶏むね', unitPrice: 140, unit: '250g' },
  { keyword: '鶏ささみ', unitPrice: 150, unit: '200g' },
  { keyword: '牛肉', unitPrice: 350, unit: '200g' },
  { keyword: 'ひき肉', unitPrice: 160, unit: '200g' },
  { keyword: '合いびき', unitPrice: 200, unit: '200g' },
  { keyword: 'ベーコン', unitPrice: 100, unit: '4枚' },
  { keyword: 'ウインナー', unitPrice: 80, unit: '4本' },
  { keyword: 'ソーセージ', unitPrice: 80, unit: '4本' },
  // 魚介類
  { keyword: '鮭', unitPrice: 150, unit: '2切れ' },
  { keyword: 'さば', unitPrice: 120, unit: '2切れ' },
  { keyword: 'ぶり', unitPrice: 180, unit: '2切れ' },
  { keyword: 'まぐろ', unitPrice: 200, unit: '100g' },
  { keyword: 'えび', unitPrice: 200, unit: '8尾' },
  { keyword: 'いか', unitPrice: 150, unit: '1杯' },
  { keyword: 'ツナ缶', unitPrice: 80, unit: '1缶' },
  // 野菜
  { keyword: '玉ねぎ', unitPrice: 30, unit: '1個' },
  { keyword: 'キャベツ', unitPrice: 40, unit: '1/4玉' },
  { keyword: 'にんじん', unitPrice: 30, unit: '1本' },
  { keyword: 'じゃがいも', unitPrice: 30, unit: '2個' },
  { keyword: 'トマト', unitPrice: 80, unit: '1個' },
  { keyword: 'ピーマン', unitPrice: 30, unit: '2個' },
  { keyword: 'なす', unitPrice: 50, unit: '2本' },
  { keyword: 'ほうれん草', unitPrice: 80, unit: '1袋' },
  { keyword: 'もやし', unitPrice: 30, unit: '1袋' },
  { keyword: '豆腐', unitPrice: 60, unit: '1丁' },
  { keyword: 'ねぎ', unitPrice: 30, unit: '1/2本' },
  { keyword: '長ねぎ', unitPrice: 40, unit: '1本' },
  { keyword: 'にんにく', unitPrice: 30, unit: '2片' },
  { keyword: 'しょうが', unitPrice: 20, unit: '1かけ' },
  { keyword: 'きのこ', unitPrice: 80, unit: '1袋' },
  { keyword: 'しめじ', unitPrice: 80, unit: '1袋' },
  { keyword: 'えのき', unitPrice: 50, unit: '1袋' },
  { keyword: 'ブロッコリー', unitPrice: 100, unit: '1/2株' },
  // 卵・乳製品
  { keyword: '卵', unitPrice: 30, unit: '2個' },
  { keyword: '牛乳', unitPrice: 30, unit: '200ml' },
  { keyword: 'バター', unitPrice: 40, unit: '大さじ1' },
  { keyword: 'チーズ', unitPrice: 60, unit: '2枚' },
  { keyword: '生クリーム', unitPrice: 100, unit: '100ml' },
  // 調味料 (少量なので低め)
  { keyword: '醤油', unitPrice: 5, unit: '大さじ1' },
  { keyword: '味噌', unitPrice: 10, unit: '大さじ1' },
  { keyword: 'みりん', unitPrice: 5, unit: '大さじ1' },
  { keyword: 'お酒', unitPrice: 5, unit: '大さじ1' },
  { keyword: '砂糖', unitPrice: 5, unit: '大さじ1' },
  { keyword: '塩', unitPrice: 2, unit: '少々' },
  { keyword: 'こしょう', unitPrice: 2, unit: '少々' },
  { keyword: 'ごま油', unitPrice: 10, unit: '小さじ1' },
  { keyword: 'オリーブオイル', unitPrice: 15, unit: '大さじ1' },
  { keyword: 'サラダ油', unitPrice: 5, unit: '大さじ1' },
  { keyword: 'ケチャップ', unitPrice: 10, unit: '大さじ2' },
  { keyword: 'マヨネーズ', unitPrice: 10, unit: '大さじ1' },
  { keyword: 'ポン酢', unitPrice: 8, unit: '大さじ1' },
  { keyword: 'だし', unitPrice: 10, unit: '1パック' },
  { keyword: 'コンソメ', unitPrice: 15, unit: '1個' },
  { keyword: '片栗粉', unitPrice: 5, unit: '大さじ1' },
  { keyword: '小麦粉', unitPrice: 5, unit: '大さじ2' },
  // 主食
  { keyword: 'ごはん', unitPrice: 40, unit: '1膳' },
  { keyword: 'パスタ', unitPrice: 40, unit: '1人前' },
  { keyword: 'うどん', unitPrice: 30, unit: '1玉' },
  { keyword: 'そば', unitPrice: 50, unit: '1人前' },
  { keyword: '食パン', unitPrice: 30, unit: '2枚' },
];

// 材料名から価格を推定
export function estimateIngredientPrice(ingredient: string): number {
  const lowerIng = ingredient.toLowerCase();
  
  // 完全一致 or 部分一致で検索
  const match = INGREDIENT_PRICES.find(p =>
    lowerIng.includes(p.keyword) || p.keyword.includes(ingredient)
  );
  
  if (match) return match.unitPrice;
  
  // キーワードが見つからない場合は汎用推定
  if (lowerIng.includes('肉')) return 150;
  if (lowerIng.includes('魚') || lowerIng.includes('海鮮')) return 150;
  if (lowerIng.includes('野菜') || lowerIng.includes('葉')) return 50;
  if (lowerIng.includes('缶')) return 80;
  if (lowerIng.includes('粉') || lowerIng.includes('油') || lowerIng.includes('酒')) return 10;
  
  return 30; // デフォルト
}

// 材料リストの合計金額を概算
export function estimateTotalCost(materials: string[]): number {
  return materials.reduce((sum, mat) => sum + estimateIngredientPrice(mat), 0);
}

// 金額帯ラベルを返す
export function getCostLabel(totalYen: number): string {
  if (totalYen <= 100) return '100円以下';
  if (totalYen <= 300) return '100〜300円';
  if (totalYen <= 500) return '300〜500円';
  if (totalYen <= 1000) return '500〜1000円';
  return '1000円以上';
}
