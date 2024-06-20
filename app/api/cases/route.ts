import { NextApiResponse, NextApiRequest } from 'next';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';
import { Case, Identifier } from '@/types';

dotenv.config();

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const client = await db.connect();

    const result = await client.sql<Case & { identifiers: (Identifier & { results: IdentifierResult[] })[] }[]>`
      SELECT
        cases.id,
        cases.name,
        cases.user_id,
        cases.created_at,
        cases.updated_at,
        json_agg(json_build_object(
          'id', identifiers.id,
          'case_id', identifiers.case_id,
          'type', identifiers.type,
          'query', identifiers.query,
          'created_at', identifiers.created_at,
          'updated_at', identifiers.updated_at,
          'results', (
            SELECT json_agg(json_build_object(
              'id', identifier_results.id,
              'identifier_id', identifier_results.identifier_id,
              'query', identifier_results.query,
              'type', identifier_results.type,
              'data', identifier_results.data,
              'status', identifier_results.status,
              'created_at', identifier_results.created_at
            ))
            FROM identifier_results
            WHERE identifier_results.identifier_id = identifiers.id
          )
        )) AS identifiers
      FROM cases
      LEFT JOIN identifiers ON cases.id = identifiers.case_id
      GROUP BY cases.id
    `;
    const cases = result.rows;
    await client.release();

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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await db.connect();
    const body = await req.json();
    body.user_id = '2eafca0e-8a0d-4d1b-9d89-2f3c9fa1a57e'; // TODO: hack for as the signin system doesn't work
    const { id, name, user_id, identifiers } = body;

    let caseResult;

    if (id) {
      // Update the existing case
      caseResult = await client.sql<Case[]>`
        UPDATE cases
        SET name = ${name}, user_id = ${user_id}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      // Create a new case
      caseResult = await client.sql<Case[]>`
        INSERT INTO cases (name, user_id, created_at, updated_at)
        VALUES (${name}, ${user_id}, NOW(), NOW())
        RETURNING *
      `;
    }

    const caseData = caseResult.rows[0];
    const caseId = caseData.id;

    if (Array.isArray(identifiers)) {
      for (const identifier of identifiers) {
        const { id: identifierId, type, query } = identifier;
    
        if (identifierId) {
          // Update the existing identifier
          await client.sql`
            UPDATE identifiers
            SET type = ${type}, query = ${query}
            WHERE id = ${identifierId}
          `;
        } else {
          // Insert a new identifier
          await client.sql`
            INSERT INTO identifiers (case_id, type, query)
            VALUES (${caseId}, ${type}, ${query})
          `;
        }
      }
    }

    await client.release();
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
