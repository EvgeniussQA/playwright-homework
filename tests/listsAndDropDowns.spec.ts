import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.locator('a.dropdown-toggle:has-text("Owners")').click();
  await page.getByRole("link", { name: /search/i }).click();
  await expect(page.getByRole("heading", { name: "Owners" })).toHaveText(
    "Owners"
  );
});

test("Validate selected pet types from the list", async ({ page }) => {
  const ownerName = page.getByText("George Franklin");
  const petTypeDropdown = page.locator("select#type");
  const editPetButton = page
    .locator('dl:has-text("Leo")')
    .getByRole("button", { name: "Edit Pet" });
  const petHeading = page.getByRole("heading", { name: "Pet" });
  const petTypeValue = page.locator("input#type1");

  await ownerName.click();
  await expect(page.locator("b.ownerFullName")).toHaveText("George Franklin");
  await editPetButton.click();
  await expect(petHeading).toHaveText("Pet");
  await expect(page.locator("input#owner_name")).toHaveValue("George Franklin");
  await expect(petTypeValue).toHaveValue("cat");

  const petTypes = ["cat", "dog", "lizard", "snake", "bird", "hamster"];
  for (const type of petTypes) {
    await petTypeDropdown.selectOption(type);
    await expect(petTypeValue).toHaveValue(type);
  }
});

test("Validate the pet type update", async ({ page }) => {
  const ownerName = page.getByText("Eduardo Rodriquez");
  const editPetRosyButton = page
    .locator('dl:has-text("Rosy")')
    .getByRole("button", { name: "Edit Pet" });
  const petNameInput = page.locator("input#name");
  const petTypeDropdown = page.locator("select#type");
  const petTypeValue = page.locator("input#type1");
  const updatePetButton = page.getByRole("button", { name: "Update Pet" });
  const rosyPetSection = page.locator('dl:has-text("Rosy")');

  await ownerName.click();
  await editPetRosyButton.click();
  await expect(petNameInput).toHaveValue("Rosy");
  await expect(petTypeValue).toHaveValue("dog");
  await petTypeDropdown.selectOption("bird");
  await expect(petTypeValue).toHaveValue("bird");
  await expect(petTypeDropdown).toHaveValue("bird");
  await updatePetButton.click();
  await expect(rosyPetSection).toContainText("bird");
  // Revert changes back to dog value
  await editPetRosyButton.click();
  await petTypeDropdown.selectOption("dog");
  await expect(petTypeValue).toHaveValue("dog");
  await expect(petTypeDropdown).toHaveValue("dog");
  await updatePetButton.click();
  await expect(rosyPetSection).toContainText("dog");
});
