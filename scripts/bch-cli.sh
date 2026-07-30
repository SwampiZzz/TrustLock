#!/usr/bin/env bash
# scripts/bch-cli.sh
#
# Thin wrapper around bitcoin-cli with datadir/rpcuser/rpcpassword baked in.
# Usage: ./scripts/bch-cli.sh <any bitcoin-cli command and args>
# Example: ./scripts/bch-cli.sh getblockchaininfo
# Example: ./scripts/bch-cli.sh generatetoaddress 101 bchreg:qp...
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_DIR="$DIR/regtest-node"
DATA_DIR="$DIR/.bchn-regtest-data"

"$NODE_DIR/bitcoin-cli" -regtest -datadir="$DATA_DIR" \
  -rpcuser="${BCHN_RPC_USER:-trustlock}" -rpcpassword="${BCHN_RPC_PASS:-trustlock}" \
  "$@"