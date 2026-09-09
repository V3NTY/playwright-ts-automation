import { Page, Locator, expect } from "@playwright/test";
import {
  generateRandomComment,
  generateRandomUserData,
} from "../utils/helpers";
import { OrderedProduct } from "../utils/types";
import { UserData } from "../utils/types";
import { CartPage } from "./CartPage";
export class CheckoutPage {
  readonly page: Page;
  readonly cartItems: Locator;

  //
  readonly deliveryAddressList: Locator;
  readonly deliveryTitle: Locator;
  readonly deliveryFullName: Locator;
  readonly deliveryStreetAddress: Locator;
  readonly deliveryCityStateZip: Locator;
  readonly deliveryCountry: Locator;
  readonly deliveryPhone: Locator;

  // BILLING ADDRESS
  readonly billingAddressList: Locator;
  readonly billingTitle: Locator;
  readonly billingFullName: Locator;
  readonly billingStreetAddress: Locator;
  readonly billingCityStateZip: Locator;
  readonly billingCountry: Locator;
  readonly billingPhone: Locator;

  readonly commentInput: Locator;
  readonly placeOrderBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#cart_info tbody tr[id^="product-"]');
    this.deliveryAddressList = page.locator("#address_delivery");
    this.deliveryTitle = this.deliveryAddressList.locator(".address_title");
    this.deliveryFullName =
      this.deliveryAddressList.locator(".address_firstname");

    // Ulica - pobiera niepusty li.address_address1
    this.deliveryStreetAddress = this.deliveryAddressList
      .locator("li.address_address1")
      .filter({ hasText: /\S/ });

    this.deliveryCityStateZip =
      this.deliveryAddressList.locator(".address_city");
    this.deliveryCountry = this.deliveryAddressList.locator(
      ".address_country_name",
    );
    this.deliveryPhone = this.deliveryAddressList.locator(".address_phone");

    // BILLING ADDRESS
    this.billingAddressList = page.locator("#address_invoice");
    this.billingTitle = this.billingAddressList.locator(".address_title");
    this.billingFullName =
      this.billingAddressList.locator(".address_firstname");
    this.billingStreetAddress = this.billingAddressList
      .locator("li.address_address1")
      .filter({ hasText: /\S/ }); // Pominie puste elementy <li> z tą samą klasą
    this.billingCityStateZip = this.billingAddressList.locator(".address_city");
    this.billingCountry = this.billingAddressList.locator(
      ".address_country_name",
    );
    this.billingPhone = this.billingAddressList.locator(".address_phone");
    this.commentInput = page.locator('textarea[name="message"]');
    this.placeOrderBtn = page.getByRole("link", { name: "Place Order" });
  }

  async verifyDeliveryAddress(userData: UserData) {
    await expect(this.deliveryFullName).toContainText(userData.firstName);
    await expect(this.deliveryFullName).toContainText(userData.lastName);
    await expect(this.deliveryStreetAddress).toHaveText(userData.address);
    await expect(this.deliveryCityStateZip).toContainText(userData.city);
    await expect(this.deliveryCityStateZip).toContainText(userData.state);
    await expect(this.deliveryCityStateZip).toContainText(userData.zipCode);
    await expect(this.deliveryPhone).toHaveText(userData.phoneNumber);
  }

  async verifyBillingAddress(userData: UserData) {
    await expect(this.billingFullName).toContainText(userData.firstName);
    await expect(this.billingFullName).toContainText(userData.lastName);
    await expect(this.billingStreetAddress).toHaveText(userData.address);
    await expect(this.billingCityStateZip).toContainText(userData.city);
    await expect(this.billingCityStateZip).toContainText(userData.state);
    await expect(this.billingCityStateZip).toContainText(userData.zipCode);
    await expect(this.billingPhone).toHaveText(userData.phoneNumber);
  }

  async fillRandomCommentToOrder() {
    const randomComment = generateRandomComment();
    await this.commentInput.fill(randomComment);
  }

  async clickPlaceOrderButton() {
    await this.placeOrderBtn.click();
  }

  async verifyCartProducts(expectedProducts: OrderedProduct[]) {
    await expect(this.cartItems.first()).toBeVisible();
    const itemsCount = await this.cartItems.count();
    expect(
      itemsCount,
      `Number of products in cart (${itemsCount}) does not match with expected (${expectedProducts.length})`,
    ).toBe(expectedProducts.length);

    // 2. Iteracja po każdym produkcie i weryfikacja danych
    for (let i = 0; i < expectedProducts.length; i++) {
      const item = this.cartItems.nth(i);
      const expected = expectedProducts[i];

      // Wyciągnięcie surowych tekstów z wiersza
      const actualName = await item
        .locator(".cart_description h4 a")
        .innerText();
      const actualPrice = await item.locator(".cart_price p").innerText();
      const actualQuantity = await item
        .locator(".cart_quantity button")
        .innerText();
      const actualTotal = await item
        .locator(".cart_total .cart_total_price")
        .innerText();

      // Weryfikacja nazwy
      expect(actualName.trim()).toBe(expected.name.trim());

      // Weryfikacja ceny jednostkowej
      expect(actualPrice.trim()).toBe(expected.price.trim());

      // Weryfikacja ilości (zgodność niezależna od typu number/string)
      expect(Number(actualQuantity.trim())).toBe(Number(expected.quantity));

      // Weryfikacja ceny całkowitej (jeśli została przekazana)
      if (expected.total) {
        expect(actualTotal.trim()).toBe(expected.total.trim());
      }
    }
  }
}
