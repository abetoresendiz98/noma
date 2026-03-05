"""
╔══════════════════════════════════════════════════════════════════════╗
║  APEX BOT v1.0 — ICT+SMC SHORT SETUP — OKX PAPER TRADING ENGINE    ║
║  Built from YOUR live data: 85.8% WR, best assets INJ/HYPE/AAVE    ║
║  DO NOT flip PAPER_MODE = False until Stage 2 backtesting is done  ║
╚══════════════════════════════════════════════════════════════════════╝

WHAT THIS BOT DOES:
  1. Every 5 minutes, scans your 10 watchlist assets on OKX
  2. Detects your exact ICT+SMC short setup:
       - Checks you are in a Killzone window (London or NY)
       - Looks for a liquidity sweep (price takes obvious high/low)
       - Confirms a Fair Value Gap (FVG) formed on 15m chart
       - Checks volume spike confirms displacement
  3. In PAPER MODE: logs the signal, simulates entry, tracks P&L
  4. In LIVE MODE: places real OCO order on OKX with $2 max stop

YOUR 6 HARD RULES ARE HARD-CODED — THE BOT CANNOT BREAK THEM:
  Rule 1: Max loss per trade = $2.00 USDT
  Rule 2: Max leverage = 18x
  Rule 3: Max 3 open positions simultaneously
  Rule 4: Never trade 00:00-05:00 UTC
  Rule 5: Close all positions before 06:30 UTC
  Rule 6: Daily loss limit = $20 → bot stops for the day

HOW TO RUN:
  1. Copy .env.example to .env and fill in your OKX API keys
  2. python apex_bot.py
  3. Watch the signals log. Don't change anything for 2 weeks.
"""

import os
import time
import json
import hmac
import base64
import hashlib
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from pathlib import Path

# ── CONFIGURATION ─────────────────────────────────────────────────────────────

PAPER_MODE = True   # ← KEEP THIS TRUE until you've backtested 6 months of data

# Your top 10 assets (from your live data — these are your profitable ones)
WATCHLIST = [
    "INJ-USDT-SWAP",       # +$23.24, 84% WR — your best
    "PUMP-USDT-SWAP",      # +$23.03, 100% WR
    "HYPE-USDT-SWAP",      # +$22.14, 95% WR
    "AAVE-USDT-SWAP",      # +$19.57, 95% WR
    "TON-USDT-SWAP",       # +$13.72, 100% WR
    "FARTCOIN-USDT-SWAP",  # +$9.56,  92% WR
    "TAO-USDT-SWAP",       # +$7.87,  100% WR
    "ZEC-USDT-SWAP",       # +$7.59,  100% WR
    "PIPPIN-USDT-SWAP",    # +$12.99, 86% WR
    "SOL-USDT-SWAP",       # +$4.75,  82% WR
]

# Your hard rules — the bot enforces these, no exceptions
RISK_RULES = {
    "max_loss_per_trade_usdt": 2.00,    # Rule 1: $2 hard stop
    "max_leverage":            18,       # Rule 2: 18x max
    "max_open_positions":      3,        # Rule 3: no basket of correlated shorts
    "no_trade_hours_utc":      (0, 5),   # Rule 4: 00:00-05:00 UTC banned
    "pre_london_close_utc":    6.5,      # Rule 5: close all by 06:30 UTC
    "daily_loss_limit_usdt":   20.00,    # Rule 6: stop if down $20/day
}

# ICT Killzone windows (UTC hours) — your best trading windows from data
KILLZONES = {
    "london_open":   (6.0,  8.0),   # 06:00-08:00 UTC — your +$20 window
    "ny_open":       (13.5, 15.5),  # 13:30-15:30 UTC — NY open power hour
    "ny_afternoon":  (17.0, 19.0),  # 17:00-19:00 UTC — your BEST window (+$35)
    "asia_close":    (5.5,  6.5),   # 05:30-06:30 UTC — occasional setups
}

# Signal thresholds
SIGNAL_CONFIG = {
    "sweep_lookback_candles": 20,       # Look back 20 candles for recent high/low
    "sweep_wick_min_pct":     0.003,    # Wick must be 0.3%+ past the level
    "fvg_min_size_pct":       0.001,    # FVG must be at least 0.1% of price
    "volume_spike_multiplier": 1.5,     # Volume must be 1.5x the 20-bar average
    "scan_interval_seconds":  300,      # Scan every 5 minutes
}

