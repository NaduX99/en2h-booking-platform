import { expect, test } from "@playwright/test";
import { customerUser, mockApi, seedSession, services } from "./fixtures/api";

test.describe("booking form workflow", () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page, customerUser);
    await mockApi(page, { user: customerUser });
  });

  test("FE-BKF preselects service and prefills authenticated customer fields", async ({
    page,
  }) => {
    await page.goto(`/book?serviceId=${services[0].id}`);

    await expect(
      page.getByRole("heading", { name: "Make a Booking" }),
    ).toBeVisible();
    await expect(page.getByLabel("Service")).toHaveValue(services[0].id);
    await expect(page.getByLabel("Full Name")).toHaveValue(customerUser.name);
    await expect(page.getByLabel("Email")).toHaveValue(customerUser.email);
    await expect(page.getByLabel("Full Name")).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Email")).toHaveAttribute("readonly", "");
  });

  test("FE-BKF connects validation errors to booking form fields", async ({
    page,
  }) => {
    await page.goto("/book");

    await page.getByRole("button", { name: "Submit Booking" }).click();

    await expect(page.getByText("Please select a service")).toBeVisible();
    await expect(
      page.getByText("Phone number must be at least 7 digits"),
    ).toBeVisible();
    await expect(page.getByText("Please select a date")).toBeVisible();
    await expect(page.getByText("Please select a time")).toBeVisible();
    await expect(page.getByLabel("Phone Number")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("FE-BKF submits a valid booking and displays confirmation details", async ({
    page,
  }) => {
    await page.goto(`/book?serviceId=${services[0].id}`);

    await page.getByLabel("Phone Number").fill("+15551234567");
    await page.getByLabel("Date").fill("2026-08-01");
    await page.getByLabel("Time").fill("14:30");
    await page
      .getByLabel("Notes (optional)")
      .fill("Please send a preparation checklist.");
    await page.getByRole("button", { name: "Submit Booking" }).click();

    await expect(
      page.getByRole("heading", { name: "Booking Submitted!" }),
    ).toBeVisible();
    await expect(page.getByText(services[0].title)).toBeVisible();
    await expect(page.getByText("PENDING")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Another Booking" }),
    ).toBeVisible();
  });
});
