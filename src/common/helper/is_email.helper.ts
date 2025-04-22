/**
 * Checks if a given string is a valid email address.
 *
 * @param email The string to check.
 * @returns `true` if the string is a valid email address, `false` otherwise.
 */
export function isValidEmail(email: string): boolean {
  if (!email) {
    return false; // Email is empty
  }

  // Regular expression for a basic email validation.
  // It checks for:
  // - One or more characters that are not whitespace, plus, or equals sign before the @ symbol
  // - An @ symbol
  // - One or more characters that are not whitespace, plus, or equals sign after the @ symbol
  // - A dot (.)
  // - Two or more characters after the dot
  const emailRegex = /^[^\s+@=]+@[^\s+@=]+\.[^\s+@=]{2,}$/;

  return emailRegex.test(email);
}
