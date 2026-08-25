import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HomePage } from "../pages/HomePage";
import { SignupLoginPage } from "../pages/SignupLoginPage";
import { RegisterPage } from "../pages/RegisterPage";

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
  });

  test("Register and Delete User Account", async () => {
    const randomUser = {
      name: faker.person.fullName(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}+${Date.now()}@xyz.com`,
      password: "Password123!",
      address: faker.location.streetAddress(),
      state: faker.location.state(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      phoneNumber: faker.phone.number(),
    };

    await homePage.goToSignupLogin();
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
});
