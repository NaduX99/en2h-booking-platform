# EN2H Booking Platform — Complete Testing README

This document defines the complete test scope for the EN2H Booking Platform, including the NestJS backend, PostgreSQL database, Docker environment, Next.js frontend, AETHER 9 design, React Bits effects, authentication flow, service management, booking management, and critical end-to-end workflows.

> **Execution status:** This is a generated test catalogue and execution guide. The test cases are marked **⬜ Not Run** until they are implemented and executed. Do not report them as passed before collecting real results.

---

## 1. Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Passed |
| ❌ | Failed |
| ⚠️ | Blocked |
| ⬜ | Not Run |

---

## 2. Current Access Model

The platform uses a role-resolution mechanism based on the user's email domain:

| Actor | Meaning |
|---|---|
| Guest (Unauthenticated) | Can browse the homepage and services, but cannot create bookings or access any dashboards. |
| Customer (Logged-in Customer) | Authenticated users with email addresses NOT ending in `@en2h.com`. Can only view their own bookings, request cancellations, pre-fill booking forms, and access a tailored Customer dashboard. |
| Staff (Admin/Staff) | Authenticated users with email addresses ending in `@en2h.com`. Have administrative rights, access to the full dashboard overview with analytics charts, service CRUD management, and all bookings. |

All booking creation and dashboard endpoints are fully protected and require JWT authentication.


---

## 3. Test Catalogue Summary

**Total planned test cases: 211**

| Test area | Number of test cases |
|---|---:|
| Backend | 113 |
| Frontend | 78 |
| Cross-system | 10 |
| Non-functional | 10 |
| **Total** | **211** |

### Priority summary

| Priority | Meaning | Count |
|---|---|---:|
| P0 | Critical workflow, security, or data-integrity test | 122 |
| P1 | Important functional or quality test | 87 |
| P2 | Lower-risk usability or metadata test | 2 |

---

## 4. Function-to-Test-Case Coverage Matrix

| Area | Function or module | Route / component | Test IDs | Count |
|---|---|---|---|---:|
| Backend | Application health and startup | `GET /api/v1 and GET /api/v1/health` | `BE-HLT-001 – BE-HLT-004` | 4 |
| Backend | User registration | `POST /api/v1/auth/register` | `BE-REG-001 – BE-REG-007` | 7 |
| Backend | User login | `POST /api/v1/auth/login` | `BE-LGN-001 – BE-LGN-007` | 7 |
| Backend | Authenticated profile | `GET /api/v1/auth/profile` | `BE-PRF-001 – BE-PRF-004` | 4 |
| Backend | Refresh-token rotation | `POST /api/v1/auth/refresh` | `BE-RFR-001 – BE-RFR-006` | 6 |
| Backend | Logout | `POST /api/v1/auth/logout` | `BE-LGO-001 – BE-LGO-004` | 4 |
| Backend | Public active services | `GET /api/v1/services/public/active` | `BE-PSV-001 – BE-PSV-005` | 5 |
| Backend | Service listing, search, filter, and pagination | `GET /api/v1/services` | `BE-SVL-001 – BE-SVL-006` | 6 |
| Backend | Service creation | `POST /api/v1/services` | `BE-SVC-001 – BE-SVC-007` | 7 |
| Backend | Get service by ID | `GET /api/v1/services/:id` | `BE-SVD-001 – BE-SVD-004` | 4 |
| Backend | Service update | `PATCH /api/v1/services/:id` | `BE-SVU-001 – BE-SVU-006` | 6 |
| Backend | Service deletion | `DELETE /api/v1/services/:id` | `BE-SVX-001 – BE-SVX-005` | 5 |
| Backend | Public booking creation | `POST /api/v1/bookings` | `BE-BKC-001 – BE-BKC-012` | 12 |
| Backend | Booking listing, search, filters, and pagination | `GET /api/v1/bookings` | `BE-BKL-001 – BE-BKL-006` | 6 |
| Backend | Get booking by ID | `GET /api/v1/bookings/:id` | `BE-BKD-001 – BE-BKD-004` | 4 |
| Backend | Booking status update | `PATCH /api/v1/bookings/:id/status` | `BE-BKS-001 – BE-BKS-007` | 7 |
| Backend | Booking cancellation | `PATCH /api/v1/bookings/:id/cancel` | `BE-BKX-001 – BE-BKX-006` | 6 |
| Backend | Global validation and error handling | `All API routes` | `BE-ERR-001 – BE-ERR-005` | 5 |
| Backend | Security headers, CORS, and throttling | `Application-wide` | `BE-SEC-001 – BE-SEC-004` | 4 |
| Backend | Database migrations, constraints, and seed data | `PostgreSQL / TypeORM` | `BE-DB-001 – BE-DB-002` | 2 |
| Backend | Docker Compose deployment | `docker compose` | `BE-DKR-001 – BE-DKR-002` | 2 |
| Frontend | Landing page | `/` | `FE-LND-001 – FE-LND-008` | 8 |
| Frontend | Navigation and footer | `Public layout` | `FE-NAV-001 – FE-NAV-006` | 6 |
| Frontend | Public services page | `/services` | `FE-PSV-001 – FE-PSV-006` | 6 |
| Frontend | Public booking form | `/book` | `FE-BKF-001 – FE-BKF-010` | 10 |
| Frontend | Login page | `/login` | `FE-LGN-001 – FE-LGN-005` | 5 |
| Frontend | Registration page | `/register` | `FE-REG-001 – FE-REG-005` | 5 |
| Frontend | Authentication session and route protection | `AuthProvider, AuthGate, GuestGate` | `FE-SES-001 – FE-SES-007` | 7 |
| Frontend | Dashboard overview | `/dashboard` | `FE-DSH-001 – FE-DSH-006` | 6 |
| Frontend | Service management UI | `/dashboard/services` | `FE-SVM-001 – FE-SVM-008` | 8 |
| Frontend | Booking management and details UI | `/dashboard/bookings and /dashboard/bookings/[id]` | `FE-BKM-001 – FE-BKM-010` | 10 |
| Frontend | AETHER design and React Bits effects | `All frontend pages` | `FE-AET-001 – FE-AET-004` | 4 |
| Frontend | Responsive and basic accessibility behavior | `All frontend pages` | `FE-RSP-001 – FE-RSP-003` | 3 |
| Cross-system | Critical user and staff workflows | `Frontend + Backend + PostgreSQL` | `E2E-001 – E2E-010` | 10 |
| Non-functional | Quality, security, performance, and compatibility | `Full system` | `NF-001 – NF-010` | 10 |

---

## 5. Recommended Test Project Structure

```text
en2h-booking-platform/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── auth.service.spec.ts
│   │   ├── services/
│   │   │   └── services.service.spec.ts
│   │   └── bookings/
│   │       └── bookings.service.spec.ts
│   ├── test/
│   │   ├── auth.e2e-spec.ts
│   │   ├── services.e2e-spec.ts
│   │   ├── bookings.e2e-spec.ts
│   │   ├── health.e2e-spec.ts
│   │   └── jest-e2e.json
│   └── docs/
│       ├── EN2H-Booking-Platform.postman_collection.json
│       └── EN2H-Booking-Platform.postman_environment.json
├── frontend/
│   ├── src/
│   │   └── **/*.test.tsx
│   ├── tests/
│   │   ├── unit/
│   │   ├── components/
│   │   └── integration/
│   └── e2e/
│       ├── auth.spec.ts
│       ├── public-booking.spec.ts
│       ├── services.spec.ts
│       └── booking-management.spec.ts
└── docs/
    └── testing/
        └── README.md
```

---

## 6. Test Tools

| Layer | Recommended tools |
|---|---|
| Backend unit tests | Jest and Nest testing utilities |
| Backend API integration | Jest and Supertest |
| Manual/API regression | Postman |
| Command-line Postman runs | Newman |
| Frontend unit/component | Vitest and React Testing Library |
| End-to-end | Playwright |
| Accessibility | axe-core and Playwright accessibility checks |
| Performance | Lighthouse and an agreed API load tool such as k6 |
| Database verification | TypeORM CLI and `psql` |
| Infrastructure | Docker Compose |

---

## 7. Test Environment

| Component | Development test value |
|---|---|
| Backend | `http://localhost:3000/api/v1` |
| Frontend | `http://localhost:3001` |
| Database | PostgreSQL in Docker |
| Public active services | `GET /services/public/active` |
| Browser set | Chromium, Firefox, WebKit |

### Test-only account

Use only in the local test environment:

