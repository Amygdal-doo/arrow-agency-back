import * as os from "os";

export function getServerIp(): string {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses[0] || "127.0.0.1"; // Fallback to localhost if no external IP found
}
