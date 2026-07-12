# EN2H Booking Platform

Welcome to the **EN2H Booking Platform** — a premium, next-generation service scheduling and dashboard analytics system. The application is built using a modern **NestJS (backend)** + **Next.js 16/React 19 (frontend)** stack, running with a **PostgreSQL** database.

The frontend is styled using pure vanilla CSS tokens, featuring a minimalist Bento grid layout, custom responsive SVG analytics charts, and advanced interactive animations from React Bits (like `<TiltedCard />` and `<ElectricBorder />`).

---

## 🔑 Default Authentication Credentials (Mandatory)

The system is seeded with default accounts. Roles are dynamically resolved by checking the user's email domain suffix:
*   **Staff/Admin Role**: Automatically assigned to any email ending in `@en2h.com`. Grants full access to management features (Services CRUD, booking updates) and the interactive analytics dashboard.
*   **Customer Role**: Assigned to any other email domain (e.g., `@gmail.com`). Grants access to a personal booking tracker and appointment cancellation utilities.

Use the following credentials to test the local application:

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Staff (Admin)** | `admin@en2h.com` | `Password123!` | Full admin dashboard, Service management, Booking management & SVG Charts |
| **Customer** | `customer@gmail.com` | `Password123!` | Personal dashboard, Gated booking form, self-cancellations |

*Note: You can also register a new user using the registration page. Suffixing your email with `@en2h.com` will automatically create a Staff account.*

---

## 🚀 How to Run the Entire Project

To run this project locally, you will need **Node.js** (v18+ recommended) and **Docker** (for starting the PostgreSQL database).

### Step 1: Start the PostgreSQL Database

If you have Docker installed, you can launch a local PostgreSQL container by running:

```bash
docker run --name en2h-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=en2h_booking \
  -p 5432:5432 \
  -d postgres
```

Ensure no other local database service is occupying port `5432`.

---

### Step 2: Set Up & Run the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your environment configuration file:
   ```bash
   cp .env.example .env
   ```
   Ensure the DB credentials match your PostgreSQL instance (the default configuration points to `localhost:5432` with username/password `postgres`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run TypeORM database migrations and seed default sample data:
   ```bash
   npm run migration:run
   ```
5. Start the NestJS API server in development mode:
   ```bash
   npm run start:dev
   ```
   The backend API will start running on **`http://localhost:3000/api/v1`**.

---

### Step 3: Set Up & Run the Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_API_URL` is set to `http://localhost:3000/api/v1`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Next.js will detect port conflicts and run the development server on **`http://localhost:3001`**.

---

## 🛠️ Running Verifications & Tests

To check the code quality, formatting, types, and run tests, you can use the following commands:

### Backend Tests
*   Run unit tests: `npm run test`
*   Run E2E tests: `npm run test:e2e`
*   Run code linter: `npm run lint`

### Frontend Tests & Builds
*   Run linter checking: `npm run lint`
*   Run TypeScript compiler typecheck: `npm run typecheck`
*   Build optimized production bundle: `npm run build`

---

## 🌟 Visuals & Core Features

*   **Authentication Gated Booking Flow**: Guest users navigating to `/book` are intercepted and redirected to `/login?redirect=/book`. Once logged in, their name and email are pre-filled in read-only format, and they are redirected back seamlessly.
*   **Role-Based Gated Dashboards**: 
    *   **Staff** accounts see an Overview dashboard featuring interactive SVG Donut charts (grouping bookings by status) and Bar charts (grouping service bookings frequency) with interactive hover segments.
    *   **Customers** see a list of their bookings, booking counts, cancellation actions, and quick links.
*   **3D Tilted Card Preview**: Hovering over the main landing page booking card triggers spring-damped 3D tilt adjustments and glowing glassmorphic overlays.
*   **Interactive Glowing Borders**: The preview card utilizes an `<ElectricBorder />` canvas component that draws customizable neon path outlines.
