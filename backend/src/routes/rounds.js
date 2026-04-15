import { Router } from "express";
import prisma from "../db.js";
import {
  generateServerSeed,
  generateNonce,
  makeCommitHex,
  makeCombinedSeed,
} from "../crypto.js";
import { runGame } from "../engine.js";

const router = Router();

/**
 * 1. COMMIT
 */
router.post("/rounds/commit", async (req, res, next) => {
  try {
    const serverSeed = generateServerSeed();
    const nonce = generateNonce();
    const commitHex = makeCommitHex(serverSeed, nonce);

    const round = await prisma.round.create({
      data: {
        status: "CREATED",
        nonce,
        commitHex,
        serverSeed,
      },
    });

    res.json({
      roundId: round.id,
      commitHex,
      nonce,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 2. START (CORE)
 */
router.post("/rounds/:id/start", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientSeed, betCents, dropColumn } = req.body;

    if (!clientSeed) return res.status(400).json({ error: "clientSeed required" });
    if (typeof dropColumn !== "number" || dropColumn < 0 || dropColumn > 12) {
      return res.status(400).json({ error: "invalid dropColumn" });
    }

    const round = await prisma.round.findUnique({ where: { id } });
    if (!round) return res.status(404).json({ error: "Round not found" });

    if (round.status !== "CREATED") {
      return res.status(400).json({ error: "Round already started" });
    }

    const result = runGame(round.serverSeed, clientSeed, round.nonce, dropColumn);

    const updated = await prisma.round.update({
      where: { id },
      data: {
        status: "STARTED",
        clientSeed,
        combinedSeed: result.combinedSeed,
        pegMapHash: result.pegMapHash,
        rows: 12,
        dropColumn,
        binIndex: result.binIndex,
        payoutMultiplier: result.payoutMultiplier,
        betCents,
        pathJson: result.path,
      },
    });

    res.json({
      roundId: updated.id,
      binIndex: updated.binIndex,
      payoutMultiplier: updated.payoutMultiplier,
      path: updated.pathJson,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 3. REVEAL
 */
router.post("/rounds/:id/reveal", async (req, res, next) => {
  try {
    const { id } = req.params;

    const round = await prisma.round.findUnique({ where: { id } });
    if (!round) return res.status(404).json({ error: "Round not found" });

    const updated = await prisma.round.update({
      where: { id },
      data: {
        status: "REVEALED",
        revealedAt: new Date(),
      },
    });

    res.json({
      serverSeed: updated.serverSeed,
      nonce: updated.nonce,
      commitHex: updated.commitHex,
    });
  } catch (err) {
    next(err);
  }
});
router.get("/rounds/:id", async (req, res, next) => {
  try {
    const round = await prisma.round.findUnique({
      where: { id: req.params.id },
    });

    if (!round) return res.status(404).json({ error: "Round not found" });

    res.json({
      ...round,
      serverSeed: round.status === "REVEALED" ? round.serverSeed : null,
    });
  } catch (err) {
    next(err);
  }
});
router.get("/verify", (req, res) => {
  const { serverSeed, clientSeed, nonce, dropColumn } = req.query;

  if (!serverSeed || !clientSeed || !nonce || dropColumn === undefined) {
    return res.status(400).json({ error: "missing params" });
  }

  const col = parseInt(dropColumn, 10);

  const commitHex = makeCommitHex(serverSeed, nonce);
  const result = runGame(serverSeed, clientSeed, nonce, col);

  res.json({
    commitHex,
    combinedSeed: result.combinedSeed,
    pegMapHash: result.pegMapHash,
    binIndex: result.binIndex,
  });
});

export default router;