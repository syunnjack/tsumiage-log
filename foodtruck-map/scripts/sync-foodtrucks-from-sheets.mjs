import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseCsv } from "../src/data/csvLoader.js";

const TARGET_PATH = "./public/data/foodtrucks.csv";
const REQUIRED_COLUMNS = [
  "id",
  "name",
  "prefecture",
  "region",
  "city",
  "genre",
  "lat",
  "lng",
  "opensAt",
  "closesAt",
  "days",
  "menu",
  "url",
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const map = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        map[key] = next;
        i += 1;
      } else {
        map[key] = "true";
      }
    }
  }

  return map;
};

const buildGoogleCsvUrl = (sheetId, gid) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

const getSource = (args) => {
  if (args.source) {
    return args.source;
  }

  if (process.env.FOODTRUCK_SHEET_CSV_URL) {
    return process.env.FOODTRUCK_SHEET_CSV_URL;
  }

  if (process.env.FOODTRUCK_SHEET_ID) {
    return buildGoogleCsvUrl(process.env.FOODTRUCK_SHEET_ID, process.env.FOODTRUCK_SHEET_GID || "0");
  }

  throw new Error(
    "Source not set. Provide --source, FOODTRUCK_SHEET_CSV_URL, or FOODTRUCK_SHEET_ID (+ optional FOODTRUCK_SHEET_GID)."
  );
};

const loadSourceText = async (source) => {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status}`);
    }
    return await response.text();
  }

  const path = resolve(process.cwd(), source);
  return await readFile(path, "utf8");
};

const validateRecords = (records, requireCoverage47) => {
  if (records.length === 0) {
    throw new Error("CSV has no data rows.");
  }

  const presentColumns = Object.keys(records[0]);
  const missing = REQUIRED_COLUMNS.filter((key) => !presentColumns.includes(key));
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(", ")}`);
  }

  const invalidLocation = records.find(
    (item) => Number.isNaN(Number(item.lat)) || Number.isNaN(Number(item.lng))
  );
  if (invalidLocation) {
    throw new Error(`Invalid lat/lng in row id=${invalidLocation.id || "unknown"}`);
  }

  const prefectures = new Set(records.map((item) => item.prefecture).filter(Boolean));
  if (requireCoverage47 && prefectures.size < 47) {
    throw new Error(
      `Coverage check failed: ${prefectures.size}/47 prefectures. Set FOODTRUCK_REQUIRE_47=false to bypass.`
    );
  }

  return {
    rowCount: records.length,
    prefectureCount: prefectures.size,
  };
};

const run = async () => {
  const args = parseArgs();
  const source = getSource(args);
  const requireCoverage47 = process.env.FOODTRUCK_REQUIRE_47 !== "false";

  const csvText = await loadSourceText(source);
  const records = parseCsv(csvText);
  const summary = validateRecords(records, requireCoverage47);

  const output = csvText.replace(/\r?\n/g, "\n").trimEnd() + "\n";
  await writeFile(resolve(process.cwd(), TARGET_PATH), output, "utf8");

  console.log(`Synced CSV from ${source}`);
  console.log(`Rows: ${summary.rowCount}`);
  console.log(`Prefectures: ${summary.prefectureCount}/47`);
  console.log(`Saved: ${TARGET_PATH}`);
};

run().catch((error) => {
  console.error("Sync failed:", error.message);
  process.exitCode = 1;
});
