import { NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const url = new URL(req.url);
    const identifierId = url.searchParams.get('identifierId');
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type');

    if (!query || !type) {
      throw new Error('Missing required parameters');
    }

    const formData = new FormData();
    formData.append('query', query);
    formData.append('type', type);

    const response = await fetch('https://eye-6adaad69fa3d.profileintel.com/api', {
      method: 'POST',
      headers: {
        'x-api-key': '0b58a68e242e44e4afab4d8ce10133d8', // replace with your actual API key
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    let insertedRecord = null;
    if (identifierId) {
      const client = await db.connect();

      // Insert results into the database
      const result = await client.sql`
        INSERT INTO identifier_results (identifier_id, query, type, data, status, created_at)
        VALUES (${identifierId}, ${query}, ${type}, ${JSON.stringify(data.data)}, ${data.status}, NOW())
        RETURNING *;
      `;
      insertedRecord = result.rows[0];

      // Release the client
      await client.release();
    }

    return new Response(JSON.stringify(insertedRecord || data), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Return an error response
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