```text
Email: admin@en2h.com
Password: Password123!
```

Never reuse this password in production.

---

## 8. Entry Criteria

- Backend dependencies are installed.
- Frontend dependencies are installed.
- PostgreSQL is running.
- All TypeORM migrations are applied.
- Test sample data is available.
- Backend environment variables are configured.
- Frontend `NEXT_PUBLIC_API_URL` points to the running backend.
- The backend allows the frontend CORS origin.
- No other application is using ports 3000 or 3001.

---

## 9. Exit Criteria

- ✅ All P0 tests pass.
- ✅ At least 95% of P1 tests pass.
- ✅ No unresolved critical or high-severity security defect remains.
- ✅ No data-integrity defect remains.
- ✅ Registration, login, refresh, logout, public booking, service CRUD, and booking status workflows pass end to end.
- ✅ Backend lint, tests, and production build pass.
- ✅ Frontend lint, type check, tests, and production build pass.
- ✅ No critical accessibility violation remains.
- ✅ Docker startup and restart tests pass.

---

## 10. Standard Test Case Record

When executing a case, record:

| Field | Description |
|---|---|
| Test Case ID | Unique ID from this catalogue |
| Requirement ID | Related requirement |
| Preconditions | Required user, service, booking, token, or environment state |
| Test Data | Exact request body or UI values used |
| Steps | Ordered execution actions |
| Expected Result | Result defined in this README |
| Actual Result | Observed result |
| Status | ✅, ❌, ⚠️, or ⬜ |
| Evidence | Screenshot, API response, test log, or database query |
| Severity | Impact if the case fails |
| Remarks | Additional notes |

---

## 11. Complete Test Case Inventory

### Backend test cases

#### Application health and startup

Route/component: `GET /api/v1 and GET /api/v1/health`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-HLT-001` | `REQ-HEALTH` | Return API information from the root endpoint | API / Integration | Jest + Supertest | The endpoint returns 200 with the expected application information. | P1 | ⬜ Not Run |
| `BE-HLT-002` | `REQ-HEALTH` | Return healthy API and database status | API / Integration | Jest + Supertest | The health endpoint returns 200 and reports the API and database as available. | P0 | ⬜ Not Run |
| `BE-HLT-003` | `REQ-HEALTH` | Handle unavailable database during health check | API / Integration | Jest + Supertest | The health endpoint reports database failure using the project's documented error response. | P0 | ⬜ Not Run |
| `BE-HLT-004` | `REQ-HEALTH` | Validate health response schema and timestamp | API / Integration | Jest + Supertest | The response contains the required fields with valid data types and an ISO timestamp. | P1 | ⬜ Not Run |
#### User registration

Route/component: `POST /api/v1/auth/register`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-REG-001` | `REQ-AUTH-REGISTER` | Register a user with valid name, email, and password | API / Unit / Integration | Jest + Supertest | A new user is created and the API returns the documented success response. | P0 | ⬜ Not Run |
| `BE-REG-002` | `REQ-AUTH-REGISTER` | Store the password as a bcrypt hash | API / Unit / Integration | Jest + Supertest | The database does not contain the submitted plain-text password and the hash validates correctly. | P0 | ⬜ Not Run |
| `BE-REG-003` | `REQ-AUTH-REGISTER` | Reject a duplicate email address | API / Unit / Integration | Jest + Supertest | The API returns 409 and does not create a second user. | P0 | ⬜ Not Run |
| `BE-REG-004` | `REQ-AUTH-REGISTER` | Reject an invalid email format | API / Unit / Integration | Jest + Supertest | The API returns 400 with a field-level validation message. | P1 | ⬜ Not Run |
| `BE-REG-005` | `REQ-AUTH-REGISTER` | Reject a password that does not meet DTO rules | API / Unit / Integration | Jest + Supertest | The API returns 400 and no user is created. | P1 | ⬜ Not Run |
| `BE-REG-006` | `REQ-AUTH-REGISTER` | Reject missing required registration fields | API / Unit / Integration | Jest + Supertest | The API returns 400 and identifies all missing required fields. | P1 | ⬜ Not Run |
| `BE-REG-007` | `REQ-AUTH-REGISTER` | Apply the registration rate limit | API / Unit / Integration | Jest + Supertest | Requests above the configured threshold return 429 without creating additional users. | P1 | ⬜ Not Run |
#### User login

Route/component: `POST /api/v1/auth/login`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-LGN-001` | `REQ-AUTH-LOGIN` | Login with correct email and password | API / Unit / Integration | Jest + Supertest | The API returns 200 with access token, refresh token, token metadata, and user details. | P0 | ⬜ Not Run |
| `BE-LGN-002` | `REQ-AUTH-LOGIN` | Reject login with an unknown email | API / Unit / Integration | Jest + Supertest | The API returns 401 without revealing whether the account exists. | P0 | ⬜ Not Run |
| `BE-LGN-003` | `REQ-AUTH-LOGIN` | Reject login with an incorrect password | API / Unit / Integration | Jest + Supertest | The API returns 401 and no tokens are issued. | P0 | ⬜ Not Run |
| `BE-LGN-004` | `REQ-AUTH-LOGIN` | Reject login with an invalid email format | API / Unit / Integration | Jest + Supertest | The API returns 400 with validation feedback. | P1 | ⬜ Not Run |
| `BE-LGN-005` | `REQ-AUTH-LOGIN` | Reject login with missing credentials | API / Unit / Integration | Jest + Supertest | The API returns 400 and identifies the missing fields. | P1 | ⬜ Not Run |
| `BE-LGN-006` | `REQ-AUTH-LOGIN` | Validate the login response structure | API / Unit / Integration | Jest + Supertest | The response contains the documented token and user fields and excludes password hashes. | P0 | ⬜ Not Run |
| `BE-LGN-007` | `REQ-AUTH-LOGIN` | Apply the login rate limit | API / Unit / Integration | Jest + Supertest | Repeated failed attempts above the configured threshold return 429. | P0 | ⬜ Not Run |
#### Authenticated profile

Route/component: `GET /api/v1/auth/profile`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-PRF-001` | `REQ-AUTH-PROFILE` | Return profile with a valid access token | API / Integration | Jest + Supertest | The API returns the authenticated user's safe profile fields. | P0 | ⬜ Not Run |
| `BE-PRF-002` | `REQ-AUTH-PROFILE` | Reject profile request without a token | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
| `BE-PRF-003` | `REQ-AUTH-PROFILE` | Reject a malformed Bearer token | API / Integration | Jest + Supertest | The API returns 401 without exposing token internals. | P1 | ⬜ Not Run |
| `BE-PRF-004` | `REQ-AUTH-PROFILE` | Reject an expired access token | API / Integration | Jest + Supertest | The API returns 401 so the client can attempt refresh. | P0 | ⬜ Not Run |
#### Refresh-token rotation

Route/component: `POST /api/v1/auth/refresh`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-RFR-001` | `REQ-AUTH-REFRESH` | Refresh a valid authenticated session | API / Unit / Integration | Jest + Supertest | The API returns a new access token and a new refresh token. | P0 | ⬜ Not Run |
| `BE-RFR-002` | `REQ-AUTH-REFRESH` | Replace the stored refresh-token hash | API / Unit / Integration | Jest + Supertest | The database hash matches only the newly issued refresh token. | P0 | ⬜ Not Run |
| `BE-RFR-003` | `REQ-AUTH-REFRESH` | Reject reuse of the previous refresh token | API / Unit / Integration | Jest + Supertest | The rotated-out token is rejected and no new tokens are issued. | P0 | ⬜ Not Run |
| `BE-RFR-004` | `REQ-AUTH-REFRESH` | Reject an invalid or tampered refresh token | API / Unit / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
| `BE-RFR-005` | `REQ-AUTH-REFRESH` | Reject refresh after logout | API / Unit / Integration | Jest + Supertest | A token whose stored hash was cleared cannot create a new session. | P0 | ⬜ Not Run |
| `BE-RFR-006` | `REQ-AUTH-REFRESH` | Reject a missing refresh token | API / Unit / Integration | Jest + Supertest | The API returns 400 with validation feedback. | P1 | ⬜ Not Run |
#### Logout

Route/component: `POST /api/v1/auth/logout`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-LGO-001` | `REQ-AUTH-LOGOUT` | Logout with a valid refresh token | API / Integration | Jest + Supertest | The API returns success and ends the server-side refresh session. | P0 | ⬜ Not Run |
| `BE-LGO-002` | `REQ-AUTH-LOGOUT` | Clear the stored refresh-token hash | API / Integration | Jest + Supertest | The user record no longer contains a usable refresh-token hash. | P0 | ⬜ Not Run |
| `BE-LGO-003` | `REQ-AUTH-LOGOUT` | Reject logout with an invalid refresh token | API / Integration | Jest + Supertest | The API returns 401 or the documented invalid-token response. | P1 | ⬜ Not Run |
| `BE-LGO-004` | `REQ-AUTH-LOGOUT` | Reject logout with a missing refresh token | API / Integration | Jest + Supertest | The API returns 400 with validation feedback. | P1 | ⬜ Not Run |
#### Public active services

