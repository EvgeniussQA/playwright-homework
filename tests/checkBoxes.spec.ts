import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Veterinarians").click();
  await page.getByText("All").click();
});

test("Validate selected specialties", async ({ page }) => {
  const specialitiesDropdown = page.locator(".selected-specialties");
  const radiologyCheckbox = page.getByRole("checkbox", {
    name: "radiology",
  });
  const surgeryCheckbox = page.getByRole("checkbox", { name: "surgery" });
  const dentistryCheckbox = page.getByRole("checkbox", {
    name: "dentistry",
  });

  await expect(page.getByRole("heading")).toHaveText("Veterinarians");
  await page
    .getByRole("row", { name: "Helen Leary" })
    .getByRole("button", { name: "Edit Vet" })
    .click();
  await expect(specialitiesDropdown).toHaveText("radiology");
  await specialitiesDropdown.click();
  await expect(radiologyCheckbox).toBeChecked();
  await expect(surgeryCheckbox).not.toBeChecked();
  await expect(dentistryCheckbox).not.toBeChecked();
  await surgeryCheckbox.check({ force: true });
  await radiologyCheckbox.uncheck({ force: true });
  await expect(specialitiesDropdown).toHaveText("surgery");
  await dentistryCheckbox.check({ force: true });
  await expect(specialitiesDropdown).toHaveText("surgery, dentistry");
});

test("Select all specialties", async ({ page }) => {
  const specialitiesDropdown = page.locator(".selected-specialties");
  await page
    .getByRole("row", { name: "Rafael Ortega" })
    .getByRole("button", { name: "Edit Vet" })
    .click();
  await expect(specialitiesDropdown).toHaveText("surgery");
  await specialitiesDropdown.click();

  const allBoxes = page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.check({ force: true });
    expect(await box.isChecked()).toBeTruthy();
  }
  await expect(specialitiesDropdown).toHaveText(
    "surgery, radiology, dentistry"
  );
});

test("Deselect all specialties", async ({ page }) => {
  const specialitiesDropdown = page.locator(".selected-specialties");

  await page
    .getByRole("row", { name: "Linda Douglas" })
    .getByRole("button", { name: "Edit Vet" })
    .click();
  // UI displays "dentistry, surgery" (different order than requirements)
  await expect(specialitiesDropdown).toHaveText("dentistry, surgery");
  await specialitiesDropdown.click();

  const allBoxes = page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    expect(await box.isChecked()).toBeFalsy();
  }
  await expect(specialitiesDropdown).toBeEmpty();
});
