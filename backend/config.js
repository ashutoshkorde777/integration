// config.js
import dotenv from 'dotenv';
dotenv.config();

import mysql from "mysql2";

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'commondb'
}).promise()

export default pool;