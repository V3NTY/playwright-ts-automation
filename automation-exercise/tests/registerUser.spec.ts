import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  generateRandomIndexBetween,
  countSelectorOptions,
} from "../utils/helpers";
test.describe("Register User", () => {
  test.beforeEach("Verify home page visibility", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Consent" }).click();

    // 1. Verify URL
    await expect(page).toHaveURL("https://automationexercise.com/");

    // 2. Verify page title
    await expect(page).toHaveTitle("Automation Exercise");

    // 3. Verify logo visibility
    const homeLogo = page.locator('img[alt="Website for automation practice"]');
    await expect(homeLogo).toBeVisible();
  });

  test("Register", async ({ page }) => {
    const randomName = faker.person.fullName();
    const randomEmail = `${faker.person.firstName()}${faker.person.lastName()}+${Math.random()}@xyz.com`;

    const signupLoginButton = page.getByText("Signup / Login");
    await signupLoginButton.click();

    const signupForm = page.locator(".signup-form");

    const signupFormHeader = signupForm.getByRole("heading", {
      name: "New User Signup!",
    });
    await expect(signupFormHeader).toBeVisible();

    const nameInput = signupForm.getByPlaceholder("Name");
    const emailAddressInput = signupForm.getByPlaceholder("Email Address");
    await nameInput.fill(randomName);
    await emailAddressInput.fill(randomEmail);

    await expect(nameInput).toHaveValue(randomName);
    await expect(emailAddressInput).toHaveValue(randomEmail);
    const signupButton = page.getByRole("button", { name: "Signup" });
    await signupButton.click();

    const loginForm = page.locator(".login-form");

    const loginFormHeader = loginForm.getByRole("heading", {
      name: "Enter account information",
    });
    await expect(loginFormHeader).toBeVisible();
    const titleInput = page.locator('[data-qa="title"]').first();
    const passwordInput = page.getByLabel("Password");
    const birthDaySelector = page.locator('[data-qa="days"]');
    const birthMonthSelector = page.locator('[data-qa="months"]');
    const birthYearSelector = page.locator('[data-qa="years"]');

    const firstNameInput = page.getByLabel("First name");
    const lastNameInput = page.getByLabel("Last name");
    const addressInput = page.getByLabel("Address ").first();
    const countrySelector = page.getByLabel("Country");
    const stateInput = page.getByLabel("State");
    const cityInput = page.locator('[data-qa="city"]');
    const zipcodeInput = page.locator('[data-qa="zipcode"]');
    const mobileNumberInput = page.getByLabel("Mobile number");
    const createAccountButton = page.locator('[data-qa="create-account"]');

    const countrySelectorCount = await countrySelector
      .locator("option")
      .count();

    const birthDaySelectorCount = await countSelectorOptions(birthDaySelector);
    // console.log(birthDaySelectorCount);

    const birthMonthSelectorCount =
      await countSelectorOptions(birthMonthSelector);
    // console.log(birthMonthSelectorCount);

    const birthYearSelectorCount =
      await countSelectorOptions(birthYearSelector);
    // console.log(birthYearSelectorCount);

    const createdAccountHeader = page.locator('[data-qa="account-created"]');

    const continueButton = page.locator('[data-qa="continue-button"]');

    const deletedAccountHeader = page.locator('[data-qa="account-deleted"]');

    const deleteAccountButton = page.getByText("Delete Account");

    const loggedInAsElement = page.getByText(/Logged in as/i);

    await titleInput.click();
    await passwordInput.fill("xyz_123");
    await birthDaySelector.selectOption({
      index: generateRandomIndexBetween(0, birthDaySelectorCount),
    });
    await birthMonthSelector.selectOption({
      index: generateRandomIndexBetween(0, birthMonthSelectorCount),
    });

    await birthYearSelector.selectOption({
      index: generateRandomIndexBetween(0, birthYearSelectorCount),
    });

    await firstNameInput.fill(faker.person.firstName());
    await lastNameInput.fill(faker.person.lastName());
    await addressInput.fill(faker.location.streetAddress());
    await countrySelector.selectOption({
      index: generateRandomIndexBetween(0, countrySelectorCount),
    });
    await stateInput.fill(faker.location.state());
    await cityInput.fill(faker.location.city());
    await zipcodeInput.fill(faker.location.zipCode());
    await mobileNumberInput.fill(faker.phone.number());
    await createAccountButton.click();

    await expect(createdAccountHeader).toBeVisible();

    await continueButton.click();

    await expect(loggedInAsElement).toBeVisible();
    await deleteAccountButton.click();

    await expect(deletedAccountHeader).toBeVisible();
    await continueButton.click();
  });
});
