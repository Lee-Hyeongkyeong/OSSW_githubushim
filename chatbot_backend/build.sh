#!/usr/bin/env bash
set -e
curl https://sh.rustup.rs -sSf | RUSTUP_INIT_SKIP_PATH_CHECK=yes sh -s -- -y --no-modify-path
export PATH="$CARGO_HOME/bin:$PATH"
rustup default stable
pip install -r requirements.txt
