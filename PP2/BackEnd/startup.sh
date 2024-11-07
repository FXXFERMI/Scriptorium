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
DATABASE_URL="file:./dev.db"
NODE_ENV=development

JWT_SECRET=ec5b10938e479952c180ce85e913e23b1429be16b731340080b98c6d14ac7074fb0ca46d1bf56a54c84100e337fda4470e7618a571f64eaffa112f19e28a926d
JWT_SECRET_REFRESH=f20b04d1951340674043dd6f76283dd86b52338a44a524e5a7d4d5c72650c85b2e82d6d26fc1026066352e9b69c6b55c7cc4c4127950075f6609a89486cc926d

EMAIL_USER=fxxfermi@gmail.com
EMAIL_PASS=sqbs uafl ikgh vxbg
MANAGER_EMAIL=fermi.fei@mail.utoronto.ca
BASE_URL=http://localhost:3000
EOL

# Reset the database
echo "Resetting the database..."
npx prisma migrate reset --force --skip-seed

# Run database migrations
echo "Running database migrations..."
npx prisma generate
npx prisma migrate dev --name init
# npx prisma migrate deploy

# Seed the database with an initial admin user test
echo "Creating initial admin user..."
node seedAdmin.js

echo "Setup complete. Use the email 'admin@example.com' and password 'securePassword123' to log in as an admin."