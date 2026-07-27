# Kandengue Shared Migration (rn-expo-native-kandengue-ts) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `rn-expo-native-kandengue-ts` (the Passenger app) to consume the already-released `@rafaelpilartes/kandengue-shared` v1.0.1 package instead of its own local duplicate types in `src/interfaces/IPromotion.ts`, and delete the local types that turn out to be unused dead code in this app.

**Architecture:** Unlike the previous two migrations (node-fastify, web-painel), this app's promotion/referral system is **REST-first**: validating/applying a promo code and requesting a withdrawal all go through backend REST endpoints that return their own response DTOs (`ValidatePromotionResponse`, `ApplyPromotionResponse`, `RequestWithdrawalResponse`, `ListMyEarningsResponse`) — the app never directly reads the raw `Promotion` or `WithdrawalRequest` Firestore documents. The **only** direct Firestore read of a shared domain type is `PromotionUsageInterface`, used for real-time active-reservation tracking. A repo-wide grep (verified, not assumed) found `PromotionType`, `PromotionUsageStatus`, `EarningStatus`, `WithdrawalStatus`, `AllowedCities`, `PromotionRules`, `ReferralConfig`, the standalone `PromotionInterface`, and `WithdrawalRequestInterface` all have **zero usages** anywhere outside their own declaration file (and, after accounting for cross-references *within* that file, all of them are only ever referenced by other now-dead types) — this migration deletes them outright instead of replacing them with an unused import, per YAGNI. `RideKind` and `RidePaymentMethod` are still needed, but only inside the local REST contract types that stay — they get their local declarations replaced with imports from the shared package instead of being deleted, since the REST contracts themselves are staying.

**Tech Stack:** React Native 0.81.5, Expo ~54.0.25, TypeScript ~5.9.2, Metro bundler (`moduleResolution: "bundler"`, `customConditions: ["react-native"]`). This repo has **no test script and no typecheck script** in `package.json` — verification is `npx tsc --noEmit` (a flat tsconfig, no project references, so this is the correct and sufficient command here — unlike the sibling repos, there is no `tsc -b` indirection to worry about) plus `npx expo export` to prove Metro can actually *bundle* the new git dependency (type-checking alone doesn't exercise Metro's separate module-resolution system).

## Global Constraints

