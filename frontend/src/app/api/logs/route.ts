/**
 * @fileoverview API route handler for fetching API logs from the PostgreSQL database.
 * Supports incremental updates by accepting a lastTimestamp parameter.
 */

import { NextResponse } from 'next/server';
import { Pool, DatabaseError } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Handles GET requests to fetch API logs.
 * Supports pagination and incremental updates through query parameters.
 *
 * @param request - The incoming HTTP request
 * @param request.url - URL containing query parameters
 * @param request.url.searchParams.lastTimestamp - Optional timestamp to fetch only newer logs
 * @param request.url.searchParams.limit - Optional limit for number of logs to return (default: 10)
 *
 * @returns {Promise<NextResponse>} JSON response containing logs or error message
 */
export async function GET(request: Request) {
  // Extract and validate query parameters
  const { searchParams } = new URL(request.url);
  const lastTimestamp = searchParams.get('lastTimestamp');
  const limit = parseInt(searchParams.get('limit') || '10');
  let client;
  try {
    console.log('Attempting to connect to database...');
    client = await pool.connect();
    console.log('Successfully connected to database');

    console.log('Executing query...');
    // Build the parameterized query
    // Uses an array to store query parameters for security (prevents SQL injection)
    const queryParams: any[] = [];
    let query = `
      SELECT 
        "createdAt" as timestamp,
        request->>'method' as method,
        request->>'path' as endpoint,
        model,
        provider,
        COALESCE(response->>'status', '500') as status,
        COALESCE((EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) * 1000)::integer, 0) as duration_ms,
        COALESCE("inputTokens", 0) as "inputTokens",
        COALESCE("outputTokens", 0) as "outputTokens",
        COALESCE("totalCost", 0) as "totalCost"
      FROM "APILogs"
    `;

    if (lastTimestamp) {
      query += ` WHERE "createdAt" > $1`;
      queryParams.push(new Date(lastTimestamp));
    }

    query += `
      ORDER BY "createdAt" DESC
      LIMIT $${queryParams.length + 1}
    `;
    queryParams.push(limit);

    const result = await client.query(query, queryParams);
    
    console.log(`Query executed. Found ${result.rows.length} logs`);
    
    // Ensure we always return an array
    const logs = Array.isArray(result.rows) ? result.rows : [];
    return NextResponse.json({ logs });
  } catch (error: unknown) {
    // Type guard for DatabaseError
    if (error instanceof DatabaseError) {
      console.error('Database error:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        schema: error.schema,
        table: error.table
      });
      return NextResponse.json({ 
        logs: [],
        error: `Database error: ${error.message}`
      }, { status: 500 });
    }
    
    // For other types of errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching logs:', errorMessage);
    return NextResponse.json({ 
      logs: [],
      error: errorMessage
    }, { status: 500 });
  } finally {
    if (client) {
      console.log('Releasing database connection');
      client.release();
    }
  }
}
