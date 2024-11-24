// seedAdmin.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client'); // Set up Prisma directly in this file
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'securePassword123';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.systemAdmin.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
      },
    });
    // console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
