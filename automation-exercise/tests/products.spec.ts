import { test, Page, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";

test.describe("Products page", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
  });

  test("Verify All Products Page", async () => {
    await homePage.productsLink.click();
    await productsPage.verifyPageLoaded();
    await productsPage.verifyFeaturesItemsVisibility();
  });

  test("Verify Single Product Page", async () => {
    await productsPage.clickFirstProductItemViewProductButton();
    await productsPage.verifyProductDetailsPageVisibility();
    await productsPage.verifyProductDetailsData();
    await productsPage.verifyProductDetailsVisibility();
    // console.log(actualProductDetails);
  });
});