Route/component: `GET /api/v1/services/public/active`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-PSV-001` | `REQ-SERVICE-PUBLIC` | Return active services without authentication | API / Integration | Jest + Supertest | The endpoint returns 200 without requiring a Bearer token. | P0 | ⬜ Not Run |
| `BE-PSV-002` | `REQ-SERVICE-PUBLIC` | Exclude inactive services | API / Integration | Jest + Supertest | Every returned service has isActive equal to true. | P0 | ⬜ Not Run |
| `BE-PSV-003` | `REQ-SERVICE-PUBLIC` | Return public service fields | API / Integration | Jest + Supertest | The response includes ID, title, description, duration, price, and active status. | P1 | ⬜ Not Run |
| `BE-PSV-004` | `REQ-SERVICE-PUBLIC` | Return an empty result when no active services exist | API / Integration | Jest + Supertest | The endpoint returns a valid empty collection rather than an error. | P1 | ⬜ Not Run |
| `BE-PSV-005` | `REQ-SERVICE-PUBLIC` | Do not expose protected user or internal fields | API / Integration | Jest + Supertest | Only public service data is returned. | P1 | ⬜ Not Run |
#### Service listing, search, filter, and pagination

Route/component: `GET /api/v1/services`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SVL-001` | `REQ-SERVICE-LIST` | Return services to an authenticated user | API / Integration | Jest + Supertest | The API returns 200 with service data and pagination metadata. | P0 | ⬜ Not Run |
| `BE-SVL-002` | `REQ-SERVICE-LIST` | Paginate services using page and limit | API / Integration | Jest + Supertest | The correct page is returned and metadata values are accurate. | P1 | ⬜ Not Run |
| `BE-SVL-003` | `REQ-SERVICE-LIST` | Search services by text | API / Integration | Jest + Supertest | Only matching services are returned. | P1 | ⬜ Not Run |
| `BE-SVL-004` | `REQ-SERVICE-LIST` | Filter active services | API / Integration | Jest + Supertest | Only services with isActive true are returned. | P1 | ⬜ Not Run |
| `BE-SVL-005` | `REQ-SERVICE-LIST` | Filter inactive services | API / Integration | Jest + Supertest | Only services with isActive false are returned. | P1 | ⬜ Not Run |
| `BE-SVL-006` | `REQ-SERVICE-LIST` | Reject service listing without authentication | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Service creation

Route/component: `POST /api/v1/services`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SVC-001` | `REQ-SERVICE-CREATE` | Create a valid active service | API / Unit / Integration | Jest + Supertest | The service is persisted and returned with a UUID and timestamps. | P0 | ⬜ Not Run |
| `BE-SVC-002` | `REQ-SERVICE-CREATE` | Create a valid inactive service | API / Unit / Integration | Jest + Supertest | The service is stored with isActive false. | P1 | ⬜ Not Run |
| `BE-SVC-003` | `REQ-SERVICE-CREATE` | Reject a missing service title | API / Unit / Integration | Jest + Supertest | The API returns 400 and creates no record. | P1 | ⬜ Not Run |
| `BE-SVC-004` | `REQ-SERVICE-CREATE` | Reject a zero or negative duration | API / Unit / Integration | Jest + Supertest | The API returns 400 and creates no record. | P1 | ⬜ Not Run |
| `BE-SVC-005` | `REQ-SERVICE-CREATE` | Reject an invalid negative price | API / Unit / Integration | Jest + Supertest | The API returns 400 and creates no record. | P1 | ⬜ Not Run |
| `BE-SVC-006` | `REQ-SERVICE-CREATE` | Reject undeclared request fields | API / Unit / Integration | Jest + Supertest | The global validation configuration returns 400 for non-whitelisted fields. | P1 | ⬜ Not Run |
| `BE-SVC-007` | `REQ-SERVICE-CREATE` | Reject service creation without authentication | API / Unit / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Get service by ID

Route/component: `GET /api/v1/services/:id`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SVD-001` | `REQ-SERVICE-DETAIL` | Return an existing service by UUID | API / Integration | Jest + Supertest | The API returns the requested service. | P0 | ⬜ Not Run |
| `BE-SVD-002` | `REQ-SERVICE-DETAIL` | Return 404 for a missing service | API / Integration | Jest + Supertest | The API returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-SVD-003` | `REQ-SERVICE-DETAIL` | Reject an invalid UUID | API / Integration | Jest + Supertest | The API returns 400 or the project's documented invalid-ID response. | P1 | ⬜ Not Run |
| `BE-SVD-004` | `REQ-SERVICE-DETAIL` | Reject unauthenticated access | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Service update

Route/component: `PATCH /api/v1/services/:id`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SVU-001` | `REQ-SERVICE-UPDATE` | Partially update a service title or description | API / Unit / Integration | Jest + Supertest | Only submitted fields change and other fields remain unchanged. | P0 | ⬜ Not Run |
| `BE-SVU-002` | `REQ-SERVICE-UPDATE` | Update price and duration | API / Unit / Integration | Jest + Supertest | Valid numeric values are persisted accurately. | P1 | ⬜ Not Run |
| `BE-SVU-003` | `REQ-SERVICE-UPDATE` | Deactivate an active service | API / Unit / Integration | Jest + Supertest | The service is stored with isActive false and disappears from public active services. | P0 | ⬜ Not Run |
| `BE-SVU-004` | `REQ-SERVICE-UPDATE` | Reject invalid updated values | API / Unit / Integration | Jest + Supertest | The API returns 400 and preserves existing valid data. | P1 | ⬜ Not Run |
| `BE-SVU-005` | `REQ-SERVICE-UPDATE` | Return 404 when updating a missing service | API / Unit / Integration | Jest + Supertest | No record is changed and the API returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-SVU-006` | `REQ-SERVICE-UPDATE` | Reject update without authentication | API / Unit / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Service deletion

Route/component: `DELETE /api/v1/services/:id`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SVX-001` | `REQ-SERVICE-DELETE` | Delete an existing service with no blocking relationship | API / Integration | Jest + Supertest | The service is removed and cannot be fetched afterwards. | P0 | ⬜ Not Run |
| `BE-SVX-002` | `REQ-SERVICE-DELETE` | Handle deletion of a service referenced by bookings | API / Integration | Jest + Supertest | The API follows the documented relationship policy and does not corrupt booking data. | P0 | ⬜ Not Run |
| `BE-SVX-003` | `REQ-SERVICE-DELETE` | Return 404 for a missing service | API / Integration | Jest + Supertest | The API returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-SVX-004` | `REQ-SERVICE-DELETE` | Reject an invalid service UUID | API / Integration | Jest + Supertest | The API returns 400 or the documented invalid-ID response. | P1 | ⬜ Not Run |
| `BE-SVX-005` | `REQ-SERVICE-DELETE` | Reject deletion without authentication | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Public booking creation

Route/component: `POST /api/v1/bookings`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-BKC-001` | `REQ-BOOKING-CREATE` | Create a valid booking with a valid user access token | API / Unit / Integration | Jest + Supertest | The API creates the booking, automatically resolves customerEmail from the token payload, and returns the booking. | P0 | ⬜ Not Run |
| `BE-BKC-001a`| `REQ-BOOKING-CREATE` | Reject booking creation without a valid access token | API / Unit / Integration | Jest + Supertest | The API returns 401 Unauthorized and blocks booking creation. | P0 | ⬜ Not Run |
| `BE-BKC-002` | `REQ-BOOKING-CREATE` | Set the initial booking status to PENDING | API / Unit / Integration | Jest + Supertest | A new booking is persisted with PENDING regardless of omitted client status. | P0 | ⬜ Not Run |
| `BE-BKC-003` | `REQ-BOOKING-CREATE` | Create a booking for an existing active service | API / Unit / Integration | Jest + Supertest | The booking relationship references the selected service. | P0 | ⬜ Not Run |
| `BE-BKC-004` | `REQ-BOOKING-CREATE` | Reject a nonexistent service ID | API / Unit / Integration | Jest + Supertest | The API returns 404 or the documented service-not-found response. | P0 | ⬜ Not Run |
| `BE-BKC-005` | `REQ-BOOKING-CREATE` | Reject an inactive service | API / Unit / Integration | Jest + Supertest | The API returns a business-rule error and creates no booking. | P0 | ⬜ Not Run |
| `BE-BKC-006` | `REQ-BOOKING-CREATE` | Reject a date in the past | API / Unit / Integration | Jest + Supertest | The API returns 400 and creates no booking. | P0 | ⬜ Not Run |
| `BE-BKC-007` | `REQ-BOOKING-CREATE` | Reject a current-date time that has already passed | API / Unit / Integration | Jest + Supertest | The API returns 400 and creates no booking. | P0 | ⬜ Not Run |
| `BE-BKC-008` | `REQ-BOOKING-CREATE` | Reject missing required customer fields | API / Unit / Integration | Jest + Supertest | The API returns 400 with field-level validation messages. | P1 | ⬜ Not Run |
| `BE-BKC-009` | `REQ-BOOKING-CREATE` | Reject an invalid customer email | API / Unit / Integration | Jest + Supertest | The API returns 400. | P1 | ⬜ Not Run |
| `BE-BKC-010` | `REQ-BOOKING-CREATE` | Reject a duplicate service, date, and time slot | API / Unit / Integration | Jest + Supertest | The API returns 409 and preserves the original booking. | P0 | ⬜ Not Run |
| `BE-BKC-011` | `REQ-BOOKING-CREATE` | Allow the same date and time for a different service | API / Unit / Integration | Jest + Supertest | The second booking succeeds when the service is different. | P1 | ⬜ Not Run |
| `BE-BKC-012` | `REQ-BOOKING-CREATE` | Allow booking creation without notes | API / Unit / Integration | Jest + Supertest | The booking succeeds with notes stored as null or the documented empty value. | P1 | ⬜ Not Run |
#### Booking listing, search, filters, and pagination

