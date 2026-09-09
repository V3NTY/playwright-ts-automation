import { test, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { faker } from "@faker-js/faker";
import { CartPage } from "../pages/CartPage";
test.describe("Verify subscribe", () => {
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
  });

  test("Verify subscription on home page", async () => {
    const randomEmail = `${faker.person.firstName()}${faker.person.lastName()}+${Math.random()}@xyz.com`;

    await homePage.fillAndSubmitEmailSubscription(randomEmail);
    await homePage.verifySuccessMessageVisibility();
  });

  test("Verify subscription on cart page", async () => {
    const randomEmail = `${faker.person.firstName()}${faker.person.lastName()}+${Math.random()}@xyz.com`;

    await homePage.goToCart();
    await cartPage.fillAndSubmitEmailSubscription(randomEmail);
    await cartPage.verifySuccessMessageVisibility();
  });
});
