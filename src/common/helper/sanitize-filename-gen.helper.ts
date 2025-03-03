export function sanitizeFilename(filename: string): string {
  if (!filename) {
    return "";
  }

  // 1. Remove control characters (0x00-0x1F and 0x7F)
  let sanitized = filename.replace(/[\x00-\x1F\x7F]/g, "");

  // 2. Escape certain special characters
  sanitized = sanitized.replace(/["*<>?\\|:\/]/g, (char) => {
    switch (char) {
      case '"':
        return "%22";
      case "*":
        return "%2A";
      case "<":
        return "%3C";
      case ">":
        return "%3E";
      case "?":
        return "%3F";
      case "\\":
        return "%5C";
      case "|":
        return "%7C";
      case ":":
        return "%3A";
      case "/":
        return "%2F";
      default:
        return char; // Should not reach here, but for safety.
    }
  });

  // 3. Handle non-ASCII characters using encodeURIComponent
  sanitized = encodeURIComponent(sanitized);

  //4. replace the space character with %20.
  sanitized = sanitized.replace(/%20/g, " ");

  //5. replace the space character with %20.
  sanitized = sanitized.replace(/ /g, "%20");

  return sanitized;
}
