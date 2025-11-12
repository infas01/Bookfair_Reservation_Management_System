/**
 * Database Connection Test Script
 * Run this script to verify database connection
 * 
 * Usage: node scripts/test-db-connection.js
 */

const db = require('../src/config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  try {
    // Test basic connection
    const isConnected = await db.testConnection();

    if (isConnected) {
      console.log('\n✅ Database connection successful!');
      
      // Test a simple query
      console.log('\n🔍 Testing table existence...');
      const tableCheck = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);

      if (tableCheck.rows.length > 0) {
        console.log('\n📋 Tables found in database:');
        tableCheck.rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.table_name}`);
        });
      } else {
        console.log('\n⚠️  No tables found. Run migrations to create schema.');
      }
    } else {
      console.log('\n❌ Database connection failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error testing database connection:', error.message);
    process.exit(1);
  } finally {
    // Close the pool
    await db.pool.end();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection();
