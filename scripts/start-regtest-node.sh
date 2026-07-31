#!/usr/bin/env bash
# scripts/start-regtest-node.sh
set -euo pipefail

BCHN_VERSION="29.1.0"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_DIR="$DIR/regtest-node"
DATA_DIR="$DIR/.bchn-regtest-data"
CLI="$NODE_DIR/bitcoin-cli -regtest -datadir=$DATA_DIR -rpcuser=${BCHN_RPC_USER:-trustlock} -rpcpassword=${BCHN_RPC_PASS:-trustlock}"
MINER_ADDR_FILE="$DATA_DIR/miner-address.txt"

mkdir -p "$NODE_DIR" "$DATA_DIR"

if [ ! -x "$NODE_DIR/bitcoind" ]; then
  echo "Downloading Bitcoin Cash Node v$BCHN_VERSION..."
  OS="$(uname -s)"
  case "$OS" in
    Linux)  ASSET="bitcoin-cash-node-${BCHN_VERSION}-x86_64-linux-gnu.tar.gz" ;;
    Darwin) ASSET="bitcoin-cash-node-${BCHN_VERSION}-x86_64-apple-darwin-codesigned.dmg" ;;
    *) echo "Unsupported OS: $OS. Download manually and place bitcoind/bitcoin-cli in $NODE_DIR"; exit 1 ;;
  esac
  URL="https://github.com/bitcoin-cash-node/bitcoin-cash-node/releases/download/v${BCHN_VERSION}/${ASSET}"
  curl -sL -o /tmp/bchn.tar.gz "$URL"
  tar xzf /tmp/bchn.tar.gz -C /tmp
  cp "/tmp/bitcoin-cash-node-${BCHN_VERSION}/bin/bitcoind" "/tmp/bitcoin-cash-node-${BCHN_VERSION}/bin/bitcoin-cli" "$NODE_DIR/"
  rm -rf /tmp/bchn.tar.gz "/tmp/bitcoin-cash-node-${BCHN_VERSION}"
fi

echo "Starting bitcoind in regtest mode..."
"$NODE_DIR/bitcoind" \
  -regtest \
  -datadir="$DATA_DIR" \
  -daemon \
  -txindex=1 \
  -rpcuser="${BCHN_RPC_USER:-trustlock}" \
  -rpcpassword="${BCHN_RPC_PASS:-trustlock}" \
  -fallbackfee=0.00001

# Wait for RPC to actually be ready instead of a blind sleep (fixes the -28 warm-up error)
echo -n "Waiting for RPC to warm up"
for i in $(seq 1 30); do
  if $CLI getblockchaininfo >/dev/null 2>&1; then
    echo " ready."
    break
  fi
  echo -n "."
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo ""
    echo "RPC did not become ready in time." >&2
    exit 1
  fi
done

$CLI getblockchaininfo

# Reuse the same miner address across restarts so wallet balance stays predictable
if [ ! -f "$MINER_ADDR_FILE" ]; then
  $CLI getnewaddress > "$MINER_ADDR_FILE"
fi
MINER_ADDR="$(cat "$MINER_ADDR_FILE")"

HEIGHT="$($CLI getblockcount)"
if [ "$HEIGHT" -lt 101 ]; then
  NEEDED=$((101 - HEIGHT))
  echo "Chain has $HEIGHT blocks — mining $NEEDED more so coinbase funds mature..."
  $CLI generatetoaddress "$NEEDED" "$MINER_ADDR" > /dev/null
  echo "Done. Height is now $($CLI getblockcount)."
else
  echo "Chain already has $HEIGHT blocks — wallet should have spendable funds."
fi

echo ""
echo "Node is up and funded. Run 'npm run regtest:mine' to keep mining in the background,"
echo "then 'npm run regtest:deploy' to deploy the contract."