Route/component: `GET /api/v1/bookings`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-BKL-001` | `REQ-BOOKING-LIST` | Return all bookings in the system to an authenticated Staff user | API / Integration | Jest + Supertest | When logged in as Staff (email ending in @en2h.com), the API returns all bookings with pagination metadata. | P0 | ⬜ Not Run |
| `BE-BKL-001a`| `REQ-BOOKING-LIST` | Restrict returned bookings to own records for Customer users | API / Integration | Jest + Supertest | When logged in as Customer (email not ending in @en2h.com), the query is force-restricted to only return their own bookings (preventing access to other customer bookings). | P0 | ⬜ Not Run |
| `BE-BKL-002` | `REQ-BOOKING-LIST` | Paginate bookings | API / Integration | Jest + Supertest | The requested page and limit are applied accurately. | P1 | ⬜ Not Run |
| `BE-BKL-003` | `REQ-BOOKING-LIST` | Search bookings | API / Integration | Jest + Supertest | Only records matching supported customer or booking fields are returned. | P1 | ⬜ Not Run |
| `BE-BKL-004` | `REQ-BOOKING-LIST` | Filter bookings by status | API / Integration | Jest + Supertest | Only bookings with the requested enum status are returned. | P1 | ⬜ Not Run |
| `BE-BKL-005` | `REQ-BOOKING-LIST` | Filter bookings by service | API / Integration | Jest + Supertest | Only bookings belonging to the selected service are returned. | P1 | ⬜ Not Run |
| `BE-BKL-006` | `REQ-BOOKING-LIST` | Reject booking listing without authentication | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Get booking by ID

Route/component: `GET /api/v1/bookings/:id`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-BKD-001` | `REQ-BOOKING-DETAIL` | Return an existing booking with service information | API / Integration | Jest + Supertest | The API returns the requested booking and its related service data. | P0 | ⬜ Not Run |
| `BE-BKD-002` | `REQ-BOOKING-DETAIL` | Return 404 for a missing booking | API / Integration | Jest + Supertest | The API returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-BKD-003` | `REQ-BOOKING-DETAIL` | Reject an invalid booking UUID | API / Integration | Jest + Supertest | The API returns 400 or the documented invalid-ID response. | P1 | ⬜ Not Run |
| `BE-BKD-004` | `REQ-BOOKING-DETAIL` | Reject unauthenticated access | API / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Booking status update

Route/component: `PATCH /api/v1/bookings/:id/status`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-BKS-001` | `REQ-BOOKING-STATUS` | Change PENDING to CONFIRMED | API / Unit / Integration | Jest + Supertest | The booking status becomes CONFIRMED. | P0 | ⬜ Not Run |
| `BE-BKS-002` | `REQ-BOOKING-STATUS` | Change CONFIRMED to COMPLETED | API / Unit / Integration | Jest + Supertest | The booking status becomes COMPLETED. | P0 | ⬜ Not Run |
| `BE-BKS-003` | `REQ-BOOKING-STATUS` | Change CONFIRMED to CANCELLED when supported by the status endpoint | API / Unit / Integration | Jest + Supertest | The booking becomes CANCELLED and cancellation metadata is updated. | P1 | ⬜ Not Run |
| `BE-BKS-004` | `REQ-BOOKING-STATUS` | Reject CANCELLED to COMPLETED | API / Unit / Integration | Jest + Supertest | The API returns a business-rule error and keeps CANCELLED. | P0 | ⬜ Not Run |
| `BE-BKS-005` | `REQ-BOOKING-STATUS` | Reject COMPLETED to CANCELLED | API / Unit / Integration | Jest + Supertest | The API returns a business-rule error and keeps COMPLETED. | P0 | ⬜ Not Run |
| `BE-BKS-006` | `REQ-BOOKING-STATUS` | Reject a value outside the booking-status enum | API / Unit / Integration | Jest + Supertest | The API returns 400. | P1 | ⬜ Not Run |
| `BE-BKS-007` | `REQ-BOOKING-STATUS` | Reject status update without authentication | API / Unit / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Booking cancellation

Route/component: `PATCH /api/v1/bookings/:id/cancel`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-BKX-001` | `REQ-BOOKING-CANCEL` | Cancel a PENDING booking | API / Unit / Integration | Jest + Supertest | The booking becomes CANCELLED and cancellation metadata is stored. | P0 | ⬜ Not Run |
| `BE-BKX-002` | `REQ-BOOKING-CANCEL` | Cancel a CONFIRMED booking | API / Unit / Integration | Jest + Supertest | The booking becomes CANCELLED. | P0 | ⬜ Not Run |
| `BE-BKX-003` | `REQ-BOOKING-CANCEL` | Reject cancellation of a COMPLETED booking | API / Unit / Integration | Jest + Supertest | The API returns a business-rule error and keeps COMPLETED. | P0 | ⬜ Not Run |
| `BE-BKX-004` | `REQ-BOOKING-CANCEL` | Reject repeated cancellation of an already CANCELLED booking | API / Unit / Integration | Jest + Supertest | The API follows the documented final-state behavior without corrupting data. | P1 | ⬜ Not Run |
| `BE-BKX-005` | `REQ-BOOKING-CANCEL` | Return 404 for a missing booking | API / Unit / Integration | Jest + Supertest | The API returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-BKX-006` | `REQ-BOOKING-CANCEL` | Reject cancellation without authentication | API / Unit / Integration | Jest + Supertest | The API returns 401. | P0 | ⬜ Not Run |
#### Global validation and error handling

