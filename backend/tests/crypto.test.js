 import { describe, it, expect } from "vitest";
import { makeCommitHex } from "../src/crypto.js";

describe("Commit Hash", () => {
  it("should generate correct SHA256 commit", () => {
    const serverSeed = "abc123";
    const nonce = "42";

    const commit1 = makeCommitHex(serverSeed, nonce);
    const commit2 = makeCommitHex(serverSeed, nonce);

    expect(commit1).toBe(commit2);
  });
});