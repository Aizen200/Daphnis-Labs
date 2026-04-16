# Plinko Lab — Provably Fair Game

A full-stack implementation of a **provably fair Plinko game**, built as part of the **Daphnis Labs Full-Stack Developer Internship Assignment**.

This project focuses on **deterministic systems, cryptographic fairness, and polished user experience**.

---

##  Live Links

* Game:https://daphnis-labs-rho.vercel.app/game
* Repository: https://github.com/Aizen200/Daphnis-Labs

---

## Architecture Overview

### Frontend

* React (Vite)
* TailwindCSS
* Framer Motion (animations)
* Custom hooks (`useGameState`, `useAnimation`, `useSound`)

### Backend

* Node.js + Express
* Prisma ORM
* PostgreSQL (or SQLite)

---

## 🔄 System Flow

1. Client calls `/commit`
2. Server generates `serverSeed + nonce`
3. Server returns `commitHex`
4. Client sends `clientSeed + bet + dropColumn`
5. Server computes deterministic result
6. Frontend animates path
7. Server reveals `serverSeed`
8. Verifier recomputes outcome

---

##  Provably Fair Implementation

### Commit-Reveal

```
commitHex = SHA256(serverSeed + ":" + nonce)
```

Server does **NOT reveal serverSeed before gameplay**.

---

### Combined Seed

```
combinedSeed = SHA256(serverSeed + ":" + clientSeed + ":" + nonce)
```

This seed drives all randomness.

---

### PRNG

Custom **xorshift32** implementation:

* Seed derived from first 4 bytes of `combinedSeed`
* Fully deterministic
* Same inputs → same outputs

---

## 🎲 Deterministic Game Engine

### Configuration

* Rows: 12
* Bins: 13 (0–12)

---

### Peg Map

Each peg has a bias:

```
leftBias = 0.5 + (rand() - 0.5) * 0.5
clamped → [0.2, 0.8]
rounded → 6 decimals
```

Stored as:

```
pegMapHash = SHA256(JSON.stringify(pegMap))
```

---

### Path Logic

At each row:

```
bias = clamp(leftBias + adjustment, 0, 1)

if rand() < bias → LEFT
else → RIGHT
```

Final:

```
binIndex = number of RIGHT moves
```

---

## Payout Table

```
[10, 5, 3, 1.5, 1, 0.5, 0.5, 0.5, 1, 1.5, 3, 5, 10]
```

Symmetric reward structure.

---

## Verifier

The `/verify` page allows users to recompute:

* commitHex
* combinedSeed
* pegMapHash
* binIndex
* full path

Ensures complete **transparency and trust**.

---

##  Features

### Gameplay

* Adjustable bet
* Drop column (slider + keyboard)
* Deterministic animation

### UI/UX

* Smooth SVG animation (Framer Motion)
* Confetti on landing
* Glassmorphism + neon UI

### Sound

* Peg collision ticks
* Win sound
* Persistent mute toggle

### Accessibility

* Keyboard controls (← →, Space)
* Reduced motion support

### Easter Eggs

* Debug Grid (G)
* Tilt Mode (T)
* Secret Theme ("opensesame")

---

## API Endpoints

### POST `/api/rounds/commit`

Returns:

```
{ roundId, commitHex, nonce }
```

### POST `/api/rounds/:id/start`

Body:

```
{ clientSeed, betCents, dropColumn }
```

Returns:

```
{ binIndex, payoutMultiplier, path }
```

### POST `/api/rounds/:id/reveal`

Returns:

```
{ serverSeed }
```

### GET `/api/rounds/:id`

Returns full round data

### GET `/api/verify`

Returns deterministic recomputation

---

## 🗄️ Database Schema

```
Round {
  id
  status
  nonce
  commitHex
  serverSeed
  clientSeed
  combinedSeed
  pegMapHash
  rows
  dropColumn
  binIndex
  payoutMultiplier
  betCents
  pathJson
}
```

---

## Testing

Unit tests implemented using **Vitest**:

* PRNG determinism
* Engine reproducibility
* Commit hash validation

Run tests:

```
npm test
```

---

##  Setup

### Backend

```
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

```
DATABASE_URL=your_database_url
PORT=3001
```

---

##  AI Usage

AI was used for:

* Debugging animation logic
* Understanding PRNG and fairness systems
* Improving UI polish

All critical logic was **reviewed, tested, and validated manually**.

---

## ⏱️ Time Spent

| Task              | Time  |
| ----------------- | ----- |
| Backend + API     | 3 hrs |
| Engine + PRNG     | 2 hrs |
| Frontend UI       | 4 hrs |
| Animation + Sound | 2 hrs |
| Debugging         | 2 hrs |

Total: **~13 hours**

---

## Test Vector

Input:

```
serverSeed = b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc
clientSeed = candidate-hello
nonce = 42
dropColumn = 6
```

Expected:

```
binIndex = 6
```

---

##  Author

**Yatin Bisht**

---

##  License

This project is for educational and evaluation purposes only.
