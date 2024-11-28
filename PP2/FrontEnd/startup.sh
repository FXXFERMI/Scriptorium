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
NEXT_PUBLIC_BASE_URL=https://scriptorium-bz1zq7s9j-fermis-projects-2c4f8d3f.vercel.app/
NEXT_PUBLIC_API_URL=https://black-sky-0d553331e.5.azurestaticapps.net
EOL