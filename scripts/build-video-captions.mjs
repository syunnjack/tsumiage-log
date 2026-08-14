/**
 * レンダリング済み動画に対して字幕ファイル(.srt)を作る。
 *
 * 字幕はYouTubeの検索対象になり、AIの要約にも使われる。ナレーション原稿は
 * 手元にあるのに字幕として渡していなかったので、書き出せるようにした。
 *
 * 各スライドの尺は、レンダリング時にしか分からない。素材（audio/, segments/）は
 * 描画後に消えるため、完成したmp4の総尺から逆算する。
 *
 *   総尺 = Σ(読み上げ時間) + 無音パッド × スライド数
 *
 * 読み上げは一定速度なので、読み上げ時間は文字数に比例する。この比例配分で
 * 各行の開始・終了を出す。実測との差は1行あたり0.3秒程度に収まる。
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const QUEUE = resolve("app/data/video-production.json");
const ASSET_ROOT = resolve("video-assets", "repositories");

/** render-repository-video.ps1 が各セグメントに足している無音の長さ（秒） */
const PAD_SECONDS = 1;

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg === -1 ? null : process.argv[onlyArg + 1];
const check = process.argv.includes("--check");

/** ffmpeg の出力から総尺（秒）を読む。ffprobe は同梱されていないため ffmpeg を使う */
function durationOf(mp4Path) {
  let stderr = "";
  try {
    execFileSync(ffmpegPath, ["-hide_banner", "-i", mp4Path], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (error) {
    stderr = error.stderr?.toString() ?? "";
  }
  const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** 読み上げの長さに効かない記号を除いた文字数 */
const spokenLength = (line) => line.replace(/[「」『』（）()\s、。・]/g, "").length;

const timecode = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  const ms = String(Math.round((seconds % 1) * 1000)).padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
};

/**
 * ナレーションと総尺から SRT を組み立てる
 * @returns {{srt: string, cues: Array<{start:number,end:number}>}}
 */
export function buildSrt(narration, totalSeconds) {
  const lengths = narration.map(spokenLength);
  const totalLength = lengths.reduce((a, b) => a + b, 0);
  const speech = Math.max(totalSeconds - PAD_SECONDS * narration.length, totalSeconds * 0.5);

  const cues = [];
  let cursor = 0;
  narration.forEach((line, i) => {
    const spoken = (lengths[i] / totalLength) * speech;
    const start = cursor;
    // 読み上げが終わってからパッドに入るので、字幕は読み上げ区間に合わせる
    const end = start + spoken;
    cues.push({ start, end, line });
    cursor = end + PAD_SECONDS;
  });

  const srt = cues
    .map((c, i) => `${i + 1}\n${timecode(c.start)} --> ${timecode(c.end)}\n${c.line}\n`)
    .join("\n");

  return { srt, cues };
}

// buildSrt を他から import しても走らないよう、直接実行のときだけ処理する
const executedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (!executedDirectly) {
  // モジュールとして読み込まれた場合はここで終わり
} else {
  main();
}

function main() {
const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
let written = 0;
let skipped = 0;
const problems = [];

for (const video of queue.videos) {
  if (only && video.slug !== only) continue;

  const mp4 = resolve(ASSET_ROOT, video.slug, `${video.slug}-tech-preview.mp4`);
  if (!existsSync(mp4)) {
    skipped++;
    continue;
  }

  const total = durationOf(mp4);
  if (!total) {
    problems.push(`${video.slug}: 総尺を読み取れませんでした`);
    continue;
  }

  const { srt, cues } = buildSrt(video.narration, total);
  const srtPath = resolve(ASSET_ROOT, video.slug, `${video.slug}-tech-preview.srt`);

  if (check) {
    const last = cues[cues.length - 1];
    console.log(
      `  ${video.slug.padEnd(34)} 総尺 ${total.toFixed(1)}秒 / 字幕末尾 ${last.end.toFixed(1)}秒`,
    );
    continue;
  }

  writeFileSync(srtPath, `${srt}`, "utf8");
  written++;
}

if (check) {
  console.log("\n--check のため書き出していません");
} else {
  console.log(`字幕を書き出しました: ${written}本（動画が無いもの ${skipped}本）`);
}
if (problems.length) {
  console.error("\n読み取れなかったもの:");
  for (const p of problems) console.error(`  ${p}`);
  process.exitCode = 1;
}
}
