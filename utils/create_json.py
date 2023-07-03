#!/usr/bin/python3
import requests
import json
from bs4 import BeautifulSoup
import re
import argparse
import time
from pprint import pprint
import db
import unicodedata
import utils

dest_path = "data"

def generate_course_json(conn:object, cur:object, course:dict)->dict:
    '''
    {
        'latest': <epoch>,
        'profs': [
            {
                'prof': <name>,
                'count': <pos_int>
            },
            ...
        ],
        'info': {
            'desc': ,
            'credit': ,
            'name':
        },
        'history': [
            {
                'epoch': ,
                'prof' ,
                'sem': source_sem, <---
                'enrol': ,
                'year': ,
                'type': ''
            },
            ...
            ]
    }
    '''
    latest = db.getLatestCourseOffering(conn, cur, course['course_code'])
    data = {}
    data['latest'] = latest
    data['info'] = course
    data['profs'] = db.getProfTeachCount(conn, cur, course['course_code'])
    data['history'] = db.getCourseHistory(conn, cur, course['course_code']) 
    return data

def writeJSON(data, course_code):
    json.dump(data, open("{}/{}.json".format(dest_path, course_code), 'w'))

## MAIN ##
(conn, cur) = db.db_connect()
courses:object = db.getCourses(conn, cur)
for course in courses:
    data = generate_course_json(conn, cur, course)
    writeJSON(data, course['course_code'])

