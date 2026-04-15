export function createPRNG(combinedSeedHex) {

  let state = parseInt(combinedSeedHex.slice(0, 8), 16);


  if (state === 0) state = 1;

  return function rand() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;


    return (state >>> 0) / 0x100000000;
  };
}