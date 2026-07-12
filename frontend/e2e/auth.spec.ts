import { expect, test } from "@playwright/test";
import { customerUser, mockApi } from "./fixtures/api";

test.describe("authentication forms and session routing", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page, { user: customerUser });
  });

  test("FE-LGN validates required login fields and password visibility", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    const password = page.locator('input[name="password"]');
    await expect(password).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("FE-LGN stores authenticated session and redirects to dashboard", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill(customerUser.email);
    await page.locator('input[name="password"]').fill("Password123!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: `Welcome back, ${customerUser.name}` }),
    ).toBeVisible();

    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem("en2h.accessToken")),
      )
      .toBe("access-token");
    await expect
      .poll(async () =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("en2h.user") ?? "{}").email,
        ),
      )
      .toBe(customerUser.email);
  });

  test("FE-REG validates registration and redirects after successful account creation", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(
      page.getByText("Name must be at least 2 characters"),
    ).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();

    await page.getByLabel("Full Name").fill(customerUser.name);
    await page.getByLabel("Email").fill(customerUser.email);
    await page.getByLabel("Password", { exact: true }).fill("Password123!");
    await page.getByLabel("Confirm Password").fill("Password123?");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    await page.getByLabel("Confirm Password").fill("Password123!");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("FE-SES redirects protected booking route to login for guests", async ({
    page,
  }) => {
    await page.goto("/book");

    await expect(page).toHaveURL(/\/login\?redirect=\/book$/);
  });
});
