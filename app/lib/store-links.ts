/**
 * 外部の販売・支援サービスへのリンクをまとめる。
 *
 * BOOTHのショップURL（サブドメイン）は後から変更でき、変えると旧URLは
 * BOOTHのトップへ飛ばされる。実際 chitamaru.booth.pm を直書きしていた頃の
 * リンクは、いま踏むとトップに放り出される状態になっている。
 *
 * そこで商品へのリンクには booth.pm/ja/items/<商品ID> という正規の形を使う。
 * この形はショップ名を変えても壊れない。ショップのトップだけは
 * サブドメインが要るため、環境変数で差し替えられるようにしてある。
 */

const trimSlash = (value: string) => value.replace(/\/+$/, "")

/** BOOTHショップのトップ。1アカウントにつき1つ */
export const boothShopUrl = trimSlash(
  process.env.NEXT_PUBLIC_BOOTH_SHOP_URL?.trim() || "https://wangan-base.booth.pm",
)

/**
 * BOOTHの商品ページURL。ショップ名の変更に影響されない正規の形を返す。
 * 商品IDはBOOTHで商品を登録すると数字で発行される。
 */
export const boothItemUrl = (itemId?: string | number | null) => {
  const id = String(itemId ?? "").trim()
  if (!id) return null
  return `https://booth.pm/ja/items/${id}`
}

/** pixivFANBOX（月額の継続支援）。未設定なら導線を出さない */
export const fanboxUrl = process.env.NEXT_PUBLIC_FANBOX_URL?.trim() || null
