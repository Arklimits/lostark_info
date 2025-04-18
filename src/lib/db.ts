import mysql from 'mysql2';

export const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
    connectionLimit: 1,
    waitForConnections: true,
  })
  .promise();
