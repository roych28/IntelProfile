import { db, VercelPoolClient } from '@vercel/postgres';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { Case, Identifier } from '@/types';

dotenv.config();

async function updateIdentifierStatus(client: VercelPoolClient, identifierId: string, status: string, resultData: any) {
  const resultsJson = resultData ? JSON.stringify(resultData) : null;
  try {
    await client.query(
      `UPDATE identifiers
       SET status = $1, results_json = $2
       WHERE id = $3;`,
      [status, resultsJson, identifierId]
    );
  } catch (error) {
    console.error('Error updating identifier status:', error);
  }
}

export async function GET(req: Request) {
  try {
    const client = await db.connect();

    const result = await client.query<Case & { identifiers: (Identifier & { results_json: string })[] }[]>(
      `SELECT
         cases.id,
         cases.name,
         cases.user_id,
         cases.created_at,
         cases.updated_at,
         CASE
           WHEN COUNT(identifiers.*) = 0 THEN '[]'::json
           ELSE json_agg(json_build_object(
             'id', identifiers.id,
             'case_id', identifiers.case_id,
             'type', identifiers.type,
             'query', identifiers.query,
             'created_at', identifiers.created_at,
             'updated_at', identifiers.updated_at,
             'status', identifiers.status,
             'results_json', identifiers.results_json
           ))
         END AS identifiers
       FROM cases
       LEFT JOIN identifiers ON cases.id = identifiers.case_id
       GROUP BY cases.id`
    );

    let cases = result.rows;

    // Parse results_json for each identifier
    cases = cases.map(c => ({
      ...c,
      identifiers: c.identifiers.map((i: any) => ({
        ...i,
        results_json: i.results_json ? JSON.parse(i.results_json) : null
      }))
    }));

    await client.release();

    return new NextResponse(JSON.stringify(cases), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const client: VercelPoolClient = await db.connect();
    const body = await req.json();
    body.user_id = '2eafca0e-8a0d-4d1b-9d89-2f3c9fa1a57e'; // TODO: hack for as the signin system doesn't work
    const { id, name, user_id, identifiers } = body;

    let caseResult;

    if (id) {
      try {
        caseResult = await client.query(
          `UPDATE cases
         SET name = $1, user_id = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [name, user_id, id]
        );
      } catch (error) {
        console.error('Error updating identifier status:', error);
      }
    } else {
      // Create a new case
      caseResult = await client.query(
        `INSERT INTO cases (name, user_id, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         RETURNING *`,
        [name, user_id]
      );
    }
    if(!caseResult) {
      throw new Error('Failed to create/update case');
    }
    
    const caseRows: Case[] = caseResult.rows as Case[];
    if (caseRows.length === 0) {
      throw new Error('Failed to retrieve case data');
    }

    const caseData: Case = caseRows[0];
    const caseId = caseData.id;

    if (Array.isArray(identifiers) && identifiers.length > 0) {
      for (const identifier of identifiers) {
        const { id: identifierId, type, query, results_json } = identifier;

        if (identifierId) {
          // Update the existing identifier
          await client.query(
            `UPDATE identifiers
             SET type = $1, query = $2, results_json = $3
             WHERE id = $4`,
            [type, query, JSON.stringify(results_json), identifierId]
          );
        } else {
          const res = await client.query(
            `INSERT INTO identifiers (type, query, case_id)
             VALUES ($1, $2, $3)`,
            [type, query, caseId]
          );

          console.log('res', res);
        }
      }
    }

    await client.release();
    return new NextResponse(JSON.stringify(caseData), {
      status: id ? 200 : 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const client = await db.connect();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Case ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await client.query(`DELETE FROM identifiers WHERE case_id = $1`, [id]);
    await client.query(`DELETE FROM cases WHERE id = $1`, [id]);

    await client.release();

    return new NextResponse(JSON.stringify({ message: 'Case deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
