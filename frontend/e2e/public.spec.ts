import { expect, test } from "@playwright/test";
import { mockApi, services } from "./fixtures/api";

test.describe("public navigation and services", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test("FE-LND/FE-NAV renders primary public navigation actions", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "EN2H Home" })).toBeVisible();

    const desktopNavServices = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Services" });

    if (await desktopNavServices.isVisible()) {
      await expect(desktopNavServices).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Book Now" }).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Login" }).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Register" }).first(),
      ).toBeVisible();
    } else {
      await page.getByRole("button", { name: "Open menu" }).click();
      const mobileNav = page.getByRole("navigation", {
        name: "Mobile navigation",
      });
      await expect(
        mobileNav.getByRole("link", { name: "Services" }),
      ).toBeVisible();
      await expect(
        mobileNav.getByRole("link", { name: "Book Now" }),
      ).toBeVisible();
      await expect(
        mobileNav.getByRole("link", { name: "Login" }),
      ).toBeVisible();
      await expect(
        mobileNav.getByRole("link", { name: "Register" }),
      ).toBeVisible();
    }
  });

  test("FE-PSV lists active public services and deep-links into booking", async ({
    page,
  }) => {
    await page.goto("/services");

    await expect(
      page.getByRole("heading", { name: "Available Services" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: services[0].title }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: services[1].title }),
    ).toBeVisible();

    const bookingLink = page
      .locator(".aether-card")
      .filter({ hasText: services[0].title })
      .getByRole("link", { name: "Book Now" });
    await expect(bookingLink).toHaveAttribute(
      "href",
      `/book?serviceId=${services[0].id}`,
    );
  });

  test("FE-PSV filters service search results through the public API query", async ({
    page,
  }) => {
    await page.goto("/services");

    await page.getByRole("searchbox").fill("Strategy");

    await expect(
      page.getByRole("heading", { name: services[0].title }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: services[1].title }),
    ).toBeHidden();
  });

  test("FE-RSP renders primary public routes without horizontal overflow", async ({
    page,
  }) => {
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/", "/services", "/login", "/register"]) {
        await page.goto(route);
        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(
          hasHorizontalOverflow,
          `${route} at ${width}px should not overflow horizontally`,
        ).toBe(false);
      }
    }
  });
});
