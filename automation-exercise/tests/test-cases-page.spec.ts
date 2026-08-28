import { test, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { TestCasesPage } from "../pages/TestCasesPage";

test.describe("Test cases page", () => {
  let homePage: HomePage;
  let testCasesPage: TestCasesPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testCasesPage = new TestCasesPage(page);
    await homePage.goto();
    await homePage.verifyHomePageLoaded();
  });

  test("Verify Test Cases Page", async () => {
    await homePage.clickTestCasesLink();
    await testCasesPage.verifyTestCasesPageVisibility();
  });
});