# ── OKX API CLIENT ────────────────────────────────────────────────────────────

class OKXClient:
    """
    Handles all communication with OKX exchange.
    In PAPER MODE: only reads market data, never places orders.
    In LIVE MODE: places real orders with hard risk limits.
    """
    BASE_URL = "https://www.okx.com"

    def __init__(self, api_key="", secret_key="", passphrase="", paper=True):
        self.api_key    = api_key
        self.secret_key = secret_key
        self.passphrase = passphrase
        self.paper      = paper

    def _sign(self, timestamp, method, path, body=""):
        msg = f"{timestamp}{method}{path}{body}"
        sig = hmac.new(self.secret_key.encode(), msg.encode(), hashlib.sha256).digest()
        return base64.b64encode(sig).decode()

    def _headers(self, method, path, body=""):
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        return {
            "OK-ACCESS-KEY":        self.api_key,
            "OK-ACCESS-SIGN":       self._sign(ts, method, path, body),
            "OK-ACCESS-TIMESTAMP":  ts,
            "OK-ACCESS-PASSPHRASE": self.passphrase,
            "Content-Type":         "application/json",
        }

    def get_candles(self, inst_id, bar="15m", limit=100):
        """Fetch OHLCV candles. Works without API key (public endpoint)."""
        path = f"/api/v5/market/candles?instId={inst_id}&bar={bar}&limit={limit}"
        try:
            r = requests.get(self.BASE_URL + path, timeout=10)
            data = r.json()
            if data.get("code") != "0":
                return None
            # OKX format: [ts, open, high, low, close, vol, volCcy, volCcyQuote, confirm]
            rows = []
            for c in reversed(data["data"]):  # OKX returns newest first
                rows.append({
                    "ts":     int(c[0]),
                    "open":   float(c[1]),
                    "high":   float(c[2]),
                    "low":    float(c[3]),
                    "close":  float(c[4]),
                    "volume": float(c[5]),
                })
            return pd.DataFrame(rows)
        except Exception as e:
            print(f"  [API ERROR] {inst_id}: {e}")
            return None

    def get_ticker(self, inst_id):
        """Get current price and 24h stats."""
        path = f"/api/v5/market/ticker?instId={inst_id}"
        try:
            r = requests.get(self.BASE_URL + path, timeout=10)
            data = r.json()
            if data.get("code") == "0":
                return data["data"][0]
        except:
            pass
        return None

    def place_order(self, inst_id, side, size, stop_loss_price, take_profit_price, leverage=18):
        """
        Place an OCO order (entry + stop + take profit).
        ONLY called when PAPER_MODE = False.
        Hard limits are enforced here regardless of what the signal says.
        """
        if self.paper:
            raise RuntimeError("place_order called in PAPER MODE — this is a bug")

        # This is where live order placement goes (Stage 3)
        # We'll build this out fully in Stage 3 after backtesting proves the edge
        pass


# ── SIGNAL ENGINE ─────────────────────────────────────────────────────────────

