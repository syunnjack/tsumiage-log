import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const appDirectory = path.resolve("app")
const publicDataFiles = [
  "app/data/favorite-videos.json",
  "app/data/manual-articles.json",
  "app/data/repositories.json",
  "app/data/video-production.json",
]
const prohibitedExpressions = [
  "試作版",
  "公開準備中",
  "公開予定",
  "企画中",
  "準備中",
  "制作待ち",
  "COMING SOON",
  "COMING IN",
  "VIDEO EXPLANATION / PREVIEW",
  "順次公開",
  "公開後",
  "予定しています",
  "予定一覧",
]

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === "data") return []
        return collectSourceFiles(entryPath)
      }
      return /\.(?:tsx|ts)$/.test(entry.name) ? [entryPath] : []
    }),
  )
  return files.flat()
}

const violations = []

function inspectText(source, filePath) {
  for (const expression of prohibitedExpressions) {
    let searchFrom = 0
    while (searchFrom < source.length) {
      const index = source.indexOf(expression, searchFrom)
      if (index === -1) break
      const line = source.slice(0, index).split("\n").length
      violations.push(`${path.relative(process.cwd(), filePath)}:${line} ${expression}`)
      searchFrom = index + expression.length
    }
  }
}

for (const filePath of await collectSourceFiles(appDirectory)) {
  const source = await readFile(filePath, "utf8")
  inspectText(source, filePath)
}

for (const relativePath of publicDataFiles) {
  const filePath = path.resolve(relativePath)
  inspectText(await readFile(filePath, "utf8"), filePath)
}

if (violations.length > 0) {
  console.error("読者に不要な制作・公開都合の表現が見つかりました。")
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log("読者向け表現監査: 違反 0件")
