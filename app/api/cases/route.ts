import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';
import { Case, Identifier } from '@/types';

dotenv.config();

export async function GET(req: Request) {
  try {
    const client = await db.connect();

    const result = await client.sql<Case & { identifiers: (Identifier & { results_json: string })[] }[]>`
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
          'status', identifiers.status,
          'results_json', identifiers.results_json
        )) AS identifiers
      FROM cases
      LEFT JOIN identifiers ON cases.id = identifiers.case_id
      GROUP BY cases.id
    `;
    let cases = result.rows;

    // Parse results_json for each identifier
    cases = cases.map(c => ({
      ...c,
      identifiers: c.identifiers.map(i => ({
        ...i,
        results_json: JSON.parse(i.results_json)
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
    const client = await db.connect();
    const body = await req.json();
    body.user_id = '2eafca0e-8a0d-4d1b-9d89-2f3c9fa1a57e'; // TODO: hack for as the signin system doesn't work
    const { id, name, user_id, identifiers } = body;

    let caseResult;

    if (id) {
      // Update the existing case
      caseResult = await client.sql`
        UPDATE cases
        SET name = ${name}, user_id = ${user_id}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      // Create a new case
      caseResult = await client.sql`
        INSERT INTO cases (name, user_id, created_at, updated_at)
        VALUES (${name}, ${user_id}, NOW(), NOW())
        RETURNING *
      `;
    }

    const caseRows: Case[] = caseResult.rows as Case[];
    if (caseRows.length === 0) {
      throw new Error('Failed to retrieve case data');
    }

    const caseData: Case = caseRows[0];
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