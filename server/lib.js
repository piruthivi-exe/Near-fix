// Pure helpers: kept separate from Express so they are easy to test.

const SERVICES = [
  { id: 'plumber', en: 'Plumber', ta: 'பிளம்பர்', hi: 'प्लंबर' },
  { id: 'electrician', en: 'Electrician', ta: 'எலக்ட்ரீஷியன்', hi: 'इलेक्ट्रीशियन' },
  { id: 'painter', en: 'Painter', ta: 'பெயிண்டர்', hi: 'पेंटर' },
  { id: 'carpenter', en: 'Carpenter', ta: 'தச்சர்', hi: 'बढ़ई' },
  { id: 'ac-repair', en: 'AC repair', ta: 'ஏசி பழுது', hi: 'एसी मरम्मत' },
  { id: 'mason', en: 'Mason', ta: 'கொத்தனார்', hi: 'राजमिस्त्री' }
];

const R = 6371; // Earth radius, km

function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Seed workers only carry offsets (km north/east) so the demo works in any
// town. Registered workers carry real lat/lng.
function place(worker, origin) {
  if (typeof worker.lat === 'number' && typeof worker.lng === 'number') {
    return { lat: worker.lat, lng: worker.lng };
  }
  const { north = 0, east = 0 } = worker.offsetKm || {};
  const lat = origin.lat + north / 110.574;
  const lng = origin.lng + east / (111.32 * Math.cos((origin.lat * Math.PI) / 180));
  return { lat, lng };
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Compare a visit charge with the median for that service.
function priceBand(visitCharge, medianCharge) {
  if (!medianCharge) return 'typical';
  const ratio = visitCharge / medianCharge;
  if (ratio < 0.85) return 'low';
  if (ratio > 1.15) return 'high';
  return 'typical';
}

function findWorkers(all, { service, origin, radiusKm = 5, maxVisit, sort = 'distance' }) {
  const pool = service ? all.filter((w) => w.service === service) : all;
  const med = median(pool.map((w) => w.visitCharge));
  const out = pool
    .map((w) => {
      const pos = place(w, origin);
      return {
        ...w,
        distanceKm: Math.round(distanceKm(origin, pos) * 10) / 10,
        priceBand: priceBand(w.visitCharge, med)
      };
    })
    .filter((w) => w.distanceKm <= radiusKm)
    .filter((w) => (maxVisit ? w.visitCharge <= maxVisit : true));

  const by = {
    distance: (a, b) => a.distanceKm - b.distanceKm,
    price: (a, b) => a.visitCharge - b.visitCharge,
    rating: (a, b) => b.rating - a.rating
  };
  return out.sort(by[sort] || by.distance);
}

module.exports = { SERVICES, distanceKm, place, median, priceBand, findWorkers };
