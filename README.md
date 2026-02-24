# 🔧 Mechanic Finder

A **location-based service platform** that connects vehicle owners with nearby mechanics in real-time. Mechanics can register, set their service area, and receive booking requests. Vehicle owners can discover available mechanics, make bookings, and track service history — all powered by a geospatially-aware backend.

---

## 📑 Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Module Overview](#module-overview)
- [Database Design](#database-design)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started (Local)](#getting-started-local)
- [Deployment (AWS)](#deployment-aws)
- [Key Design Decisions](#key-design-decisions)

---

## System Architecture

The backend follows a **Modular Monolith** pattern using NestJS, where each business domain (Auth, Bookings, Mechanics, etc.) is fully encapsulated in its own module. The database is MySQL, managed via TypeORM with `synchronize: false` for production safety.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Clients                                     │
│                 (Mobile App / Browser / API Consumer)               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP / WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NestJS Backend (Port 3000)                     │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐ │
│  │   Auth   │  │Mechanics │  │ Bookings │  │   Notifications     │ │
│  │  Module  │  │  Module  │  │  Module  │  │ Module (WebSockets)  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│
│  │  Users   │  │ Reviews  │  │ Service  │  │       Admin          ││
│  │  Module  │  │  Module  │  │  Types   │  │       Module         ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘│
│                                                                     │
│                    TypeORM (ORM Layer)                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │     MySQL Database      │
                  │   (Local / AWS RDS)    │
                  └────────────────────────┘
```

### AWS Deployment Architecture

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────┐
│                   AWS VPC (default)             │
│                                                 │
│  ┌──────────────────┐     ┌──────────────────┐  │
│  │   EC2 Instance   │────▶│   RDS Instance   │  │
│  │  (NestJS API)    │     │  (MySQL 8.x)     │  │
│  │  t2.micro / free │     │  db.t3.micro/free│  │
│  └──────────────────┘     └──────────────────┘  │
│           │                                     │
└───────────│─────────────────────────────────────┘
            │ Port 3000
         Internet
```

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | NestJS v11 |
| **Language** | TypeScript v5 |
| **Database** | MySQL 8.x |
| **ORM** | TypeORM v0.3 |
| **Authentication** | Passport.js + JWT (access + refresh tokens) |
| **Password Hashing** | Bcrypt |
| **Real-time** | Socket.io (WebSockets via `@nestjs/platform-socket.io`) |
| **Validation** | class-validator + class-transformer |
| **API Spec** | OpenAPI 3.1 (Swagger) |
| **Geospatial** | Haversine formula (SQL-level calculation) |
| **ID Strategy** | UUID v4 |
| **Process Manager** | PM2 (production) |

---

## Project Structure

```
mechanic-finder/
├── api-spec/
│   └── api.yaml              # OpenAPI 3.1 specification (contract-first)
├── backend/
│   ├── src/
│   │   ├── admin/            # Admin dashboard & statistics
│   │   ├── auth/             # JWT auth, login, register, refresh tokens
│   │   ├── bookings/         # Booking lifecycle management
│   │   ├── mechanics/        # Mechanic profiles, geospatial search
│   │   ├── notifications/    # Real-time notifications (WebSocket)
│   │   ├── reviews/          # Mechanic review system
│   │   ├── service-types/    # Service catalogue management
│   │   ├── subscriptions/    # Subscription plans & billing
│   │   ├── user/             # User profile management
│   │   ├── vehicles/         # Vehicle tracking & service history
│   │   ├── app.module.ts     # Root module (DI composition root)
│   │   └── main.ts           # Application entry point
│   ├── test/                 # e2e tests
│   ├── .env.example          # Environment variable template
│   └── package.json
├── database/
│   ├── database.sql          # Full schema with triggers, views, indexes
│   └── data.sql              # Seed data
└── docs/
    └── aws-integration-guide.md
```

---

## Module Overview

### `Auth`
- Registers users with role assignment (`user`, `mechanic`, `admin`)
- Issues **JWT access tokens** (short-lived) and **refresh tokens** (long-lived, stored in DB as `RefreshTokens`)
- Token revocation on logout via `revoked_at` timestamp
- Guards applied globally using `@UseGuards(JwtAuthGuard)`

### `Mechanics`
- Mechanics create/update a profile with certifications, experience years, and a configurable **service radius (km)**
- Location is kept up-to-date via `PUT /mechanics/location`
- **Geospatial Discovery** — `GET /mechanics` accepts `latitude`, `longitude`, and `radius` parameters. Distance is computed at the SQL layer using the **Haversine formula**:

  ```sql
  6371 * ACOS(
    LEAST(1,
      COS(RADIANS(:latitude)) * COS(RADIANS(mechanic.currentLatitude)) *
      COS(RADIANS(mechanic.currentLongitude - :longitude)) +
      SIN(RADIANS(:latitude)) * SIN(RADIANS(mechanic.currentLatitude))
    )
  )
  ```
  Results are filtered by `HAVING distance <= :radius` and ordered by proximity.

### `Bookings`
- Full lifecycle: `pending` → `accepted` → `completed` / `canceled`
- Role-based state machine — only **mechanics** can accept; only the **booking owner** or **mechanic** can cancel
- **ACID transactions**: booking + booking services are saved in a single `QueryRunner` transaction
- **Overlap detection**: prevents double-booking a mechanic in the same time window
- Real-time notifications fire on every status change

### `Notifications`
- Persisted in DB (`Notifications` table)
- Delivered via WebSocket (Socket.io) for real-time push
- Supports mark-as-read in bulk

### `Reviews`
- Users submit star ratings (0–5) and comments after a booking
- Soft-deleted (`deleted_at` column) to preserve data integrity
- Triggers update mechanic aggregate rating automatically

### `Admin`
- Admin-only endpoints for viewing all users, all mechanics, and system statistics
- Dashboard exposes: total users, mechanics, bookings, top mechanics, recent activity
- Booking stats: pending / accepted / completed / canceled counts + average rating

### `Subscriptions`
- Subscription plans with configurable duration, price, and mechanic revenue share
- `UserSubscriptions` links users to plans with auto-renew and **PayHere** payment gateway integration fields
- `MaintenanceSchedules` handles recurring service appointments tied to a user's vehicles

### `Vehicles`
- Stores vehicle make, model, year, VIN, mileage, and a JSON `service_history` log
- Linked to `MaintenanceSchedules` for subscription-driven servicing

---

## Database Design

The schema (in `database/database.sql`) is fully normalized with **20+ tables**.

### Core Tables

| Table | Purpose |
| :--- | :--- |
| `Users` | Base user records with role ENUM (`user`, `mechanic`, `admin`) |
| `RefreshTokens` | Persisted refresh tokens with `revoked_at` for secure logout |
| `Mechanics` | Mechanic profiles — location, availability, service radius |
| `ServiceTypes` | Service catalogue with base price and emergency surcharge |
| `MechanicServices` | Many-to-many junction — which mechanic offers which service |
| `Bookings` | Full booking records including estimated/actual cost & duration |
| `BookingServices` | Services requested within a single booking |
| `Reviews` | User ratings and comments, soft-deletable |
| `Notifications` | Persisted in-app notifications |
| `Vehicles` | User-owned vehicle records with service history |
| `UserSubscriptions` | Active subscription plans per user |
| `SubscriptionPlans` | Plan catalogue with pricing and revenue share config |
| `MaintenanceSchedules` | Recurring maintenance appointments |
| `Transactions` | Payment records per booking |
| `MechanicLocationHistory` | Historical location trail for mechanics |
| `EmergencyContacts` | User-defined emergency contacts |

### Advanced DB Features

**Audit Triggers** — every update to `Users`, `Mechanics`, `Bookings`, `Reviews`, and `UserSubscriptions` is automatically logged to dedicated audit tables (`UserAudit`, `MechanicAudit`, `BookingAudit`, `ReviewAudit`, `SubscriptionAudit`) capturing `old_data → new_data` as JSON:

```sql
CREATE TRIGGER after_booking_update
AFTER UPDATE ON Bookings FOR EACH ROW
BEGIN
  INSERT INTO BookingAudit (audit_id, booking_id, action, old_data, new_data)
  VALUES (UUID(), OLD.id, 'UPDATE',
    JSON_OBJECT('status', OLD.status),
    JSON_OBJECT('status', NEW.status));
END//
```

**Indexes** — targeted indexes on high-query columns:
```sql
INDEX idx_status (status)
INDEX idx_user_status (user_id, status)
INDEX idx_mechanic_status (mechanic_id, status)
INDEX idx_scheduled_time (scheduled_time)
INDEX idx_user_email ON Users(email)
```

**Views** — `AvailableMechanics` joins Mechanics + Users and filters for `availability = TRUE`.

**Statistics Tables** — `ServiceStatistics` and `AreaStatistics` track aggregate performance metrics per mechanic/region over time periods.

---

## API Reference

The full API contract is defined in [`api-spec/api.yaml`](./api-spec/api.yaml) (OpenAPI 3.1).

### Endpoints Summary

| Tag | Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| Auth | `POST` | `/auth/register` | — | Register a new user/mechanic |
| Auth | `POST` | `/auth/login` | — | Login and receive JWT tokens |
| Auth | `POST` | `/auth/refresh` | — | Refresh access token |
| Auth | `POST` | `/auth/logout` | Bearer | Invalidate session |
| Users | `GET` | `/users/me` | Bearer | Get own profile |
| Users | `PUT` | `/users/me` | Bearer | Update own profile |
| Mechanics | `GET` | `/mechanics` | — | List mechanics (optional geo-filter) |
| Mechanics | `GET` | `/mechanics/nearby` | — | Find nearby available mechanics |
| Mechanics | `GET/POST` | `/mechanics/profile` | Bearer | Get / create mechanic profile |
| Mechanics | `PUT` | `/mechanics/location` | Bearer | Update mechanic location & availability |
| Bookings | `POST` | `/bookings` | Bearer | Create a new booking |
| Bookings | `GET` | `/bookings` | Bearer | List your bookings (paginated, filterable) |
| Bookings | `GET` | `/bookings/:id` | Bearer | Get booking details |
| Bookings | `PUT` | `/bookings/:id` | Bearer | Update booking status |
| Reviews | `POST` | `/reviews` | Bearer | Submit a review |
| Reviews | `GET` | `/reviews/:mechanicId` | — | Get reviews for a mechanic |
| Notifications | `GET` | `/notifications` | Bearer | Get own notifications |
| Notifications | `POST` | `/notifications` | Bearer | Mark notifications as read |
| Admin | `GET` | `/admin/users` | Bearer (Admin) | List all users |
| Admin | `GET` | `/admin/mechanics` | Bearer (Admin) | List all mechanics |
| Admin | `GET` | `/admin/dashboard` | Bearer (Admin) | Dashboard statistics |
| Admin | `GET` | `/admin/booking-stats` | Bearer (Admin) | Booking statistics |

### Authentication

All protected routes use **Bearer JWT** authentication:
```http
Authorization: Bearer <access_token>
```

Tokens are obtained from `POST /auth/login` or `POST /auth/register`.

---

## Environment Variables

Copy `.env.example` to `.env` inside the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `JWT_SECRET` | Secret key for signing JWTs | `supersecretkey` |
| `DB_HOST` | MySQL host (localhost or RDS endpoint) | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | Database name | `mechanic_finder` |
| `PORT` | Server port (default: 3000) | `3000` |

---

## Getting Started (Local)

### Prerequisites
- Node.js ≥ 20 (LTS)
- MySQL 8.x running locally

### 1. Set up the database

```bash
# Run the full schema (creates DB, tables, triggers, views, indexes)
mysql -u root -p < database/database.sql

# (Optional) Load seed data
mysql -u root -p mechanic_finder < database/data.sql
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local MySQL credentials
```

### 3. Install dependencies & run

```bash
npm install

# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

### 4. Run tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Coverage report
npm run test:cov
```

---

## Deployment (AWS)

A full step-by-step AWS deployment guide is available at [`docs/aws-integration-guide.md`](./docs/aws-integration-guide.md).

### Summary

The production stack uses AWS **Free Tier** eligible services:

| Service | Role | Instance |
| :--- | :--- | :--- |
| **Amazon EC2** | Hosts the NestJS API | `t2.micro` (Ubuntu 24.04 LTS) |
| **Amazon RDS** | Managed MySQL database | `db.t3.micro` (MySQL 8.x) |

The EC2 and RDS instances are in the **same VPC**, communicating over a private security group rule (no public database exposure). The app is kept alive using **PM2** as a process manager with auto-restart on reboot.

**Quick deployment steps:**
1. Provision RDS instance (`mechfinder-db`) and note the endpoint.
2. Import schema: `mysql -h <RDS_ENDPOINT> -u admin -p mechanic_finder < database/database.sql`
3. Launch `t2.micro` EC2 instance (Ubuntu), SSH in, install Node.js via NVM.
4. Clone the repo, `npm install && npm run build`.
5. Create `.env` on EC2 with RDS credentials.
6. Start with PM2: `pm2 start dist/main.js --name mechfinder-api`

---

## Key Design Decisions

| Decision | Rationale |
| :--- | :--- |
| **Modular Monolith** | Clean domain boundaries without the operational overhead of microservices at this scale |
| **`synchronize: false` in TypeORM** | Prevents accidental schema destruction in production; schema is managed manually via SQL files |
| **UUID primary keys** | Globally unique IDs that don't leak sequential information, safe for distributed use |
| **Haversine at SQL layer** | Distance filtering inside the DB avoids fetching all mechanics into memory before filtering |
| **ACID transactions for bookings** | Multi-row insert (Bookings + BookingServices) must be atomic to prevent partial data |
| **JWT refresh token rotation** | Short-lived access tokens + DB-backed revocable refresh tokens for a secure, stateless-friendly auth flow |
| **Database-level audit triggers** | Guarantees audit records are written regardless of which application layer performs the update |
| **JSON columns for flexible data** | `certifications`, `working_hours`, `service_history`, `features` use JSON for schema flexibility without extra join tables |
