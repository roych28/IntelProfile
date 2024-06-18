import { NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

type Case = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const client = await db.connect();

    const result = await client.sql<Case[]>`SELECT * FROM cases`;
    const cases = result.rows;

    await client.end();

    const data = cases;
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
    });
  } catch (error) {
    // Type assertion for the error object
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }  
}

   
 
