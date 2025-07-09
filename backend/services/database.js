const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    try {
      // Use SQLite for local development
      const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || path.join(__dirname, '../swap4x_local.db');
      
      return new Promise((resolve, reject) => {
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            logger.error('Failed to connect to SQLite database:', err);
            reject(err);
          } else {
            logger.info(`Connected to SQLite database at ${dbPath}`);
            this.createTables()
              .then(() => {
                this.isInitialized = true;
                resolve(true);
              })
              .catch(reject);
          }
        });
      });
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  async createTables() {
    return new Promise((resolve, reject) => {
      const createTablesSQL = `
        -- Transactions table
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          user_address TEXT NOT NULL,
          from_chain TEXT NOT NULL,
          to_chain TEXT NOT NULL,
          from_token TEXT NOT NULL,
          to_token TEXT NOT NULL,
          amount TEXT NOT NULL,
          bridge_name TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          tx_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Bridge routes table
        CREATE TABLE IF NOT EXISTS bridge_routes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          from_chain TEXT NOT NULL,
          to_chain TEXT NOT NULL,
          token TEXT NOT NULL,
          bridge_name TEXT NOT NULL,
          estimated_time INTEGER,
          fee_percentage REAL,
          min_amount TEXT,
          max_amount TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Price history table
        CREATE TABLE IF NOT EXISTS price_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          token_id TEXT NOT NULL,
          price REAL NOT NULL,
          currency TEXT DEFAULT 'usd',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Analytics table
        CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          metric_name TEXT NOT NULL,
          metric_value TEXT NOT NULL,
          date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;

      this.db.exec(createTablesSQL, (err) => {
        if (err) {
          logger.error('Failed to create tables:', err);
          reject(err);
        } else {
          logger.info('Database tables created successfully');
          resolve();
        }
      });
    });
  }

  /**
   * Save transaction
   */
  async saveTransaction(transaction) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO transactions (
          id, user_address, from_chain, to_chain, from_token, to_token,
          amount, bridge_name, status, tx_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(sql, [
        transaction.id,
        transaction.userAddress,
        transaction.fromChain,
        transaction.toChain,
        transaction.fromToken,
        transaction.toToken,
        transaction.amount,
        transaction.bridgeName,
        transaction.status || 'pending',
        transaction.txHash || null
      ], function(err) {
        if (err) {
          logger.error('Failed to save transaction:', err);
          reject(err);
        } else {
          logger.info(`Transaction saved with ID: ${transaction.id}`);
          resolve(this.lastID);
        }
      });
    });
  }

  /**
   * Get transactions by user address
   */
  async getTransactionsByUser(userAddress, limit = 50) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM transactions 
        WHERE user_address = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `;

      this.db.all(sql, [userAddress, limit], (err, rows) => {
        if (err) {
          logger.error('Failed to get transactions:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId, status, txHash = null) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE transactions 
        SET status = ?, tx_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(sql, [status, txHash, transactionId], function(err) {
        if (err) {
          logger.error('Failed to update transaction:', err);
          reject(err);
        } else {
          logger.info(`Transaction ${transactionId} updated to status: ${status}`);
          resolve(this.changes);
        }
      });
    });
  }

  /**
   * Save price data
   */
  async savePriceData(tokenId, price, currency = 'usd') {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO price_history (token_id, price, currency)
        VALUES (?, ?, ?)
      `;

      this.db.run(sql, [tokenId, price, currency], function(err) {
        if (err) {
          logger.error('Failed to save price data:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  /**
   * Get analytics data
   */
  async getAnalytics(days = 30) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_transactions,
          SUM(CAST(amount AS REAL)) as total_volume,
          COUNT(DISTINCT user_address) as unique_users
        FROM transactions 
        WHERE created_at >= datetime('now', '-${days} days')
      `;

      this.db.get(sql, (err, row) => {
        if (err) {
          logger.error('Failed to get analytics:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Error closing database:', err);
          } else {
            logger.info('Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

/**
 * Initialize database
 */
async function initializeDatabase() {
  return await databaseService.initialize();
}

/**
 * Get database instance
 */
function getDatabase() {
  return databaseService;
}

module.exports = {
  DatabaseService,
  initializeDatabase,
  getDatabase
};

