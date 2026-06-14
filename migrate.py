import sqlite3
import os

def main():
    db_file = os.path.join('data', 'schoolspedia.db')
    print("Database path:", os.path.abspath(db_file))
    print("Exists:", os.path.exists(db_file))
    
    conn = sqlite3.connect(db_file)
    cur = conn.cursor()
    
    # 1. Create contact_submissions table
    print("Creating contact_submissions table...")
    cur.execute("""
    CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        school TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("contact_submissions table created successfully.")
    
    # 2. Add facilities columns to schools table if they do not exist
    cols_to_add = [
        ('has_library', 'INTEGER DEFAULT 0'),
        ('has_electricity', 'INTEGER DEFAULT 0'),
        ('has_computers', 'INTEGER DEFAULT 0'),
        ('boys_toilets_count', 'INTEGER DEFAULT 0'),
        ('girls_toilets_count', 'INTEGER DEFAULT 0')
    ]
    
    for col_name, col_type in cols_to_add:
        try:
            print(f"Adding column {col_name} to schools table...")
            cur.execute(f"ALTER TABLE schools ADD COLUMN {col_name} {col_type}")
            print(f"Column {col_name} added successfully.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column {col_name} already exists. Skipping.")
            else:
                print(f"Error adding column {col_name}: {e}")
                
    conn.commit()
    conn.close()
    print("Migration finished successfully.")

if __name__ == '__main__':
    main()
