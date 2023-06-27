#!/usr/bin/python3
import requests
import json
from bs4 import BeautifulSoup
import re
import time
from pprint import pprint
import psycopg2
import os
from dotenv import load_dotenv
import utils
import scrap_utils
#load_dotenv()

#host=os.environ.get("DB_HOST")
#port=os.environ.get("DB_PORT")

# Establish a connection to the PostgreSQL database
#conn = psycopg2.connect(
#    host="your_host",
#    port="your_port",
#    database="your_database",
#    user="your_username",
#    password="your_password"
#)

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

TAB = "div.TABDIV"

def parseTable(data:dict={}, subjects_data:object = None, div:str=TAB, subject:str = "")->(dict, str):
    '''
    The document that is of concern is:
    * first table has `class="TABDIV0"`
    * remaining tables have `class=:TABDIV"`

    On each TABDIV:
    * div.TABDIV0 > table > tbody > tr > td: there are 3 divs
        * first div is just the title of the table -> useless
        * second div is the table content -> USEFUL
        * third div is the footnotes -> USEFUL to parse only once (i.e. when parsing TABDIV0
        * hence selection becomes: `div.TABDIV0 > table > tbody > tr > td > div:nth-of-type(2)`
    * `div.TABDIV0 > table > tbody > tr > td > div:nth-of-type(2) > table > tbody`: there are n+1 <tr>
        Inside each table contains the following fields:
        * Subject
        * Course
        * Term: The last term in which the indicated instructor will be teaching this course (may be different from final term of course, see 'Type'; S1/2 -> 1st/2nd part of summer).
        * Grp: Sessional, Faculty (the instructor type/position)
        * CRN: not useful
        * Type: Day, Evening, Unscheduled
        * Enrolment
        * Cross Reference: not useful for now

        HTML layout of the information page is garbage. Goes by columns instead of rows ...
        * Each table has n + 1 <tr> where n represents the different number of subjects
            * the first row (first <tr>) is the table header
            * for each n <tr> contains course information for each subject in the table:
                * each sub <tr> represents a column (I know it's digusting)
    returns: a tuple of the course data and the last processed subject
    '''
    if not subjects_data:
        print("Error no html to parse")
        return
    subjects_data:object = subjects_data.select(div + " > table > tbody > tr > td > div:nth-of-type(2) > table > tbody > tr") #browser adds tbody
    size:int = len(subjects_data)
    if size == 0: #failed to capture table
        return ({}, "")
    count:int = 0;
    for subject_data in subjects_data[1:]: #1st row is headers
        (tmp_data, subject) = scrap_utils.parseSubject(subject_data, subject)
        if tmp_data and subject == "MATH":
            updateData(data, tmp_data)
    return subject

def writeData(data:dict, date:dict, skip_subject:str=""):
    '''
    writes course data by subject into a JSON file
    WARNING: Deltes processed data
    '''
    subjects = []
    if len(skip_subject) > 0:
        for subject in data.keys():
            if subject == skip_subject:
                continue
            subjects.append(subject)
        #done
    else:
        subjects.extend(data.keys())
    if len(subjects) == 0:
        return
    for subject in subjects:
        with open('data/{}-{}.json'.format(date["year"], subject), 'w') as handler:
            data[subject].update(date)
            handler.write(json.dumps(data[subject], indent=2) )
        handler.close()
        print("Processed {}-{}".format(subject, date["year"]), flush=True)
        del data[subject]
    #done
    assert(not subjects[0] in data)

def updateData(data:dict, tmp_data:dict):
    '''
    course data is added to the dictionary
    
    format:
    {
        "MATH1004": [
            {
                "prof": "",
                "crn": ,
                "term": "",
                "type": "",
                "enrol": 
            },
            ...
            { ...}
        ]
    }
    '''
    if not tmp_data:
        return
    for i in range(len(tmp_data['courses'])):
        if tmp_data['prof'][i] == '\xa0':
            continue
        course:str = tmp_data['courses'][i]
        course_record:dict = {}
        course_record['term'] = tmp_data['term'][i]
        course_record['prof'] = tmp_data['prof'][i]
        course_record['crn'] = tmp_data['crn'][i]
        course_record['type'] = tmp_data['type'][i]
        course_record['enrol'] = tmp_data['enrol'][i]
        if course in data:
            data[course].append(course_record)
        else:
            data[course] = [course_record]


###############################################################################
#url = 'https://oirp.carleton.ca/course-inst/tables/2020w-course-inst_hpt.htm'
#url = "http://127.0.0.1:4000/blog/assets/test.html"
#url = "http://127.0.0.1:4000/blog/assets/test2.html"

semesters:list = ['f','w','s']


#for year in range(2010,2011):
#    for sem_char in semesters:

for year in range(2015,2016):
    #url = "https://oirp.carleton.ca/course-inst/tables/2018f-course-inst_hpt.htm"
    sem = 'w'
    url:str = utils.create_semester_url(year, sem)
    if not url:
        print("failed to construct semester url")
        continue
    data:object = requests.get(url)
    if not data:
        print("failed to get " + url)
    html:object = BeautifulSoup(data.text, "html5lib")
    courses_data:dict = {}
    subject:str = ""
    
    date:dict = scrap_utils.grabDataDate(html)
    #parseTable(data=course_data, subjects_data=html, div=TAB + "0", subject="")
    tables_data:list = html.select("html > body > " + TAB)
    count = 0
    found_math:bool = False
    for table_data in tables_data:
        subject = parseTable(data=courses_data, subjects_data=table_data, subject=subject)
        if found_math and subject != "MATH":
            break
        if subject == "MATH":
            found_math = True

    pprint(courses_data)
    print("{}COMPLETED{}".format("="*5, "="*5))