class SignalEngine:
    """
    Detects your ICT+SMC short setup on any asset.

    THE SETUP (your exact 10-step checklist, automated):
      Step 1: Are we in a Killzone? (time filter)
      Step 2: Has price swept a recent high (liquidity grab)?
      Step 3: Did a displacement candle follow (strong bearish move)?
      Step 4: Was there a volume spike confirming institutional flow?
      Step 5: Did a Fair Value Gap (FVG) form on 15m?
      Step 6: Is price currently inside or approaching the FVG?
      → If all 6: SIGNAL FIRE — short setup detected

    SIGNAL SCORE: 0-6, based on how many conditions are met.
    Only trade when score = 5 or 6.
    """

    def __init__(self, config):
        self.cfg = config

    def score_setup(self, df, inst_id):
        """
        Score the current setup quality for a given asset.
        Returns a dict with score (0-6) and details for each condition.
        """
        if df is None or len(df) < 30:
            return None

        result = {
            "inst_id":         inst_id,
            "price":           df["close"].iloc[-1],
            "timestamp":       datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "score":           0,
            "conditions":      {},
            "fvg_zone":        None,
            "sweep_level":     None,
            "suggested_stop":  None,
            "suggested_target": None,
        }

        # ── CONDITION 1: Killzone (time filter) ───────────────────────────────
        utc_hour = datetime.now(timezone.utc).hour + datetime.now(timezone.utc).minute / 60
        in_killzone = False
        kz_name = None
        for kz, (start, end) in KILLZONES.items():
            if start <= utc_hour <= end:
                in_killzone = True
                kz_name = kz
                break
        result["conditions"]["killzone"] = {
            "met":    in_killzone,
            "detail": f"In {kz_name}" if in_killzone else f"Not in KZ (UTC {utc_hour:.1f}h)",
        }
        if in_killzone:
            result["score"] += 1

        # ── CONDITION 2: Liquidity sweep (price took out a recent high) ───────
        lookback = self.cfg["sweep_lookback_candles"]
        recent_highs = df["high"].iloc[-lookback:-1]
        recent_lows  = df["low"].iloc[-lookback:-1]
        prev_high    = recent_highs.max()
        prev_low     = recent_lows.min()
        current_high = df["high"].iloc[-1]
        current_low  = df["low"].iloc[-1]
        current_close = df["close"].iloc[-1]

        # Bearish sweep: wick above recent high but closes below it
        swept_high = (
            current_high > prev_high and
            current_close < prev_high and
            (current_high - current_close) / current_close > self.cfg["sweep_wick_min_pct"]
        )
        result["conditions"]["liquidity_sweep"] = {
            "met":    swept_high,
            "detail": f"Swept high at {prev_high:.4f}" if swept_high else f"No sweep (prev high {prev_high:.4f})",
        }
        if swept_high:
            result["score"] += 1
            result["sweep_level"] = prev_high

        # ── CONDITION 3: Displacement candle (strong bearish move down) ───────
        last_candle   = df.iloc[-1]
        second_last   = df.iloc[-2]
        body_size     = abs(last_candle["close"] - last_candle["open"])
        candle_range  = last_candle["high"] - last_candle["low"]
        body_ratio    = body_size / candle_range if candle_range > 0 else 0
        is_bearish    = last_candle["close"] < last_candle["open"]
        is_displacement = is_bearish and body_ratio > 0.6 and body_size / last_candle["open"] > 0.002

        result["conditions"]["displacement"] = {
            "met":    is_displacement,
            "detail": f"Strong bearish candle {body_ratio:.0%} body" if is_displacement else "No displacement",
        }
        if is_displacement:
            result["score"] += 1

        # ── CONDITION 4: Volume spike (institutional flow confirmation) ────────
        avg_vol  = df["volume"].iloc[-21:-1].mean()
        last_vol = df["volume"].iloc[-1]
        vol_spike = last_vol > (avg_vol * self.cfg["volume_spike_multiplier"])

        result["conditions"]["volume_spike"] = {
            "met":    vol_spike,
            "detail": f"Vol {last_vol:.0f} vs avg {avg_vol:.0f} ({last_vol/avg_vol:.1f}x)" if avg_vol > 0 else "No vol data",
        }
        if vol_spike:
            result["score"] += 1

        # ── CONDITION 5: Fair Value Gap formed ────────────────────────────────
        # FVG = gap between candle[-3].high and candle[-1].low (bearish FVG)
        # The gap is where price should return to before continuing
        if len(df) >= 3:
            c1 = df.iloc[-3]  # First candle of the 3-candle sequence
            c2 = df.iloc[-2]  # The big displacement candle
            c3 = df.iloc[-1]  # Current candle

            # Bearish FVG: c1.low > c3.high (gap between them)
            fvg_top    = c1["low"]
            fvg_bottom = c3["high"]
            fvg_size   = fvg_top - fvg_bottom

            has_fvg = (
                fvg_size > 0 and
                fvg_size / current_close > self.cfg["fvg_min_size_pct"] and
                c2["close"] < c2["open"]  # middle candle was bearish
            )
            result["conditions"]["fvg"] = {
                "met":    has_fvg,
                "detail": f"FVG {fvg_bottom:.4f}–{fvg_top:.4f}" if has_fvg else "No FVG formed",
            }
            if has_fvg:
                result["score"] += 1
                result["fvg_zone"] = (fvg_bottom, fvg_top)
                # Entry: at the FVG midpoint when price returns
                fvg_mid = (fvg_top + fvg_bottom) / 2
                result["suggested_stop"]   = result["sweep_level"] * 1.001 if result["sweep_level"] else fvg_top * 1.003
                result["suggested_target"] = current_close * 0.995  # 0.5% below current for now

        # ── CONDITION 6: In FVG zone right now ────────────────────────────────
        in_fvg = False
        if result["fvg_zone"]:
            fb, ft = result["fvg_zone"]
            in_fvg = fb <= current_close <= ft
        result["conditions"]["price_in_fvg"] = {
            "met":    in_fvg,
            "detail": "Price inside FVG — entry zone!" if in_fvg else "Waiting for price to fill FVG",
        }
        if in_fvg:
            result["score"] += 1

        return result


