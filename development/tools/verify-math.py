#!/usr/bin/env python3
"""
Mathematical accuracy verification for dodo-poker.

Verifies every numerical claim made in game content — hand frequencies,
assessment correctAnswer values, probability tree calculations — from
first principles using exact arithmetic.

Run directly:    python3 development/tools/verify-math.py
Via npm:         npm run verify-math     (from development/)
Pre-commit:      runs automatically via .hooks/pre-commit

Exit 0 = all checks pass. Exit 1 = one or more failures.
Add new checks to NUMERIC_ASSESSMENT_ANSWERS and the relevant section
below whenever a new numeric correctAnswer is written into dialog JSON.
"""

import json
import sys
from fractions import Fraction
from math import comb
from pathlib import Path

REPO_ROOT  = Path(__file__).resolve().parent.parent
DIALOG_DIR = REPO_ROOT / "dialog"

PASS = 0
FAIL = 0
WARNINGS = []


def ok(label: str) -> None:
    global PASS
    PASS += 1
    print(f"  ✓  {label}")


def fail(label: str, expected, actual) -> None:
    global FAIL
    FAIL += 1
    print(f"  ✗  {label}")
    print(f"       expected: {expected}")
    print(f"       actual:   {actual}")


def warn(label: str) -> None:
    WARNINGS.append(label)
    print(f"  ?  {label}")


def assert_eq(label: str, expected, actual) -> None:
    if expected == actual:
        ok(label)
    else:
        fail(label, expected, actual)


def assert_close(label: str, expected: float, actual: float, tol: float = 1e-6) -> None:
    if abs(expected - actual) <= tol:
        ok(label)
    else:
        fail(label, f"{expected:.8f}", f"{actual:.8f}")


def section(title: str) -> None:
    print(f"\n{title}")
    print("─" * len(title))


# ── Five-card hand frequencies ────────────────────────────────────────────────

section("Five-card hand frequencies  (C(52,5) = 2,598,960)")

TOTAL = comb(52, 5)

ROYAL_FLUSH    = 4
STRAIGHT_FLUSH = 36                                  # excludes royal
FOUR_KIND      = comb(13,1) * comb(4,4) * comb(12,1) * comb(4,1)
FULL_HOUSE     = comb(13,1) * comb(4,3) * comb(12,1) * comb(4,2)
FLUSH          = comb(4,1) * comb(13,5) - 40        # subtract straight flushes
STRAIGHT       = 10 * (4**5) - 40                   # subtract straight flushes
THREE_KIND     = comb(13,1) * comb(4,3) * comb(12,2) * 4 * 4
TWO_PAIR       = comb(13,2) * comb(4,2) * comb(4,2) * comb(11,1) * 4
ONE_PAIR       = comb(13,1) * comb(4,2) * comb(12,3) * 4**3
HIGH_CARD      = TOTAL - (
    ROYAL_FLUSH + STRAIGHT_FLUSH + FOUR_KIND + FULL_HOUSE +
    FLUSH + STRAIGHT + THREE_KIND + TWO_PAIR + ONE_PAIR
)

KNOWN_COUNTS = {
    "High Card":       1_302_540,
    "One Pair":        1_098_240,
    "Two Pair":          123_552,
    "Three of a Kind":    54_912,
    "Straight":           10_200,
    "Flush":               5_108,
    "Full House":          3_744,
    "Four of a Kind":        624,
    "Straight Flush":         36,
    "Royal Flush":             4,
}

COMPUTED_COUNTS = {
    "High Card":       HIGH_CARD,
    "One Pair":        ONE_PAIR,
    "Two Pair":        TWO_PAIR,
    "Three of a Kind": THREE_KIND,
    "Straight":        STRAIGHT,
    "Flush":           FLUSH,
    "Full House":      FULL_HOUSE,
    "Four of a Kind":  FOUR_KIND,
    "Straight Flush":  STRAIGHT_FLUSH,
    "Royal Flush":     ROYAL_FLUSH,
}

assert_eq("Total hands C(52,5)", 2_598_960, TOTAL)
for name, known in KNOWN_COUNTS.items():
    pct = COMPUTED_COUNTS[name] / TOTAL * 100
    assert_eq(f"{name:<18} {COMPUTED_COUNTS[name]:>9,}  ({pct:.4f}%)", known, COMPUTED_COUNTS[name])
