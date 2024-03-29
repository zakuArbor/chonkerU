#!/usr/bin/python3
from email.mime import base
import requests
import json
from bs4 import BeautifulSoup
import re
import argparse
import time
from pprint import pprint
import db
import unicodedata

base_url:str = "https://calendar.carleton.ca/undergrad/courses/";
#base_url:str = "https://calendar.carleton.ca/grad/courses/"; #grad courses cannot be collected, parser needs to be adapted i.e. MATH50001 [0.5 Credit] (MAT 5144) <- this course messes things up I think

info_url:str = "https://calendar.carleton.ca/search/?=";


def writeData(data:dict, subject:str=""):
    '''
    writes course data into a JSON file
    '''
    with open('data/{}.json'.format(subject), 'w') as handler:
        handler.write(json.dumps(data, indent=2) )
    handler.close()
    #done

def grabDataDate(html)->dict:
    '''
    String to retrieve: `Source: 	Banner Course data - 2020W, as at 30-APR-2020`
    There seems to be a typo in CU data
    '''
    parsed = html.select("html > body > div.TABDIV0 > table > tbody > tr > td > div:nth-of-type(3) > table > tbody > tr:nth-of-type(1) > td:nth-of-type(2)") #browser adds tbody
    text = parsed[0].string.strip()
    match = re.search("\d\d\d\d[F|W|S]", text)
    if match:
        data["year"] = match[0][0:4]
        data["sem"] = match[0][-1]
    #fi
    match = re.search("\d\d-[A-Za-z]{3,4}-\d\d\d\d", text)
    if match:
        data['source'] = match[0]

    return data

def retrieveCourseName(code:str)->str:
    '''
    Retrieve defunt courses such as MATH1002
    https://calendar.carleton.ca/search/?=MATH%201052
    %20 for whitespace
    '''
    data:object = requests.get(url+code)
    html:object = BeautifulSoup(data.text, "html5lib")


def getCourses(courses_html)->object:
    '''
    Return an object where each key is a course_code and its value is a course object where each object is: {
        'code': str
        'name': str,
        'credit': 0.5 or 1.0
        'desc': str,
        'additional': str
    }
    '''
    courses:object = {}
    for course_html in courses_html:
        course:object = {}
        temp = course_html.select(".courseblocktitle")
        if (len(temp) == 0):
            continue
        #fi
        temp = temp[0]
        temp1 = temp.select(".courseblockcode")
        code = temp1[0].text.replace(u'\xa0', '')
        temp_code:str = temp1[0].text.replace(u'\xa0', '%20')
        #if (code[4] == '0'):
        #    continue;
        #fi
        course["code"] = code
        match = re.search("([0|1]\.[\d])", temp.text)
        if match:
            course["credit"] = match.group(1)
        #fi

        temp = course_html.decode().split("<br/>")
        temp = course_html.get_text().strip().replace(u'\xa0', u'').split('\n');
        # Sample list
        # ['MATH4905 [0.5 credit]', 'Honours Project (Honours)', 'Consists of a written report on some approved topic or topics in the field of mathematics, together with a short lecture on the report.', 'Includes: Experiential Learning ActivityPrerequisite(s): B.Math.(Honours) students only.']
        if len(temp) < 3:
            continue #not enough information
        if len(temp) >= 3:
            course["name"] = temp[1]
            course["desc"] = temp[2]
            course["additional"] = ''
        if len(temp) >= 4:
            course['additional'] = ". ".join(temp[4:])
        pprint(course)
        '''
        index:int = line.find(" ")
        if index >= 0:
            course["name"] = line[:index]
        else:
            course["name"] = retrieveCourseName(temp_code)
            break
        #fi
        if (len(temp) > 2):
            temp = temp[2:]

        line = temp[0].replace('\n', '')
        line = course["desc"] = line
        line = course["additional"] = temp[1]
        '''
        courses[code] = course
    #done
    return courses

def writeDataDB(courses:dict):
    (conn, cur) = db.db_connect()
    insert_query = "INSERT INTO courses (course_code, course_name, course_desc, course_credit, additional) VALUES (%s, %s, %s, %s, %s)"
    
    values = []
    pprint("---------------------------")
    for code in courses:
        course = courses[code]
        values.append((course['code'], course['name'], course['desc'], course['credit'], course['additional']))
    pprint(values) 
    cur.executemany(insert_query, values)
    conn.commit()
    db.db_close(conn, cur)


###############################################################################

parser = argparse.ArgumentParser(description='Scrap all course description and names given a subject')
parser.add_argument('--subject',type=str, default='MATH',
                    help='the subject to parse')
args = parser.parse_args()
subject = args.subject.upper()

data:object = requests.get(base_url+subject)
html:object = BeautifulSoup(data.text, "html5lib")
data:dict = {}

courses_html = html.select(".courseblock");
courses:object = getCourses(courses_html)
writeData(courses, subject)
writeDataDB(courses)
