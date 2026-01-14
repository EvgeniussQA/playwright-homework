import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: "Search" }).click();
});


test("Select the desired date in the calendar", async ({ page }) => {
    let date = new Date(2014, 4, 2);

    const dateInDatePicker = date.getDate().toString(); // 2
    const expectedDate = date.toLocaleString('en-US', { day: '2-digit' }); // 02
    const expectedMonthShort = date.toLocaleString('en-US', { month: '2-digit' }); // 05
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedYear}/${expectedMonthShort}/${expectedDate}`; // 2014/05/02
    
    await page.getByRole("link", { name: "Harold Davis" }).click();
    await page.getByRole("button", { name: "Add New Pet" }).click();
    await expect(page.locator('#name')).toBeVisible();
    await page.locator('#name').fill('Tom');
    await expect(page.locator(".glyphicon-ok")).toBeVisible();
    await page.locator('.mat-mdc-button-touch-target').click();
    

    // TBH I'm not sure if that loop is the best to select date, it takes time
    // But I just repeated what was shown in the lesson
    // LMK if there's more effective way to do it (kinda opening drop down with months?)
    let calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent();
    const expectedMonthAndYear = `${expectedMonthShort} ${expectedYear}`;
    while(!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.getByRole('button', { name: 'Previous month' }).click();
        calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent();
    }

    await page.locator('.mat-calendar-body-cell').getByText(dateInDatePicker, {exact: true}).click();
    await expect(page.locator('input[name="birthDate"]')).toHaveValue(dateToAssert);
    await page.locator('#type').selectOption('dog');
    await page.getByRole("button", { name: "Save Pet" }).click();
    // It's been tricky to select the newly created pet, so I used nth(1) to select the second pet in the list
    const tomPetTable = page.locator('app-pet-list').nth(1);
    await expect(tomPetTable.locator('dt:has-text("Name") + dd')).toHaveText('Tom');
    await expect(tomPetTable.locator('dt:has-text("Birth Date") + dd')).toHaveText('2014-05-02');
    await expect(tomPetTable.locator('dt:has-text("Type") + dd')).toHaveText('dog');
    await tomPetTable.getByRole('button', { name: 'Delete Pet' }).click();
    await expect(page.locator('app-pet-list').filter({ hasText: 'Tom' })).toHaveCount(0);
});

test("Select the dates of visits and validate dates order.", async ({ page }) => {
    let date = new Date();
    const currentDate = date.getDate().toString(); // current day (14)
    const currentMonth = date.toLocaleString('en-US', { month: '2-digit' }); // current month (06)
    const currentYear = date.getFullYear(); // current year (2024)
    const dateToAssert = `${currentYear}/${currentMonth}/${currentDate}`; // 2024/06/14

    await page.getByRole("link", { name: "Jean Coleman" }).click();
    // Here I tried another way to locate a pet table
    await page.locator('td .dl-horizontal', { hasText: 'Samantha' }).getByRole('button', { name: 'Add Visit' }).click();
    await expect(page.getByRole('heading')).toHaveText('New Visit');
    // I'm not sure about those 2 assertions...
    // But left it like that since there's only 1 table and 1 row with info
    await expect(page.locator('tr td').nth(0)).toHaveText('Samantha');
    await expect (page.locator('tr td').nth(3)).toHaveText('Jean Coleman');
    await page.locator('.mat-mdc-button-touch-target').click();
    await page.getByRole('button', { name:  currentDate }).click();
    await expect(page.locator('input[name="date"]')).toHaveValue(dateToAssert);
    await page.locator('#description').fill('dermatologists visit');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    // Maybe this assertion can be simplified? Tried to make it unique enough
    const samanthaPet = page.locator('app-pet-list').filter({ hasText: 'Samantha' });
    await expect(samanthaPet.locator('app-visit-list td').first()).toHaveText(`${currentYear}-${currentMonth}-${currentDate}`);    
    await samanthaPet.getByRole('button', { name: 'Add Visit' }).click();
    await page.locator('.mat-mdc-button-touch-target').click();
    date.setDate(date.getDate() - 45);
    const pastDay = date.getDate().toString();
    const pastMonth = date.toLocaleString('en-US', { month: '2-digit' });
    const pastYear = date.getFullYear(); 
    const pastMonthAndYear = `${pastMonth} ${pastYear}`;
    let calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent();
    while(!calendarMonthAndYear?.includes(pastMonthAndYear)) {
        await page.getByRole('button', { name: 'Previous month' }).click();
        calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent();
    }
    await page.getByRole('button', { name: pastDay }).click();
    await page.locator('#description').fill('massage therapy');
    await page.getByRole('button', { name: 'Add Visit' }).click();
const samanthaVisitList = samanthaPet.locator("app-visit-list tr");
const currentVisitDate = await samanthaVisitList.filter({ hasText: "dermatologists visit" }).locator('td').first().textContent();  
const pastVisitDate = await samanthaVisitList.filter({ hasText: "massage therapy" }).locator('td').first().textContent();
expect(currentVisitDate! > pastVisitDate!).toBeTruthy();

const visitDescriptions = ["dermatologists visit", "massage therapy"];
for (const description of visitDescriptions) {
    await samanthaVisitList.filter({ hasText: description }).getByRole('button', { name: 'Delete Visit' }).click();
    await expect(samanthaVisitList.filter({ hasText: description })).toHaveCount(0);
}
});

