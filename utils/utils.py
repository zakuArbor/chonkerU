import sys
import hashlib

def hash_string(str:str)->str:
    return hashlib.md5(str.encode('utf-8')).hexdigest()

def create_semester_url(year:int, sem:str)->str:
    """
    Construct url to web scrap from

    :param year: the year
    :param sem: a one character that represents a semester
    >>> create_semester_url(2000, 'w')
    ''
    >>> create_semester_url(2020, 'a')
    ''
    >>> create_semester_url(2020, 'w')
    'https://oirp.carleton.ca/course-inst/tables/2020w-course-inst_hpt.htm'
    """
    if year > 2030 or year < 2010:
        sys.stderr.write("Year must be between 2010 and 2030\n")
        return ""
    if sem not in ['s','w','f']:
        sys.stderr.write("Semester must be either 's','w', or 'f'\n")
        return ""
    base_url = "https://oirp.carleton.ca/course-inst/tables/"
    end_url  = "-course-inst_hpt.htm"
    return '{0}{1}{2}{3}'.format(base_url, str(year), sem, end_url)

