import { createHash, randomBytes, randomInt } from "node:crypto";

export function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

export function generateServerSeed() {
  return randomBytes(32).toString("hex");
}

export function generateNonce() {
  return randomInt(0, 2 ** 32).toString();
}

export function makeCommitHex(serverSeed, nonce) {
  return sha256(serverSeed + ":" + nonce);
}

export function makeCombinedSeed(serverSeed, clientSeed, nonce) {
  return sha256(serverSeed + ":" + clientSeed + ":" + nonce);
}