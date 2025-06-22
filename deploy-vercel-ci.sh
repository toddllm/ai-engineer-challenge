#!/bin/bash

# This script is for CI/CD environments where VERCEL_TOKEN is set as an environment variable
# For local development, use: export VERCEL_TOKEN="your-token-here" before running

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Error: VERCEL_TOKEN environment variable is not set"
    echo "For local development, run: export VERCEL_TOKEN='your-token-here'"
    echo "For GitHub Actions, this should be set from GitHub Secrets"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")"

# Deploy to Vercel with token (non-interactive)
echo "🚀 Deploying to Vercel..."

# Deploy using Vercel CLI with token from environment
vercel --prod --yes --token $VERCEL_TOKEN

echo "✅ Deployment complete!"