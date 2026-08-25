import { Page, Locator, expect } from "@playwright/test";
import { generateRandomIndexBetween } from "../utils/helpers";
import fs from "fs";
import { updateAuthCredentials } from "../utils/authHelper";

export class RegisterPage {
  readonly page: Page;
  readonly accountInfoHeader: Locator;
  readonly titleRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountBtn: Locator;
  readonly createdAccountHeader: Locator;

  readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountInfoHeader = page.getByRole("heading", {
      name: "Enter account information",
    });
    this.titleRadio = page.locator('[data-qa="title"]').first();
    this.passwordInput = page.getByLabel("Password");
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');
    this.firstNameInput = page.getByLabel("First name");
    this.lastNameInput = page.getByLabel("Last name");
    this.addressInput = page.locator('[data-qa="address"]');
    this.countrySelect = page.getByLabel("Country");
    this.stateInput = page.getByLabel("State");
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileInput = page.getByLabel("Mobile number");
    this.createAccountBtn = page.locator('[data-qa="create-account"]');
    this.createdAccountHeader = page.locator('[data-qa="account-created"]');

    this.continueBtn = page.locator('[data-qa="continue-button"]');
  }

  async verifyPageLoaded() {
    await expect(this.accountInfoHeader).toBeVisible();
  }

  async selectRandomOption(selectLocator: Locator) {
    const count = await selectLocator.locator("option").count();
    const randomIndex = generateRandomIndexBetween(1, count - 1);
    await selectLocator.selectOption({ index: randomIndex });
  }
  async fillAccountDetails(password: string) {
    await this.titleRadio.check();
    await this.passwordInput.fill(password);
    updateAuthCredentials({ password });
    await this.selectRandomOption(this.daysSelect);
    await this.selectRandomOption(this.monthsSelect);
    await this.selectRandomOption(this.yearsSelect);
  }

  async fillAddressInformation(userData: any) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.selectRandomOption(this.countrySelect);
    await this.stateInput.fill(userData.state);
    await this.cityInput.fill(userData.city);
    await this.zipcodeInput.fill(userData.zipCode);
    await this.mobileInput.fill(userData.phoneNumber);
  }

  async submitAccountCreation() {
    await this.createAccountBtn.click();
    await expect(this.createdAccountHeader).toBeVisible();
    await this.continueBtn.click();
  }
}
