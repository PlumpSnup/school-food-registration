// Menu and prices, shared by the server and the order page in the browser.

export const MEAL = {
  name: "Chicken & rice lunch",
  short: "Chicken & rice",
  description: "Baked chicken, rice, carrots, cucumbers and water. Nut-free.",
  foods: ["chicken", "rice", "carrot", "cucumber", "water"],
};

// Prices in fils (1 AED = 100 fils), before VAT.
export const DAY_PRICE = 1800;
export const WEEK_PRICE = 8000;
const VAT_RATE = 0.05;

export function price(days: number, wholeWeek: boolean) {
  const subtotal = wholeWeek ? WEEK_PRICE : days * DAY_PRICE;
  const vat = Math.round(subtotal * VAT_RATE);
  return { subtotal, vat, total: subtotal + vat };
}

/** "56.70 AED"; whole amounts drop the decimals ("84 AED"). */
export function aed(fils: number): string {
  return `${fils % 100 === 0 ? fils / 100 : (fils / 100).toFixed(2)} AED`;
}

/** A line amount on a receipt, always with two decimals: "18.00". */
export function money(fils: number): string {
  return (fils / 100).toFixed(2);
}
