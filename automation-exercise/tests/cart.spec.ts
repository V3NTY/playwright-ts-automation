import { test, Page, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { testItem1, testItem2 } from "../utils/helpers";

test.describe("Cart Page", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
    await homePage.goToProducts();
    await productsPage.verifyPageLoaded();
  });

  test("Add products to cart", async () => {
    await cartPage.removeAllAddsFromPage();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCart();
    await cartPage.verifyCartPageVisibility();
    const itemsCount = await cartPage.getItemsInCartCount();
    await cartPage.verifyItemsInCartCount(itemsCount, 2);

    const item1 = await cartPage.getCartItemDetailsByIndex(0);
    expect(item1).toEqual(testItem1);

    // Weryfikacja drugiego produktu (np. "Men Tshirt")
    const item2 = await cartPage.getCartItemDetailsByIndex(1);
    expect(item2).toEqual(testItem2);
  });

  test("Add product quantity", async () => {
    await productsPage.clickProductItemViewButtonByIndex(0);
    await productsPage.fillProductQuantity(3);
    await productsPage.addProductToCart();
    await productsPage.clickViewCart();
    await cartPage.verifyCartItemQuantityByIndex(0, 3);
  });
});
