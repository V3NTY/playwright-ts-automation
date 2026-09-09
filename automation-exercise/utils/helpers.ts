import { Locator } from "@playwright/test";
import { faker } from "@faker-js/faker";

export function generateRandomIndexBetween(from: number, to: number): number {
  if (from > to) {
    throw new Error('Parametr "from" nie może być większy niż "to"');
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function countSelectorOptions(locator: Locator) {
  return locator.locator("option").count();
}

export function generateRandomUserData() {
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
  return randomUser;
}

export function generateRandomPaymentDetails() {
  const futureDate = faker.date.future({ years: 5 });
  const randomCardDetails = {
    nameOnCard: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber(),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: String(futureDate.getMonth() + 1).padStart(2, "0"),
    expiryYear: String(futureDate.getFullYear()).slice(-2),
  };
  console.log(randomCardDetails);
  return randomCardDetails;
}

export const testItem1 = {
  name: "Blue Top",
  price: "Rs. 500",
  quantity: "1",
  total: "Rs. 500",
};

export const testItem2 = {
  name: "Men Tshirt",
  price: "Rs. 400",
  quantity: "1",
  total: "Rs. 400",
};

export function generateRandomComment(): string {
  return faker.lorem.paragraph();
}
// export type Title = "Mr." | "Mrs.";

// export function getRandomTitle(): Title {
//   const titles: Title[] = ["Mr.", "Mrs."];
//   return titles[Math.floor(Math.random() * titles.length)];
// }