Route/component: `All API routes`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-ERR-001` | `REQ-ERRORS` | Return the consistent global error schema | API / Integration | Jest + Supertest | Errors contain the documented status code, message, path, and timestamp fields. | P0 | ⬜ Not Run |
| `BE-ERR-002` | `REQ-ERRORS` | Return all DTO validation messages when multiple fields fail | API / Integration | Jest + Supertest | The client receives useful field validation details. | P1 | ⬜ Not Run |
| `BE-ERR-003` | `REQ-ERRORS` | Reject malformed JSON | API / Integration | Jest + Supertest | The API returns 400 and remains available for subsequent requests. | P1 | ⬜ Not Run |
| `BE-ERR-004` | `REQ-ERRORS` | Return 404 for an unsupported route or method | API / Integration | Jest + Supertest | The global filter returns the standard not-found response. | P1 | ⬜ Not Run |
| `BE-ERR-005` | `REQ-ERRORS` | Avoid leaking stack traces and sensitive internals | API / Integration | Jest + Supertest | Production-style error responses contain no password, SQL, JWT secret, or stack information. | P0 | ⬜ Not Run |
#### Security headers, CORS, and throttling

Route/component: `Application-wide`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-SEC-001` | `REQ-SECURITY` | Return secure HTTP headers from Helmet | Security / Integration | Supertest + Postman/Newman | Expected security headers are present without breaking the API. | P1 | ⬜ Not Run |
| `BE-SEC-002` | `REQ-SECURITY` | Allow the Next.js development origin | Security / Integration | Supertest + Postman/Newman | CORS permits requests from http://localhost:3001. | P0 | ⬜ Not Run |
| `BE-SEC-003` | `REQ-SECURITY` | Reject or omit CORS permission for an unapproved origin | Security / Integration | Supertest + Postman/Newman | The browser does not receive an allowed-origin header for an unknown production origin. | P1 | ⬜ Not Run |
| `BE-SEC-004` | `REQ-SECURITY` | Apply endpoint-specific rate limits | Security / Integration | Supertest + Postman/Newman | Login, registration, refresh, and public booking endpoints enforce their configured limits. | P0 | ⬜ Not Run |
#### Database migrations, constraints, and seed data

Route/component: `PostgreSQL / TypeORM`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-DB-001` | `REQ-DATABASE` | Run all migrations on an empty database | Database / Integration | TypeORM CLI + psql | All tables, constraints, enum types, and indexes are created successfully. | P0 | ⬜ Not Run |
| `BE-DB-002` | `REQ-DATABASE` | Preserve integrity when sample seed data is run again | Database / Integration | TypeORM CLI + psql | The seed process is duplicate-safe and does not create invalid relationships. | P1 | ⬜ Not Run |
#### Docker Compose deployment

Route/component: `docker compose`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `BE-DKR-001` | `REQ-DOCKER` | Start PostgreSQL and API containers successfully | Infrastructure / Integration | Docker Compose | PostgreSQL becomes healthy, migrations complete, and the API listens once on port 3000. | P0 | ⬜ Not Run |
| `BE-DKR-002` | `REQ-DOCKER` | Restart containers without losing database data | Infrastructure / Integration | Docker Compose | The volume persists data and startup reports no pending migrations when appropriate. | P0 | ⬜ Not Run |
### Frontend test cases

#### Landing page

Route/component: `/`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-LND-001` | `REQ-FE-LANDING` | Render the AETHER landing page | UI / Component / Integration | Vitest + Testing Library + Playwright | The page loads with the main heading, supporting text, and primary content. | P0 | ⬜ Not Run |
| `FE-LND-002` | `REQ-FE-LANDING` | Display the primary Book a Service CTA | UI / Component / Integration | Vitest + Testing Library + Playwright | The CTA is visible, keyboard accessible, and links to /book. | P0 | ⬜ Not Run |
| `FE-LND-003` | `REQ-FE-LANDING` | Display the Explore Services CTA | UI / Component / Integration | Vitest + Testing Library + Playwright | The CTA links to /services. | P1 | ⬜ Not Run |
| `FE-LND-004` | `REQ-FE-LANDING` | Display a staff login link without competing with the main CTA | UI / Component / Integration | Vitest + Testing Library + Playwright | The staff action is available and visually secondary. | P1 | ⬜ Not Run |
| `FE-LND-005` | `REQ-FE-LANDING` | Render the active services preview | UI / Component / Integration | Vitest + Testing Library + Playwright | Up to the configured number of active service cards is shown. | P0 | ⬜ Not Run |
| `FE-LND-006` | `REQ-FE-LANDING` | Render loading, empty, and error states for service preview | UI / Component / Integration | Vitest + Testing Library + Playwright | The section never remains blank and provides retry when appropriate. | P1 | ⬜ Not Run |
| `FE-LND-007` | `REQ-FE-LANDING` | Render How It Works, Benefits, Staff Portal, and final CTA sections | UI / Component / Integration | Vitest + Testing Library + Playwright | All required landing sections and actions are present. | P1 | ⬜ Not Run |
| `FE-LND-008` | `REQ-FE-LANDING` | Provide valid page title and metadata | UI / Component / Integration | Vitest + Testing Library + Playwright | The page contains useful title and description metadata. | P2 | ⬜ Not Run |
#### Navigation and footer

Route/component: `Public layout`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-NAV-001` | `REQ-FE-NAV` | Render desktop navigation links | UI / Component / E2E | Testing Library + Playwright | Home, Services, How It Works, Book Now, Login, and Register are available. | P0 | ⬜ Not Run |
| `FE-NAV-002` | `REQ-FE-NAV` | Place Login and Register in required public locations | UI / Component / E2E | Testing Library + Playwright | They appear in the desktop navigation, mobile menu, Staff Portal section, and footer. | P0 | ⬜ Not Run |
| `FE-NAV-003` | `REQ-FE-NAV` | Open and close the mobile navigation | UI / Component / E2E | Testing Library + Playwright | The menu responds to the control and exposes the correct accessible state. | P1 | ⬜ Not Run |
| `FE-NAV-004` | `REQ-FE-NAV` | Close the mobile menu after navigation | UI / Component / E2E | Testing Library + Playwright | Selecting a route closes the menu and navigates correctly. | P1 | ⬜ Not Run |
| `FE-NAV-005` | `REQ-FE-NAV` | Render working footer links | UI / Component / E2E | Testing Library + Playwright | All footer navigation routes are valid. | P1 | ⬜ Not Run |
| `FE-NAV-006` | `REQ-FE-NAV` | Navigate public controls using only the keyboard | UI / Component / E2E | Testing Library + Playwright | Focus order is logical and every action has a visible focus state. | P0 | ⬜ Not Run |
#### Public services page

Route/component: `/services`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-PSV-001` | `REQ-FE-SERVICES-PUBLIC` | Load and display active services | UI / Component / Integration | Vitest + Testing Library + Playwright | Only active services are rendered. | P0 | ⬜ Not Run |
| `FE-PSV-002` | `REQ-FE-SERVICES-PUBLIC` | Search public services | UI / Component / Integration | Vitest + Testing Library + Playwright | The displayed list updates to matching active services. | P1 | ⬜ Not Run |
| `FE-PSV-003` | `REQ-FE-SERVICES-PUBLIC` | Display title, description, duration, and price | UI / Component / Integration | Vitest + Testing Library + Playwright | Every service card presents the required formatted information. | P1 | ⬜ Not Run |
| `FE-PSV-004` | `REQ-FE-SERVICES-PUBLIC` | Create a booking link with serviceId | UI / Component / Integration | Vitest + Testing Library + Playwright | Book Now navigates to /book?serviceId=<id>. | P0 | ⬜ Not Run |
| `FE-PSV-005` | `REQ-FE-SERVICES-PUBLIC` | Render loading and empty states | UI / Component / Integration | Vitest + Testing Library + Playwright | Skeleton and no-results UI are displayed appropriately. | P1 | ⬜ Not Run |
| `FE-PSV-006` | `REQ-FE-SERVICES-PUBLIC` | Render API error with retry | UI / Component / Integration | Vitest + Testing Library + Playwright | A readable error and functional retry action are shown. | P1 | ⬜ Not Run |
#### Public booking form

