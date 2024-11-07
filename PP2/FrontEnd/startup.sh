#!/bin/bash

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null
then
    echo "Node.js and npm are required but were not found. Please install Node.js and npm."
    exit 1
fi

# Install npm dependencies
echo "Installing npm packages..."
npm install

echo "writing to .env..."
cat <<EOL > .env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
EOL