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
    await homePage.goToProducts();
  });

  test("Verify All Products Page", async () => {
    await productsPage.verifyPageLoaded();
    await productsPage.verifyFeaturesItemsVisibility();
  });

  test("Verify Single Product Page", async () => {
    await productsPage.clickProductItemViewButtonByIndex(0);
    await productsPage.verifyProductDetailsPageVisibility();
    await productsPage.verifyProductDetailsData();
    await productsPage.verifyProductDetailsVisibility();
    // console.log(actualProductDetails);
  });

  test("Verify Searched Products", async () => {
    const searchProduct = "Pink";
    await productsPage.verifyPageLoaded();
    await productsPage.fillAndSubmitSearchInput(searchProduct);
    await productsPage.verifySearchProductURL(searchProduct);
    await productsPage.verifySearchProductsVisibility(searchProduct);
  });
});
