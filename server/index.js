const express = require('express');
const fs = require('fs');
const path = require('path');
const { SERVICES, findWorkers } = require('./lib');

const app = express();
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const SEED_FILE = path.join(__dirname, 'data', 'workers.json');
const REG_FILE = path.join(__dirname, 'data', 'registered.json');

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

const seedWorkers = readJson(SEED_FILE, []);
let registered = readJson(REG_FILE, []);
const bookings = []; // in-memory for the demo; swap for a DB table later
const allWorkers = () => [...seedWorkers, ...registered];

const serviceIds = new Set(SERVICES.map((s) => s.id));
const num = (v) => (v === undefined || v === '' ? NaN : Number(v));
const isPhone = (p) => /^[6-9]\d{9}$/.test(String(p || ''));

function parseOrigin(q) {
  const lat = num(q.lat);
  const lng = num(q.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return null;
  }
  return { lat, lng };
}

app.get('/api/services', (_req, res) => res.json(SERVICES));

// GET /api/workers?service=plumber&lat=..&lng=..&radius=5&maxVisit=150&sort=price
app.get('/api/workers', (req, res) => {
  const origin = parseOrigin(req.query);
  if (!origin) return res.status(400).json({ error: 'lat and lng are required numbers' });
  const service = serviceIds.has(req.query.service) ? req.query.service : undefined;
  const radiusKm = Math.min(Math.max(num(req.query.radius) || 5, 0.5), 50);
  const maxVisit = num(req.query.maxVisit) || undefined;
  const sort = req.query.sort;
  res.json(findWorkers(allWorkers(), { service, origin, radiusKm, maxVisit, sort }));
});

// Worker self-onboarding
app.post('/api/workers', (req, res) => {
  const b = req.body || {};
  const lat = num(b.lat);
  const lng = num(b.lng);
  const visitCharge = num(b.visitCharge);
  const rates = Array.isArray(b.rates) ? b.rates.slice(0, 10) : [];

  const errors = [];
  if (!String(b.name || '').trim()) errors.push('name is required');
  if (!serviceIds.has(b.service)) errors.push('service is not valid');
  if (!isPhone(b.phone)) errors.push('phone must be a 10 digit Indian mobile number');
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) errors.push('location is required');
  if (!Number.isFinite(visitCharge) || visitCharge < 0 || visitCharge > 5000) {
    errors.push('visitCharge must be between 0 and 5000');
  }
  const cleanRates = rates
    .map((r) => ({ task: String(r.task || '').trim().slice(0, 60), price: num(r.price) }))
    .filter((r) => r.task && Number.isFinite(r.price) && r.price >= 0);
  if (cleanRates.length < 1) errors.push('add at least one rate (task and price)');
  if (errors.length) return res.status(400).json({ errors });

  const worker = {
    id: 'r' + Date.now().toString(36),
    name: String(b.name).trim().slice(0, 60),
    service: b.service,
    phone: String(b.phone),
    languages: Array.isArray(b.languages) ? b.languages.slice(0, 4).map(String) : ['en'],
    rating: 0,
    jobs: 0,
    years: Math.max(0, Math.min(60, num(b.years) || 0)),
    verified: false, // set to true only after ID check
    available: true,
    visitCharge,
    rates: cleanRates,
    lat,
    lng
  };
  registered.push(worker);
  fs.writeFileSync(REG_FILE, JSON.stringify(registered, null, 2));
  res.status(201).json({ id: worker.id });
});

app.post('/api/bookings', (req, res) => {
  const b = req.body || {};
  const worker = allWorkers().find((w) => w.id === b.workerId);
  if (!worker) return res.status(404).json({ error: 'worker not found' });
  if (!String(b.name || '').trim() || !isPhone(b.phone)) {
    return res.status(400).json({ error: 'name and a valid 10 digit phone are required' });
  }
  const booking = {
    id: 'b' + (bookings.length + 1),
    workerId: worker.id,
    name: String(b.name).trim().slice(0, 60),
    phone: String(b.phone),
    problem: String(b.problem || '').slice(0, 500),
    status: 'requested',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// Emergency: alert the nearest available workers for a service.
// Notification delivery is simulated; plug in FCM / WhatsApp Business API here.
app.post('/api/emergency', (req, res) => {
  const b = req.body || {};
  const origin = parseOrigin(b);
  if (!origin) return res.status(400).json({ error: 'lat and lng are required numbers' });
  if (!serviceIds.has(b.service)) return res.status(400).json({ error: 'service is not valid' });
  const nearby = findWorkers(allWorkers(), { service: b.service, origin, radiusKm: 10 })
    .filter((w) => w.available)
    .slice(0, 5);
  res.status(202).json({
    alerted: nearby.map((w) => ({ id: w.id, name: w.name, distanceKm: w.distanceKm, phone: w.phone })),
    message: nearby.length
      ? 'Nearest available workers have been alerted. The first to accept will call you.'
      : 'No available workers within 10 km right now.'
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`NearFix running on http://localhost:${PORT}`));
}
module.exports = app;
