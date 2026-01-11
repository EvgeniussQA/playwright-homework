import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Veterinarians").click();
  await page.getByText("All").click();
  await page.waitForSelector("tbody tr");
});

test("Validate selected specialties", async ({ page }) => {
  const vetPage = page.getByRole("heading", { name: "Veterinarians" });
  const vetName = "Helen Leary";
  const editVetButton = page
    .getByRole("row", { name: vetName })
    .getByRole("button", { name: "Edit Vet" });
  const specialitiesDropdown = page.locator(".selected-specialties");
  const radiologyCheckbox = page.getByRole("checkbox", {
    name: "radiology",
  });
  const surgeryCheckbox = page.getByRole("checkbox", { name: "surgery" });
  const dentistryCheckbox = page.getByRole("checkbox", {
    name: "dentistry",
  });

  await expect(vetPage).toHaveText("Veterinarians");
  await editVetButton.click();
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
  const vetName = "Rafael Ortega";
  const editVetButton = page
    .getByRole("row", { name: vetName })
    .getByRole("button", { name: "Edit Vet" });
  const specialitiesDropdown = page.locator(".selected-specialties");
  const radiologyCheckbox = page.getByRole("checkbox", {
    name: "radiology",
  });
  const surgeryCheckbox = page.getByRole("checkbox", { name: "surgery" });
  const dentistryCheckbox = page.getByRole("checkbox", {
    name: "dentistry",
  });

await editVetButton.click();
await expect(specialitiesDropdown).toHaveText("surgery");
await specialitiesDropdown.click();


//   const allBoxes = page.getByRole('checkbox')
// for(const box of await allBoxes.all()){
// await box.uncheck({force: true})
// expect (await box.isChecked()).toBeFalsy()
});