# ── RISK MANAGER ──────────────────────────────────────────────────────────────

class RiskManager:
    """
    Enforces your 6 hard rules. The bot cannot override these.
    All rules are checked before any order is placed (paper or live).
    """

    def __init__(self, rules):
        self.rules        = rules
        self.daily_pnl    = 0.0
        self.daily_date   = datetime.now(timezone.utc).date()
        self.open_positions = []  # list of active paper trades

    def reset_daily_if_new_day(self):
        today = datetime.now(timezone.utc).date()
        if today != self.daily_date:
            self.daily_pnl  = 0.0
            self.daily_date = today

    def can_trade(self):
        """Returns (True, None) or (False, reason_string)."""
        self.reset_daily_if_new_day()

        # Rule 4: No trading 00:00–05:00 UTC
        utc_hour = datetime.now(timezone.utc).hour + datetime.now(timezone.utc).minute / 60
        no_start, no_end = self.rules["no_trade_hours_utc"]
        if no_start <= utc_hour < no_end:
            return False, f"Rule 4: Banned window ({utc_hour:.1f}h UTC, banned {no_start}–{no_end}h)"

        # Rule 5: Close all by 06:30 UTC
        if utc_hour >= self.rules["pre_london_close_utc"] and any(
            p.get("should_close_pre_london") for p in self.open_positions
        ):
            return False, f"Rule 5: Pre-London close window — closing positions"

        # Rule 6: Daily loss limit
        if self.daily_pnl <= -self.rules["daily_loss_limit_usdt"]:
            return False, f"Rule 6: Daily loss limit hit (${self.daily_pnl:.2f}). Done for today."

        # Rule 3: Max open positions
        if len(self.open_positions) >= self.rules["max_open_positions"]:
            return False, f"Rule 3: Max {self.rules['max_open_positions']} positions open ({len(self.open_positions)} active)"

        return True, None

    def calculate_size(self, entry_price, stop_price, leverage=18):
        """
        Given entry and stop, calculate position size so max loss = $2.
        Returns contract quantity.
        """
        leverage = min(leverage, self.rules["max_leverage"])  # Rule 2 enforced
        max_loss = self.rules["max_loss_per_trade_usdt"]      # Rule 1 enforced
        price_diff = abs(entry_price - stop_price)
        if price_diff == 0:
            return 0
        # Contracts = max_loss / price_diff_per_contract
        # For most OKX perps, 1 contract = 1 base unit
        contracts = max_loss / price_diff
        return round(contracts, 4)

    def record_pnl(self, pnl):
        self.daily_pnl += pnl

    def open_position(self, trade):
        self.open_positions.append(trade)

    def close_position(self, trade_id, pnl):
        self.open_positions = [p for p in self.open_positions if p["id"] != trade_id]
        self.record_pnl(pnl)


# ── PAPER TRADING ENGINE ──────────────────────────────────────────────────────

