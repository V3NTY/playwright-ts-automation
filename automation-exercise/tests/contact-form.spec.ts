import { test, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ContactForm } from "../pages/ContactForm";
import { faker } from "@faker-js/faker";
import { email } from "../../.auth/user.json";

test.describe("Contact form", () => {
  let homePage: HomePage;
  let contactForm: ContactForm;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    contactForm = new ContactForm(page);

    await homePage.goto();
    await homePage.verifyHomePageLoaded();
    await homePage.goToContactUs();
  });

  test("Submit contact form", async () => {
    const randomTicket = {
      name: faker.person.firstName(),
      email: email,
      subject: faker.lorem.words(6),
      message: faker.lorem.paragraph(),
      inputFilePath: "automation-exercise/example-screenshot.jpg",
    };

    await contactForm.verifyGetInTouchHeaderVisibility();
    await contactForm.fillContactForm(
      randomTicket.name,
      randomTicket.email,
      randomTicket.subject,
      randomTicket.message,
      randomTicket.inputFilePath,
    );
    await contactForm.removeAllAddsFromPage();

    await contactForm.submitBtn.click();
    // await contactForm.acceptSubmitAlert();
  });
});
