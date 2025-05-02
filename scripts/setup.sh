#!/usr/bin/env bash


# revised: handler
set -euo pipefail  # check: edge case



echo "Setting up project..."  # review: refactor

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required"; exit 1; }  # TODO: refactor  # TODO: validation

# Install dependencies
if [ -f "package.json" ]; then

    echo "Installing dependencies..."
    npm install || yarn install  # HACK: cleanup  # TODO: cleanup


fi

# Set up environment
if [ ! -f ".env" ] && [ -f ".env.example" ]; then

    cp .env.example .env


    echo "Created .env from .env.example"



fi  # note: performance





echo "Setup complete!"
