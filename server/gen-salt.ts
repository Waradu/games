import { randomBytes } from "crypto";

function generateSalt(length = 32): string {
  return randomBytes(length).toString("hex");
}

const salt = generateSalt();
console.log("New salt:", salt);