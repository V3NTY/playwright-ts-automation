import { Page, Locator, expect } from "@playwright/test";

export interface ProductDetails {
  name: string;
  category: string;
  price: string;
  availability: string;
  condition: string;
  brand: string;
}

export class ProductsPage {
  readonly page: Page;
  readonly productsHeader: Locator;
  readonly featuresItemList: Locator;
  readonly firstProductItemViewProductButton: Locator;
  readonly productDetailsPage: Locator;
  readonly productInfo: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsHeader = page.getByRole("heading", {
      name: "ALL PRODUCTS",
    });
    this.featuresItemList = page.locator(".features_items");
    this.firstProductItemViewProductButton = page
      .locator(".features_items")
      .locator(".choose")
      .first();
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

  async goto() {
    await this.page.goto("/");
  }

  async verifyPageLoaded() {
    await expect(this.productsHeader).toBeVisible();
    await expect(this.page).toHaveURL(/.*\/products/);
  }

  async verifyFeaturesItemsVisibility() {
    await expect(this.featuresItemList).toBeVisible();
  }

  async clickFirstProductItemViewProductButton() {
    await this.firstProductItemViewProductButton.click();
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
}
