import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Export a named GET handler
export async function GET() {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection(dbConfig);

    // Query to fetch unique warehouse IDs
    const [rows] = await connection.query(
      'SELECT DISTINCT warehouse_id FROM product;' // Replace \"warehouses\" with your table name
    );

    // Close the connection
    await connection.end();

    // Return the response
    return NextResponse.json({ warehouse_ids: rows });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
