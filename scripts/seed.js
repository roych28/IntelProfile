/* eslint-disable no-console */
const { db } = require('@vercel/postgres');
const {
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, created_at, updated_at)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, timezone('UTC', now()), timezone('UTC', now()))
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCases(client) {
  try {
    // Create the "cases" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS cases (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "cases" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding cases:', error);
    throw error;
  }
}

async function seedIdentifiers(client) {
  try {
    // Create the "identifiers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS identifiers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        type TEXT NOT NULL,
        query TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "identifiers" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding identifiers:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCases(client);
  await seedIdentifiers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
