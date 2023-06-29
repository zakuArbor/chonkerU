import os
import psycopg2
from dotenv import load_dotenv
import hashlib

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

def get_profId(prof:str, conn:object, cur:object)->int:
    '''
    Return the id associated with the prof
    If the prof does not exist, insert into the database
    '''
    query:str = "SELECT prof_id FROM profs WHERE prof_name = %s"
    cur.execute(query, (prof,))
    prof_id:int = cur.fetchone()
    if prof_id:
        return prof_id[0]
    md5 = hashlib.md5(prof.encode('utf8')).hexdigest()
    query = "INSERT INTO profs (prof_name, prof_hash)  VALUES (%s, %s) RETURNING prof_id"
    try:
        cur.execute(query, (prof, md5))
        prof_id = cur.fetchone()
        conn.commit()
        if prof_id:
            return prof_id[0]
        else:
            print("failed to insert for " + prof)
            print(prof_id)
        return prof_id
    except (psycopg2.Error, psycopg2.Warning) as e:
            print("get_profId: Pikachu has no clue about " + prof)
            print(e)

    return -1

def get_courseId(code:str, conn:object, cur:object)->str:
    '''
    Return the id associated with the course
    If the course does not exist, print a warning
    '''
    query:str = "SELECT course_id FROM courses WHERE course_code = %s"
    cur.execute(query, (code,))
    course_id:int = cur.fetchone()
    if course_id:
        return course_id[0]
    print("{} does not exist".format(code))
    return -1



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

