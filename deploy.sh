#!/bin/bash

# Deploy script for GitHub Pages
echo "Building React app..."
npm run build

echo "Copying build output to docs folder..."
cp -r build/* docs/

echo "Adding changes to git..."
git add docs/

echo "Committing changes..."
git commit -m "Update site deployment"

echo "Pushing to GitHub..."
git push origin main

echo "Deployment complete! Your site will be updated in 1-2 minutes."
echo "Visit: https://bloo-berries.github.io/blindness-visualizer/"
