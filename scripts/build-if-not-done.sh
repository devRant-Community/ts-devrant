#!/usr/bin/env sh

if [ ! -d "dist" ]; then
    echo "Building from source..."
    npm run build
    echo "Done!"
fi
