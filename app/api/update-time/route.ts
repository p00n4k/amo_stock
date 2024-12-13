import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Define an interface for the row type
interface UpdateTimeRow {
  update_time: string;
}

// Export a named GET handler
export async function GET() {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection(dbConfig);
    
    // Query to fetch the latest update_time
    const [rows] = await connection.query<mysql.RowDataPacket[]>('SELECT update_time FROM product ORDER BY update_time DESC LIMIT 1');
    
    // Close the connection
    await connection.end();
    
    // Type assertion and check
    const updateTimeRows = rows as UpdateTimeRow[];
    
    // Check if any rows were returned
    if (updateTimeRows.length > 0) {
      const latestTime = updateTimeRows[0].update_time;
      
      // Return the response with the latest time
      return NextResponse.json({ latestTime });
    } else {
      // Handle case when no data is found
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}