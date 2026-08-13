// 楽天レシピAPI ユーティリティ

export type RakutenCategory = {
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
  parentCategoryId?: string;
};

export type RakutenRecipe = {
  recipeId: number;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  mediumImageUrl: string;
  smallImageUrl: string;
  recipeIndication: string; // "約10分" etc.
  recipeCost: string;       // "100〜300円" etc.
  recipeDescription: string;
  recipeMaterial: string[]; // ingredient names
  rank: string;
};

const RAKUTEN_APP_ID =
  process.env.RAKUTEN_APP_ID ||
  process.env.RAKUTEN_APPLICATION_ID ||
  process.env.NEXT_PUBLIC_RAKUTEN_APP_ID ||
  '';
const BASE = 'https://app.rakuten.co.jp/services/api';

export async function fetchCategories(): Promise<{ large: RakutenCategory[]; medium: RakutenCategory[]; small: RakutenCategory[] }> {
  const url = `${BASE}/Recipe/CategoryList/20170426?applicationId=${RAKUTEN_APP_ID}&format=json`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('カテゴリ取得に失敗しました');
  const data = await res.json();
  return {
    large: data.result.large || [],
    medium: data.result.medium || [],
    small: data.result.small || [],
  };
}

export async function fetchCategoryRanking(categoryId: string): Promise<RakutenRecipe[]> {
  const url = `${BASE}/Recipe/CategoryRanking/20170426?applicationId=${RAKUTEN_APP_ID}&categoryId=${categoryId}&format=json`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error('レシピ取得に失敗しました');
  const data = await res.json();
  return data.result || [];
}

// 調理時間ラベルを分に変換（ソート用）
export function indicationToMinutes(ind: string): number {
  const m = ind?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 999;
}

// コスト文字列を最大値に変換（ソート用）
export function costToNumber(cost: string): number {
  if (!cost) return 9999;
  if (cost.includes('100円以下')) return 100;
  if (cost.includes('100〜300')) return 300;
  if (cost.includes('300〜500')) return 500;
  if (cost.includes('500〜1000')) return 1000;
  return 9999;
}
