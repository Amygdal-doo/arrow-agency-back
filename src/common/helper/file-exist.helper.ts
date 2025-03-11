import { promises as fs } from "fs";
import { join } from "path";

export async function checkFileExists(templateId: string) {
  const templatePath = join(
    process.cwd(),
    "public",
    "templates",
    `${templateId}.html`
  );

  try {
    await fs.access(templatePath);
    return true; // File exists
  } catch (error) {
    return false; // File doesn't exist
  }
}
