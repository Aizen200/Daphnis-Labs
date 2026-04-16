import { describe, it, expect } from "vitest";
import { runGame } from "../src/engine.js";

describe("Game Engine Determinism", () => {
  it("should produce same result for same seeds", () => {
    const input = {
      serverSeed: "test-server-seed",
      clientSeed: "test-client-seed",
      nonce: "42",
      dropColumn: 6,
    };

    const result1 = runGame(
      input.serverSeed,
      input.clientSeed,
      input.nonce,
      input.dropColumn
    );

    const result2 = runGame(
      input.serverSeed,
      input.clientSeed,
      input.nonce,
      input.dropColumn
    );

    expect(result1.binIndex).toBe(result2.binIndex);
    expect(result1.path).toEqual(result2.path);
    expect(result1.pegMapHash).toBe(result2.pegMapHash);
  });
});