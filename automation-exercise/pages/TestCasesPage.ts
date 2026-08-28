import { Page, Locator, expect } from "@playwright/test";
import { HomePage } from "./HomePage";

export class TestCasesPage {
  readonly page: Page;
  readonly testCasesHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.testCasesHeader = page
      .getByRole("heading", { name: "Test Cases" })
      .first();
  }

  async goto() {
    await this.page.goto("/");
  }

  async verifyTestCasesPageVisibility() {
    await expect(this.testCasesHeader).toBeVisible();
  }
}
