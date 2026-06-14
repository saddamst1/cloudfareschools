import sqlite3
import os

def main():
    db_file = os.path.join('data', 'schoolspedia.db')
    print("Checking database path:", os.path.abspath(db_file))
    print("Exists:", os.path.exists(db_file))
    conn = sqlite3.connect(db_file)
    cur = conn.cursor()
    cur.execute('PRAGMA table_info(schools)')
    columns = cur.fetchall()
    print("Schools Table columns:")
    for col in columns:
        print(col)
    
    cur.execute('SELECT * FROM schools LIMIT 1')
    row = cur.fetchone()
    print("\nSample Row:")
    print(row)
    
    conn.close()

if __name__ == '__main__':
    main()
