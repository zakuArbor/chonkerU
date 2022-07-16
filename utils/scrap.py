#!/usr/bin/python3
import requests
import json
from bs4 import BeautifulSoup
from pprint import pprint

TAB = "TABDIV"

def parseCourseCode(html:object)->list[str]:
    '''
    count number of courses and strip section
    course codes are: 8 characters long
        * 4 character for department
        * 4 characters for course number
    '''
    courses = html.decode().split("<br/>")
    if len(courses) == 0 and len(courses[0]) < 9:
        return []
    courses[0] = courses[0][-9:-1] 
    if len(courses) > 2: 
        for i in range(1, len(courses)-1):
            if len(courses) < 9:
                continue
            courses[i] = courses[i][:-1]
        #END
    #endif
    courses[-1] = courses[-1][:8]
    return courses

def findSubject(html:object)->str:
    data_str = html.decode()
    size:int = len(data_str)
    if size == 0 or size < 4: #course code has 4 characters
        return ""
    index:int = data_str.find("<br/>")
    if index < 4:
        return "" 
    return data_str[index-4:index]

def parseCol(html:object)->list[str]:
    if not html:
        return []
    row = html.decode().split("<br/>")

    if len(row) == 0:
        return []
    index:int = row[0].rfind(">")
    if index >= 0:
        row[0] = row[0][index+1:] #remove html code
        row[0] = row[0].strip()
    index = row[-1].find("<")
    if index >=0:
        row[-1] = row[-1][0:index]
        row[-1].strip()
    return row

def parseSubject(html:str, subject="")->(dict, str):
    '''
    col 0: subject
    col 1: course
    col 2: term => skip
    col 3: instructor
    col 4: group => skip for now
    col 5: crn => might be useful to find room capacity
    col 6: type
    col 7: enrollemnt
    col 8: cross-reference => useless for now

    Note: empty entry has \xa0

    returns a dictionary and the subject
    '''
#    pprint(html)
    data = {}
    cols:list[str] = html.select("tr > td")
    if len(subject) == 0:
        subject = findSubject(cols[0])
    data["courses"]:list[str] = parseCourseCode(cols[1])
    data["insutrctor"]:list[str] = parseCol(cols[3])
    data["crn"]:list[str] = parseCol(cols[5])
    data["type"]:list[str] = parseCol(cols[6])
    data["enrol"]:list[str] = parseCol(cols[7])
    return (data, subject)

def parseTable(html:str, div=TAB)->(dict, str):
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

    subjects_data:list[str] = html.select("div.TABDIV0 > table > tbody > tr > td > div:nth-of-type(2) > table > tbody > tr")
    size:int = len(subjects_data)
    if size == 0 and size > 1: #failed to capture table or there's only a header
        return ({}, "") 
    subjects_data.pop(0)
    data:dict = {}
    subject:str = ""
    for subject_data in subjects_data:
        (tmp_data, subject) = parseSubject(subject_data)
        data[subject] = tmp_data
    return (data, subject)

def writeData(data, skip_subject=""):
    subjects = []
    if len(skip_subject) > 0:
        for subject in data.keys():
            if subject == skip_subject:
                continue
            subjects.append(subject)
        #done
    #fi
    if len(subjects) < 0:
        return
    for subject in subjects:
        with open('{}.json'.format(subject), 'w') as handler:
            handler.write(json.dumps(data[subject], indent=2) )
        handler.close()
    #done
###############################################################################
url = 'https://oirp.carleton.ca/course-inst/tables/2020w-course-inst_hpt.htm'
url = "http://127.0.0.1:4000/blog/assets/test2.html"
data:object = requests.get(url)
html:object = BeautifulSoup(data.text, 'html.parser')
data:dict = {}
subject:str = ""
(data, subject) = parseTable(html, "div0")
if len(data.keys()) > 1: #can dump subject to text file
    writeData(data=data, skip_subject=subject)
pprint(data)
