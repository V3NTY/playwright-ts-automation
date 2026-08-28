import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly consentButton: Locator;
  readonly logo: Locator;
  readonly signupLoginLink: Locator;
  readonly loggedInAsText: Locator;
  readonly deleteAccountLink: Locator;
  readonly deletedAccountHeader: Locator;
  readonly continueBtn: Locator;
  readonly logoutBtn: Locator;
  readonly testCasesLink: Locator;
  readonly productsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentButton = page.getByRole("button", { name: "Consent" });
    this.logo = page.locator('img[alt="Website for automation practice"]');
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.loggedInAsText = page.getByText(/Logged in as/i);
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.deletedAccountHeader = page.locator('[data-qa="account-deleted"]');
    this.continueBtn = page.locator('[data-qa="continue-button"]');
    this.logoutBtn = page.getByRole("link", { name: "Logout" });
    this.testCasesLink = page
      .locator(".shop-menu")
      .getByRole("link", { name: "Test Cases" });
    this.productsLink = page.getByRole("link", { name: "Products" });
  }

  async goto() {
    await this.page.goto("/");
    if (await this.consentButton.isVisible()) {
      await this.consentButton.click();
    }
  }

  async verifyHomePageLoaded() {
    await expect(this.page).toHaveURL("https://automationexercise.com/");
    await expect(this.page).toHaveTitle("Automation Exercise");
    await expect(this.logo).toBeVisible();
  }

  async goToSignupLogin() {
    await this.signupLoginLink.click();
  }

  async verifyUserLoggedIn() {
    await expect(this.loggedInAsText).toBeVisible();
  }

  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }

  async clickLogout() {
    await this.logoutBtn.click();
  }

  async clickTestCasesLink() {
    await this.testCasesLink.click();
  }

  async verifyAndConfirmAccountDeletion() {
    await expect(this.deletedAccountHeader).toBeVisible();
    await this.continueBtn.click();
  }
}
