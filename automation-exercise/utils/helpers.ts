import { Locator } from "@playwright/test";

/**
 * Generuje losową liczbę całkowitą z podanego zakresu <from, to> (włącznie z `from` oraz `to`).
 *
 * @param from Minimum zakresu (np. 1, aby pominąć placeholder na indeksie 0)
 * @param to Maksimum zakresu (np. łączna liczba opcji - 1)
 */
export function generateRandomIndexBetween(from: number, to: number): number {
  if (from > to) {
    throw new Error('Parametr "from" nie może być większy niż "to"');
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function countSelectorOptions(locator: Locator) {
  return locator.locator("option").count();
}

// export type Title = "Mr." | "Mrs.";

// export function getRandomTitle(): Title {
//   const titles: Title[] = ["Mr.", "Mrs."];
//   return titles[Math.floor(Math.random() * titles.length)];
// }
