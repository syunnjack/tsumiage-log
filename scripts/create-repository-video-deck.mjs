import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"

const [slug, renderDir, pptxPath] = process.argv.slice(2)
if (!slug || !renderDir || !pptxPath) {
  throw new Error("slug, renderDir and pptxPath are required")
}

const root = path.resolve(import.meta.dirname, "..")
const queue = JSON.parse(await fs.readFile(path.join(root, "app/data/video-production.json"), "utf8"))
const item = queue.videos.find((video) => video.slug === slug)
if (!item) throw new Error(`Video queue entry not found: ${slug}`)
if (!Array.isArray(item.slides) || item.slides.length !== 6) {
  throw new Error(`Six Japanese slide definitions are required for ${slug}`)
}

const artifactEntry = process.env.CODEX_ARTIFACT_TOOL_ENTRY || path.join(
  os.homedir(),
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs",
)
try {
  await fs.access(artifactEntry)
} catch {
  throw new Error(`Artifact tool was not found: ${artifactEntry}`)
}
const { Presentation, PresentationFile } = await import(pathToFileURL(artifactEntry).href)

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } })
const palette = {
  paper: "stone-50",
  ink: "emerald-950",
  muted: "stone-600",
  accent: "amber-500",
  pale: "emerald-50",
  line: "stone-200",
}

function addText(slide, text, position, style, name) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  })
  shape.text = text
  shape.text.style = style
  return shape
}

function addBase(slide, index) {
  slide.background.fill = palette.paper
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 18, height: 720 },
    fill: palette.ink,
    line: { style: "solid", fill: palette.ink, width: 0 },
  })
  slide.shapes.add({
    geometry: "rect",
    position: { left: 72, top: 78, width: 70, height: 7 },
    fill: palette.accent,
    line: { style: "solid", fill: palette.accent, width: 0 },
  })
  addText(
    slide,
    "積み上げログ  |  技術解説",
    { left: 72, top: 38, width: 460, height: 30 },
    { fontSize: 16, bold: true, color: palette.ink },
    `series-${index}`,
  )
  addText(
    slide,
    String(index + 1).padStart(2, "0"),
    { left: 1132, top: 650, width: 70, height: 28 },
    { fontSize: 14, bold: true, color: palette.muted, alignment: "right" },
    `page-${index}`,
  )
}

for (const [index, definition] of item.slides.entries()) {
  const slide = deck.slides.add()
  addBase(slide, index)

  if (index === 0) {
    addText(
      slide,
      definition.title,
      { left: 72, top: 180, width: 1080, height: 150 },
      { fontSize: 58, bold: true, color: palette.ink },
      "title",
    )
    addText(
      slide,
      definition.body,
      { left: 76, top: 360, width: 940, height: 82 },
      { fontSize: 25, color: palette.muted },
      "subtitle",
    )
    addText(
      slide,
      item.language || "技術プロジェクト",
      { left: 76, top: 500, width: 320, height: 44 },
      { fontSize: 20, bold: true, color: palette.accent },
      "language",
    )
  } else {
    addText(
      slide,
      definition.title,
      { left: 72, top: 125, width: 1090, height: 120 },
      { fontSize: 42, bold: true, color: palette.ink },
      `title-${index}`,
    )
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 72, top: 285, width: 1110, height: 260 },
      fill: palette.pale,
      line: { style: "solid", fill: palette.line, width: 1 },
      borderRadius: "rounded-xl",
    })
    addText(
      slide,
      definition.body,
      { left: 112, top: 325, width: 1030, height: 185 },
      { fontSize: 26, color: palette.ink },
      `body-${index}`,
    )
  }

  const sources = `[Sources]\n- ${item.repositoryUrl}\n- ${item.articleUrl}`
  slide.speakerNotes.textFrame.setText(`${item.narration[index]}\n\n${sources}`)
  slide.speakerNotes.setVisible(true)
}

await fs.mkdir(renderDir, { recursive: true })
for (const [index, slide] of deck.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`
  const png = await deck.export({ slide, format: "png", scale: 1 })
  await fs.writeFile(path.join(renderDir, `${stem}.png`), new Uint8Array(await png.arrayBuffer()))
  const layout = await slide.export({ format: "layout" })
  await fs.writeFile(path.join(renderDir, `${stem}.layout.json`), await layout.text())
}
const montage = await deck.export({ format: "webp", montage: true, scale: 1 })
await fs.writeFile(path.join(renderDir, "montage.webp"), new Uint8Array(await montage.arrayBuffer()))
const pptx = await PresentationFile.exportPptx(deck)
await pptx.save(pptxPath)
await fs.writeFile(path.join(renderDir, "narration.json"), `${JSON.stringify(item.narration, null, 2)}\n`)

console.log(JSON.stringify({ slug, slides: item.slides.length, pptxPath, renderDir }))

// artifact-tool の後片付けがプロセスの終了コードを 127 に書き換えるため、
// このスクリプトの終了コードは成否を表さない（呼び出し側も生成物で判定している）。
// 失敗したときに何が欠けたのかが分かるよう、ここで生成物を確かめて標準エラーに出す。
const expectedArtifacts = [
  pptxPath,
  path.join(renderDir, "montage.webp"),
  path.join(renderDir, "narration.json"),
  ...Array.from({ length: item.slides.length }, (_, index) =>
    path.join(renderDir, `slide-${String(index + 1).padStart(2, "0")}.png`),
  ),
]
const missing = []
for (const artifact of expectedArtifacts) {
  const stat = await fs.stat(artifact).catch(() => null)
  if (!stat || stat.size === 0) missing.push(artifact)
}
if (missing.length > 0) {
  console.error("Slide artifacts are missing or empty:")
  for (const artifact of missing) console.error(`- ${artifact}`)
  process.exit(1)
}
process.exit(0)