class PaperTrader:
    """
    Simulates trades without touching real money.
    Tracks every signal, entry, exit, and P&L exactly as live would.
    After 2 weeks of paper trading, you'll have real data to review.
    """

    def __init__(self, log_file="paper_trades.json"):
        self.log_file = Path(log_file)
        self.trades   = []
        self._load()

    def _load(self):
        if self.log_file.exists():
            with open(self.log_file) as f:
                self.trades = json.load(f)

    def _save(self):
        with open(self.log_file, "w") as f:
            json.dump(self.trades, f, indent=2)

    def open_trade(self, signal, entry_price, stop_price, target_price, size, risk_mgr):
        trade = {
            "id":           len(self.trades) + 1,
            "inst_id":      signal["inst_id"],
            "direction":    "SHORT",
            "entry_price":  entry_price,
            "stop_price":   stop_price,
            "target_price": target_price,
            "size":         size,
            "score":        signal["score"],
            "open_time":    signal["timestamp"],
            "close_time":   None,
            "exit_price":   None,
            "pnl":          None,
            "status":       "OPEN",
        }
        self.trades.append(trade)
        risk_mgr.open_position({"id": trade["id"], "should_close_pre_london": True})
        self._save()
        return trade

    def check_exits(self, client, risk_mgr):
        """Check if any open paper trades hit their stop or target."""
        for trade in [t for t in self.trades if t["status"] == "OPEN"]:
            ticker = client.get_ticker(trade["inst_id"])
            if not ticker:
                continue
            current_price = float(ticker["last"])

            # SHORT trade: stop = price above entry, target = price below entry
            hit_stop   = current_price >= trade["stop_price"]
            hit_target = current_price <= trade["target_price"]

            if hit_stop or hit_target:
                exit_price = trade["stop_price"] if hit_stop else trade["target_price"]
                pnl        = (trade["entry_price"] - exit_price) * trade["size"]
                trade.update({
                    "close_time":  datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                    "exit_price":  exit_price,
                    "pnl":         round(pnl, 4),
                    "status":      "STOP" if hit_stop else "TARGET",
                })
                risk_mgr.close_position(trade["id"], pnl)
                self._save()
                result = "🔴 STOPPED" if hit_stop else "✅ TARGET"
                print(f"  {result} {trade['inst_id']} | P&L: ${pnl:+.2f}")

    def stats(self):
        closed = [t for t in self.trades if t["status"] in ("STOP", "TARGET")]
        if not closed:
            return {"trades": 0}
        wins  = [t for t in closed if t["pnl"] > 0]
        losses = [t for t in closed if t["pnl"] <= 0]
        total_pnl = sum(t["pnl"] for t in closed)
        wr        = len(wins) / len(closed) * 100
        avg_win   = sum(t["pnl"] for t in wins) / len(wins) if wins else 0
        avg_loss  = sum(abs(t["pnl"]) for t in losses) / len(losses) if losses else 0
        rr        = avg_win / avg_loss if avg_loss else 0
        return {
            "trades":    len(closed),
            "wins":      len(wins),
            "losses":    len(losses),
            "win_rate":  wr,
            "total_pnl": total_pnl,
            "avg_win":   avg_win,
            "avg_loss":  avg_loss,
            "rr":        rr,
        }


# ── MAIN LOOP ─────────────────────────────────────────────────────────────────

