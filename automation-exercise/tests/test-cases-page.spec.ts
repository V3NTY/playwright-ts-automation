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
    await homePage.goToTestCases();
  });

  test("Verify Test Cases Page", async () => {
    await testCasesPage.verifyTestCasesPageVisibility();
  });
});
