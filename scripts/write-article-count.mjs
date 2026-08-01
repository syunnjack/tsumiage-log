import { appendFileSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const data = JSON.parse(
  readFileSync(resolve("app/data/repositories.json"), "utf8"),
)
const count = data.articles.length

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `count=${count}\n`)
}

console.log(`現在の記事数: ${count}`)
