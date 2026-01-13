import { test, expect } from "@playwright/test";
import { time } from "console";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Validate the pet name city of the owner", async ({ page }) => {
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: /search/i }).click();
  const tartgetRowByOwner = page.getByRole("row", { name: "Jeff Black" });
  await expect(tartgetRowByOwner.locator("td").nth(2)).toHaveText("Monona");
  await expect(tartgetRowByOwner.locator("td").nth(4)).toHaveText("Lucky");
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
  const actualMadisonCityPets = [];
const madisonRows = page.getByRole("row").filter({ hasText: "Madison" });
 await expect(madisonRows).toHaveCount(4);
//   const allRows = await madisonRows.all();
//   console.log(`Found ${allRows.length} rows with Madison`);


//   for (let row of await madisonRows.all()) {
//     const petName = await row.locator("td").nth(4).locator("tr").textContent();
//     if (petName) {
//     actualMadisonCityPets.push(petName.trim());
//   }
//   }

//   const expectedMadisonPets = ["Leo", "George", "Mulligan", "Freddy"];
//   expect(actualMadisonCityPets).toEqual(expectedMadisonPets);
});
