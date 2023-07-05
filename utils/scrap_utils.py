import re
from pprint import pprint

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
    col 2: term
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
    if len(tmp_subject) == 0 and subject != "MATH":
        return (None, subject)
    if len(tmp_subject) != 0:
        subject = tmp_subject #must be processing a new subject
    data["courses"]:list[str] = parseCourseCode(cols[1])
    data["term"]:list[str] = parseCol(cols[2])
    data["prof"]:list[str] = parseCol(cols[3])
    data["crn"]:list[str] = parseCol(cols[5])
    data["type"]:list[str] = parseCol(cols[6])
    data["enrol"]:list[str] = parseCol(cols[7])
    return (data, subject)


def grabDataDate(html)->dict:
    '''
    String to retrieve: `Source:    Banner Course data - 2020W, as at 30-APR-2020`
    There seems to be a typo in CU data

    Example:
    {'2020', '30=APR-2020'}
    '''
    data = {}
    parsed = html.select("html > body > div.TABDIV0 > table > tbody > tr" 
                         + " > td > div:nth-of-type(3) > table > tbody > tr:nth-of-type(1)" 
                         + " > td:nth-of-type(2)") #browser adds tbody
    if not parsed:
        pprint(parsed)
        return data
    text = parsed[0].string.strip()
    match = re.search("\d\d\d\d[F|W|S]", text)
    if match:
        data["year"] = match[0][0:4]
    #fi
    match = re.search("\d\d-[A-Za-z]{3,4}-\d\d\d\d", text)
    if match:
        data['source'] = match[0]
    return data

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
