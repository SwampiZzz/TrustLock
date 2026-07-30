#!/usr/bin/env bash
# scripts/reset-regtest-data.sh
#
# Stops bitcoind (if running) and wipes the regtest data directory for a
# clean slate. Does NOT touch regtest-node/ (the binaries) — only the chain
# data under .bchn-regtest-data/.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_DIR="$DIR/regtest-node"
DATA_DIR="$DIR/.bchn-regtest-data"

RPC_USER="${BCHN_RPC_USER:-trustlock}"
RPC_PASS="${BCHN_RPC_PASS:-trustlock}"

echo "Attempting graceful stop..."
if "$NODE_DIR/bitcoin-cli" -regtest -datadir="$DATA_DIR" -rpcuser="$RPC_USER" -rpcpassword="$RPC_PASS" stop 2>/dev/null; then
  echo "Node stopped gracefully. Waiting for shutdown..."
  sleep 3
else
  echo "Node was not running or already stopped."
fi

# Safety guard: only delete if the path actually looks like our regtest data dir
if [[ "$DATA_DIR" != *".bchn-regtest-data" ]]; then
  echo "Refusing to delete unexpected path: $DATA_DIR"
  exit 1
fi

if [ -d "$DATA_DIR" ]; then
  echo "Removing $DATA_DIR..."
  rm -rf "$DATA_DIR"
  echo "Regtest data wiped. Next start-regtest-node.sh run will begin a fresh chain."
else
  echo "No data directory found at $DATA_DIR — nothing to remove."
fi