import sqlite3
import os

def main():
    db_file = os.path.join('data', 'schoolspedia.db')
    out_file = 'db_tables.txt'
    
    with open(out_file, 'w') as f:
        try:
            conn = sqlite3.connect(db_file)
            cur = conn.cursor()
            cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cur.fetchall()
            f.write("Tables in database:\n")
            for t in tables:
                t_name = t[0]
                f.write(f"\nTable: {t_name}\n")
                cur.execute(f"PRAGMA table_info({t_name})")
                cols = cur.fetchall()
                for col in cols:
                    f.write(f"  {col}\n")
                cur.execute(f"SELECT COUNT(*) FROM {t_name}")
                count = cur.fetchone()[0]
                f.write(f"  Row Count: {count}\n")
            conn.close()
        except Exception as e:
            f.write(f"Error: {e}\n")

if __name__ == '__main__':
    main()