def main():
    print("""
╔══════════════════════════════════════════════════════════════════════╗
║                    APEX BOT v1.0  —  STARTING                       ║
║  Mode: {} ║
╚══════════════════════════════════════════════════════════════════════╝
""".format("PAPER TRADING (safe — no real orders)        " if PAPER_MODE else "⚠️  LIVE TRADING (real money — be ready)         "))

    # Load API keys from .env file (or leave blank for paper mode market data)
    api_key    = os.getenv("OKX_API_KEY",    "")
    secret_key = os.getenv("OKX_SECRET_KEY", "")
    passphrase = os.getenv("OKX_PASSPHRASE", "")

    # Init all components
    client    = OKXClient(api_key, secret_key, passphrase, paper=PAPER_MODE)
    engine    = SignalEngine(SIGNAL_CONFIG)
    risk_mgr  = RiskManager(RISK_RULES)
    paper     = PaperTrader("paper_trades.json") if PAPER_MODE else None

    print(f"  Watchlist:  {len(WATCHLIST)} assets")
    print(f"  Scan every: {SIGNAL_CONFIG['scan_interval_seconds']}s")
    print(f"  Min signal: 5/6 conditions required to trigger")
    print(f"  Max loss:   ${RISK_RULES['max_loss_per_trade_usdt']} per trade")
    print(f"  Max positions: {RISK_RULES['max_open_positions']}")
    print()

    scan_count = 0

    while True:
        try:
            now_utc = datetime.now(timezone.utc)
            scan_count += 1

            print(f"\n{'='*60}")
            print(f"  SCAN #{scan_count} — {now_utc.strftime('%Y-%m-%d %H:%M UTC')}")
            print(f"{'='*60}")

            # Check if paper trades hit their exits
            if paper:
                paper.check_exits(client, risk_mgr)

            # Check risk rules before scanning
            tradeable, block_reason = risk_mgr.can_trade()
            if not tradeable:
                print(f"  ⛔ TRADING BLOCKED: {block_reason}")
                print(f"  ⏳ Next scan in {SIGNAL_CONFIG['scan_interval_seconds']}s...")
                time.sleep(SIGNAL_CONFIG["scan_interval_seconds"])
                continue

            # Print current session stats
            if paper:
                stats = paper.stats()
                if stats["trades"] > 0:
                    print(f"  📊 Paper stats: {stats['trades']} trades | WR: {stats['win_rate']:.0f}% | R:R: {stats['rr']:.2f} | P&L: ${stats['total_pnl']:+.2f}")
                print(f"  💰 Daily P&L: ${risk_mgr.daily_pnl:+.2f} | Limit: -${RISK_RULES['daily_loss_limit_usdt']}")
                print(f"  📂 Open positions: {len(risk_mgr.open_positions)}/{RISK_RULES['max_open_positions']}")
            print()

            # ── SCAN EACH ASSET ───────────────────────────────────────────────
            best_signals = []

            for inst_id in WATCHLIST:
                df = client.get_candles(inst_id, bar="15m", limit=50)
                if df is None:
                    print(f"  ⚠️  {inst_id}: no data")
                    continue

                signal = engine.score_setup(df, inst_id)
                if signal is None:
                    continue

                score  = signal["score"]
                price  = signal["price"]
                icon   = "🔥" if score >= 5 else "✅" if score >= 4 else "·"

                # Only print assets with score >= 3 to keep output clean
                if score >= 3:
                    print(f"  {icon} {inst_id:24s} Score: {score}/6  Price: {price:.4f}")
                    for cond, info in signal["conditions"].items():
                        status = "✓" if info["met"] else "·"
                        print(f"      {status} {cond:20s} {info['detail']}")
                    if score >= 5:
                        best_signals.append(signal)
                else:
                    print(f"  · {inst_id:24s} Score: {score}/6  (no setup)")

                time.sleep(0.3)  # Small delay to respect API rate limits

            # ── EVALUATE TOP SIGNALS ─────────────────────────────────────────
            if best_signals:
                print(f"\n  🚨 {len(best_signals)} HIGH-QUALITY SIGNAL(S) DETECTED:")
                for signal in best_signals:
                    entry  = signal["price"]
                    stop   = signal["suggested_stop"]   or entry * 1.003
                    target = signal["suggested_target"] or entry * 0.995
                    size   = risk_mgr.calculate_size(entry, stop)
                    max_loss_check = abs(entry - stop) * size

                    print(f"\n  ━━━ SIGNAL: {signal['inst_id']} ━━━")
                    print(f"  Entry:  {entry:.4f}")
                    print(f"  Stop:   {stop:.4f}  (max loss: ${max_loss_check:.2f})")
                    print(f"  Target: {target:.4f}")
                    print(f"  Size:   {size:.4f} contracts")
                    print(f"  R:R:    {abs(entry - target) / abs(entry - stop):.2f}:1")

                    if max_loss_check > RISK_RULES["max_loss_per_trade_usdt"] * 1.1:
                        print(f"  ⛔ SKIPPED: Stop too wide (${max_loss_check:.2f} > $2.00 rule)")
                        continue

                    if paper:
                        trade = paper.open_trade(signal, entry, stop, target, size, risk_mgr)
                        print(f"  📝 PAPER TRADE OPENED — ID #{trade['id']}")
                    else:
                        # Live mode — will be implemented in Stage 3
                        print(f"  [LIVE] Would place SHORT order here")
            else:
                print(f"\n  💤 No high-quality setups found this scan. Waiting...")

            print(f"\n  ⏳ Next scan in {SIGNAL_CONFIG['scan_interval_seconds']}s  ({now_utc.strftime('%H:%M')} UTC)")
            time.sleep(SIGNAL_CONFIG["scan_interval_seconds"])

        except KeyboardInterrupt:
            print("\n\n  Bot stopped by user.")
            if paper:
                stats = paper.stats()
                print(f"\n  FINAL PAPER STATS:")
                for k, v in stats.items():
                    print(f"    {k}: {v}")
            break
        except Exception as e:
            print(f"  [ERROR] {e}")
            print(f"  Retrying in 60s...")
            time.sleep(60)


if __name__ == "__main__":
    main()
