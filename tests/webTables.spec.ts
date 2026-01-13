import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Validate the pet name city of the owner", async ({ page }) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  const targetRowByOwner = page.getByRole("row", { name: "Jeff Black" });
  await expect(targetRowByOwner.locator("td").nth(2)).toHaveText("Monona");
  await expect(targetRowByOwner.locator("td").nth(4)).toHaveText("Lucky");
});

test("Validate owners count of the Madison city", async ({ page }) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "Madison" })
  ).toHaveCount(4);
});

test("Validate search by Last Name", async ({ page }) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  await page.getByRole("textbox").fill("Black");
  await page.getByRole("button", { name: "Find Owner" }).click();
  await expect(page.getByRole("table")).toContainText("Black");

  await page.getByRole("textbox").fill("Davis");
  await page.getByRole("button", { name: "Find Owner" }).click();
  // Added timeout to wait for table to update
  await page.waitForTimeout(500);
  const davisRows = page
    .getByRole("row")
    .filter({ has: page.locator("td.ownerFullName") });
  for (let row of await davisRows.all()) {
    const cellValue = await row.locator("td.ownerFullName").textContent();
    expect(cellValue).toContain("Davis");
  }

  await page.getByRole("textbox").fill("Es");
  await page.getByRole("button", { name: "Find Owner" }).click();
  // Added timeout to wait for table to update
  await page.waitForTimeout(500);
  const esRows = page
    .getByRole("row")
    .filter({ has: page.locator("td.ownerFullName") });
  for (let row of await esRows.all()) {
    const cellValue = await row.locator("td.ownerFullName").textContent();
    expect(cellValue).toContain("Es");
  }

  await page.getByRole("textbox").fill("Playwright");
  await page.getByRole("button", { name: "Find Owner" }).click();
  await expect(
    page.getByText('No owners with LastName starting with "Playwright"')
  ).toBeVisible();
});

test("Validate phone number and pet name on the Owner Information page", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  const targetRow = page.getByRole("row", { name: "6085552765" });
  const petName = await targetRow.locator("td").nth(4).textContent();
  await targetRow.locator("td").nth(0).getByRole("link").click();
  await expect(page.getByRole("table").first()).toContainText("6085552765");
  // Another option for a phone number locator:
  // page.getByRole('row').filter({ hasText: 'Telephone' }).locator('td');
  await expect(page.locator("dl.dl-horizontal dd").first()).toHaveText(
    petName!
  );
});

test("Validate pets of the Madison city", async ({ page }) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  const madisonRows = page.getByRole("row").filter({ hasText: "Madison" });
  await expect(madisonRows).toHaveCount(4);
  const actualPets = [];
  for (let row of await madisonRows.all()) {
    const petName = await row.locator("td").nth(4).textContent();
    if (petName) {
      actualPets.push(petName.trim());
    }
  }
  const expectedMadisonPets = ["Leo", "George", "Mulligan", "Freddy"];
  expect(actualPets).toEqual(expectedMadisonPets);
});

test("Validate specialty update", async ({ page }) => {
  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "ALL" }).click();
  // Not sure about that constant tbh... Decided to keep because it unloads assertion on line 98
  const targetRowOrtega = page.getByRole("row", { name: "Rafael Ortega" });
  await expect(targetRowOrtega.locator("td").nth(1)).toHaveText("surgery");
  await page.getByRole("link", { name: "Specialties" }).click();
  await expect(page.getByRole("heading")).toHaveText("Specialties");
  await page
    .getByRole("row", { name: "surgery" })
    .getByRole("button", { name: "Edit" })
    .click();
  await expect(page.getByRole("heading")).toHaveText("Edit Specialty");
  const textbox = page.getByRole("textbox");
  // It wasn't working without clicking before filling textbox, can you comment on it pls
  await textbox.click();
  await textbox.fill("dermatology");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[id="1"]')).toHaveValue("dermatology");
  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "ALL" }).click();
  await expect(targetRowOrtega.locator("td").nth(1)).toHaveText("dermatology");
  await page.getByRole("link", { name: "Specialties" }).click();
  await page
    .getByRole("row", { name: "dermatology" })
    .getByRole("button", { name: "Edit" })
    .click();
  await textbox.click();
  await textbox.fill("surgery");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.locator('[id="1"]')).toHaveValue("surgery");
});

test("Validate specialty lists", async ({ page }) => {
  await page.getByRole("link", { name: "Specialties" }).click();
  await page.getByRole("button", { name: "Add" }).click();
  await page.locator("#name").fill("oncology");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(500);
  const specialitiesList = [];
  const specialityRows = page.locator("tbody tr");

  for (const row of await specialityRows.all()) {
    const speciality = await row.locator(".form-control").inputValue();
    if (speciality) {
      specialitiesList.push(speciality.trim());
    }
  }

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "ALL" }).click();
  const sharonVetRow = page.getByRole("row", { name: "Sharon Jenkins" });
  await sharonVetRow.getByRole("button", { name: "Edit" }).click();
  await page.locator(".dropdown-display").click();
  const specialitiesFromDropdown = [];
  const dropdownOptions = page.locator(".dropdown-content label");

  for (const option of await dropdownOptions.all()) {
    const speciality = await option.textContent();
    if (speciality) {
      specialitiesFromDropdown.push(speciality.trim());
    }
  }

  expect(specialitiesFromDropdown).toEqual(specialitiesList);
  await page.getByRole("checkbox", { name: "oncology" }).check();
  await page.locator(".dropdown-display").click();
  await page.getByRole("button", { name: "Save Vet" }).click();
  await expect(sharonVetRow.locator("td").nth(1)).toHaveText("oncology");
  await page.getByRole("link", { name: "Specialties" }).click();
  await page.getByRole("row", { name: "oncology" }).getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "ALL" }).click();
  await expect(sharonVetRow.locator("td").nth(1)).toBeEmpty();
});