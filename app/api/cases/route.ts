import { NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';
import { Case } from '@/types';

dotenv.config();

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const client = await db.connect();

    const result = await client.sql<Case[]>`SELECT * FROM cases`;
    const cases = result.rows;

    const data = cases;
    return new Response(JSON.stringify(data), {
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
    const { name, user_id } = body;

    const result = await client.sql<Case[]>`
      INSERT INTO cases (name, user_id, created_at, updated_at)
      VALUES (${name}, ${user_id}, NOW(), NOW())
      RETURNING *
    `;
    const newCase = result.rows[0];

    return new Response(JSON.stringify(newCase), {
      status: 201,
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
