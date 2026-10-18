const test = require('node:test');
const assert = require('node:assert/strict');
const { distanceKm, priceBand, findWorkers } = require('./lib');

test('distanceKm is 0 for identical points and ~111 km per degree of latitude', () => {
  assert.equal(distanceKm({ lat: 10, lng: 78 }, { lat: 10, lng: 78 }), 0);
  const d = distanceKm({ lat: 10, lng: 78 }, { lat: 11, lng: 78 });
  assert.ok(d > 110 && d < 112);
});

test('priceBand flags unusually low and high visit charges', () => {
  assert.equal(priceBand(70, 100), 'low');
  assert.equal(priceBand(100, 100), 'typical');
  assert.equal(priceBand(130, 100), 'high');
});

test('findWorkers filters by service, radius and max visit charge', () => {
  const workers = [
    { id: 'a', service: 'plumber', visitCharge: 100, rating: 4, offsetKm: { north: 1, east: 0 } },
    { id: 'b', service: 'plumber', visitCharge: 300, rating: 5, offsetKm: { north: 2, east: 0 } },
    { id: 'c', service: 'plumber', visitCharge: 120, rating: 3, offsetKm: { north: 20, east: 0 } },
    { id: 'd', service: 'painter', visitCharge: 100, rating: 5, offsetKm: { north: 1, east: 0 } }
  ];
  const origin = { lat: 12, lng: 78 };
  const all = findWorkers(workers, { service: 'plumber', origin, radiusKm: 5 });
  assert.deepEqual(all.map((w) => w.id), ['a', 'b']);
  const cheap = findWorkers(workers, { service: 'plumber', origin, radiusKm: 5, maxVisit: 150 });
  assert.deepEqual(cheap.map((w) => w.id), ['a']);
});
