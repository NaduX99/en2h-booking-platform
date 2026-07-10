# EN2H Booking Platform API

A production-style REST API built with NestJS, TypeScript, PostgreSQL, and TypeORM for managing services and customer bookings.

This project was developed for the EN2H Software Engineer Intern technical assessment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Booking Status Flow](#booking-status-flow)
- [Business Rules](#business-rules)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [API Base URL](#api-base-url)
- [API Endpoints](#api-endpoints)
- [Postman Setup](#postman-setup)
- [Rate Limiting](#rate-limiting)
- [Validation and Error Handling](#validation-and-error-handling)
- [Health Check](#health-check)
- [Testing](#testing)
- [Build and Production Run](#build-and-production-run)
- [Security Considerations](#security-considerations)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)
- [Git Commit Conventions](#git-commit-conventions)

---

## Project Overview

The EN2H Booking Platform API allows authenticated users to manage services and customer bookings.

Customers can create bookings without authentication. Authenticated users can manage services, view bookings, update booking statuses, and cancel bookings.

The backend focuses on:

- Clean NestJS architecture
- Maintainable module separation
- JWT authentication
- PostgreSQL relational database design
- TypeORM migrations
- DTO validation
- Global exception handling
- Booking business-rule enforcement
- API rate limiting
- Refresh-token rotation
- Postman-based API testing

---

## Main Features

### Authentication

- User registration
- User login
- JWT access token
- Refresh token
- Refresh-token rotation
- Logout
- Refresh-token invalidation
- Protected profile endpoint
- Password hashing with bcrypt
- Login rate limiting
- Registration rate limiting

### Service Management

Authenticated users can:

- Create services
- View all services
- View a service by ID
- Update services
- Delete services
- Search services
- Filter services by active status
- Use pagination

### Booking Management

Customers can:

- Create bookings without authentication

Authenticated users can:

- View all bookings
- View a booking by ID
- Search bookings
- Filter bookings by status
- Filter bookings by service
- Use pagination
- Update booking status
- Cancel bookings

### Booking Business Rules

- A booking must belong to an existing service
- The service must be active
- Booking date and time must be in the future
- Duplicate bookings for the same service, date, and time are not allowed
- Cancelled bookings cannot be completed
- Completed bookings cannot be cancelled
- Invalid booking-status transitions are rejected

### Other Features

- PostgreSQL database
- TypeORM migrations
- Global DTO validation
- Global exception handling
- Consistent API responses
- UUID identifiers
- Database health check
- Secure HTTP headers using Helmet
- CORS support
- Global and route-specific rate limiting
- Postman collection support

---

## Technology Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT and Passport
- **Password Hashing:** bcrypt
- **Validation:** class-validator and class-transformer
- **Security:** Helmet and NestJS Throttler
- **API Testing:** Postman
- **Unit Testing:** Jest
- **Runtime:** Node.js
- **Package Manager:** npm

---

## Project Structure

```text
backend/
├── docs/
│   └── EN2H-Booking-Platform.postman_collection.json
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── logout.dto.ts
│   │   │   ├── refresh-token.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interfaces/
│   │   │   └── jwt-payload.interface.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── bookings/
│   │   ├── dto/
│   │   │   ├── booking-query.dto.ts
│   │   │   ├── create-booking.dto.ts
│   │   │   └── update-booking-status.dto.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts
│   │   ├── enums/
│   │   │   └── booking-status.enum.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.module.ts
│   │   └── bookings.service.ts
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interfaces/
│   │       └── error-response.interface.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── InitialSchema.ts
│   │   │   └── AddRefreshTokenHash.ts
│   │   └── data-source.ts
│   ├── services/
│   │   ├── dto/
│   │   │   ├── create-service.dto.ts
│   │   │   ├── service-query.dto.ts
│   │   │   └── update-service.dto.ts
│   │   ├── entities/
│   │   │   └── service.entity.ts
│   │   ├── services.controller.ts
│   │   ├── services.module.ts
│   │   └── services.service.ts
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```

---

## System Architecture

The application follows a modular NestJS architecture.

```text
Client / Postman
      |
      v
Controller Layer
      |
      v
Service Layer
      |
      v
TypeORM Repository
      |
      v
PostgreSQL Database
```

### Main Modules

- `AuthModule` handles registration, login, refresh tokens, logout, and JWT validation
- `UsersModule` handles user database operations
- `ServicesModule` handles service CRUD, pagination, search, and filtering
- `BookingsModule` handles booking creation, status updates, cancellation, search, and pagination
- `Common` contains reusable filters and response interfaces
- `Database` contains the TypeORM data source and migrations

---

## Database Design

### Users Table

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(100) | User name |
| email | VARCHAR(150) | Unique email |
| password_hash | VARCHAR | Hashed password |
| refresh_token_hash | VARCHAR, nullable | Hashed refresh token |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### Services Table

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | VARCHAR(150) | Service title |
| description | TEXT | Service description |
| duration_minutes | INTEGER | Service duration |
| price | NUMERIC(10,2) | Service price |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### Bookings Table

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| customer_name | VARCHAR(100) | Customer name |
| customer_email | VARCHAR(150) | Customer email |
| customer_phone | VARCHAR(30) | Customer phone |
| service_id | UUID | Foreign key to services |
| booking_date | DATE | Booking date |
| booking_time | TIME | Booking time |
| status | ENUM | Booking status |
| notes | TEXT, nullable | Optional notes |
| cancelled_at | TIMESTAMP WITH TIME ZONE, nullable | Cancellation time |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### Relationship

```text
Service 1 ---- many Bookings
```

### Important Constraints

- User email is unique
- Booking service ID references the services table
- Duplicate bookings for the same service, date, and time are prevented
- Booking status uses a PostgreSQL enum

---

## Authentication Flow

### Registration

```text
Client
  |
  v
POST /auth/register
  |
  v
Validate DTO
  |
  v
Check duplicate email
  |
  v
Hash password
  |
  v
Save user
```

### Login

```text
Client
  |
  v
POST /auth/login
  |
  v
Verify email and password
  |
  v
Generate access token
  |
  v
Generate refresh token
  |
  v
Hash and store refresh token
  |
  v
Return tokens and user details
```

### Refresh Token

```text
Client
  |
  v
POST /auth/refresh
  |
  v
Verify refresh token
  |
  v
Compare token with stored hash
  |
  v
Generate new access and refresh tokens
  |
  v
Replace stored refresh-token hash
```

### Logout

```text
Client
  |
  v
POST /auth/logout
  |
  v
Validate refresh token
  |
  v
Remove stored refresh-token hash
```

---

## Booking Status Flow

Supported statuses:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

Allowed transitions:

```text
PENDING -> CONFIRMED
PENDING -> CANCELLED
CONFIRMED -> COMPLETED
CONFIRMED -> CANCELLED
```

Blocked transitions:

```text
CANCELLED -> COMPLETED
CANCELLED -> CONFIRMED
COMPLETED -> CANCELLED
COMPLETED -> CONFIRMED
```

---

## Business Rules

1. A booking must reference an existing service.
2. A booking can only be created for an active service.
3. Booking date and time must be in the future.
4. A service cannot have multiple bookings at the same date and time.
5. New bookings start with `PENDING` status.
6. Cancelled bookings cannot be completed.
7. Completed bookings cannot be cancelled.
8. Only authenticated users can manage services.
9. Customers can create bookings without authentication.
10. Booking-management endpoints require authentication.
11. Passwords are stored only as bcrypt hashes.
12. Refresh tokens are stored only as bcrypt hashes.

---

## Installation

### Prerequisites

Install:

- Node.js 20 or later
- npm
- PostgreSQL 15 or later
- pgAdmin 4
- Postman
- Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd en2h-booking-platform/backend
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the backend root.

Copy from `.env.example`:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Windows Command Prompt

```bat
copy .env.example .env
```

### Linux or macOS

```bash
cp .env.example .env
```

Example `.env`:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_postgresql_password
DATABASE_NAME=en2h_booking

JWT_ACCESS_SECRET=your_long_access_token_secret
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_different_long_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
```

Generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice and use different values for the access-token secret and refresh-token secret.

Never commit the real `.env` file.

---

## Database Setup

Open pgAdmin or PostgreSQL Query Tool.

Create the database:

```sql
CREATE DATABASE en2h_booking;
```

Do not manually create tables. Tables are created by TypeORM migrations.

---

## Database Migrations

The project uses migrations instead of `synchronize: true`.

Make sure the application configuration contains:

```typescript
synchronize: false
```

### Generate a Migration

```bash
npm run typeorm -- migration:generate src/database/migrations/MigrationName -d src/database/data-source.ts
```

Example:

```bash
npm run typeorm -- migration:generate src/database/migrations/AddRefreshTokenHash -d src/database/data-source.ts
```

### Run Pending Migrations

```bash
npm run migration:run
```

### Show Migration Status

```bash
npm run migration:show
```

Example result:

```text
[X] InitialSchema
[X] AddRefreshTokenHash
```

### Revert Latest Migration

```bash
npm run migration:revert
```

---

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Standard Mode

```bash
npm run start
```

### Debug Mode

```bash
npm run start:debug
```

Default server:

```text
http://localhost:3000
```

---

## API Base URL

```text
http://localhost:3000/api/v1
```

---

## API Endpoints

## Health

### Get API Information

```http
GET /api/v1
```

### Check API and Database Health

```http
GET /api/v1/health
```

Example response:

```json
{
  "success": true,
  "status": "ok",
  "api": "running",
  "database": "connected",
  "timestamp": "2026-07-10T18:30:00.000Z"
}
```

---

## Authentication

### Register

```http
POST /api/v1/auth/register
```

Body:

```json
{
  "name": "Nadul Laknidu",
  "email": "nadul@example.com",
  "password": "Password123!"
}
```

### Login

```http
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "nadul@example.com",
  "password": "Password123!"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "access-token",
    "refreshToken": "refresh-token",
    "tokenType": "Bearer",
    "accessTokenExpiresIn": "15m",
    "refreshTokenExpiresIn": "7d",
    "user": {
      "id": "uuid",
      "name": "Nadul Laknidu",
      "email": "nadul@example.com"
    }
  }
}
```

### Refresh Tokens

```http
POST /api/v1/auth/refresh
```

Body:

```json
{
  "refreshToken": "refresh-token"
}
```

### Logout

```http
POST /api/v1/auth/logout
```

Body:

```json
{
  "refreshToken": "refresh-token"
}
```

### Get Authenticated Profile

```http
GET /api/v1/auth/profile
```

Header:

```http
Authorization: Bearer <access-token>
```

---

## Services

All service-management endpoints require authentication.

### Create Service

```http
POST /api/v1/services
```

Body:

```json
{
  "title": "Software Consultation",
  "description": "One-hour software consultation service",
  "duration": 60,
  "price": 5000,
  "isActive": true
}
```

### Get All Services

```http
GET /api/v1/services
```

Supported query parameters:

```text
page
limit
search
isActive
```

Example:

```http
GET /api/v1/services?page=1&limit=10&search=software&isActive=true
```

### Get Service by ID

```http
GET /api/v1/services/:id
```

### Update Service

```http
PATCH /api/v1/services/:id
```

Body:

```json
{
  "price": 6000,
  "duration": 90,
  "isActive": true
}
```

### Delete Service

```http
DELETE /api/v1/services/:id
```

---

## Bookings

### Create Booking

Public endpoint.

```http
POST /api/v1/bookings
```

Body:

```json
{
  "customerName": "Kasun Perera",
  "customerEmail": "kasun@example.com",
  "customerPhone": "0771234567",
  "serviceId": "service-uuid",
  "bookingDate": "2026-07-25",
  "bookingTime": "14:30",
  "notes": "Initial consultation"
}
```

### Get All Bookings

Requires authentication.

```http
GET /api/v1/bookings
```

Supported query parameters:

```text
page
limit
search
status
serviceId
```

Example:

```http
GET /api/v1/bookings?page=1&limit=10&status=PENDING&search=kasun
```

### Get Booking by ID

```http
GET /api/v1/bookings/:id
```

### Update Booking Status

```http
PATCH /api/v1/bookings/:id/status
```

Body:

```json
{
  "status": "CONFIRMED"
}
```

Valid values:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

### Cancel Booking

```http
PATCH /api/v1/bookings/:id/cancel
```

No request body is required.

---

## Pagination Response

Example:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Postman Setup

Import:

```text
docs/EN2H-Booking-Platform.postman_collection.json
```

Recommended collection variables:

```text
baseUrl = http://localhost:3000/api/v1
accessToken =
refreshToken =
serviceId =
bookingId =
```

For protected endpoints:

```text
Authorization Type: Bearer Token
Token: {{accessToken}}
```

The login request should automatically save:

```text
accessToken
refreshToken
```

The create-service request should automatically save:

```text
serviceId
```

The create-booking request should automatically save:

```text
bookingId
```

---

## Rate Limiting

The project uses `@nestjs/throttler`.

Recommended limits:

| Endpoint | Limit | Time Window | Block Duration |
|---|---:|---:|---:|
| General API | 100 requests | 1 minute | 1 minute |
| Login | 5 requests | 1 minute | 5 minutes |
| Register | 3 requests | 1 minute | 10 minutes |
| Refresh token | 10 requests | 1 minute | 2 minutes |
| Public booking creation | 10 requests | 1 minute | 2 minutes |
| Service creation | 20 requests | 1 minute | Default |
| Health endpoint | Unlimited | — | — |

When the limit is exceeded, the API returns:

```http
429 Too Many Requests
```

Example:

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Too Many Requests",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "timestamp": "2026-07-10T18:30:00.000Z"
}
```

---

## Validation and Error Handling

The application uses a global `ValidationPipe` with:

```typescript
whitelist: true
forbidNonWhitelisted: true
transform: true
```

This provides:

- Automatic DTO validation
- Removal or rejection of unknown properties
- Query-parameter transformation
- Consistent validation errors

Example validation error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request",
  "path": "/api/v1/auth/register",
  "method": "POST",
  "timestamp": "2026-07-10T18:30:00.000Z"
}
```

Example not-found error:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Service not found",
  "error": "Not Found",
  "path": "/api/v1/services/service-id",
  "method": "GET",
  "timestamp": "2026-07-10T18:30:00.000Z"
}
```

---

## Health Check

```http
GET /api/v1/health
```

The endpoint checks:

- NestJS API availability
- PostgreSQL database connectivity

Healthy response:

```json
{
  "success": true,
  "status": "ok",
  "api": "running",
  "database": "connected",
  "timestamp": "2026-07-10T18:30:00.000Z"
}
```

Database failure response:

```http
503 Service Unavailable
```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

### Watch Tests

```bash
npm run test:watch
```

### Generate Coverage

```bash
npm run test:cov
```

### Run End-to-End Tests

```bash
npm run test:e2e
```

Recommended test cases:

### Authentication

- Register valid user
- Reject duplicate email
- Login successfully
- Reject invalid password
- Refresh valid tokens
- Reject invalid refresh token
- Logout successfully

### Services

- Create service with authentication
- Reject service creation without authentication
- Get all services
- Update service
- Delete service
- Reject invalid UUID

### Bookings

- Create booking without authentication
- Reject nonexistent service
- Reject inactive service
- Reject past booking date
- Reject duplicate booking
- Confirm pending booking
- Complete confirmed booking
- Cancel pending booking
- Reject cancelled-to-completed transition
- Reject completed-to-cancelled transition

---

## Build and Production Run

### Build

```bash
npm run build
```

### Production Start

```bash
npm run start:prod
```

The production command runs:

```text
dist/main
```

Before running in production:

- Set production environment variables
- Run migrations
- Use secure JWT secrets
- Configure allowed CORS origins
- Use HTTPS
- Use a production PostgreSQL database

---

## Security Considerations

Implemented:

- Password hashing using bcrypt
- JWT access tokens
- Refresh-token rotation
- Hashed refresh-token storage
- Refresh-token invalidation on logout
- Token-type validation
- Authentication guards
- Global and route-specific rate limiting
- Helmet security headers
- DTO validation
- Unknown-property rejection
- Database constraints
- Unique email constraint
- Duplicate booking constraint
- Protected service-management endpoints
- Protected booking-management endpoints
- Hidden refresh-token hash
- Environment-based secrets

Recommended for future production use:

- Store refresh tokens in secure HTTP-only cookies
- Configure strict CORS origins
- Add Redis-backed distributed rate limiting
- Add audit logs
- Add account lockout policies
- Add email verification
- Add password-reset functionality
- Add structured logging
- Add monitoring and alerting
- Add automated security scanning

---

## Assumptions

1. Only registered internal users manage services.
2. Customers do not require accounts to create bookings.
3. Booking management requires authentication.
4. Services must be active before customers can book them.
5. Booking cancellation updates the status instead of deleting the booking.
6. Cancelled and completed bookings are final states.
7. A service can have only one booking at a particular date and time.
8. Date and time values are validated using the server environment.
9. Prices use PostgreSQL numeric values with two decimal places.
10. The built-in throttler storage is sufficient for the single-instance assessment project.
11. Refresh tokens are sent in the request body for easy Postman testing.
12. A production browser application should use secure HTTP-only cookies for refresh tokens.

---

## Future Improvements

- Role-based access control
- Admin and staff roles
- Email verification
- Forgot-password flow
- Password-reset flow
- Customer accounts
- Booking rescheduling
- Booking reminders
- Email notifications
- SMS notifications
- Availability schedules
- Service working hours
- Staff assignment
- Payment integration
- Audit logs
- Soft deletion
- Docker support
- CI/CD pipeline
- Redis-backed rate limiting
- Structured logging
- OpenAPI or Swagger documentation
- Cloud deployment
- Frontend application

---

## Git Commit Conventions

Examples:

```bash
git commit -m "chore: initialize NestJS backend"
git commit -m "feat: implement JWT authentication"
git commit -m "feat: add refresh token rotation and logout"
git commit -m "feat: implement service management"
git commit -m "feat: implement booking management"
git commit -m "feat: add pagination and filtering"
git commit -m "feat: add API rate limiting"
git commit -m "feat: add global exception handling"
git commit -m "feat: add TypeORM migrations"
git commit -m "test: add authentication and booking tests"
git commit -m "docs: add Postman collection and README"
```

---

## Submission Checklist

Before submission, verify:

- [ ] All required endpoints work
- [ ] PostgreSQL connection works
- [ ] `synchronize` is set to `false`
- [ ] Migration files exist
- [ ] `npm run migration:run` works
- [ ] Register and login work
- [ ] Access token works
- [ ] Refresh token works
- [ ] Logout invalidates refresh token
- [ ] Service CRUD works
- [ ] Booking creation works without authentication
- [ ] Booking management requires authentication
- [ ] Duplicate bookings are rejected
- [ ] Past bookings are rejected
- [ ] Invalid status transitions are rejected
- [ ] Pagination and filters work
- [ ] Rate limiting works
- [ ] Global error handling works
- [ ] `.env` is ignored
- [ ] `.env.example` exists
- [ ] Postman collection is exported
- [ ] README instructions work on a fresh clone
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] No secrets are committed
- [ ] No `node_modules` folder is committed

---

## License

This project was created for the EN2H Software Engineer Intern technical assessment.