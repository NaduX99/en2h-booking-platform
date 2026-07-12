import { Page, Route } from "@playwright/test";

export const API_BASE = "http://localhost:3000/api/v1";

export const customerUser = {
  id: "customer-user-id",
  name: "Ada Lovelace",
  email: "ada@example.com",
};

export const staffUser = {
  id: "staff-user-id",
  name: "EN2H Admin",
  email: "admin@en2h.com",
};

export const services = [
  {
    id: "7a45fc64-46b8-4e0a-b76b-229144d2a400",
    title: "Strategy Consultation",
    description: "A focused planning session for high-value customer outcomes.",
    duration: 60,
    price: "120.00",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "1ba5fe8d-6cc5-4f7c-a6fb-9b06fd084001",
    title: "Implementation Review",
    description: "Review the current setup and identify the next improvements.",
    duration: 90,
    price: "180.00",
    isActive: true,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

export const bookings = [
  {
    id: "b8160ba2-f32e-404d-820d-c8727d4af638",
    customerName: customerUser.name,
    customerEmail: customerUser.email,
    customerPhone: "+15551234567",
    serviceId: services[0].id,
    service: services[0],
    bookingDate: "2026-08-01",
    bookingTime: "14:30",
    status: "PENDING",
    notes: "Please send a preparation checklist.",
    cancelledAt: null,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "33c5a586-84f9-4a5e-aa5b-0d9f94d53121",
    customerName: "Grace Hopper",
    customerEmail: "grace@example.com",
    customerPhone: "+15559876543",
    serviceId: services[1].id,
    service: services[1],
    bookingDate: "2026-08-03",
    bookingTime: "09:00",
    status: "CONFIRMED",
    notes: null,
    cancelledAt: null,
    createdAt: "2026-07-02T00:00:00.000Z",
    updatedAt: "2026-07-02T00:00:00.000Z",
  },
];

type JsonBody = Record<string, unknown> | unknown[] | null;

async function fulfill(route: Route, status: number, body: JsonBody) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export async function mockApi(
  page: Page,
  options: { user?: typeof customerUser | typeof staffUser } = {},
) {
  const user = options.user ?? customerUser;

  await page.route(`${API_BASE}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace("/api/v1", "");
    const method = request.method();

    if (path === "/auth/profile" && method === "GET") {
      await fulfill(route, 200, { success: true, data: user });
      return;
    }

    if (path === "/auth/login" && method === "POST") {
      await fulfill(route, 200, {
        success: true,
        message: "Login successful",
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          tokenType: "Bearer",
          accessTokenExpiresIn: "15m",
          refreshTokenExpiresIn: "7d",
          user,
        },
      });
      return;
    }

    if (path === "/auth/register" && method === "POST") {
      await fulfill(route, 201, {
        success: true,
        message: "Registration successful",
        data: user,
      });
      return;
    }

    if (path === "/auth/refresh" && method === "POST") {
      await fulfill(route, 200, {
        success: true,
        data: {
          accessToken: "rotated-access-token",
          refreshToken: "rotated-refresh-token",
          tokenType: "Bearer",
          accessTokenExpiresIn: "15m",
          refreshTokenExpiresIn: "7d",
        },
      });
      return;
    }

    if (path === "/auth/logout" && method === "POST") {
      await fulfill(route, 200, { success: true });
      return;
    }

    if (path === "/services/public/active" && method === "GET") {
      const search = url.searchParams.get("search")?.toLowerCase();
      const filtered = search
        ? services.filter((service) =>
            service.title.toLowerCase().includes(search),
          )
        : services;
      await fulfill(route, 200, {
        success: true,
        data: filtered,
        meta: {
          page: Number(url.searchParams.get("page") ?? 1),
          limit: Number(url.searchParams.get("limit") ?? 9),
          total: filtered.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
      return;
    }

    if (path === "/services" && method === "GET") {
      await fulfill(route, 200, {
        success: true,
        data: services,
        meta: { page: 1, limit: 100, total: services.length, totalPages: 1 },
      });
      return;
    }

    if (path === "/bookings" && method === "GET") {
      const visibleBookings = user.email.endsWith("@en2h.com")
        ? bookings
        : bookings.filter((booking) => booking.customerEmail === user.email);
      await fulfill(route, 200, {
        success: true,
        data: visibleBookings,
        meta: {
          page: 1,
          limit: 100,
          total: visibleBookings.length,
          totalPages: 1,
        },
      });
      return;
    }

    if (path === "/bookings" && method === "POST") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      await fulfill(route, 201, {
        success: true,
        message: "Booking created successfully",
        data: {
          id: "new-booking-id",
          ...payload,
          customerEmail: user.email,
          status: "PENDING",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-12T00:00:00.000Z",
        },
      });
      return;
    }

    if (path.endsWith("/cancel") && method === "PATCH") {
      await fulfill(route, 200, {
        success: true,
        data: {
          ...bookings[0],
          status: "CANCELLED",
          cancelledAt: "2026-07-12T00:00:00.000Z",
        },
      });
      return;
    }

    await fulfill(route, 404, {
      success: false,
      statusCode: 404,
      message: `Unhandled test route: ${method} ${path}`,
    });
  });
}

export async function seedSession(page: Page, user = customerUser) {
  await page.addInitScript(
    ({ seededUser }) => {
      window.localStorage.setItem("en2h.accessToken", "access-token");
      window.localStorage.setItem("en2h.refreshToken", "refresh-token");
      window.localStorage.setItem("en2h.user", JSON.stringify(seededUser));
    },
    { seededUser: user },
  );
}
