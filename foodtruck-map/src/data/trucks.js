import { prefectures } from "./prefectures.js";

const genres = [
  "Burger",
  "Taco",
  "Crepe",
  "Kebab",
  "Curry",
  "Ramen",
  "Coffee",
  "Vegan",
];

const daySets = [
  [1, 2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [0, 1, 5, 6],
  [3, 4, 5, 6],
];

const prefectureMap = new Map(prefectures.map((pref) => [pref.name, pref]));

const formatClock = (hour, minute) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const asMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const isOpenAt = (truck, date = new Date()) => {
  const day = date.getDay();
  const now = date.getHours() * 60 + date.getMinutes();
  const opens = asMinutes(truck.opensAt);
  const closes = asMinutes(truck.closesAt);
  return truck.days.includes(day) && now >= opens && now <= closes;
};

const toList = (value, delimiter) =>
  String(value ?? "")
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);

const toDays = (value) => {
  const numbers = toList(value, "|")
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 0 && item <= 6);

  return numbers.length > 0 ? numbers : [1, 2, 3, 4, 5];
};

export const normalizeTruckRecord = (record) => {
  const pref = prefectureMap.get(record.prefecture);

  return {
    id: String(record.id || `${record.prefecture}-${record.name}`),
    name: String(record.name || "Unknown Truck"),
    prefecture: String(record.prefecture || ""),
    region: String(record.region || pref?.region || "Unknown"),
    city: String(record.city || pref?.capital || "Unknown"),
    genre: String(record.genre || "Other"),
    lat: Number(record.lat ?? pref?.lat ?? 0),
    lng: Number(record.lng ?? pref?.lng ?? 0),
    opensAt: String(record.opensAt || "10:00"),
    closesAt: String(record.closesAt || "18:00"),
    days: Array.isArray(record.days) ? record.days : toDays(record.days),
    menu: Array.isArray(record.menu) ? record.menu : toList(record.menu, ";"),
    url: String(record.url || "https://example.com"),
  };
};

export const buildSeedTrucks = () =>
  prefectures.flatMap((pref, index) => {
  const baseGenre = genres[index % genres.length];
  const secondGenre = genres[(index + 3) % genres.length];
  const scheduleA = daySets[index % daySets.length];
  const scheduleB = daySets[(index + 1) % daySets.length];

  const openHourA = 10 + (index % 3);
  const openHourB = 11 + (index % 2);

  return [
    {
      id: `${pref.code}-A`,
      name: `${pref.capital} Street Bites`,
      prefecture: pref.name,
      region: pref.region,
      city: pref.capital,
      genre: baseGenre,
      lat: Number((pref.lat + 0.07).toFixed(4)),
      lng: Number((pref.lng + 0.06).toFixed(4)),
      opensAt: formatClock(openHourA, 0),
      closesAt: formatClock(openHourA + 8, 0),
      days: scheduleA,
      menu: [`${baseGenre} Signature`, "Local Pickles", "Seasonal Drink"],
      url: `https://example.com/foodtrucks/${pref.name.toLowerCase()}/street-bites`,
    },
    {
      id: `${pref.code}-B`,
      name: `${pref.capital} Night Caravan`,
      prefecture: pref.name,
      region: pref.region,
      city: pref.capital,
      genre: secondGenre,
      lat: Number((pref.lat - 0.06).toFixed(4)),
      lng: Number((pref.lng - 0.05).toFixed(4)),
      opensAt: formatClock(openHourB, 30),
      closesAt: formatClock(openHourB + 9, 0),
      days: scheduleB,
      menu: [`${secondGenre} Plate`, "House Sauce", "Cold Brew"],
      url: `https://example.com/foodtrucks/${pref.name.toLowerCase()}/night-caravan`,
    },
  ];
});

export const trucks = buildSeedTrucks();

export const getGenresInUse = (list) => [...new Set(list.map((truck) => truck.genre))];

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getCoverage = (list) => {
  const covered = new Set(list.map((truck) => truck.prefecture));
  return {
    prefectureCount: covered.size,
    totalPrefectures: prefectures.length,
    truckCount: list.length,
  };
};

export const isTruckOpenNow = isOpenAt;
