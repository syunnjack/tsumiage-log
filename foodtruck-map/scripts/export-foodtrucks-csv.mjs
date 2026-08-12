import { writeFileSync } from "node:fs";
import { trucks } from "../src/data/trucks.js";

const header = [
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
].join(",");

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
};

const lines = trucks.map((truck) => {
  const row = [
    truck.id,
    truck.name,
    truck.prefecture,
    truck.region,
    truck.city,
    truck.genre,
    truck.lat,
    truck.lng,
    truck.opensAt,
    truck.closesAt,
    truck.days.join("|"),
    truck.menu.join(";"),
    truck.url,
  ];

  return row.map(escapeCsv).join(",");
});

writeFileSync("./public/data/foodtrucks.csv", [header, ...lines].join("\n"));
console.log(`Exported ${lines.length} rows to public/data/foodtrucks.csv`);
