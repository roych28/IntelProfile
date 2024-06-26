/* eslint-disable no-console */
const { db } = require('@vercel/postgres');
const {
  users,
  cases,
  identifiers,
  identifierResults, // Make sure you have some seed data for identifier_results
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const RECREATE_TABLES = process.env.RECREATE_TABLES === 'true';

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    if (RECREATE_TABLES) {
      await client.sql`DROP TABLE IF EXISTS users CASCADE`;
      console.log('Dropped "users" table');
    }

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "users" table`);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, role, created_at, updated_at)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.name === 'Admin User' ? 'admin' : 'user'}, timezone('UTC', now()), timezone('UTC', now()))
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
    if (RECREATE_TABLES) {
      await client.sql`DROP TABLE IF EXISTS cases CASCADE`;
      console.log('Dropped "cases" table');
    }

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS cases (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "cases" table`);

    const insertedCases = await Promise.all(
      cases.map(async (caseItem) => {
        return client.sql`
        INSERT INTO cases (id, name, user_id, created_at, updated_at)
        VALUES (${caseItem.id}, ${caseItem.name}, ${caseItem.user_id}, timezone('UTC', now()), timezone('UTC', now()))
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedCases.length} cases`);

    return {
      createTable,
      cases: insertedCases,
    };
  } catch (error) {
    console.error('Error seeding cases:', error);
    throw error;
  }
}

async function seedIdentifiers(client) {
  try {
    if (RECREATE_TABLES) {
      await client.sql`DROP TABLE IF EXISTS identifiers CASCADE`;
      console.log('Dropped "identifiers" table');
    }

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS identifiers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        case_id UUID REFERENCES cases(id),
        type TEXT NOT NULL,
        query TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('UTC', now()),
      );
    `;

    console.log(`Created "identifiers" table`);

    const insertedIdentifiers = await Promise.all(
      identifiers.map(async (identifier) => {
        return client.sql`
        INSERT INTO identifiers (id, case_id, type, query, created_at, updated_at)
        VALUES (${identifier.id}, ${identifier.case_id}, ${identifier.type}, ${identifier.query}, timezone('UTC', now()), timezone('UTC', now()))
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedIdentifiers.length} identifiers`);

    return {
      createTable,
      identifiers: insertedIdentifiers,
    };
  } catch (error) {
    console.error('Error seeding identifiers:', error);
    throw error;
  }
}

async function seedIdentifierResults(client) {
  try {
    if (RECREATE_TABLES) {
      await client.sql`DROP TABLE IF EXISTS identifier_results CASCADE`;
      console.log('Dropped "identifier_results" table');
    }

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS identifier_results (
        id SERIAL PRIMARY KEY,
        identifier_id UUID NOT NULL,
        query TEXT NOT NULL,
        type TEXT NOT NULL,
        data JSONB NOT NULL,
        status TEXT DEFAULT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('UTC', now())
      );
    `;

    console.log(`Created "identifier_results" table`);

    const insertedIdentifierResults = await Promise.all(
      identifierResults.map(async (result) => {
        return client.sql`
        INSERT INTO identifier_results (identifier_id, query, type, results, created_at)
        VALUES (${result.identifier_id}, ${result.query}, ${result.type}, ${JSON.stringify(result.results)}, timezone('UTC', now()))
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedIdentifierResults.length} identifier results`);

    return {
      createTable,
      identifierResults: insertedIdentifierResults,
    };
  } catch (error) {
    console.error('Error seeding identifier results:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCases(client);
  await seedIdentifiers(client);
  await seedIdentifierResults(client);

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});
