import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Utility function to create a MySQL connection
const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

export async function POST(request: NextRequest) {
  let connection;
  try {
    // Parse request body
    const {
      id,
      name,
      page = 1,
      limit = 30,
      quantity,
      quantity_filter = 'greater', // 'greater' or 'less'
      warehouse_id,
      product_unit, // New filter for product_unit
    } = await request.json();
    const offset = (page - 1) * limit;

    // Validate input for quantity_filter
    if (!['greater', 'less'].includes(quantity_filter)) {
      return NextResponse.json(
        { message: "Invalid 'quantity_filter' value. Use 'greater' or 'less'." },
        { status: 400 }
      );
    }

    // Ensure quantity is a valid number
    if (quantity && isNaN(quantity)) {
      return NextResponse.json(
        { message: "Invalid 'quantity'. Must be a number." },
        { status: 400 }
      );
    }

    // Create connection
    connection = await getConnection();

    // Determine the operator based on the filter
    const quantityOperator = quantity_filter === 'greater' ? '>' : '<';

    // SQL query with additional product_unit and warehouse_id filters if provided
    const query = `
      SELECT SQL_CALC_FOUND_ROWS * 
      FROM product 
      WHERE product_stock_id LIKE ? 
        AND product_detail LIKE ? 
        AND product_quantity ${quantityOperator} ? 
        ${warehouse_id ? 'AND warehouse_id = ?' : ''} 
        ${product_unit ? 'AND product_unit = ?' : ''} 
      LIMIT ? OFFSET ?
    `;

    // Prepare the query parameters
    const queryParams = [
      `%${id}%`,
      `%${name}%`,
      quantity,
      ...(warehouse_id ? [warehouse_id] : []),
      ...(product_unit ? [product_unit] : []),
      limit.toString(),
      offset.toString(),
    ];

    // Execute the query
    const [rows] = await connection.execute(query, queryParams);

    // Second query to get total number of rows
    const [totalRows] = await connection.execute('SELECT FOUND_ROWS() AS total');
    const total = (totalRows as any)[0].total;

    // If no products are found
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 204 });
    }

    // Return successful response
    return NextResponse.json({ products: rows, total }, { status: 200 });

  } catch (error) {
    console.error('Error in product search:', error);
    return NextResponse.json(
      { 
        message: 'Internal Server Error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  } finally {
    // Ensure connection is closed
    if (connection) {
      await connection.end();
    }
  }
}

// Optional: Add GET method if needed
export async function GET() {
  return NextResponse.json({ message: 'Method not supported' }, { status: 405 });
}