Route/component: `/book`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-BKF-001` | `REQ-FE-BOOKING` | Load active services into the service selector | UI / Component / Integration | Vitest + Testing Library + Playwright | The selector contains only active services. | P0 | ⬜ Not Run |
| `FE-BKF-001a`| `REQ-FE-BOOKING` | Redirect unauthenticated guests to login page with redirect param | UI / Component / Integration | Vitest + Testing Library + Playwright | Guest navigating to /book is redirected to /login?redirect=/book. | P0 | ⬜ Not Run |
| `FE-BKF-001b`| `REQ-FE-BOOKING` | Pre-fill logged-in customer name and email as read-only | UI / Component / Integration | Vitest + Testing Library + Playwright | After logging in, customer details are loaded and name and email form fields are pre-filled and set to read-only/disabled. | P0 | ⬜ Not Run |
| `FE-BKF-002` | `REQ-FE-BOOKING` | Preselect serviceId from the query string | UI / Component / Integration | Vitest + Testing Library + Playwright | A valid query service is selected automatically. | P0 | ⬜ Not Run |
| `FE-BKF-003` | `REQ-FE-BOOKING` | Reject missing required fields on the client | UI / Component / Integration | Vitest + Testing Library + Playwright | Accessible validation messages are shown and no request is sent. | P1 | ⬜ Not Run |
| `FE-BKF-004` | `REQ-FE-BOOKING` | Reject an invalid customer email | UI / Component / Integration | Vitest + Testing Library + Playwright | The email field displays a connected validation error. | P1 | ⬜ Not Run |
| `FE-BKF-005` | `REQ-FE-BOOKING` | Prevent selection of a past date | UI / Component / Integration | Vitest + Testing Library + Playwright | The date control and validation block past dates. | P0 | ⬜ Not Run |
| `FE-BKF-006` | `REQ-FE-BOOKING` | Submit a valid booking payload | UI / Component / Integration | Vitest + Testing Library + Playwright | The frontend sends the exact backend field names and values. | P0 | ⬜ Not Run |
| `FE-BKF-007` | `REQ-FE-BOOKING` | Prevent repeated submission while loading | UI / Component / Integration | Vitest + Testing Library + Playwright | The submit control is disabled and only one request is sent. | P0 | ⬜ Not Run |
| `FE-BKF-008` | `REQ-FE-BOOKING` | Display duplicate-slot conflict | UI / Component / Integration | Vitest + Testing Library + Playwright | A 409 response produces a clear time-slot conflict message. | P0 | ⬜ Not Run |
| `FE-BKF-009` | `REQ-FE-BOOKING` | Display inactive, removed-service, and rate-limit errors | UI / Component / Integration | Vitest + Testing Library + Playwright | The correct user-friendly feedback is shown for each response. | P1 | ⬜ Not Run |
| `FE-BKF-010` | `REQ-FE-BOOKING` | Display booking success details | UI / Component / Integration | Vitest + Testing Library + Playwright | The reference, service, date, time, and PENDING status are shown with follow-up actions. | P0 | ⬜ Not Run |
#### Login page

Route/component: `/login`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-LGN-001` | `REQ-FE-LOGIN` | Render login fields and actions | UI / Component / Integration | Vitest + Testing Library + Playwright | Email, password, show/hide, Login, Register, and Back Home are available. | P0 | ⬜ Not Run |
| `FE-LGN-002` | `REQ-FE-LOGIN` | Validate login fields before submission | UI / Component / Integration | Vitest + Testing Library + Playwright | Invalid or missing values produce accessible field errors. | P1 | ⬜ Not Run |
| `FE-LGN-003` | `REQ-FE-LOGIN` | Login successfully and redirect | UI / Component / Integration | Vitest + Testing Library + Playwright | Tokens and user data are saved and the user reaches /dashboard. | P0 | ⬜ Not Run |
| `FE-LGN-004` | `REQ-FE-LOGIN` | Display invalid credentials and rate-limit errors | UI / Component / Integration | Vitest + Testing Library + Playwright | 401 and 429 responses produce useful messages. | P0 | ⬜ Not Run |
| `FE-LGN-005` | `REQ-FE-LOGIN` | Redirect an already authenticated user | UI / Component / Integration | Vitest + Testing Library + Playwright | A valid session visiting /login is sent to /dashboard. | P1 | ⬜ Not Run |
#### Registration page

Route/component: `/register`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-REG-001` | `REQ-FE-REGISTER` | Render all registration fields and actions | UI / Component / Integration | Vitest + Testing Library + Playwright | Name, email, password, confirmation, Login, and Back Home are available. | P0 | ⬜ Not Run |
| `FE-REG-002` | `REQ-FE-REGISTER` | Validate password confirmation | UI / Component / Integration | Vitest + Testing Library + Playwright | Mismatched passwords prevent submission and show a connected error. | P1 | ⬜ Not Run |
| `FE-REG-003` | `REQ-FE-REGISTER` | Register successfully | UI / Component / Integration | Vitest + Testing Library + Playwright | The success state appears and the user is redirected to login. | P0 | ⬜ Not Run |
| `FE-REG-004` | `REQ-FE-REGISTER` | Display duplicate-email and rate-limit errors | UI / Component / Integration | Vitest + Testing Library + Playwright | 409 and 429 responses produce clear messages. | P0 | ⬜ Not Run |
| `FE-REG-005` | `REQ-FE-REGISTER` | Preserve safe form values after a failed request | UI / Component / Integration | Vitest + Testing Library + Playwright | The user does not need to re-enter non-sensitive data unnecessarily. | P2 | ⬜ Not Run |
#### Authentication session and route protection

Route/component: `AuthProvider, AuthGate, GuestGate`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-SES-001` | `REQ-FE-SESSION` | Restore a valid stored session | Unit / Component / Integration | Vitest + Testing Library | The profile is loaded and protected content becomes available. | P0 | ⬜ Not Run |
| `FE-SES-002` | `REQ-FE-SESSION` | Refresh an expired access token | Unit / Component / Integration | Vitest + Testing Library | The client stores both rotated tokens and retries once. | P0 | ⬜ Not Run |
| `FE-SES-003` | `REQ-FE-SESSION` | Use one shared refresh request for simultaneous 401 responses | Unit / Component / Integration | Vitest + Testing Library | Concurrent protected requests wait for one refresh operation. | P0 | ⬜ Not Run |
| `FE-SES-004` | `REQ-FE-SESSION` | Clear the session after failed refresh | Unit / Component / Integration | Vitest + Testing Library | Stored authentication data is removed and the user returns to login. | P0 | ⬜ Not Run |
| `FE-SES-005` | `REQ-FE-SESSION` | Protect dashboard routes from guests | Unit / Component / Integration | Vitest + Testing Library | Unauthenticated users are redirected without seeing protected data. | P0 | ⬜ Not Run |
| `FE-SES-005a`| `REQ-FE-SESSION` | Redirect guest to book page after successful login from gated link | Unit / Component / Integration | Vitest + Testing Library | After logging in, the query redirect parameter is read and user is routed back to /book. | P0 | ⬜ Not Run |
| `FE-SES-006` | `REQ-FE-SESSION` | Protect guest routes from authenticated users | Unit / Component / Integration | Vitest + Testing Library | Authenticated users are redirected from login and registration to the dashboard. | P1 | ⬜ Not Run |
| `FE-SES-007` | `REQ-FE-SESSION` | Logout and invalidate the client session | Unit / Component / Integration | Vitest + Testing Library | The logout API is called, local data is cleared, and dashboard access is removed. | P0 | ⬜ Not Run |
#### Dashboard overview

