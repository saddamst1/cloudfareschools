import sqlite3
import os

def main():
    db_file = os.path.join('data', 'schoolspedia.db')
    out_file = 'db_columns.txt'
    
    with open(out_file, 'w') as f:
        f.write(f"Checking database path: {os.path.abspath(db_file)}\n")
        f.write(f"Exists: {os.path.exists(db_file)}\n")
        
        try:
            conn = sqlite3.connect(db_file)
            cur = conn.cursor()
            cur.execute('PRAGMA table_info(schools)')
            columns = cur.fetchall()
            f.write("Schools Table columns:\n")
            for col in columns:
                f.write(f"{col}\n")
            
            cur.execute('SELECT * FROM schools LIMIT 1')
            row = cur.fetchone()
            f.write("\nSample Row:\n")
            f.write(f"{row}\n")
            conn.close()
        except Exception as e:
            f.write(f"Error: {e}\n")

if __name__ == '__main__':
    main()
