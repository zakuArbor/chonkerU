import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_host=os.environ.get("DB_HOST")
db_port=os.environ.get("DB_PORT")
db_name=os.environ.get("DB_NAME")
db_user=os.environ.get("DB_USER")
db_pw=os.environ.get("DB_PW")


def db_connect()->tuple[object, object]:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_pw
    )
    if not conn:
        print("failed to connect to database")
        return (None, None)
    return (conn, conn.cursor())

def db_close(conn, cur):
    cur.close()
    conn.close()
# Create a cursor object to interact with the database
#cur = conn.cursor()

# Define the INSERT statement with placeholders
#insert_query = "INSERT INTO your_table (column1, column2, column3) VALUES (%s, %s, %s)"

# Define the values to be inserted as a list of tuples
#values = [
#    ("value1", "value2", "value3"),
#    ("value4", "value5", "value6"),
#    ("value7", "value8", "value9")
#]

# Execute the INSERT statement with prepared statement
#cur.executemany(insert_query, values)

# Commit the changes to the database
#conn.commit()

# Close the cursor and connection
#cur.close()
#conn.close()

