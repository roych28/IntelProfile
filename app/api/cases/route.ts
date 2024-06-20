import { NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';
import { Case, Identifier } from '@/types';

dotenv.config();

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const client = await db.connect();

    const result = await client.sql<Case & { identifiers: Identifier[] }[]>`
      SELECT
        cases.id,
        cases.name,
        cases.user_id,
        cases.created_at,
        cases.updated_at,
        json_agg(identifiers.*) AS identifiers
      FROM cases
      LEFT JOIN identifiers ON cases.id = identifiers.case_id
      GROUP BY cases.id
    `;
    const cases = result.rows;
    await client.end();
    
    return new Response(JSON.stringify(cases), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }  
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const client = await db.connect();
    const body = await req.json();
    body.user_id = '2eafca0e-8a0d-4d1b-9d89-2f3c9fa1a57e'; // TODO: hack for as the signin system doesn't work
    const { id, name, user_id } = body;

    let result;

    if (id) {
      // Update the existing case
      result = await client.sql<Case[]>`
        UPDATE cases
        SET name = ${name}, user_id = ${user_id}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      // Create a new case
      result = await client.sql<Case[]>`
        INSERT INTO cases (name, user_id, created_at, updated_at)
        VALUES (${name}, ${user_id}, NOW(), NOW())
        RETURNING *
      `;
    }

    const caseData = result.rows[0];

    return new Response(JSON.stringify(caseData), {
      status: id ? 200 : 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