- Package already exists and is released: `@rafaelpilartes/kandengue-shared` v1.0.1, installed via `"github:RafaelPilartes/lib_npm-kandengue_shared-ts#v1.0.1"`. No new version of the shared package is needed for this migration.
- `ReferralSettingsInterface` stays local (out of scope for the shared package, same as the other two repos' equivalents) — do not touch `IAppConfigRepository.ts`, `appConfig.dao.ts`, `appConfigUseCase.ts`, or `ReferralViewModel.ts`'s use of it.
- All the REST contract types (`ValidatePromotionRequest`, `ValidatePromotionResponse`, `ApplyPromotionRequest`, `ApplyPromotionResponse`, `RequestWithdrawalRequest`, `RequestWithdrawalResponse`, `ListMyEarningsResponse`) stay local and unchanged in shape — they are HTTP contracts specific to this app's REST client, not Firestore domain types, and were never part of the shared package's scope. Only their *internal* references to now-migrated types (`PromotionType`, `RideKind`, `RidePaymentMethod`, `ReferralEarningInterface`) change.
- Metro (`customConditions: ["react-native"]`) resolves the shared package's `exports` map (which has no explicit `"react-native"` condition) by falling back to the `"import"`/`"require"` conditions — this is the same fallback behavior every third-party npm package without an RN-specific build already relies on in this app, so no changes to the shared package or to `metro.config.js` are anticipated. Task 2 verifies this empirically via `npx expo export`, since type-checking alone cannot prove Metro's bundler resolved it correctly.
- The Driver app (`rn-expo-native-kandengue_pro-ts`) needs **no migration at all** — confirmed via repo-wide grep that it has zero duplication of `Promotion`/`PromotionUsage`/`ReferralEarning`/`WithdrawalRequest` (only two pass-through scalar fields, `promotion_id?`/`promotion_usage_id?`, on its `RideEntity`, which is explicitly out of scope per the original design spec). No plan or task exists for that repo.

---

### Task 1: Migrate `PromotionUsageInterface` to the shared package and delete dead local types

**Files:**
- Modify: `/Users/user/Projects/Kandebgue/rn-expo-native-kandengue-ts/package.json`
- Modify: `src/interfaces/IPromotion.ts`
- Modify: `src/core/interfaces/IPromotionUsageRepository.ts`
- Modify: `src/modules/Api/firebase/promotionUsage.dao.ts`
- Modify: `src/domain/usecases/promotionUsageUseCase.ts`

**Interfaces:**
- Consumes: `@rafaelpilartes/kandengue-shared/usage` (`PromotionUsage`), `@rafaelpilartes/kandengue-shared/referral` (`ReferralEarning`), `@rafaelpilartes/kandengue-shared/promotion` (`PromotionType`, `RideKind`, `RidePaymentMethod`).
- Produces: nothing new. The deliverable is `npx tsc --noEmit` passing clean with zero remaining local declarations of any migrated type, and all genuinely-dead local types removed.

This task does everything in one pass — installs the package, rewrites `IPromotion.ts`, and fixes the 3 consumer files — so the repo never sits on a commit with a broken build mid-task.

- [ ] **Step 1: Install the package**

```bash
cd /Users/user/Projects/Kandebgue/rn-expo-native-kandengue-ts
npm install "@rafaelpilartes/kandengue-shared@github:RafaelPilartes/lib_npm-kandengue_shared-ts#v1.0.1"
```

- [ ] **Step 2: Rewrite `src/interfaces/IPromotion.ts`**

Replace the entire file with:

```ts
// Replicação manual — fonte de verdade: documento "08 — Firestore Schema".
// Só ficam aqui os contratos REST (específicos desta app) e o tipo que
// continua fora de escopo do pacote partilhado (ReferralSettingsInterface).
// Promotion, PromotionUsage e ReferralEarning vêm de @rafaelpilartes/kandengue-shared.

import type {
  PromotionType,
  RideKind,
  RidePaymentMethod
} from '@rafaelpilartes/kandengue-shared/promotion'
import type { ReferralEarning } from '@rafaelpilartes/kandengue-shared/referral'

export interface ReferralSettingsInterface {
  minimum_withdrawal_amount: number
  updated_by: string
  updated_at: Date
}

// REST API contracts
export interface ValidatePromotionRequest {
  code: string
  ride_context: {
    city_origin: string
    city_destination: string
    ride_type: RideKind
    estimated_price: number
    payment_method: RidePaymentMethod
  }
}

export interface ValidatePromotionResponse {
  valid: true
  code_applied: string
  discount_amount: number
  discount_type: PromotionType
  final_price: number
}

export interface ApplyPromotionRequest extends ValidatePromotionRequest {
  device_id?: string
}

export interface ApplyPromotionResponse {
  promotion_usage_id: string
  promotion_id: string
  expires_at: string
  discount_amount: number
  discount_type: PromotionType
  final_price: number
}

export interface RequestWithdrawalRequest {
  payment_details: {
    bank_name: string
    account_number: string
    account_holder: string
  }
}

export interface RequestWithdrawalResponse {
  withdrawal_id: string
  total_amount: number
  earning_ids: string[]
}

export interface ListMyEarningsResponse {
  totals: {
    paid: number
    pending: number
    requested: number
  }
  earnings: Array<
    Omit<ReferralEarning, 'created_at' | 'requested_at' | 'paid_at'> & {
      created_at: string
      requested_at?: string | null
      paid_at?: string | null
    }
  >
}
```

This deletes `PromotionUsageStatus`, `EarningStatus`, `WithdrawalStatus`, `AllowedCities`, `PromotionRules`, `ReferralConfig`, `PromotionInterface`, `PromotionUsageInterface`, `ReferralEarningInterface`, and `WithdrawalRequestInterface` entirely — all confirmed dead (zero usages anywhere in this repo once their only referrers, `PromotionInterface`/`WithdrawalRequestInterface`/`PromotionUsageInterface`/`ReferralEarningInterface`, are themselves removed). `PromotionType`, `RideKind`, `RidePaymentMethod` are kept, but now imported from the shared package instead of declared locally, since the REST contract types above still need them.

- [ ] **Step 3: Fix `src/core/interfaces/IPromotionUsageRepository.ts`**

Replace:
```ts
// core/interfaces/IPromotionUsageRepository.ts
import type { PromotionUsageInterface } from '@/interfaces/IPromotion';

/**
 * Repository de leitura sobre `promotion_usages` (Firestore).
 * O passageiro só lê — escritas são feitas pelo backend e triggers.
 */
export interface IPromotionUsageRepository {
  getActiveReservation(
    userId: string,
  ): Promise<PromotionUsageInterface | null>;

  getByRideId(rideId: string): Promise<PromotionUsageInterface | null>;

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsageInterface | null) => void,
    onError?: (err: Error) => void,
  ): () => void;
}
```
with:
```ts
// core/interfaces/IPromotionUsageRepository.ts
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage';

/**
 * Repository de leitura sobre `promotion_usages` (Firestore).
 * O passageiro só lê — escritas são feitas pelo backend e triggers.
 */
export interface IPromotionUsageRepository {
  getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null>;

  getByRideId(rideId: string): Promise<PromotionUsage | null>;

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ): () => void;
}
```

- [ ] **Step 4: Fix `src/modules/Api/firebase/promotionUsage.dao.ts`**

Replace:
```ts
import type { IPromotionUsageRepository } from '@/core/interfaces/IPromotionUsageRepository'
import type { PromotionUsageInterface } from '@/interfaces/IPromotion'

function toDate(v: any): Date | null {
  if (!v) return null
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  return new Date(v)
}

function mapDoc(data: any): PromotionUsageInterface {
  return {
    ...data,
    expires_at: toDate(data.expires_at),
    created_at: toDate(data.created_at) ?? new Date(),
    updated_at: toDate(data.updated_at) ?? new Date(),
  } as PromotionUsageInterface
}

export class FirebasePromotionUsageDAO implements IPromotionUsageRepository {
  private ref = collection(db, firebaseCollections.promotionUsages.root)

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsageInterface | null> {
    const snap = await getDoc(doc(this.ref, `active_reservation_${userId}`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsageInterface | null> {
    const snap = await getDoc(doc(this.ref, `${rideId}_promo`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsageInterface | null) => void,
    onError?: (err: Error) => void,
  ): () => void {
```
with:
```ts
import type { IPromotionUsageRepository } from '@/core/interfaces/IPromotionUsageRepository'
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage'

function toDate(v: any): Date | null {
  if (!v) return null
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  return new Date(v)
}

function mapDoc(data: any): PromotionUsage {
  return {
    ...data,
    expires_at: toDate(data.expires_at),
    created_at: toDate(data.created_at) ?? new Date(),
    updated_at: toDate(data.updated_at) ?? new Date(),
  } as PromotionUsage
}

export class FirebasePromotionUsageDAO implements IPromotionUsageRepository {
  private ref = collection(db, firebaseCollections.promotionUsages.root)

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null> {
    const snap = await getDoc(doc(this.ref, `active_reservation_${userId}`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsage | null> {
    const snap = await getDoc(doc(this.ref, `${rideId}_promo`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ): () => void {
```
(The rest of the file — the `onSnapshot` body — is unchanged; only the type name changes, never its logic.)

- [ ] **Step 5: Fix `src/domain/usecases/promotionUsageUseCase.ts`**

Replace:
```ts
// src/domain/usecases/promotionUsageUseCase.ts
import { promotionUsageRepository } from '@/modules/Api'
import type { PromotionUsageInterface } from '@/interfaces/IPromotion'

export class PromotionUsageUseCase {
  private repository = promotionUsageRepository

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsageInterface | null> {
    try {
      return await this.repository.getActiveReservation(userId)
    } catch (error: any) {
      console.error('Erro ao buscar reserva ativa:', error)
      throw new Error(error.message || 'Erro ao buscar reserva ativa')
    }
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsageInterface | null> {
    try {
      return await this.repository.getByRideId(rideId)
    } catch (error: any) {
      console.error('Erro ao buscar uso por ride:', error)
      throw new Error(error.message || 'Erro ao buscar uso por ride')
    }
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsageInterface | null) => void,
    onError?: (err: Error) => void,
  ) {
```
with:
```ts
// src/domain/usecases/promotionUsageUseCase.ts
import { promotionUsageRepository } from '@/modules/Api'
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage'

export class PromotionUsageUseCase {
  private repository = promotionUsageRepository

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null> {
    try {
      return await this.repository.getActiveReservation(userId)
    } catch (error: any) {
      console.error('Erro ao buscar reserva ativa:', error)
      throw new Error(error.message || 'Erro ao buscar reserva ativa')
    }
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsage | null> {
    try {
      return await this.repository.getByRideId(rideId)
    } catch (error: any) {
      console.error('Erro ao buscar uso por ride:', error)
      throw new Error(error.message || 'Erro ao buscar uso por ride')
    }
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ) {
```
(The rest of the file — the `try`/`catch` body of `listenActiveReservation` — is unchanged.)

- [ ] **Step 6: Type-check**

```bash
cd /Users/user/Projects/Kandebgue/rn-expo-native-kandengue-ts
npx tsc --noEmit
```
Expected: exits 0, zero errors.

- [ ] **Step 7: Confirm no remaining references to the deleted local types**

```bash
grep -rn "PromotionUsageInterface\|ReferralEarningInterface\|WithdrawalRequestInterface\|PromotionInterface\b\|PromotionUsageStatus\|EarningStatus\|WithdrawalStatus\|AllowedCities\|PromotionRules\|ReferralConfig" src/
```
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/interfaces/IPromotion.ts src/core/interfaces/IPromotionUsageRepository.ts src/modules/Api/firebase/promotionUsage.dao.ts src/domain/usecases/promotionUsageUseCase.ts
git commit -m "refactor: migrate to kandengue-shared, remove dead local promotion/withdrawal types"
```

---

### Task 2: Full verification (type-check + Metro bundle)

**Files:** none (verification only)

- [ ] **Step 1: Clean type-check**

```bash
cd /Users/user/Projects/Kandebgue/rn-expo-native-kandengue-ts
npx tsc --noEmit
```
Expected: exits 0, zero errors.

- [ ] **Step 2: Verify Metro can actually bundle the new dependency**

```bash
npx expo export --platform ios --output-dir /tmp/kandengue-passenger-export-check
```
Expected: exits 0, no "Unable to resolve module" or package-exports resolution errors for `@rafaelpilartes/kandengue-shared/usage` or `@rafaelpilartes/kandengue-shared/referral`. This is a stronger check than `tsc --noEmit` alone — it proves Metro's bundler (a separate resolution system from TypeScript) can actually load the shared package's `exports` map, which the plan's Global Constraints section flags as the one real toolchain risk specific to this repo. Clean up afterward:
```bash
rm -rf /tmp/kandengue-passenger-export-check
```

- [ ] **Step 3: Confirm no orphaned references anywhere in the repo**

```bash
grep -rn "IPromotion\b" src/ 2>/dev/null
```
Expected: only matches inside import paths (`from '@/interfaces/IPromotion'`) for the 4 files that still import `ReferralSettingsInterface` or the REST contract types (`ReferralViewModel.ts`, `IAppConfigRepository.ts`, `appConfig.dao.ts`, `appConfigUseCase.ts`, `PromotionViewModel.ts`, `IPromotionRepository.ts`, `promotion.dao.ts` (rest), `promotionUseCase.ts`) — no file should still reference a deleted type name.

- [ ] **Step 4: Report**

No commit expected from this task unless the Metro bundle check surfaces a real resolution problem (in which case, investigate, fix — likely by adding an explicit `"react-native"` condition to the shared package's `exports` map as a follow-up release — and re-run Steps 1-3).

---

## Self-Review

**Spec coverage:**
- "Migração dos consumidores" step 3 (RN apps, "em paralelo" per the spec) → this plan covers the Passenger app in full; the Driver app needs no plan at all, confirmed via repo-wide grep showing zero duplication of any in-scope type — documented explicitly in Global Constraints so this isn't mistaken for an oversight later.
- Every type in the original `IPromotion.ts` is accounted for: either migrated to an import (`PromotionUsageInterface`, `ReferralEarningInterface` via `ListMyEarningsResponse`, `PromotionType`/`RideKind`/`RidePaymentMethod` via the REST contracts), or confirmed dead via grep and deleted (`PromotionUsageStatus`, `EarningStatus`, `WithdrawalStatus`, `AllowedCities`, `PromotionRules`, `ReferralConfig`, `PromotionInterface`, `WithdrawalRequestInterface`), or confirmed out-of-scope and left untouched (`ReferralSettingsInterface`).
- Metro/Expo-specific toolchain risk (package `exports` resolution under a bundler with `customConditions: ["react-native"]`) is called out explicitly and given its own verification step (`npx expo export`), rather than assuming `tsc --noEmit` passing is sufficient proof — type-checking and Metro bundling are separate systems that can disagree.

**Placeholder scan:** no TBD/TODO — every step shows the full file content or an exact before/after diff.

**Type consistency:** `PromotionUsage` (Task 1 Step 2 onward) matches the shared package's `usage.ts` exactly (same type this app's sibling repos already migrated to). `ReferralEarning`'s use inside `ListMyEarningsResponse`'s `Omit<...>` preserves the exact same override shape (`created_at`/`requested_at`/`paid_at` re-typed as `string`/`string | null` for JSON-over-REST transport) that the original `ReferralEarningInterface`-based version had.

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-27-kandengue-shared-migration.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
