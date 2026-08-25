import { Page, Locator, expect } from "@playwright/test";
import fs from "fs";
import { updateAuthCredentials } from "../utils/authHelper";

export class SignupLoginPage {
  // SIGN UP
  readonly signupForm: Locator;
  readonly signupHeader: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;

  // LOGIN

  readonly loginForm: Locator;
  readonly loginHeader: Locator;
  readonly emailLoginInput: Locator;
  readonly passwordLoginInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    // SIGN UP LOCATORS
    this.signupForm = page.locator(".signup-form");
    this.signupHeader = this.signupForm.getByRole("heading", {
      name: "New User Signup!",
    });
    this.nameInput = this.signupForm.getByPlaceholder("Name");
    this.emailInput = this.signupForm.getByPlaceholder("Email Address");
    this.signupButton = this.signupForm.getByRole("button", { name: "Signup" });

    // LOGIN LOCATORS

    this.loginForm = page.locator(".login-form");
    this.loginHeader = this.loginForm.getByRole("heading", {
      name: "Login to your account",
    });
    this.emailLoginInput = this.loginForm.locator('[data-qa="login-email"]');
    this.passwordLoginInput = this.loginForm.locator(
      '[data-qa="login-password"]',
    );

    this.loginButton = this.loginForm.getByRole("button", { name: "Login" });
  }

  async verifySignupHeaderVisible() {
    await expect(this.signupHeader).toBeVisible();
  }

  async verifyLoginHeaderVisible() {
    await expect(this.loginHeader).toBeVisible();
  }

  async fillInitialSignup(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    updateAuthCredentials({ email });
    await expect(this.nameInput).toHaveValue(name);
    await expect(this.emailInput).toHaveValue(email);
  }

  async clickSignup() {
    await this.signupButton.click();
  }

  async fillLoginCredentials(email: string, password: string) {
    await this.emailLoginInput.fill(email);
    await this.passwordLoginInput.fill(password);
    await expect(this.emailLoginInput).toHaveValue(email);
    await expect(this.passwordLoginInput).toHaveValue(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
