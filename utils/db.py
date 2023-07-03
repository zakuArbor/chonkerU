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

def getCourses(conn:object, cur:object)->list[object]:
    '''
    returns: a list of courses that are available such as their name and description

    returns:
    [
    {
        course_code: "",
        course_name: "",
        course_desc: "",
        course_credit:
    },
    ...
    ]
    '''
    query:str = "SELECT course_code, course_name, course_desc, course_credit FROM courses"
    cur.execute(query, ())
    courses_rows = cur.fetchall()
    courses = []
    if courses_rows:
        for course_row in courses_rows:
            course = {}
            course['course_code'] = course_row[0]
            course['course_name'] = course_row[1]
            course['course_desc'] = course_row[2]
            course['course_credit'] = course_row[3]
            courses.append(course)
    return courses

def getLatestCourseOffering(conn:object, cur:object, code:str)->int:
    query:str = "SELECT EXTRACT(epoch FROM MAX(source_date))::int AS latest from course_records INNER JOIN courses ON course_records.course_id = courses.course_id WHERE course_code = %s"
    cur.execute(query, (code,))
    epoch = cur.fetchone()
    if epoch:
        return epoch[0]
    return 0

def getProfTeachCount(conn, cur, code:str)->list[dict]:
    query:str = "SELECT COUNT(prof_name), prof_name FROM profs INNER JOIN course_records ON course_records.prof_id = profs.prof_id INNER JOIN courses ON courses.course_id = course_records.course_id WHERE course_code = %s GROUP BY profs.prof_id"
    cur.execute(query, (code,))
    rows = cur.fetchall()
    profs = []
    if rows:
        print(rows)
        for row in rows:
            profs.append({'count': row[0], 'prof': row[1]})
    return profs

def getCourseHistory(conn:object, cur:object, code:str)->list[dict]:
    '''
    [
        (epoch, prof, sem, enrol, year, type), ...
    ]
    '''
    query:str = "SELECT EXTRACT(epoch FROM source_date)::int AS epoch, prof_name, source_term, enrollment, EXTRACT(year FROM source_date)::varchar,type FROM course_records INNER JOIN profs ON course_records.prof_id = profs.prof_id INNER JOIN courses ON courses.course_id = course_records.course_id WHERE course_code = %s"
    cur.execute(query, (code,))
    history_rows = cur.fetchall()
    history = []
    if history_rows:
        for row in history_rows:
            record = {}
            record['epoch'] = row[0]
            record['prof'] = row[1]
            record['sem'] = row[2]
            record['enrol'] = row[3]
            record['year'] = row[4]
            record['type'] = row[5]
            history.append(record)
    return history

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