Route/component: `/dashboard`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-DSH-001` | `REQ-FE-DASHBOARD` | Render the authenticated dashboard shell | UI / Component / Integration | Vitest + Testing Library + Playwright | Sidebar, header, user summary, and logout are available. | P0 | ⬜ Not Run |
| `FE-DSH-002` | `REQ-FE-DASHBOARD` | Display service totals | UI / Component / Integration | Vitest + Testing Library + Playwright | Total, active, and inactive service values are correct for the loaded API data. | P1 | ⬜ Not Run |
| `FE-DSH-003` | `REQ-FE-DASHBOARD` | Display booking status totals | UI / Component / Integration | Vitest + Testing Library + Playwright | Pending, confirmed, completed, and cancelled values are calculated correctly. | P1 | ⬜ Not Run |
| `FE-DSH-004` | `REQ-FE-DASHBOARD` | Display recent bookings | UI / Component / Integration | Vitest + Testing Library + Playwright | Recent records are rendered with service and status information. | P1 | ⬜ Not Run |
| `FE-DSH-005` | `REQ-FE-DASHBOARD` | Render dashboard loading and error states | UI / Component / Integration | Vitest + Testing Library + Playwright | The user sees a skeleton, readable error, and retry action. | P1 | ⬜ Not Run |
| `FE-DSH-006` | `REQ-FE-DASHBOARD` | Use the mobile dashboard drawer | UI / Component / Integration | Vitest + Testing Library + Playwright | The drawer opens, closes, and navigates accessibly on small screens. | P1 | ⬜ Not Run |
| `FE-DSH-007` | `REQ-FE-DASHBOARD` | Render Customer Booking Tracker for Customer users | UI / Component / Integration | Vitest + Testing Library + Playwright | Customers see their own appointments list, cancel buttons, simple stats, and a shortcut link to /book. Sidebar does not display Services or all bookings links. | P0 | ⬜ Not Run |
| `FE-DSH-008` | `REQ-FE-DASHBOARD` | Render admin overview widgets and SVG charts for Staff users | UI / Component / Integration | Vitest + Testing Library + Playwright | Staff see full metric summaries and interactive SVG Donut and Bar charts. | P0 | ⬜ Not Run |
| `FE-DSH-009` | `REQ-FE-DASHBOARD` | Interactive SVG Donut hover states | UI / Component / Integration | Vitest + Testing Library + Playwright | Hovering an SVG donut slice updates the center text with segment label and count. | P1 | ⬜ Not Run |
| `FE-DSH-010` | `REQ-FE-DASHBOARD` | Interactive SVG Bar chart hover highlights | UI / Component / Integration | Vitest + Testing Library + Playwright | Hovering a service bar displays glowing shadows and highlighted values. | P1 | ⬜ Not Run |
#### Service management UI

Route/component: `/dashboard/services`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-SVM-001` | `REQ-FE-SERVICE-MANAGEMENT` | Load the protected service list | UI / Component / Integration | Vitest + Testing Library + Playwright | The table or cards display API data and pagination. | P0 | ⬜ Not Run |
| `FE-SVM-002` | `REQ-FE-SERVICE-MANAGEMENT` | Search and filter services | UI / Component / Integration | Vitest + Testing Library + Playwright | Search and active-status filters update the requested results. | P1 | ⬜ Not Run |
| `FE-SVM-003` | `REQ-FE-SERVICE-MANAGEMENT` | Create a valid service | UI / Component / Integration | Vitest + Testing Library + Playwright | The correct payload is submitted and the list updates with success feedback. | P0 | ⬜ Not Run |
| `FE-SVM-004` | `REQ-FE-SERVICE-MANAGEMENT` | Display create-service validation errors | UI / Component / Integration | Vitest + Testing Library + Playwright | Invalid values are connected to their fields. | P1 | ⬜ Not Run |
| `FE-SVM-005` | `REQ-FE-SERVICE-MANAGEMENT` | Open and populate the edit form | UI / Component / Integration | Vitest + Testing Library + Playwright | The selected service values appear correctly. | P1 | ⬜ Not Run |
| `FE-SVM-006` | `REQ-FE-SERVICE-MANAGEMENT` | Update a service | UI / Component / Integration | Vitest + Testing Library + Playwright | The correct PATCH payload is sent and the UI reflects the response. | P0 | ⬜ Not Run |
| `FE-SVM-007` | `REQ-FE-SERVICE-MANAGEMENT` | Confirm and delete a service | UI / Component / Integration | Vitest + Testing Library + Playwright | The dialog identifies the service and successful deletion refreshes the list. | P0 | ⬜ Not Run |
| `FE-SVM-008` | `REQ-FE-SERVICE-MANAGEMENT` | Handle delete conflict, loading, empty, and API error states | UI / Component / Integration | Vitest + Testing Library + Playwright | The UI presents the correct feedback without losing the current view. | P1 | ⬜ Not Run |
#### Booking management and details UI

Route/component: `/dashboard/bookings and /dashboard/bookings/[id]`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-BKM-001` | `REQ-FE-BOOKING-MANAGEMENT` | Load protected bookings with pagination | UI / Component / Integration | Vitest + Testing Library + Playwright | The list displays booking and service information with accurate metadata. | P0 | ⬜ Not Run |
| `FE-BKM-002` | `REQ-FE-BOOKING-MANAGEMENT` | Search bookings with debounce | UI / Component / Integration | Vitest + Testing Library + Playwright | The request is delayed appropriately and stale results do not replace newer results. | P1 | ⬜ Not Run |
| `FE-BKM-003` | `REQ-FE-BOOKING-MANAGEMENT` | Filter by status and service | UI / Component / Integration | Vitest + Testing Library + Playwright | The URL and requested data reflect the selected filters. | P1 | ⬜ Not Run |
| `FE-BKM-004` | `REQ-FE-BOOKING-MANAGEMENT` | Open booking details | UI / Component / Integration | Vitest + Testing Library + Playwright | The details page displays customer, service, date, time, status, notes, and timestamps. | P0 | ⬜ Not Run |
| `FE-BKM-005` | `REQ-FE-BOOKING-MANAGEMENT` | Show accessible status badges | UI / Component / Integration | Vitest + Testing Library + Playwright | Each state includes readable text and does not rely only on color. | P1 | ⬜ Not Run |
| `FE-BKM-006` | `REQ-FE-BOOKING-MANAGEMENT` | Confirm a PENDING booking | UI / Component / Integration | Vitest + Testing Library + Playwright | The user confirms the dialog and the booking becomes CONFIRMED. | P0 | ⬜ Not Run |
| `FE-BKM-007` | `REQ-FE-BOOKING-MANAGEMENT` | Complete a CONFIRMED booking | UI / Component / Integration | Vitest + Testing Library + Playwright | The user confirms the dialog and the booking becomes COMPLETED. | P0 | ⬜ Not Run |
| `FE-BKM-008` | `REQ-FE-BOOKING-MANAGEMENT` | Cancel a PENDING or CONFIRMED booking | UI / Component / Integration | Vitest + Testing Library + Playwright | The booking becomes CANCELLED after confirmation. | P0 | ⬜ Not Run |
| `FE-BKM-009` | `REQ-FE-BOOKING-MANAGEMENT` | Hide actions for CANCELLED and COMPLETED bookings | UI / Component / Integration | Vitest + Testing Library + Playwright | No invalid status action is displayed. | P0 | ⬜ Not Run |
| `FE-BKM-010` | `REQ-FE-BOOKING-MANAGEMENT` | Handle missing booking, rejected transition, and API error | UI / Component / Integration | Vitest + Testing Library + Playwright | The details view shows the correct error and remains recoverable. | P1 | ⬜ Not Run |
#### AETHER design and React Bits effects

Route/component: `All frontend pages`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-AET-001` | `REQ-FE-AETHER` | Use the exact AETHER color roles | Visual / Component | Playwright visual checks + Manual review | Background, surface, text, and border tokens match the approved design file. | P0 | ⬜ Not Run |
| `FE-AET-002` | `REQ-FE-AETHER` | Use the specified Inter and JetBrains Mono typography | Visual / Component | Playwright visual checks + Manual review | Display, body, and label styles match the approved hierarchy. | P1 | ⬜ Not Run |
| `FE-AET-003` | `REQ-FE-AETHER` | Render the selected React Bits hero effect behind content | Visual / Component | Playwright visual checks + Manual review | The effect remains secondary, non-blocking, responsive, and readable. | P1 | ⬜ Not Run |
| `FE-AET-004` | `REQ-FE-AETHER` | Disable or minimize effects for reduced motion | Visual / Component | Playwright visual checks + Manual review | The interface remains complete when prefers-reduced-motion is enabled. | P0 | ⬜ Not Run |
| `FE-AET-005` | `REQ-FE-AETHER` | Render canvas ElectricBorder with custom gold strokes around the Hero preview card | Visual / Component | Playwright visual checks + Manual review | Electric border canvas draws correctly, adjusts on window resize, and cycles neon glowing line coordinates. | P0 | ⬜ Not Run |
| `FE-AET-006` | `REQ-FE-AETHER` | TiltedCard mouse tilt on hover | Visual / Component | Playwright visual checks + Manual review | Hovering over the card container calculates mouse relative positioning, translates spring motion values into 3D transforms, and renders the hover glassmorphic overlays. | P0 | ⬜ Not Run |
#### Responsive and basic accessibility behavior

Route/component: `All frontend pages`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `FE-RSP-001` | `REQ-FE-RESPONSIVE` | Render without horizontal overflow at 320px, 768px, 1024px, and 1440px | Responsive / Accessibility | Playwright + axe-core | All primary pages remain usable at the required breakpoints. | P0 | ⬜ Not Run |
| `FE-RSP-002` | `REQ-FE-RESPONSIVE` | Use keyboard focus and accessible names | Responsive / Accessibility | Playwright + axe-core | Interactive controls are reachable, named, and visibly focused. | P0 | ⬜ Not Run |
| `FE-RSP-003` | `REQ-FE-RESPONSIVE` | Connect form errors and asynchronous messages to assistive technology | Responsive / Accessibility | Playwright + axe-core | aria-invalid, aria-describedby, and aria-live behavior is correct. | P0 | ⬜ Not Run |
### Cross-system test cases

#### Critical user and staff workflows

