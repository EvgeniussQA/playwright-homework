import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Pet Types" }).click();
  await expect(page.getByRole("heading")).toHaveText("Pet Types");
});

test("Update pet type", async ({ page }) => {
  const nameInput = page.locator("#name");

  await page.getByRole("button", { name: "Edit" }).first().click();
  await expect(page.getByRole("heading")).toHaveText("Edit Pet Type");

  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("rabbit");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[name="pettype_name"]').first()).toHaveValue(
    "rabbit"
  );

  await page.getByRole("button", { name: "Edit" }).first().click();
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("cat");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[name="pettype_name"]').first()).toHaveValue(
    "cat"
  );
});

test("Cancel pet type update", async ({ page }) => {
  const nameInput = page.locator("#name");

  await page
    .getByRole("row", { name: "dog" })
    .getByRole("button", { name: "Edit" })
    .click();
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("moose");
  await expect(nameInput).toHaveValue("moose");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator('[name="pettype_name"]').nth(1)).toHaveValue("dog");
});

test("Cancel pet type update for lizard", async ({ page }) => {
  const nameInput = page.locator("#name");
  await page
    .getByRole("row", { name: "lizard" })
    .getByRole("button", { name: "Edit" })
    .click();
  await nameInput.click();
  await nameInput.clear();
  await expect(
    page.locator(".help-block", { hasText: "Name is required" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Update" }).click();
  await expect(
    page.getByRole("heading", { name: "Edit Pet Type" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(
    page.getByRole("heading", { name: "Pet Types" })
  ).toBeVisible();
});
