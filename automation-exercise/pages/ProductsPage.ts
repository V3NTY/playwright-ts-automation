import { Page, Locator, expect } from "@playwright/test";
import { ProductDetails } from "../utils/types";
export class ProductsPage {
  readonly page: Page;
  readonly productsHeader: Locator;
  readonly featuresItemList: Locator;

  readonly productDetailsPage: Locator;
  readonly productInfo: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly searchProductsInput: Locator;
  readonly searchProductsBtn: Locator;
  readonly searchedProductsHeader: Locator;
  readonly productCards: Locator;
  readonly productNameTitles: Locator;
  readonly firstProductItemAddToCartButton: Locator;
  readonly continueShoppingBtn: Locator;
  readonly viewCartModalLink: Locator;
  readonly productQuantityInput: Locator;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsHeader = page.getByRole("heading", {
      name: "ALL PRODUCTS",
    });
    this.featuresItemList = page.locator(".features_items");

    this.productDetailsPage = page.locator(".product-details");
    this.productInfo = page.locator(".product-information");
    this.productName = this.productInfo.locator("h2");
    this.productCategory = this.productInfo.locator("p", {
      hasText: "Category:",
    });
    this.productPrice = this.productInfo.locator("span > span");
    this.productAvailability = this.productInfo.locator("p", {
      hasText: "Availability:",
    });
    this.productCondition = this.productInfo.locator("p", {
      hasText: "Condition:",
    });
    this.productBrand = this.productInfo
      .locator("p", { hasText: "Brand:" })
      .locator("a");
    this.searchProductsInput = page.getByPlaceholder("Search Product");
    this.searchProductsBtn = page.locator("#submit_search");

    this.searchedProductsHeader = page.getByRole("heading", {
      name: "Searched Products",
    });
    this.productCards = page.locator(".single-products");
    this.productNameTitles = page.locator(".productinfo p");
    this.firstProductItemAddToCartButton = page.locator(".add-to-cart").first();
    this.continueShoppingBtn = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.viewCartModalLink = page.getByRole("link", { name: "View Cart" });
    this.productQuantityInput = page.locator("#quantity");
    this.addToCartBtn = page.getByRole("button", { name: "Add to cart" });
  }
  private async parseField(locator: Locator, label: string): Promise<string> {
    const text = await locator.innerText();
    return text.replace(label, "").trim();
  }

  async getDetails(): Promise<ProductDetails> {
    return {
      name: (await this.productName.innerText()).trim(),
      category: await this.parseField(this.productCategory, "Category:"),
      price: (await this.productPrice.innerText()).trim(),
      availability: await this.parseField(
        this.productAvailability,
        "Availability:",
      ),
      condition: await this.parseField(this.productCondition, "Condition:"),
      brand: (await this.productBrand.innerText()).trim(),
    };
  }

  // async goto() {
  //   await this.page.goto("/");
  // }

  async verifyPageLoaded() {
    await expect(this.productsHeader).toBeVisible();
    await expect(this.page).toHaveURL(/.*\/products/);
  }

  async verifyFeaturesItemsVisibility() {
    await expect(this.featuresItemList).toBeVisible();
  }

  async clickProductItemViewButtonByIndex(index: number) {
    const item = this.page
      .locator(".features_items")
      .locator(".choose")
      .nth(index);

    await item.click();
  }

  async verifyProductDetailsPageVisibility() {
    await expect(this.productDetailsPage).toBeVisible();
    await expect(this.page).toHaveURL(/.*\/product_details/);
  }

  async verifyProductDetailsVisibility() {
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
  }

  async verifyProductDetailsData() {
    const expectedProductDetails = {
      name: "Blue Top",
      category: "Women > Tops",
      price: "Rs. 500",
      availability: "In Stock",
      condition: "New",
      brand: "Polo",
    };

    const actualProductDetails = await this.getDetails();
    await expect(actualProductDetails).toEqual(expectedProductDetails);
  }

  async fillAndSubmitSearchInput(productName: string) {
    await this.searchProductsInput.fill(productName);
    await this.searchProductsBtn.click();
  }

  async verifySearchProductURL(productName: string) {
    const encodedName = encodeURIComponent(productName);

    const urlRegex = new RegExp(`\\/products\\?search=${encodedName}$`);

    await expect(this.page).toHaveURL(urlRegex);
  }

  async verifySearchProductsVisibility(searchQuery: string) {
    await expect(this.searchedProductsHeader).toBeVisible();
    const count = await this.productCards.count();
    await expect(
      count,
      "Searched items list should not be empty",
    ).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = this.productCards.nth(i);
      const titleLocator = this.productNameTitles.nth(i);

      await expect(card).toBeVisible();

      const titleText = await titleLocator.innerText();
      await expect(titleText.toLowerCase()).toContain(
        searchQuery.toLowerCase(),
      );
    }
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const product = this.productCards.nth(index);
    await product.scrollIntoViewIfNeeded();
    await product.hover();

    const addToCartBtn = product.locator(".overlay-content .add-to-cart");
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
  }

  async clickContinueShopping(): Promise<void> {
    await expect(this.continueShoppingBtn).toBeVisible();
    await this.continueShoppingBtn.click();
  }

  async clickViewCart(): Promise<void> {
    await expect(this.viewCartModalLink).toBeVisible();
    await this.viewCartModalLink.click();
  }

  async fillProductQuantity(quantity: number) {
    await this.productQuantityInput.fill(quantity.toString());
  }

  async addProductToCart() {
    await this.addToCartBtn.click();
  }

  async removeAllAddsFromPage() {
    // 1. Czyszczenie reklam i nakładek z całej strony
    await this.page.evaluate(() => {
      document
        .querySelectorAll("ins, iframe, .adsbygoogle")
        .forEach((el) => el.remove());
    });
  }
}
