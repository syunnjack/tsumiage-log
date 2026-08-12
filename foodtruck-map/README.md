# foodtruck-map

Nationwide foodtruck map for Japan with complete 47-prefecture coverage.

## Features

- Interactive map with marker coverage in all prefectures
- Filter by prefecture, region, genre, and open-now status
- Keyword search for truck name and location
- Live directory panel synchronized with map matches
- CSV-first data loading from `public/data/foodtrucks.csv`

## CSV data format

`public/data/foodtrucks.csv` is loaded first. If the file is missing or empty, built-in nationwide seed data is used.

Header:

`id,name,prefecture,region,city,genre,lat,lng,opensAt,closesAt,days,menu,url`

Rules:

- `days`: `0|1|2|3|4|5|6` style (`0=Sun` ... `6=Sat`)
- `menu`: `;` separated values
- `lat` and `lng`: decimal numbers

## Spreadsheet sync

### Manual replace

1. Maintain the same header order in Google Sheets or Excel
2. Export as CSV (`UTF-8`)
3. Replace `public/data/foodtrucks.csv`
4. Run `npm run dev` and confirm source badge shows `CSV`

### Automated sync from Google Sheets

1. Copy `.env.example` to `.env` and set one of the following:
2. Set `FOODTRUCK_SHEET_CSV_URL` to a published CSV URL
3. Or set `FOODTRUCK_SHEET_ID` (and optional `FOODTRUCK_SHEET_GID`)
4. Run `npm run data:sync-sheet`

The sync script validates required columns and checks nationwide coverage (`47 prefectures`) by default.
To skip this strict check, set `FOODTRUCK_REQUIRE_47=false`.

## Daily auto-sync with GitHub Actions

Workflow file:

- `../.github/workflows/foodtruck-map-sheet-sync.yml` (workspace root)

Schedule:

- Runs every day at 03:15 JST
- Supports manual run from Actions tab

Manual run inputs:

- `source_csv_url`: one-time override URL for this run
- `require_47`: strict nationwide check toggle (`true`/`false`)

Required repository secrets (set one source at minimum):

- `FOODTRUCK_SHEET_CSV_URL` or `FOODTRUCK_SHEET_ID`
- Optional: `FOODTRUCK_SHEET_GID`
- Optional: `FOODTRUCK_REQUIRE_47` (`true` recommended)

Behavior:

1. Downloads and validates sheet CSV
2. Runs build validation
3. Commits only `public/data/foodtrucks.csv` when changed
4. Creates or updates an Issue when sync fails
5. Closes open sync-failure Issue automatically on success

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
