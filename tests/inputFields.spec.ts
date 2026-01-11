import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  // I put first and second steps of the homework into the beforeEach hook
  // to avoid code duplication in each test, since the step and assertion are common for all tests
  await page.getByRole("link", { name: "Pet Types" }).click();
  await expect(page.getByRole("heading", { name: "Pet Types" })).toHaveText(
    "Pet Types"
  );
});

test("Update pet type", async ({ page }) => {
  // Here I declare the locator variables for further reuse
  const editButton = page.getByRole("button", { name: "Edit" }).first();
  const editPageTitle = page.getByRole("heading", { name: "Edit Pet Type" });
  const nameInput = page.locator("#name");
  const updateButton = page.getByRole("button", { name: "Update" });
  const firstPetName = page.locator('[name="pettype_name"]').first();

  // 3. Click on "Edit" button for the "cat" pet type
  // 4. Add assertion of the "Edit Pet Type" text displayed
  await editButton.click();
  await expect(editPageTitle).toHaveText("Edit Pet Type");

  // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button
  // 6. Add the assertion that the first pet type in the list of types has a value "rabbit"
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("rabbit");
  await updateButton.click();
  await expect(firstPetName).toHaveValue("rabbit");

  // 7. Click on "Edit" button for the same "rabbit" pet type
  // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
  await editButton.click();
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("cat");
  await updateButton.click();

  // 9. Add the assertion that the first pet type in the list of types has a value "cat"
  await expect(firstPetName).toHaveValue("cat");
});

test("Cancel pet type update", async ({ page }) => {
  // Here I declare the locator variables for further reuse
  // Added expectedPetType to ensure I always search for the correct pet type in the list
  const expectedPetType = "dog";
  const editButton = page
    .getByRole("row", { name: expectedPetType })
    .getByRole("button", { name: "Edit" });
  const nameInput = page.locator("#name");
  const cancelButton = page.getByRole("button", { name: "Cancel" });
  const petTypeInList = page
    .getByRole("row", { name: expectedPetType })
    .locator('[name="pettype_name"]');

  // 3. Click on "Edit" button for the "dog" pet type
  await editButton.click();
  await nameInput.click();
  await nameInput.clear();
  // 4. Type the new pet type name "moose"
  // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
  await nameInput.fill("moose");
  await expect(nameInput).toHaveValue("moose");
  // 6. Click on "Cancel" button
  // 7. Add the assertion the value "dog" is still displayed in the list of pet types
  await cancelButton.click();
  await expect(petTypeInList).toHaveValue(expectedPetType);
});

test("Cancel pet type update for lizard", async ({ page }) => {
  // Here I declare the locator variables for further reuse
  const expectedPetType = "lizard";
  const editButton = page
    .getByRole("row", { name: expectedPetType })
    .getByRole("button", { name: "Edit" });
  const nameInput = page.locator("#name");
  const updateButton = page.getByRole("button", { name: "Update" });
  const cancelButton = page.getByRole("button", { name: "Cancel" });
  const validationMessage = page.getByText("Name is required");
  const editPageTitle = page.getByRole("heading", { name: "Edit Pet Type" });

  // 3. Click on "Edit" button for the "lizard" pet type
  // 4. On the Edit Pet Type page, clear the input field
  await editButton.click();
  await nameInput.click();
  await nameInput.clear();
  // 5. Add the assertion for the "Name is required" message below the input field
  await expect(validationMessage).toBeVisible();
  // 6. Click on "Update" button
  await updateButton.click();
  // 7. Add assertion that "Edit Pet Type" page is still displayed
  await expect(editPageTitle).toBeVisible();
  // 8. Click on "Cancel" button
  await cancelButton.click();
  // 9. Add assertion that "Pet Types" page is displayed
  await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();
});
