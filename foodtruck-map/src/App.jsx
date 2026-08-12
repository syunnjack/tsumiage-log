import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { prefectures, regions } from "./data/prefectures";
import { loadTrucksFromCsv } from "./data/csvLoader";
import {
  dayNames,
  getCoverage,
  getGenresInUse,
  isTruckOpenNow,
  normalizeTruckRecord,
  trucks as seedTrucks,
} from "./data/trucks";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mapCenter = [36.2048, 138.2529];

const summarizeByPrefecture = (list) =>
  prefectures.map((pref) => ({
    ...pref,
    total: list.filter((item) => item.prefecture === pref.name).length,
  }));

function App() {
  const [truckData, setTruckData] = useState(seedTrucks);
  const [dataSource, setDataSource] = useState("seed");
  const [selectedPrefecture, setSelectedPrefecture] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const rows = await loadTrucksFromCsv("/data/foodtrucks.csv");
        const normalized = rows.map((row) => normalizeTruckRecord(row));

        if (!active || normalized.length === 0) {
          return;
        }

        setTruckData(normalized);
        setDataSource("csv");
      } catch (error) {
        if (active) {
          setTruckData(seedTrucks);
          setDataSource("seed");
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const filteredTrucks = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return truckData.filter((truck) => {
      if (selectedPrefecture !== "all" && truck.prefecture !== selectedPrefecture) return false;
      if (selectedRegion !== "all" && truck.region !== selectedRegion) return false;
      if (selectedGenre !== "all" && truck.genre !== selectedGenre) return false;
      if (openNowOnly && !isTruckOpenNow(truck)) return false;
      if (!q) return true;

      const target = `${truck.name} ${truck.city} ${truck.prefecture} ${truck.genre}`.toLowerCase();
      return target.includes(q);
    });
  }, [keyword, openNowOnly, selectedGenre, selectedPrefecture, selectedRegion, truckData]);

  const mapPoints = useMemo(() => summarizeByPrefecture(filteredTrucks), [filteredTrucks]);
  const coverage = useMemo(() => getCoverage(truckData), [truckData]);
  const genresInUse = useMemo(() => getGenresInUse(truckData), [truckData]);
  const activePrefectures = useMemo(
    () => mapPoints.filter((point) => point.total > 0).length,
    [mapPoints]
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">NATIONWIDE DIRECTORY</p>
        <h1>Foodtruck Map Japan</h1>
        <p className="hero-copy">
          Nationwide foodtruck coverage across all 47 prefectures. Filter by region, cuisine, and live opening status.
        </p>
        <p className="source-badge">Data source: {dataSource === "csv" ? "CSV" : "Built-in seed"}</p>
        <div className="stats-row">
          <article>
            <span>Total Trucks</span>
            <strong>{coverage.truckCount}</strong>
          </article>
          <article>
            <span>Coverage</span>
            <strong>
              {coverage.prefectureCount}/{coverage.totalPrefectures}
            </strong>
          </article>
          <article>
            <span>Visible Prefectures</span>
            <strong>{activePrefectures}</strong>
          </article>
          <article>
            <span>Current Matches</span>
            <strong>{filteredTrucks.length}</strong>
          </article>
        </div>
      </header>

      <main className="layout-grid">
        <section className="panel filters-panel">
          <h2>Filters</h2>
          <label>
            Search
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="truck, city, prefecture"
            />
          </label>

          <label>
            Prefecture
            <select
              value={selectedPrefecture}
              onChange={(event) => setSelectedPrefecture(event.target.value)}
            >
              <option value="all">All prefectures</option>
              {prefectures.map((pref) => (
                <option key={pref.code} value={pref.name}>
                  {pref.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Region
            <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}>
              <option value="all">All regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label>
            Genre
            <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
              <option value="all">All genres</option>
              {genresInUse.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={openNowOnly}
              onChange={(event) => setOpenNowOnly(event.target.checked)}
            />
            Open now only
          </label>

          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setSelectedPrefecture("all");
              setSelectedRegion("all");
              setSelectedGenre("all");
              setOpenNowOnly(false);
            }}
          >
            Reset filters
          </button>
        </section>

        <section className="panel map-panel">
          <h2>Map</h2>
          <MapContainer center={mapCenter} zoom={5} minZoom={4} className="map-canvas" scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapPoints
              .filter((point) => point.total > 0)
              .map((point) => (
                <Marker key={point.code} position={[point.lat, point.lng]}>
                  <Popup>
                    <strong>{point.name}</strong>
                    <div>{point.capital}</div>
                    <div>{point.total} truck(s) match</div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </section>

        <section className="panel results-panel">
          <h2>Truck Directory</h2>
          <ul>
            {filteredTrucks.map((truck) => (
              <li key={truck.id}>
                <header>
                  <strong>{truck.name}</strong>
                  <span className={isTruckOpenNow(truck) ? "open" : "closed"}>
                    {isTruckOpenNow(truck) ? "OPEN" : "CLOSED"}
                  </span>
                </header>
                <p>
                  {truck.prefecture} / {truck.city} / {truck.genre}
                </p>
                <p>
                  {truck.opensAt}-{truck.closesAt} ({truck.days.map((d) => dayNames[d]).join(", ")})
                </p>
                <p>{truck.menu.join(" | ")}</p>
                <a href={truck.url} target="_blank" rel="noreferrer">
                  Official page
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
