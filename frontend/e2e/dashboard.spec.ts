import { expect, test } from "@playwright/test";
import { customerUser, mockApi, seedSession, staffUser } from "./fixtures/api";

test.describe("dashboard role-specific behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("FE-DSH renders customer booking tracker without staff navigation", async ({
    page,
  }) => {
    await seedSession(page, customerUser);
    await mockApi(page, { user: customerUser });

    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: `Welcome back, ${customerUser.name}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "My Active Appointments" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Services", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Bookings", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /New Booking/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("FE-DSH renders staff metrics, charts, and management links", async ({
    page,
  }) => {
    await seedSession(page, staffUser);
    await mockApi(page, { user: staffUser });

    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.getByText("Total Services")).toBeVisible();
    await expect(page.getByText("Total Bookings")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Bookings by Status" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Top Booked Services" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Services", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Bookings", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Manage Services" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Manage Bookings" }),
    ).toBeVisible();
  });

  test("FE-DSH donut hover updates center label and count", async ({
    page,
  }) => {
    await seedSession(page, staffUser);
    await mockApi(page, { user: staffUser });

    await page.goto("/dashboard");

    await page.getByText("Confirmed").nth(1).hover();
    await expect
      .poll(async () => page.locator("svg text").first().textContent())
      .toBe("CONFIRMED");
    await expect
      .poll(async () => page.locator("svg text").nth(1).textContent())
      .toBe("1");
  });

  test("FE-SES logout clears session and blocks protected navigation", async ({
    browser,
    page,
  }) => {
    await seedSession(page, customerUser);
    await mockApi(page, { user: customerUser });

    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Logout" }).click();

    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem("en2h.accessToken")),
      )
      .toBeNull();

    const guestPage = await browser.newPage();
    await mockApi(guestPage, { user: customerUser });
    await guestPage.goto("/dashboard");
    await expect(guestPage).toHaveURL(/\/login$/);
    await guestPage.close();
  });
});
