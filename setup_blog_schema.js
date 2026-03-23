
import mysql from 'mysql2/promise';

async function generateSchema() {
    console.log('Connecting to max_connections...');
    const db = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const query = `
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                excerpt TEXT NOT NULL,
                content LONGTEXT NOT NULL,
                image VARCHAR(255),
                category VARCHAR(100),
                author VARCHAR(100),
                read_time VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.execute(query);
        console.log('Successfully created blog_posts table!');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await db.end();
        process.exit();
    }
}

generateSchema();
