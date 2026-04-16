import { sha256, makeCombinedSeed } from "./crypto.js";
import { createPRNG } from "./prng.js";

const PAYOUT_MULTIPLIERS = [10, 5, 3, 1.5, 1, 0.5, 0.5, 0.5, 1, 1.5, 3, 5, 10];
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
export function generatePegMap(rand, rows = 12) {
  const pegMap = [];

  for (let r = 0; r < rows; r++) {
    const row = [];

    for (let p = 0; p <= r; p++) {
      const raw = 0.5 + (rand() - 0.5) * 0.2;
      const clamped = clamp(raw, 0.4, 0.6);
      const rounded = Number(clamped.toFixed(6));
      row.push(rounded);
    }

    pegMap.push(row);
  }

  return pegMap;
}

export function computePegMapHash(pegMap) {
  return sha256(JSON.stringify(pegMap));
}
export function simulatePath(rand, pegMap, dropColumn, rows = 12) {
  let pos = 0;
  const path = [];

  const adj = (dropColumn - 6) * 0.01;

  for (let r = 0; r < rows; r++) {
    const pegIndex = Math.min(pos, r);

    const leftBias = pegMap[r][pegIndex];
    const bias = clamp(leftBias + adj, 0, 1);

    const rnd = rand();

    if (rnd < bias) {
      path.push("L");
    } else {
      path.push("R");
      pos++;
    }
  }

  return { path, binIndex: pos };
}
export function getPayoutMultiplier(binIndex) {
  return PAYOUT_MULTIPLIERS[binIndex] ?? 0;
}

export function runGame(serverSeed, clientSeed, nonce, dropColumn) {
  const combinedSeed = makeCombinedSeed(serverSeed, clientSeed, nonce);
  const rand = createPRNG(combinedSeed);
  const pegMap = generatePegMap(rand);
  const pegMapHash = computePegMapHash(pegMap);
  const { path, binIndex } = simulatePath(rand, pegMap, dropColumn);
  const payoutMultiplier = getPayoutMultiplier(binIndex);

  return {
    combinedSeed,
    pegMap,
    pegMapHash,
    path,
    binIndex,
    payoutMultiplier,
  };
}