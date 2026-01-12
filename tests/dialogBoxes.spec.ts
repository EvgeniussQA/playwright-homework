import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Add and delete pet type', async ({page}) => {
    await page.getByRole('link', { name: 'Pet Types' }).click();
    await expect(page.getByRole('heading')).toHaveText('Pet Types');
    await page.getByRole('button', { name: 'Add' }).click();

// Used constant here for section locator to avoid repetition, seems as a valid usage here
// Added constant for input field since it's used multiple times
    const newPetTypeSection = page.locator('.container.xd-container');
    const petNameInputField = newPetTypeSection.locator('input#name');
    await expect(newPetTypeSection.getByRole('heading').last()).toHaveText('New Pet Type');
    await expect(newPetTypeSection.getByText('Name').last()).toBeVisible();
    await expect(petNameInputField).toBeVisible();

    await petNameInputField.fill("pig");
    await page.getByRole("button", { name: "Save" }).click();
    // Here I set locator as .last to avoid mistakenly putting the assertion value into the locator itself
    await expect(page.locator('table#pettypes input[name="pettype_name"]').last()).toHaveValue("pig");
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Delete the pet type?');
        await dialog.accept();
        });

    await page.locator('table#pettypes tbody tr').last().getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('table#pettypes input[name="pettype_name"]').last()).not.toHaveValue('pig');
});

