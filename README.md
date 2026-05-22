# 🔗 LinkPulse — URL-Shortener mit Analytics

Professioneller URL-Shortener mit Klick-Tracking, QR-Codes und Analytics-Dashboard.

## Tech-Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 19, Vite 6, React Router |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Datenbank | PostgreSQL 16 |
| Cache | Redis 7 |
| Container | Docker + Docker Compose |

## Architektur

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   FastAPI   │────▶│  PostgreSQL │
│  (Port 5173)│     │  (Port 8000)│     │  (Port 5432)│
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │  (Port 6379)│
                    └─────────────┘
```

## Schnellstart

```bash
# 1. Umgebungsvariablen kopieren
cp .env.example .env

# 2. Alles starten
docker compose up --build

# 3. Services erreichen
Frontend:  http://localhost:5173
Backend:   http://localhost:8000/docs
```

## Features (geplant)

- [ ] Shortlinks erstellen
- [ ] Klick-Tracking (Geo, Device, Referrer)
- [ ] QR-Code-Generierung
- [ ] Analytics-Dashboard
- [ ] API-Rate-Limiting