Route/component: `Frontend + Backend + PostgreSQL`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `E2E-001` | `REQ-E2E` | Register a staff account and log in | End-to-End | Playwright | The user registers, logs in, receives a valid session, and reaches the dashboard. | P0 | ⬜ Not Run |
| `E2E-002` | `REQ-E2E` | Create an active service and display it publicly | End-to-End | Playwright | The staff-created service appears on the public services page. | P0 | ⬜ Not Run |
| `E2E-003` | `REQ-E2E` | Create a public booking for the new service | End-to-End | Playwright | The booking is persisted with PENDING and appears in staff management. | P0 | ⬜ Not Run |
| `E2E-004` | `REQ-E2E` | Confirm a pending booking | End-to-End | Playwright | The staff action updates both the backend and frontend to CONFIRMED. | P0 | ⬜ Not Run |
| `E2E-005` | `REQ-E2E` | Complete a confirmed booking | End-to-End | Playwright | The booking reaches COMPLETED and no further status actions appear. | P0 | ⬜ Not Run |
| `E2E-006` | `REQ-E2E` | Cancel a pending booking | End-to-End | Playwright | The booking reaches CANCELLED and becomes a final state. | P0 | ⬜ Not Run |
| `E2E-007` | `REQ-E2E` | Prevent a duplicate public booking slot | End-to-End | Playwright | The second identical booking receives a conflict message and no duplicate row is created. | P0 | ⬜ Not Run |
| `E2E-008` | `REQ-E2E` | Refresh an expired dashboard session | End-to-End | Playwright | The session rotates tokens and the current dashboard action completes once. | P0 | ⬜ Not Run |
| `E2E-009` | `REQ-E2E` | Logout and block protected navigation | End-to-End | Playwright | The session is invalidated and direct dashboard access redirects to login. | P0 | ⬜ Not Run |
| `E2E-010` | `REQ-E2E` | Restart Docker and preserve workflow data | End-to-End | Playwright | After restart, services, users, and bookings remain available. | P0 | ⬜ Not Run |
### Non-functional test cases

#### Quality, security, performance, and compatibility

Route/component: `Full system`

| ID | Requirement | Scenario | Type | Recommended tool | Expected result | Priority | Status |
|---|---|---|---|---|---|:---:|:---:|
| `NF-001` | `REQ-NONFUNCTIONAL` | Meet public-page performance target | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Landing and public service pages meet the team's agreed Lighthouse performance threshold. | P1 | ⬜ Not Run |
| `NF-002` | `REQ-NONFUNCTIONAL` | Meet accessibility target | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Automated scans report no critical accessibility violations on required routes. | P0 | ⬜ Not Run |
| `NF-003` | `REQ-NONFUNCTIONAL` | Maintain API stability under expected concurrent requests | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | The API remains responsive and does not corrupt booking slots under the agreed test load. | P0 | ⬜ Not Run |
| `NF-004` | `REQ-NONFUNCTIONAL` | Enforce duplicate booking integrity under concurrency | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Two simultaneous identical booking requests produce only one valid booking. | P0 | ⬜ Not Run |
| `NF-005` | `REQ-NONFUNCTIONAL` | Avoid sensitive data in browser storage and logs | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | JWT secrets, database credentials, password hashes, and stack traces are absent. | P0 | ⬜ Not Run |
| `NF-006` | `REQ-NONFUNCTIONAL` | Support current Chromium, Firefox, and WebKit | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Critical public and dashboard workflows pass in supported browsers. | P1 | ⬜ Not Run |
| `NF-007` | `REQ-NONFUNCTIONAL` | Recover from a temporary network failure | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | The UI shows a readable error and succeeds after retry when connectivity returns. | P1 | ⬜ Not Run |
| `NF-008` | `REQ-NONFUNCTIONAL` | Maintain readable contrast across AETHER components | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Text, borders, controls, and status labels meet the approved contrast requirements. | P0 | ⬜ Not Run |
| `NF-009` | `REQ-NONFUNCTIONAL` | Handle API rate limits without repeated automatic retry | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | The client shows a 429 message and does not create a request loop. | P0 | ⬜ Not Run |
| `NF-010` | `REQ-NONFUNCTIONAL` | Complete production builds without errors | Non-functional | Lighthouse + axe-core + k6/Postman + Manual | Backend and frontend lint, type checks, tests, and production builds pass. | P0 | ⬜ Not Run |

---

## 12. Backend Commands

Run from `backend/`.

```bash
npm install
npm run lint
npm run build
npm run test
npm run test:cov
npm run test:e2e
```

Run migrations:

```bash
npm run migration:run
npm run migration:show
```

Run with Docker:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f api
```

The actual Compose service name may be `api` or `postgres` depending on `docker-compose.yml`; use `docker compose config --services` to confirm it.

---

## 13. Postman and Newman

Recommended collection variables:

```text
baseUrl = http://localhost:3000/api/v1
accessToken =
refreshToken =
serviceId =
bookingId =
```

Run a collection:

```bash
newman run docs/EN2H-Booking-Platform.postman_collection.json \
  -e docs/EN2H-Booking-Platform.postman_environment.json
```

The login request should store the tokens. Create-service and create-booking requests should store their generated IDs.

---

## 14. Frontend Commands

Run from `frontend/`.

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
```

Run Playwright:

```bash
npx playwright test
npx playwright show-report
```

---

## 15. Suggested Coverage Targets

| Area | Minimum target |
|---|---:|
| Backend service and business-rule lines | 85% |
| Backend branches | 80% |
| Authentication and booking business rules | 90% |
| Frontend validation and API-client lines | 85% |
| Frontend branches | 75% |
| Critical E2E workflows | 100% of the 10 listed workflows |

Coverage percentage alone does not prove correctness. P0 business-rule tests are mandatory even when the numerical target is met.

---

## 16. Regression Suite

Run the complete regression suite after changes to:

- Authentication DTOs or token configuration
- Refresh-token rotation
- Service entities or migrations
- Booking status rules
- Duplicate-slot constraints
- Global validation or exception filters
- Public active-service endpoint
- Frontend API client
- AuthProvider or route guards
- Booking and service forms
- Docker or environment configuration

---

## 17. CI Quality Gate

A pull request should fail when:

- Lint fails.
- Type checking fails.
- A P0 automated test fails.
- The backend or frontend production build fails.
- Database migrations fail on a clean PostgreSQL instance.
- A critical Playwright workflow fails.
- Test coverage falls below the agreed threshold.

Recommended pipeline order:

```text
Install
→ Lint
→ Type Check
→ Backend Unit Tests
→ Frontend Unit/Component Tests
→ Start PostgreSQL
→ Run Migrations
→ Backend E2E Tests
→ Build Backend
→ Build Frontend
→ Playwright Critical Workflows
→ Publish Test Reports
```

---

## 18. Final Test Completion Checklist

### Backend

- [ ] Health checks tested
- [ ] Registration tested
- [ ] Login tested
- [ ] Profile tested
- [ ] Refresh rotation tested
- [ ] Logout tested
- [ ] Public active services tested
- [ ] Service CRUD tested
- [ ] Service search/filter/pagination tested
- [ ] Public booking tested
- [ ] Booking search/filter/pagination tested
- [ ] Booking details tested
- [ ] Status transitions tested
- [ ] Cancellation tested
- [ ] Error schema tested
- [ ] Rate limits tested
- [ ] CORS tested
- [ ] Migrations tested
- [ ] Seed data tested
- [ ] Docker startup and persistence tested

### Frontend

- [ ] Landing page tested
- [ ] Login and Register placement tested
- [ ] Public services tested
- [ ] Public booking form tested
- [ ] Login tested
- [ ] Registration tested
- [ ] Session restoration tested
- [ ] Shared refresh lock tested
- [ ] Protected routes tested
- [ ] Dashboard tested
- [ ] Service management tested
- [ ] Booking management tested
- [ ] Booking details tested
- [ ] AETHER design tokens checked
- [ ] React Bits effects checked
- [ ] Responsive layouts checked
- [ ] Accessibility checked

### Final

- [ ] All 211 planned test cases reviewed
- [ ] Every P0 case executed
- [ ] Failures include evidence and defect IDs
- [ ] Regression suite executed
- [ ] Test summary report prepared

---

## 19. Test Summary Report Template

```text
Project: EN2H Booking Platform
Build/Commit:
Environment:
Execution Date:
Tester:

Total Planned: 211
Executed:
Passed:
Failed:
Blocked:
Not Run:

P0 Passed / Total:
P1 Passed / Total:
P2 Passed / Total:

Critical Defects:
High Defects:
Medium Defects:
Low Defects:

Recommendation:
✅ Ready for submission
❌ Not ready for submission
```

---

## 20. Definition of Done

Testing is complete only when the defined exit criteria are met and the actual results, evidence, and defect references have been recorded. A generated test case is not considered executed until the system has been run and the observed result has been compared with the expected result.
