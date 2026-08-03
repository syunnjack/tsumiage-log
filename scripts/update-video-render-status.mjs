import fs from "node:fs/promises"
import path from "node:path"

const [slug] = process.argv.slice(2)
if (!slug) throw new Error("slug is required")

const root = path.resolve(import.meta.dirname, "..")
const queuePath = path.join(root, "app/data/video-production.json")
const queue = JSON.parse(await fs.readFile(queuePath, "utf8"))
const item = queue.videos.find((video) => video.slug === slug)
if (!item) throw new Error(`Video queue entry not found: ${slug}`)

if (!["scheduled", "published"].includes(item.status)) item.status = "rendered"
item.localVideoUrl = `/videos/repositories/${slug}/${slug}-tech-preview.mp4`
item.localPptxUrl = `/videos/repositories/${slug}/${slug}-tech-preview.pptx`

await fs.writeFile(queuePath, `${JSON.stringify(queue, null, 2)}\n`, "utf8")
console.log(JSON.stringify({ slug, status: item.status, localVideoUrl: item.localVideoUrl }))
