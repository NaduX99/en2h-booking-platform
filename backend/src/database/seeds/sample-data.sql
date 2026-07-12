-- ============================================================
-- EN2H Booking Platform - Sample Database Data
-- PostgreSQL seed file
--
-- Sample staff credentials:
--   Email:    admin@en2h.com
--   Password: Password123!
--
-- This file:
--   1. Creates two sample authenticated users
--   2. Creates eight sample services
--   3. Creates twelve future sample bookings
--
-- It is safe to run more than once because fixed IDs and
-- ON CONFLICT clauses are used.
-- ============================================================

BEGIN;

-- Used to create bcrypt password hashes inside PostgreSQL.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. SAMPLE USERS
-- ============================================================

INSERT INTO users (
    id,
    name,
    email,
    password_hash,
    refresh_token_hash
)
VALUES
(
    'a0000000-0000-4000-8000-000000000001',
    'EN2H Administrator',
    'admin@en2h.com',
    crypt('Password123!', gen_salt('bf', 10)),
    NULL
),
(
    'a0000000-0000-4000-8000-000000000002',
    'EN2H Staff User',
    'staff@en2h.com',
    crypt('Password123!', gen_salt('bf', 10)),
    NULL
)
ON CONFLICT (email)
DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    refresh_token_hash = NULL;

-- ============================================================
-- 2. SAMPLE SERVICES
-- ============================================================
--
-- The backend README uses the database column duration_minutes.
-- If your migration created a column named duration instead,
-- replace duration_minutes with duration in this section.
-- ============================================================

INSERT INTO services (
    id,
    title,
    description,
    duration_minutes,
    price,
    is_active
)
VALUES
(
    'b0000000-0000-4000-8000-000000000001',
    'Software Consultation',
    'A focused consultation for software architecture, technical planning, and development guidance.',
    60,
    5000.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000002',
    'Website Development Consultation',
    'Discuss requirements, design direction, technology selection, and delivery planning for a modern website.',
    45,
    3500.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000003',
    'UI and UX Review',
    'A structured review of usability, accessibility, navigation, visual hierarchy, and responsive behavior.',
    60,
    4500.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000004',
    'Database Design Session',
    'Review entities, relationships, constraints, indexing, normalization, and migration planning.',
    90,
    7000.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000005',
    'API Integration Support',
    'Technical support for REST API integration, authentication, error handling, and frontend data flow.',
    60,
    5500.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000006',
    'Code Review',
    'A practical review focused on correctness, maintainability, security, performance, and code structure.',
    75,
    6500.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000007',
    'Deployment Assistance',
    'Guidance for environment configuration, Docker, deployment checks, and production readiness.',
    90,
    8000.00,
    TRUE
),
(
    'b0000000-0000-4000-8000-000000000008',
    'Legacy System Assessment',
    'An assessment of an existing system before migration, redesign, or modernization.',
    120,
    10000.00,
    FALSE
)
ON CONFLICT (id)
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    duration_minutes = EXCLUDED.duration_minutes,
    price = EXCLUDED.price,
    is_active = EXCLUDED.is_active;

-- ============================================================
-- 3. SAMPLE BOOKINGS
-- ============================================================
--
-- Dates are generated relative to CURRENT_DATE, so the sample
-- bookings remain in the future whenever this file is first run.
-- ============================================================

