#!/usr/bin/python3
import requests
import json
from bs4 import BeautifulSoup
import re
import time
from pprint import pprint

TAB = "div.TABDIV"

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
    courses[0] = courses[0].strip()
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
    data_str = data_str.strip()
    subject:str = data_str[index-4:index]
    #i.e. "r>\n\xa0", '>\n\xa0'
    match = re.match("[A-Z]{3,4}", subject)
    if match:
        return match[0]
    return ""

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
    data = {}
    cols:list[str] = html.select("tr > td")
    tmp_subject = findSubject(cols[0])
    if len(tmp_subject) != 0:
        subject = tmp_subject #must be processing a new subject
    data["courses"]:list[str] = parseCourseCode(cols[1])
    data["prof"]:list[str] = parseCol(cols[3])
    data["crn"]:list[str] = parseCol(cols[5])
    data["type"]:list[str] = parseCol(cols[6])
    data["enrol"]:list[str] = parseCol(cols[7])
    return (data, subject)

def parseTable(subjects_data:str, div:str=TAB, subject:str = "")->(dict, str):
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

    subjects_data:object = subjects_data.select(div + " > table > tbody > tr > td > div:nth-of-type(2) > table > tbody > tr") #browser adds tbody
    size:int = len(subjects_data)
    if size == 0 and size > 1: #failed to capture table
        return ({}, "") 
    data:dict = {}
    count = 0;
    for subject_data in subjects_data:
        count+=1
        (tmp_data, subject) = parseSubject(subject_data, subject)
        updateData(data, {subject: tmp_data})
    return (data, subject)

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
        with open('data/{}{}_{}.json'.format(date["year"], date["sem"], subject), 'w') as handler:
            data[subject].update(date)
            handler.write(json.dumps(data[subject], indent=2) )
        handler.close()
        del data[subject]
        print("Processed {}".format(subject), flush=True)
    #done
    assert(not subjects[0] in data)

def updateData(data:dict, tmp_data:dict):
    '''
    Update the dictionary with the new dictionary without deleting any entries (i.e. cannot use dict.update())
    Order of the list matters a lot because each index in each list corresponds to the same course
    '''
    subjects:list[str] = tmp_data.keys()
    for subject in subjects:
        if subject in data:
            for key in data[subject].keys():
                data[subject][key].extend(tmp_data[subject][key])
            #done
        else:
            data[subject] = tmp_data[subject]

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

###############################################################################
#url = 'https://oirp.carleton.ca/course-inst/tables/2020w-course-inst_hpt.htm'
#url = "http://127.0.0.1:4000/blog/assets/test.html"
#url = "http://127.0.0.1:4000/blog/assets/test2.html"
url = "https://oirp.carleton.ca/course-inst/tables/2018f-course-inst_hpt.htm"
data:object = requests.get(url)
html:object = BeautifulSoup(data.text, "html5lib")
data:dict = {}
subject:str = ""

date:dict = grabDataDate(html)
(data, subject) = parseTable(html, TAB + "0")
if len(data.keys()) > 1: #can dump subject to text file
    writeData(data=data, date=date, skip_subject=subject)
tables_data:list = html.select("html > body > " + TAB)
count = 0
for table_data in tables_data:
    count +=1
    tmp_data:dict = {}
    (tmp_data, subject) = parseTable(subjects_data=table_data, subject=subject)
    if len(tmp_data) == 0:
        continue
    updateData(data, tmp_data)
    if len(data.keys()) > 1: #can dump subject to text file                            
        writeData(data=data, date=date, skip_subject=subject)
#done
writeData(data, date) #write remaining subjects
print("{}COMPLETED{}".format("="*5, "="*5))
