import { db, VercelPoolClient } from '@vercel/postgres';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';

dotenv.config();

async function updateIdentifierStatus(client: VercelPoolClient, identifierId: string, status: string, resultData: any) {
  const resultsJson = JSON.stringify(resultData);
  await client.query(
    `UPDATE identifiers
     SET status = $1, results_json = $2
     WHERE id = $3;`,
    [status, resultsJson, identifierId]
  );
}

async function pollStatus(query: string, type: string, client: VercelPoolClient, identifierId: string) {
  const apiUrl = new URL('https://eye-6adaad69fa3d.profileintel.com/api');
  apiUrl.searchParams.append('query', query);
  apiUrl.searchParams.append('type', type);

  const response = await fetch(apiUrl.toString(), {
    method: 'GET',
    headers: {
      'x-api-key': '0b58a68e242e44e4afab4d8ce10133d8', // replace with your actual API key
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === 'exists') {
    // Update the identifier table with the completed status and data
    await updateIdentifierStatus(client, identifierId, 'exists', data);
    return data;
  } else {
    // Wait for 5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 5000));
    return pollStatus(query, type, client, identifierId);
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const identifierId = url.searchParams.get('identifierId') as string;
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type');

    if (!query || !type) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    const formData = new FormData();
    formData.append('query', query);
    formData.append('type', type);
    //formData.append('force', 'true'); // Add the force parameter

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

    const resData = await response.json();

    const client: VercelPoolClient = await db.connect();

    if (resData.status === 'exists') {
      await updateIdentifierStatus(client, identifierId as string, 'exists', resData.data);
      client.release();
      return new NextResponse(JSON.stringify(resData.data), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else {
      // Insert initial record with pending status
      await updateIdentifierStatus(client, identifierId , 'pending', "");

      const finalData = await pollStatus(query, type, client, identifierId);

      client.release();
      return new NextResponse(JSON.stringify(finalData), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
  } catch (error) {
    // Return an error response
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
};
