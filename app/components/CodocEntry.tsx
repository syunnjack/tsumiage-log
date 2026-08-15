/**
 * codoc の枠を置くための部品。
 *
 * codoc は head で読み込んだ cms.js が、この div を見つけて中身を描く。
 * entryId は codoc の管理画面で商品（記事・サポート）を作ると発行される。
 *
 * ユーザーコードが未設定のとき、または entryId が無いときは何も描かない。
 * 空の枠だけが残ると、読者には壊れた場所に見えるため。
 */

type Props = {
  /** codoc の管理画面で発行される ID（codoc-entry-XXXXXXXX の XXXXXXXX 部分ではなく全体） */
  entryId?: string | null
  /** 枠の上に出す案内。サポートか有料記事かで変えられる */
  heading?: string
  description?: string
}

const userCode = process.env.NEXT_PUBLIC_CODOC_USERCODE?.trim()

export default function CodocEntry({ entryId, heading, description }: Props) {
  if (!userCode || !entryId) return null

  return (
    <aside className="codoc-block">
      {heading ? <h2 className="codoc-block__heading">{heading}</h2> : null}
      {description ? <p className="codoc-block__description">{description}</p> : null}
      <div className="codoc-entries" id={entryId} />
    </aside>
  )
}
