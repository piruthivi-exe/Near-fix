# NearFix

Find verified plumbers, electricians, painters and other home-service workers within a few streets of your home, see their prices **before** you call, and contact them immediately.

Built for a hackathon.

## The problem

When a pipe bursts or the power goes out, finding a trustworthy worker means asking neighbours, and the price is only revealed after the visit. Workers on big platforms lose 20-25% of each job to commission, which pushes prices up.

## What makes NearFix different

| Feature | Why it matters |
| --- | --- |
| **Rate card on every profile** | Visit charge and standard job prices (tap repair, fan install, painting per sq ft) are shown up front. No surprise bills. |
| **Price band** | Each visit charge is compared with the local median for that trade and marked below, near or above average. |
| **Emergency button** | One tap alerts the nearest available workers. The first to accept calls you. |
| **Low cost for workers** | Designed around a flat subscription instead of a per-job commission, so workers keep their earnings and can keep prices fair. |
| **Local languages** | UI in English, Tamil and Hindi. The structure is ready for more. |
| **Worker self-onboarding** | Workers list themselves in a minute from a phone, with a pending ID verification flag. |

## Quick start

Requires Node.js 18 or newer.

```bash
git clone https://github.com/<your-username>/nearfix.git
cd nearfix
npm install
npm start
```

Open http://localhost:3000, tap **Use my location**, and pick a trade.

```bash
npm test      # unit tests for distance, radius and price logic
```

### Demo data

The 12 seeded workers in `server/data/workers.json` are stored as offsets (km north/east) from the searcher, so the demo shows nearby results in **any** town. Workers who register through `/join.html` store real coordinates. All seed phone numbers are fake.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/services` | List of trades with English, Tamil and Hindi names |
| GET | `/api/workers?lat&lng&service&radius&maxVisit&sort` | Workers near a point. `sort` is `distance`, `price` or `rating` |
| POST | `/api/workers` | Register a worker (name, phone, service, lat, lng, visitCharge, rates) |
| POST | `/api/bookings` | Send a booking request to a worker |
| POST | `/api/emergency` | Alert the nearest available workers for a trade |

## Project structure

```
server/
  index.js        Express routes and validation
  lib.js          Distance, radius filter, price band (pure functions)
  lib.test.js     Unit tests (node:test)
  data/           Seed workers (registered.json is created at runtime)
public/
  index.html      Search page
  app.js          Client logic and English/Tamil/Hindi strings
  join.html       Worker sign-up
  styles.css
```

## Known limits

- Storage is JSON files and memory. Swap for PostgreSQL with PostGIS for real geo queries at scale.
- Emergency alerts and booking notifications are simulated. Plug in Firebase Cloud Messaging or the WhatsApp Business API in `server/index.js`.
- No login or OTP yet, and ID verification is a flag only. Phone OTP (Firebase Auth) is the next step.
- Tamil and Hindi strings should be reviewed by native speakers before launch.

## Roadmap

1. Phone OTP login for workers and customers
2. Photo and voice-note problem description, so workers can quote before visiting
3. Neighbour-verified reviews (only people from the same area can rate)
4. Worker subscription billing and warranty add-on
5. Flutter / React Native app on top of this API

## License

MIT