INSERT INTO bookings (
    id,
    customer_name,
    customer_email,
    customer_phone,
    service_id,
    booking_date,
    booking_time,
    status,
    notes
)
VALUES
(
    'c0000000-0000-4000-8000-000000000001',
    'Kasun Perera',
    'kasun.perera@example.com',
    '0771234567',
    'b0000000-0000-4000-8000-000000000001',
    CURRENT_DATE + 2,
    '09:00:00',
    'PENDING',
    'Needs guidance for a new booking platform.'
),
(
    'c0000000-0000-4000-8000-000000000002',
    'Nimali Fernando',
    'nimali.fernando@example.com',
    '0712345678',
    'b0000000-0000-4000-8000-000000000002',
    CURRENT_DATE + 2,
    '11:00:00',
    'CONFIRMED',
    'Wants to discuss a company website redesign.'
),
(
    'c0000000-0000-4000-8000-000000000003',
    'Tharindu Silva',
    'tharindu.silva@example.com',
    '0763456789',
    'b0000000-0000-4000-8000-000000000003',
    CURRENT_DATE + 3,
    '10:30:00',
    'PENDING',
    'Reviewing a university project dashboard.'
),
(
    'c0000000-0000-4000-8000-000000000004',
    'Ishara Jayasinghe',
    'ishara.j@example.com',
    '0754567890',
    'b0000000-0000-4000-8000-000000000004',
    CURRENT_DATE + 4,
    '13:30:00',
    'CONFIRMED',
    'Needs PostgreSQL schema and indexing advice.'
),
(
    'c0000000-0000-4000-8000-000000000005',
    'Ravindu Gunasekara',
    'ravindu.g@example.com',
    '0705678901',
    'b0000000-0000-4000-8000-000000000005',
    CURRENT_DATE + 5,
    '15:00:00',
    'PENDING',
    'Integrating a Next.js frontend with a NestJS API.'
),
(
    'c0000000-0000-4000-8000-000000000006',
    'Sajini Wickramasinghe',
    'sajini.w@example.com',
    '0786789012',
    'b0000000-0000-4000-8000-000000000006',
    CURRENT_DATE + 6,
    '09:30:00',
    'COMPLETED',
    'Backend code review.'
),
(
    'c0000000-0000-4000-8000-000000000007',
    'Dilan Maduranga',
    'dilan.m@example.com',
    '0727890123',
    'b0000000-0000-4000-8000-000000000007',
    CURRENT_DATE + 7,
    '14:00:00',
    'CANCELLED',
    'Docker deployment support.'
),
(
    'c0000000-0000-4000-8000-000000000008',
    'Harini De Silva',
    'harini.desilva@example.com',
    '0748901234',
    'b0000000-0000-4000-8000-000000000001',
    CURRENT_DATE + 8,
    '10:00:00',
    'CONFIRMED',
    'Architecture consultation for a final-year project.'
),
(
    'c0000000-0000-4000-8000-000000000009',
    'Chamod Bandara',
    'chamod.bandara@example.com',
    '0779012345',
    'b0000000-0000-4000-8000-000000000003',
    CURRENT_DATE + 9,
    '16:00:00',
    'PENDING',
    'Mobile responsiveness and accessibility review.'
),
(
    'c0000000-0000-4000-8000-000000000010',
    'Piumi Rathnayake',
    'piumi.r@example.com',
    '0710123456',
    'b0000000-0000-4000-8000-000000000004',
    CURRENT_DATE + 10,
    '11:30:00',
    'CONFIRMED',
    'Entity relationship and migration review.'
),
(
    'c0000000-0000-4000-8000-000000000011',
    'Ayesh Lakmal',
    'ayesh.lakmal@example.com',
    '0761122334',
    'b0000000-0000-4000-8000-000000000005',
    CURRENT_DATE + 11,
    '13:00:00',
    'PENDING',
    'JWT refresh-token integration support.'
),
(
    'c0000000-0000-4000-8000-000000000012',
    'Shenali Peris',
    'shenali.peris@example.com',
    '0752233445',
    'b0000000-0000-4000-8000-000000000006',
    CURRENT_DATE + 12,
    '15:30:00',
    'COMPLETED',
    'Frontend and backend integration review.'
)
ON CONFLICT (id)
DO NOTHING;

COMMIT;

-- ============================================================
-- 4. VERIFICATION
-- ============================================================

SELECT
    id,
    name,
    email
FROM users
WHERE email IN (
    'admin@en2h.com',
    'staff@en2h.com'
)
ORDER BY email;

SELECT
    id,
    title,
    duration_minutes,
    price,
    is_active
FROM services
WHERE id::text LIKE 'b0000000-%'
ORDER BY title;

SELECT
    b.id,
    b.customer_name,
    s.title AS service,
    b.booking_date,
    b.booking_time,
    b.status
FROM bookings b
INNER JOIN services s
    ON s.id = b.service_id
WHERE b.id::text LIKE 'c0000000-%'
ORDER BY b.booking_date, b.booking_time;
