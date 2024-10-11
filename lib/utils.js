import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string) {
  if (!string) return ""; // Handle empty strings or undefined
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getCurrentMonthName() {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const currentMonth = new Date().getMonth(); // 0-11
  return months[currentMonth];
}

export function determineCategory(transaction) {
  const category = transaction.category[0];
  if (category.includes("Groceries")) {
    return "groceries";
  } else if (category.includes("Transportation")) {
    return "transportation";
  } else if (category.includes("Housing")) {
    return "housing";
  } else if (category.includes("Utilities")) {
    return "utilities";
  } else if (category.includes("Entertainment")) {
    return "entertainment";
  } else if (category.includes("Subscriptions")) {
    return "subscriptions";
  } else if (category.includes("Health")) {
    return "health";
  } else if (category.includes("Travel")) {
    return "vacation";
  } else if (
    category.includes("Dining") ||
    category.includes("Food") ||
    category.includes("Restaurants")
  ) {
    return "dining";
  } else if (category.includes("Shopping") || category.includes("Amazon")) {
    return "shopping";
  } else {
    return "other";
  }
}
