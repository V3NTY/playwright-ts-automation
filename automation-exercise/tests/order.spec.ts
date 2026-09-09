import { test, Page, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { generateRandomUserData } from "../utils/helpers";
import { SignupLoginPage } from "../pages/SignupLoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";

test.describe("Order Page", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let signupLoginPage: SignupLoginPage;
  let registerPage: RegisterPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    signupLoginPage = new SignupLoginPage(page);
    registerPage = new RegisterPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
    // await homePage.goToProducts();
    // await productsPage.verifyPageLoaded();
  });

  test("Place order: Register while checkout", async () => {
    const randomUser = generateRandomUserData();
    await homePage.goToProducts();
    await productsPage.removeAllAddsFromPage();
    // await productsPage.addProductToCartByIndex(0);
    // await productsPage.clickContinueShopping();
    // await productsPage.addProductToCartByIndex(1);
    // await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await cartPage.removeAllAddsFromPage();
    await cartPage.verifyCartPageVisibility();
    await cartPage.clickProceedToCheckoutButton();
    await cartPage.clickRegisterOrLoginButtonOnCheckoutModal();
    // SIGN UP PROCESS
    await signupLoginPage.fillInitialSignup(randomUser.name, randomUser.email);
    await signupLoginPage.clickSignup();
    await registerPage.fillAccountDetails(randomUser.password);
    await registerPage.fillAddressInformation(randomUser);
    await registerPage.submitAccountCreation();
    await homePage.verifyUserLoggedIn();
    await homePage.goToCart();
    // BACK TO CART
    const orderedProducts = await cartPage.snapshotAllCartItems();
    await cartPage.clickProceedToCheckoutButton();
    await checkoutPage.verifyDeliveryAddress(randomUser);
    await checkoutPage.verifyBillingAddress(randomUser);
    await checkoutPage.verifyCartProducts(orderedProducts);
    await checkoutPage.fillRandomCommentToOrder();
    await checkoutPage.clickPlaceOrderButton();
    await paymentPage.fillPaymentDetails();
    await paymentPage.clickPayAndConfirmOrderButton();
    // await paymentPage.verifySuccessMessageVisible();
    await paymentPage.verifySuccessPageVisible();
    await homePage.clickDeleteAccount();
    await homePage.verifyAndConfirmAccountDeletion();
  });

  test("Place order: Register before checkout", async () => {
    const randomUser = generateRandomUserData();
    await homePage.goToSignupLogin();
    await signupLoginPage.fillInitialSignup(randomUser.name, randomUser.email);
    await signupLoginPage.clickSignup();
    await registerPage.fillAccountDetails(randomUser.password);
    await registerPage.fillAddressInformation(randomUser);
    await registerPage.submitAccountCreation();
    await homePage.verifyUserLoggedIn();
    await homePage.goToProducts();
    await productsPage.removeAllAddsFromPage();
    // await productsPage.addProductToCartByIndex(0);
    // await productsPage.clickContinueShopping();
    // await productsPage.addProductToCartByIndex(1);
    // await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await cartPage.removeAllAddsFromPage();
    await cartPage.verifyCartPageVisibility();
    const orderedProducts = await cartPage.snapshotAllCartItems();
    await cartPage.clickProceedToCheckoutButton();
    await checkoutPage.verifyDeliveryAddress(randomUser);
    await checkoutPage.verifyBillingAddress(randomUser);
    await checkoutPage.verifyCartProducts(orderedProducts);
    await checkoutPage.fillRandomCommentToOrder();
    await checkoutPage.clickPlaceOrderButton();
    await paymentPage.fillPaymentDetails();
    await paymentPage.clickPayAndConfirmOrderButton();
    // await paymentPage.verifySuccessMessageVisible();
    await paymentPage.verifySuccessPageVisible();
    await homePage.clickDeleteAccount();
    await homePage.verifyAndConfirmAccountDeletion();
  });
});
