import { Page, Locator, expect } from "@playwright/test";
import { OrderedProduct } from "../utils/types";

export class CartPage {
  readonly page: Page;
  readonly subscriptionHeader: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscribeBtn: Locator;
  readonly successSubscribeMessage: Locator;
  readonly cartItems: Locator;
  readonly proceedToCheckoutBtn: Locator;
  readonly registerOrLoginButtonOnCheckoutModal: Locator;
  readonly savedProducts: OrderedProduct[] = [];

  constructor(page: Page) {
    this.page = page;

    this.subscriptionHeader = page.getByRole("heading", {
      name: "Subscription",
    });
    this.subscriptionEmailInput = page.getByPlaceholder("Your email address");
    this.subscribeBtn = page.locator("#subscribe");
    this.successSubscribeMessage = page.getByText(
      "You have been successfully subscribed!",
    );
    this.proceedToCheckoutBtn = page.locator(".check_out");

    this.cartItems = page.locator('#cart_info_table tbody tr[id^="product-"]');
    this.registerOrLoginButtonOnCheckoutModal = page.getByRole("link", {
      name: "Register / Login",
    });
  }

  async fillAndSubmitEmailSubscription(email: string) {
    await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
    await this.subscriptionHeader.isVisible();
    await this.subscriptionEmailInput.fill(email);
    await this.subscribeBtn.click();
  }

  async verifySuccessMessageVisibility() {
    await this.successSubscribeMessage.isVisible();
  }

  async clickRegisterOrLoginButtonOnCheckoutModal() {
    await this.registerOrLoginButtonOnCheckoutModal.click();
  }

  async getItemsInCartCount() {
    return await this.cartItems.count();
  }

  async getCartItemDetailsByIndex(index: number) {
    const item = this.cartItems.nth(index);

    return {
      name: (await item.locator(".cart_description h4 a").innerText()).trim(),
      price: (await item.locator(".cart_price p").innerText()).trim(),
      quantity: (
        await item.locator(".cart_quantity button").innerText()
      ).trim(),
      total: (
        await item.locator(".cart_total .cart_total_price").innerText()
      ).trim(),
    };
  }

  async verifyCartItemQuantityByIndex(index: number, expectedQuantity: number) {
    const item = await this.getCartItemDetailsByIndex(index);

    expect(Number(item.quantity)).toBe(expectedQuantity);
  }

  async verifyCartPageVisibility() {
    await expect(this.page).toHaveURL(/\/view_cart$/);
  }

  async clickProceedToCheckoutButton() {
    await this.proceedToCheckoutBtn.click();
  }

  async verifyItemsInCartCount(actualCount: number, expectedCount: number) {
    await expect(
      actualCount,
      `Cart should include exacly ${expectedCount} items`,
    ).toBe(expectedCount);
  }

  async removeAllAddsFromPage() {
    // 1. Czyszczenie reklam i nakładek z całej strony
    await this.page.evaluate(() => {
      document
        .querySelectorAll("ins, iframe, .adsbygoogle")
        .forEach((el) => el.remove());
    });
  }

  async snapshotAllCartItems(): Promise<OrderedProduct[]> {
    const count = await this.cartItems.count();
    this.savedProducts.length = 0; // Czyszczenie przed nowym zrzutem

    for (let i = 0; i < count; i++) {
      const item = await this.getCartItemDetailsByIndex(i);
      this.savedProducts.push(item);
    }

    return this.savedProducts;
  }
}
