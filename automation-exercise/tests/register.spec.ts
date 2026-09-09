import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HomePage } from "../pages/HomePage";
import { SignupLoginPage } from "../pages/SignupLoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { email } from "../../.auth/user.json";
import { readSavedCredentials } from "../utils/authHelper";
import { generateRandomUserData } from "../utils/helpers";
test.describe("Register User", () => {
  let homePage: HomePage;
  let signupLoginPage: SignupLoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signupLoginPage = new SignupLoginPage(page);
    registerPage = new RegisterPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
    await homePage.goToSignupLogin();
  });

  test("Register and Delete User Account", async () => {
    const randomUser = generateRandomUserData();

    // await homePage.goToSignupLogin();
    await signupLoginPage.verifySignupHeaderVisible();
    await signupLoginPage.fillInitialSignup(randomUser.name, randomUser.email);
    await signupLoginPage.clickSignup();

    await registerPage.verifyPageLoaded();
    await registerPage.fillAccountDetails(randomUser.password);
    await registerPage.fillAddressInformation(randomUser);
    await registerPage.submitAccountCreation();

    await homePage.verifyUserLoggedIn();
    // await homePage.clickDeleteAccount();
    // await homePage.verifyAndConfirmAccountDeletion();
  });

  test("Register Existing User", async () => {
    const randomUser = generateRandomUserData();
    const randomName = randomUser.name;
    // Read updated credentials
    const { email } = readSavedCredentials();
    // await homePage.goToSignupLogin();
    await signupLoginPage.verifySignupHeaderVisible();
    await signupLoginPage.fillInitialSignup(randomName, email);
    await signupLoginPage.clickSignup();
    await signupLoginPage.verifyExistingAccountError();
  });
});
