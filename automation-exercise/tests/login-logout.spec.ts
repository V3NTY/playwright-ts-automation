import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SignupLoginPage } from "../pages/SignupLoginPage";
import { password, email } from "../../.auth/user.json";
test.describe("Login User", () => {
  let homePage: HomePage;
  let signupLoginPage: SignupLoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signupLoginPage = new SignupLoginPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
  });

  test("Correct Login and Delete User Account", async () => {
    await homePage.goToSignupLogin();
    await signupLoginPage.verifyLoginHeaderVisible();
    await signupLoginPage.fillLoginCredentials(email, password);
    await signupLoginPage.clickLogin();
    await homePage.verifyUserLoggedIn();
    await homePage.clickDeleteAccount();
    await homePage.verifyAndConfirmAccountDeletion();
    // await registerPage.verifyPageLoaded();
    // await registerPage.fillAccountDetails(randomUser.password);
    // await registerPage.fillAddressInformation(randomUser);
    // await registerPage.submitAccountCreation();

    // // 3. Weryfikacja zalogowania i usunięcie konta
    // await homePage.verifyUserLoggedIn();
    // await homePage.clickDeleteAccount();
    // await registerPage.verifyAndConfirmAccountDeletion();
  });

  test("Logout User", async () => {
    await homePage.goToSignupLogin();
    await signupLoginPage.verifyLoginHeaderVisible();
    await signupLoginPage.fillLoginCredentials(email, password);
    await signupLoginPage.clickLogin();
    await homePage.verifyUserLoggedIn();
    await homePage.clickLogout();
    await signupLoginPage.verifyLoginHeaderVisible();
  });

  test("Incorrect Login", async () => {
    await homePage.goToSignupLogin();
    await signupLoginPage.verifyLoginHeaderVisible();
    await signupLoginPage.fillLoginCredentials(
      "incorrectemail@xyz.com",
      "sadsanioasnd",
    );
    await signupLoginPage.clickLogin();
    await signupLoginPage.verifyIncorrectPasswordErrorVisibility();
  });
});
