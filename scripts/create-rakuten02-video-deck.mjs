import fs from "node:fs/promises"
import { Presentation, PresentationFile } from "@oai/artifact-tool"
import { buildSlide01 } from "./templates/slide-01.mjs"
import { buildSlide13 } from "./templates/slide-13.mjs"
import { buildSlide06 } from "./templates/slide-06.mjs"
import { buildSlide17 } from "./templates/slide-17.mjs"
import { buildSlide10 } from "./templates/slide-10.mjs"
import { buildSlide26 } from "./templates/slide-26.mjs"

const outputDir = process.argv[2]
const finalPptx = process.argv[3]
if (!outputDir || !finalPptx) throw new Error("outputDir and finalPptx are required")

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } })
const source = "[Sources]\n- https://github.com/syunnjack/rakuten02\n- https://github.com/syunnjack/rakuten02/blob/master/README.md\n- Rakuten02 public commit history, checked 2026-07-30"
const narrations = [
  "今回は、Rakuten02、終電ホテルを解説します。終電後やライブ後に、今夜近くで泊まれるホテルを探すためのアプリです。",
  "解決したいのは、時間がない夜の宿探しです。駅や場所から検索し、空室を確認し、予約先へ進むまでを短くつなぎます。",
  "構成は三つです。Windows Forms版、検索とジオコーディングを担う共通コア、そしてASP.NET CoreのWeb版です。",
  "検索は、場所を緯度経度へ変換し、楽天トラベルAPIで空室を取得します。地名は十四日、空室結果は十分だけキャッシュします。",
  "Web版では、サーバーレンダリング、構造化データ、サイトマップ、エルエルエムズテキストを実装。予約リンクは広告リンクとして明示します。",
  "技術の中心はCシャープとASP.NET Coreです。次回の本編では、API連携、キャッシュ、検索導線、公開時の注意点をコードと画面で詳しく解説します。",
]

const slides = [
  buildSlide01(deck, { title: "TSUMIAGE LOG / TECH VIDEO", title2: "Rakuten02の技術解説", title3: "終電後のホテル検索を、C#と楽天トラベルAPIで形にする" }),
  buildSlide13(deck, { title: "時間がない夜の宿探しを、短い導線にする", footer1: "02", body1: { titleGoesHere: "終電後", loremIpsumDolorSitAmetConsecteturAdipiscing: "今夜泊まれる宿を、現在地や駅名から探す" }, body2: { titleGoesHere: "ライブ後", loremIpsumDolorSitAmetConsecteturAdipiscing: "会場周辺の空室へすばやく到達する" }, body3: { titleGoesHere: "急な延泊", loremIpsumDolorSitAmetConsecteturAdipiscing: "出張延長でも、その日の宿泊先を確認する" }, body4: { titleGoesHere: "予約まで", loremIpsumDolorSitAmetConsecteturAdipiscing: "検索結果から楽天トラベルの予約先へ進む" } }),
  buildSlide06(deck, { title: "3つのプロジェクトに責務を分けた", footer1: "03", body1: { titleHere: "Windows Forms", loremIpsumDolorSitAmetConsecteturAdipiscing: "デスクトップ版\n検索UIを提供" }, body2: { titleHere: "rakuten02.Core", loremIpsumDolorSitAmetConsecteturAdipiscing: "楽天検索と\nジオコーディング" }, body3: { titleHere: "ASP.NET Core", loremIpsumDolorSitAmetConsecteturAdipiscing: "Web公開と\nSEO対応" } }),
  buildSlide17(deck, { title: "検索処理は、場所から空室へ順番につなぐ", footer1: "04", label1: "PLACE", label2: "SEARCH", label3: "BOOK", body1: { titleHere: "場所を入力", loremIpsumDolorSitAmetConsecteturAdipiscing: "駅名・会場名を\n緯度経度へ変換" }, body2: { titleHere: "空室を取得", loremIpsumDolorSitAmetConsecteturAdipiscing: "楽天トラベルAPI\n結果は10分キャッシュ" }, body3: { titleHere: "予約先へ", loremIpsumDolorSitAmetConsecteturAdipiscing: "最新情報を確認し\n予約リンクへ進む" } }),
  buildSlide10(deck, { title: "公開後に見つけてもらう設計も含める", footer1: "05", body1: "SEO / AIO / LLMO", body2: { loremIpsumDolorSitAmetConsecteturAdipiscing: "検索結果ページはサーバー側で描画。構造化データと明確な説明で、検索エンジンとAIの双方が内容を理解しやすくします。", loremIpsumDolorSitAmetConsecteturAdipiscing2: "予約リンクには sponsored と nofollow を付け、広告・アフィリエイトであることを利用者へ明示します。" }, label1: "title・description・canonical", label2: "WebApplication / ItemList", label3: "sitemap.xml・robots.txt", label4: "llms.txt", label5: "広告・プライバシー表記" }),
  buildSlide26(deck, { title: "AUGUST PREVIEW", title2: "本編ではコードと画面で解説", title3: { loremIpsumDetails: "楽天トラベルAPI連携", loremIpsumDetails2: "キャッシュと検索導線", loremIpsumDetails3: "公開・SEOの実装判断" } }),
]

for (const [index, slide] of slides.entries()) {
  slide.speakerNotes.textFrame.setText(`${narrations[index]}\n\n${source}`)
  slide.speakerNotes.setVisible(true)
}

await fs.mkdir(outputDir, { recursive: true })
for (const [index, slide] of slides.entries()) {
  const png = await deck.export({ slide, format: "png", scale: 1 })
  await fs.writeFile(`${outputDir}/slide-${String(index + 1).padStart(2, "0")}.png`, new Uint8Array(await png.arrayBuffer()))
  const layout = await slide.export({ format: "layout" })
  await fs.writeFile(`${outputDir}/slide-${String(index + 1).padStart(2, "0")}.layout.json`, await layout.text())
}
const montage = await deck.export({ format: "webp", montage: true, scale: 1 })
await fs.writeFile(`${outputDir}/montage.webp`, new Uint8Array(await montage.arrayBuffer()))
const pptx = await PresentationFile.exportPptx(deck)
await pptx.save(finalPptx)
await fs.writeFile(`${outputDir}/narration.json`, JSON.stringify(narrations, null, 2))
