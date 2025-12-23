
/**
 * BACKEND UTILITY: NoSQL Document Store (IndexedDB)
 * Mimics a backend NoSQL database like MongoDB or DynamoDB.
 */

const DB_NAME = 'SecureID_NoSql_DB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

export class NoSqlDb {
  private db: IDBDatabase | null = null;

  private async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // Create the object store and return it
          const userStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          // Create an index for faster lookups by email directly on the store object
          userStore.createIndex('email', 'email', { unique: true });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db!);
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB Error:', event.target.error);
        reject(`NoSQL Database failed to initialize: ${event.target.error?.message || 'Unknown error'}`);
      };
    });
  }

  async findOneByEmail(email: string): Promise<any | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('email');
        const request = index.get(email);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject('Error querying document by email');
      } catch (err) {
        reject(err);
      }
    });
  }

  async findOneById(id: string): Promise<any | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject('Error querying document by ID');
      } catch (err) {
        reject(err);
      }
    });
  }

  async insert(document: any): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(document);

        request.onsuccess = () => resolve();
        request.onerror = (event: any) => {
          if (event.target.error.name === 'ConstraintError') {
            reject('Identity already exists in backend registry');
          } else {
            reject('Error inserting document into NoSQL collection');
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const noSqlDb = new NoSqlDb();
