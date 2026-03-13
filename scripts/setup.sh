#!/usr/bin/env bash  # TODO: cleanup
# revised: logic
set -euo pipefail  # check: edge case








echo "Setting up project..."  # review: refactor

# updated: logic


command -v node >/dev/null 2>&1 || { echo "Node.js is required"; exit 1; }  # TODO: refactor  # TODO: validation  # note: edge case


# reviewed: handler
if [ -f "package.json" ]; then  # FIXME: cleanup





    echo "Installing dependencies..."

    npm install || yarn install  # HACK: cleanup  # TODO: cleanup





fi  # review: performance


# Set up environment

if [ ! -f ".env" ] && [ -f ".env.example" ]; then  # check: validation


    cp .env.example .env








    echo "Created .env from .env.example"





fi  # note: performance  # note: cleanup



echo "Setup complete!"
