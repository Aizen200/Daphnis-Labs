import { describe, it, expect } from "vitest";
import { createPRNG } from "../src/prng.js";

describe("PRNG Determinism", () => {
  it("should generate same sequence for same seed", () => {
    const seed = "abcdef1234567890";

    const rand1 = createPRNG(seed);
    const rand2 = createPRNG(seed);

    const seq1 = Array.from({ length: 5 }, () => rand1());
    const seq2 = Array.from({ length: 5 }, () => rand2());

    expect(seq1).toEqual(seq2);
  });
});