assert_eq("All hand counts sum to C(52,5)", TOTAL, sum(COMPUTED_COUNTS.values()))

# Reference percentages used in FrequencyTable.svelte and dialog content
assert_close("High Card   ~50.1177%", 50.1177, HIGH_CARD  / TOTAL * 100, tol=0.0001)
assert_close("One Pair    ~42.2569%", 42.2569, ONE_PAIR   / TOTAL * 100, tol=0.0001)
assert_close("Two Pair    ~ 4.7539%",  4.7539, TWO_PAIR   / TOTAL * 100, tol=0.0001)


# ── Two-card hole card probabilities (Table 2B) ──────────────────────────────

section("Two-card hole card probabilities  (Table 2B — 52 → 51 sequential deal)")

# P(pocket aces): first ace from 52, second from remaining 51 (3 aces left)
pocket_aces = Fraction(4, 52) * Fraction(3, 51)
assert_eq("P(pocket aces) = 4/52 × 3/51 = 1/221",         Fraction(1, 221),  pocket_aces)
assert_close("P(pocket aces) ≈ 0.4525%", 0.452489, float(pocket_aces) * 100, tol=0.0001)

# P(pocket pair, any rank): 13 equally rare specific pairs
pocket_pair_any = 13 * pocket_aces
assert_eq("P(pocket pair, any rank) = 13/221",             Fraction(13, 221), pocket_pair_any)
assert_close("P(pocket pair, any rank) ≈ 5.8824%", 5.8824, float(pocket_pair_any) * 100, tol=0.0001)

# P(ace + king, any order, any suits): P(A then K) + P(K then A)
p_ak_ordered = Fraction(4, 52) * Fraction(4, 51)   # ace first, king second
p_ka_ordered = Fraction(4, 52) * Fraction(4, 51)   # king first, ace second (same value)
p_ak_either  = p_ak_ordered + p_ka_ordered
assert_eq("P(A then K, any suit) = 4/52 × 4/51 = 16/2652",  Fraction(16, 2652), p_ak_ordered)
assert_eq("P(A+K either order, any suit) = 32/2652",         Fraction(32, 2652), p_ak_either)

# P(specific two-card combo, e.g. A♠ and K♥ regardless of order)
specific_combo = Fraction(2, 52) * Fraction(1, 51)  # P(one of the two specific cards first) × P(the other second)
assert_eq("P(specific two cards e.g. A♠K♥, either order) = 2/2652 = 1/1326",
          Fraction(1, 1326), specific_combo)

# Gate question probe: P(ace-king suited): 4 suits × P(that ace then that king in same suit)
ak_suited = 4 * (Fraction(1, 52) * Fraction(1, 51)) * 2  # ×2 for either order
assert_eq("P(ace-king suited, either order) = 8/2652 = 2/663",
          Fraction(2, 663), ak_suited)


# ── Conditional probability foundations (Table 3B prep) ─────────────────────

section("Conditional probability — draw outs  (Table 3B prep)")

# P(completing flush with 1 draw from 47 remaining cards)
# Hold 4 spades; 9 spades remain in 47 unseen cards
flush_draw = Fraction(9, 47)
assert_eq("P(flush on draw | 4 to flush, 47 unseen) = 9/47",  Fraction(9, 47), flush_draw)
assert_close("P(flush draw) ≈ 19.149%", 19.149, float(flush_draw) * 100, tol=0.001)

# P(completing open-ended straight with 1 draw)
# 8 cards complete an OESD (4 ranks at each end)
oesd_draw = Fraction(8, 47)
assert_eq("P(OESD on draw | 47 unseen) = 8/47",               Fraction(8, 47), oesd_draw)
assert_close("P(OESD draw) ≈ 17.021%", 17.021, float(oesd_draw) * 100, tol=0.001)

# P(four of a kind with 1 draw: hold 3-of-a-kind, 1 card of that rank remains)
quads_draw = Fraction(1, 47)
assert_eq("P(quads on draw | 3oaK held, 47 unseen) = 1/47",   Fraction(1, 47), quads_draw)


