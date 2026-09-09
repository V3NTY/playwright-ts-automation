import { Page, Locator, expect } from "@playwright/test";
import { HomePage } from "./HomePage";
import { generateRandomPaymentDetails } from "../utils/helpers";

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcNumberInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmOrderBtn: Locator;
  readonly orderPlacedHeader: Locator;
  readonly orderPlacedMessage: Locator;
  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcNumberInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmOrderBtn = page.locator('[data-qa="pay-button"]');
    this.orderPlacedHeader = page.getByRole("heading", {
      name: "Order Placed",
    });
    this.orderPlacedMessage = page.getByText(
      "Congratulations! Your order has been confirmed!",
    );
  }

  async fillPaymentDetails() {
    const randomCardDetails = generateRandomPaymentDetails();
    await this.nameOnCardInput.fill(randomCardDetails.nameOnCard);
    await this.cardNumberInput.fill(randomCardDetails.cardNumber);
    await this.cvcNumberInput.fill(randomCardDetails.cvc);
    await this.expiryMonthInput.fill(randomCardDetails.expiryMonth);
    await this.expiryYearInput.fill(randomCardDetails.expiryYear);
  }

  async clickPayAndConfirmOrderButton() {
    await this.payAndConfirmOrderBtn.click();
  }

  async verifySuccessPageVisible() {
    // await this.successMessage.waitFor({ state: "visible", timeout: 3000 });
    await expect(this.page).toHaveURL(/.*payment_done/);
    await expect(this.orderPlacedHeader).toBeVisible();
    await expect(this.orderPlacedMessage).toBeVisible();
  }
}
