import { readFile, writeFile } from "node:fs/promises";

const [adm2Input, output, adm1Input, toleranceArg] = process.argv.slice(2);
if (!adm2Input || !output || !adm1Input) throw new Error("Usage: node scripts/build-japan-travel-map.mjs <adm2.geojson> <output.json> <adm1.geojson> [tolerance]");
const tolerance = Number(toleranceArg ?? "0.0025");
if (!Number.isFinite(tolerance) || tolerance <= 0) throw new Error("Tolerance must be a positive number in degrees.");

const [adm2Source, adm1Source] = await Promise.all([adm2Input, adm1Input].map(async (input) => JSON.parse(await readFile(input, "utf8"))));
if (adm2Source.type !== "FeatureCollection" || adm1Source.type !== "FeatureCollection") throw new Error("Expected GeoJSON FeatureCollections.");

function distanceToSegmentSquared(point, start, end) {
  const x = start[0]; const y = start[1]; const dx = end[0] - x; const dy = end[1] - y;
  if (dx === 0 && dy === 0) return (point[0] - x) ** 2 + (point[1] - y) ** 2;
  const ratio = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx ** 2 + dy ** 2);
  const projectedX = x + Math.max(0, Math.min(1, ratio)) * dx;
  const projectedY = y + Math.max(0, Math.min(1, ratio)) * dy;
  return (point[0] - projectedX) ** 2 + (point[1] - projectedY) ** 2;
}
function simplify(points) {
  if (points.length <= 4) return points;
  const closed = points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1];
  const ring = closed ? points.slice(0, -1) : points.slice();
  if (ring.length < 3) return points;
  const retained = new Set([0, ring.length - 1]); const toleranceSquared = tolerance ** 2;
  const visit = (startIndex, endIndex) => {
    let maxDistance = toleranceSquared; let candidate = -1;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = distanceToSegmentSquared(ring[index], ring[startIndex], ring[endIndex]);
      if (distance > maxDistance) { maxDistance = distance; candidate = index; }
    }
    if (candidate !== -1) { retained.add(candidate); visit(startIndex, candidate); visit(candidate, endIndex); }
  };
  visit(0, ring.length - 1);
  const simplified = [...retained].sort((a, b) => a - b).map((index) => ring[index]);
  return simplified.length < 3 ? points : closed ? [...simplified, simplified[0]] : simplified;
}
function ringsFor(geometry) {
  if (geometry?.type === "Polygon") return geometry.coordinates.map(simplify);
  if (geometry?.type === "MultiPolygon") return geometry.coordinates.flatMap((polygon) => polygon.map(simplify));
  return [];
}
function polygonsFor(geometry) { return geometry?.type === "Polygon" ? [geometry.coordinates] : geometry?.type === "MultiPolygon" ? geometry.coordinates : []; }
function pointInRing([x, y], ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [xi, yi] = ring[index]; const [xj, yj] = ring[previous];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function contains(geometry, point) {
  return polygonsFor(geometry).some(([outer, ...holes]) => pointInRing(point, outer) && !holes.some((hole) => pointInRing(point, hole)));
}
function representativePoint(geometry) {
  const outer = polygonsFor(geometry)[0]?.[0] ?? [];
  const bounds = outer.reduce((result, [x, y]) => ({ minX: Math.min(result.minX, x), maxX: Math.max(result.maxX, x), minY: Math.min(result.minY, y), maxY: Math.max(result.maxY, y) }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  const centre = [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2];
  if (contains(geometry, centre)) return centre;
  const average = outer.reduce(([x, y], point) => [x + point[0] / outer.length, y + point[1] / outer.length], [0, 0]);
  return contains(geometry, average) ? average : outer[0];
}

const regionNames = {
  "JP-01": "北海道", "JP-02": "青森县", "JP-03": "岩手县", "JP-04": "宫城县", "JP-05": "秋田县", "JP-06": "山形县", "JP-07": "福岛县", "JP-08": "茨城县", "JP-09": "栃木县", "JP-10": "群马县", "JP-11": "埼玉县", "JP-12": "千叶县", "JP-13": "东京都", "JP-14": "神奈川县", "JP-15": "新潟县", "JP-16": "富山县", "JP-17": "石川县", "JP-18": "福井县", "JP-19": "山梨县", "JP-20": "长野县", "JP-21": "岐阜县", "JP-22": "静冈县", "JP-23": "爱知县", "JP-24": "三重县", "JP-25": "滋贺县", "JP-26": "京都府", "JP-27": "大阪府", "JP-28": "兵库县", "JP-29": "奈良县", "JP-30": "和歌山县", "JP-31": "鸟取县", "JP-32": "岛根县", "JP-33": "冈山县", "JP-34": "广岛县", "JP-35": "山口县", "JP-36": "德岛县", "JP-37": "香川县", "JP-38": "爱媛县", "JP-39": "高知县", "JP-40": "福冈县", "JP-41": "佐贺县", "JP-42": "长崎县", "JP-43": "熊本县", "JP-44": "大分县", "JP-45": "宫崎县", "JP-46": "鹿儿岛县", "JP-47": "冲绳县"
};
const regions = adm1Source.features.flatMap((feature) => {
  const id = feature.properties?.ISO_Code;
  const name = feature.properties?.NAME;
  const polygons = ringsFor(feature.geometry);
  return typeof id === "string" && typeof name === "string" && polygons.length > 0 ? [{ id, pid: "JP", level: 0, name: regionNames[id] ?? name, polygons, geometry: feature.geometry }] : [];
});
const cities = adm2Source.features.flatMap((feature) => {
  const id = feature.properties?.shapeID;
  const name = feature.properties?.shapeName;
  const polygons = ringsFor(feature.geometry);
  const point = representativePoint(feature.geometry);
  const region = regions.find((candidate) => contains(candidate.geometry, point));
  return typeof id === "string" && typeof name === "string" && polygons.length > 0 && region ? [{ id, pid: region.id, level: 1, name, polygons }] : [];
});
const unassigned = adm2Source.features.length - cities.length;
if (unassigned > 0) console.warn(`${unassigned} ADM2 features could not be assigned to an ADM1 region.`);
await writeFile(output, `${JSON.stringify({ source: "geoBoundaries JPN ADM1 + ADM2", sourceUrl: "https://www.geoboundaries.org/", tolerance, features: [...regions.map(({ geometry, ...feature }) => feature), ...cities] })}\n`);
console.log(`Wrote ${regions.length} Japanese ADM1 and ${cities.length} ADM2 features to ${output}.`);
