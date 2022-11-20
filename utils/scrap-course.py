#!/usr/bin/python3
from email.mime import base
import requests
import json
from bs4 import BeautifulSoup
import re
import argparse
import time
from pprint import pprint
import unicodedata

base_url:str = "https://calendar.carleton.ca/undergrad/courses/";
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
    #pprint(html);
    exit(1)


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
        if (code[4] == '0'):
            continue;
        #fi
        course["code"] = code
        match = re.search("([0|1]\.[\d])", temp.text)
        if match:
            course["credit"] = match.group(1)
        #fi

        temp = course_html.decode().split("<br/>")
        print("===================================")
        #print(course_html.get_text().strip().replace(u'\xa0', u'').split('\n'))
        #print("===================================")

#        line = temp[1].strip("\n")
        temp = course_html.get_text().strip().replace(u'\xa0', u'').split('\n');
        print(temp)
        # Sample list
        # ['MATH4905 [0.5 credit]', 'Honours Project (Honours)', 'Consists of a written report on some approved topic or topics in the field of mathematics, together with a short lecture on the report.', 'Includes: Experiential Learning ActivityPrerequisite(s): B.Math.(Honours) students only.']
        if len(temp) > 3:
            course["name"] = temp[1]
            print("desc: " + temp[2])
            course["desc"] = temp[2]
        if len(temp) >= 4:
            course['additional'] = ". ".join(temp[4:])
        print("===================================")
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


###############################################################################
#url = 'https://oirp.carleton.ca/course-inst/tables/2020w-course-inst_hpt.htm'
#url = "http://127.0.0.1:4000/blog/assets/test.html"
#url = "http://127.0.0.1:4000/blog/assets/math.html"

parser = argparse.ArgumentParser(description='Scrap all course description and names given a subject')
parser.add_argument('--subject',type=str, default='MATH',
                    help='the subject to parse')
args = parser.parse_args()
subject = args.subject.upper()

url = base_url + subject

#data:object = requests.get(base_url+subject)
data:object = requests.get(url)
html:object = BeautifulSoup(data.text, "html5lib")
data:dict = {}

courses_html = html.select(".courseblock");
courses:object = getCourses(courses_html)
#pprint(courses);
writeData(courses, subject)