import { Page, expect, Dialog, Locator } from "@playwright/test";

export class ContactForm {
  readonly page: Page;

  readonly contactUsHeader: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileInput: Locator;
  readonly submitBtn: Locator;
  readonly closeAddBtn: Locator;
  constructor(page: Page) {
    this.page = page;

    this.contactUsHeader = page.getByRole("heading", { name: "Contact Us" });
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.fileInput = page.locator('[name="upload_file"]');
    this.submitBtn = page.locator('[data-qa="submit-button"]');
    this.closeAddBtn = page.locator(
      '.grippy-host button, .grippy-host [aria-label*="Close"]',
    );
  }

  async verifyGetInTouchHeaderVisibility() {
    await expect(this.contactUsHeader).toBeVisible();
  }

  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    inputFilePath: string,
  ) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
    await this.fileInput.setInputFiles(inputFilePath);
  }

  async acceptSubmitAlert() {
    this.page.once("dialog", async (dialog: Dialog) => {
      console.log(dialog.message());
      await dialog.accept();
    });
  }
  async removeAllAddsFromPage() {
    // 1. Czyszczenie reklam i nakładek z całej strony
    await this.page.evaluate(() => {
      document
        .querySelectorAll("ins, iframe, .adsbygoogle")
        .forEach((el) => el.remove());
    });

    // 2. Wymuszenie scrolla do przycisku i kliknięcie go bezpośrednio w DOM
    await this.page.evaluate(() => {
      const btn = document.querySelector(
        'input[type="submit"], button[type="submit"]',
      ) as HTMLElement;
      if (btn) {
        btn.scrollIntoView();
        btn.click();
      }
    });
  }
}