# ── Assessment numeric answers in dialog JSON ────────────────────────────────
#
# Register every dialog node with responseType="numeric" here.
# Format:  "node-id": (correct_answer, human_readable_description)
#
# When a new numeric node is added to any dialog JSON file, add it here
# before the commit. Unregistered numeric nodes produce a warning.

# Static numeric nodes: correctAnswer is a fixed value we can verify here.
# live-numeric nodes have correctAnswerKey instead — no static value to check.
NUMERIC_ASSESSMENT_ANSWERS: dict[str, tuple[int | float, str]] = {
    # Table 1A
    "t1a-assess-hank-numeric": (5,  "Hank bets every hand — 5 of 5 expected bets"),
    # Table 1B
    "t1b-assess-proc":         (40, "20 pairs / 50 hands = 40% relative frequency"),
}

# Known correctAnswerKey values for live-numeric nodes (must match LiveDataKey in liveData.ts).
# Unrecognised keys produce a warning — they can still work at runtime but should be added here
# once confirmed correct so the closed enum stays in sync.
KNOWN_LIVE_DATA_KEYS = {
    "totalHands",
    "highCardCount",   "onePairCount",        "twoPairCount",      "threeOfAKindCount",
    "straightCount",   "flushCount",          "fullHouseCount",    "fourOfAKindCount",
    "straightFlushCount",
    "winCount",        "lossCount",           "tieCount",          "foldCount",
    "highCardPercent", "onePairPercent",       "twoPairPercent",    "threeOfAKindPercent",
    "straightPercent", "flushPercent",         "fullHousePercent",  "fourOfAKindPercent",
    "straightFlushPercent",
    "winPercent",      "lossPercent",         "tiePercent",
}

section("Assessment correctAnswer values in dialog JSON")

found_numeric_nodes = []

for json_file in sorted(DIALOG_DIR.glob("table-*.json")):
    try:
        data = json.loads(json_file.read_text())
    except json.JSONDecodeError as e:
        fail(f"{json_file.name}: valid JSON", "parseable", str(e))
        continue

    for node in data.get("nodes", []):
        node_id  = node.get("id", "")
        response = node.get("responseType", "")

        if response == "numeric" and "correctAnswer" in node:
            ca = node["correctAnswer"]
            found_numeric_nodes.append(node_id)
            if node_id in NUMERIC_ASSESSMENT_ANSWERS:
                expected_ca, desc = NUMERIC_ASSESSMENT_ANSWERS[node_id]
                assert_eq(f"{node_id}: {desc}", expected_ca, ca)
            else:
                warn(
                    f"{node_id}: correctAnswer={ca} not registered in "
                    f"NUMERIC_ASSESSMENT_ANSWERS — add it to verify-math.py"
                )

        elif response == "live-numeric":
            key = node.get("correctAnswerKey", "")
            if not key:
                warn(f"{node_id}: live-numeric node missing correctAnswerKey")
            elif key not in KNOWN_LIVE_DATA_KEYS:
                warn(
                    f"{node_id}: correctAnswerKey='{key}' not in KNOWN_LIVE_DATA_KEYS — "
                    f"add it to verify-math.py and liveData.ts"
                )
            else:
                ok(f"{node_id}: live-numeric key '{key}' recognised")

# Flag registered entries with no matching dialog node (stale registrations)
for node_id in NUMERIC_ASSESSMENT_ANSWERS:
    if node_id not in found_numeric_nodes:
        warn(f"{node_id} is registered in NUMERIC_ASSESSMENT_ANSWERS but not found in any dialog JSON")


# ── Report ───────────────────────────────────────────────────────────────────

print()
if WARNINGS:
    print(f"Warnings ({len(WARNINGS)}):")
    for w in WARNINGS:
        print(f"  ! {w}")

if FAIL:
    print()
    print(f"{'═' * 55}")
    print(f"  FAILED: {FAIL} check(s) failed, {PASS} passed.")
    print(f"{'═' * 55}")
    sys.exit(1)
else:
    total = PASS + len(WARNINGS)
    print(f"{'═' * 55}")
    print(f"  All {PASS} checks passed." + (f"  {len(WARNINGS)} warning(s)." if WARNINGS else ""))
    print(f"{'═' * 55}")
    sys.exit(0)
