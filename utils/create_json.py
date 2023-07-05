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
    latest = db.getCourseLatestOffering(conn, cur, course['course_code'])
    data = {}
    data['latest'] = latest
    data['info'] = course
    data['profs'] = db.getProfTeachCount(conn, cur, course['course_code'])
    data['history'] = db.getCourseHistory(conn, cur, course['course_code']) 
    return data

def generate_prof_json(conn:object, cur:object, prof:dict)->dict:
    '''
    {
        'latest': <epoch>,
        'prof': "",
        'courses': {
            'course1': {
                'name':
                'latest':
                'history': [{...}]
            } 
        }
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
    latest = db.getProfLatestOffering(conn, cur, prof['prof_name'])
    data = {}
    data['latest'] = latest
    data['prof'] = prof['prof_name']
    data['history'] = db.getProfHistory(conn, cur, prof['prof_name']) 
    return data



def writeCourseJSON(data, course_code):
    json.dump(data, open("{}/{}.json".format(dest_path, course_code), 'w'))

## MAIN ##
(conn, cur) = db.db_connect()
courses:object = db.getCourses(conn, cur)
for course in courses:
    data = generate_course_json(conn, cur, course)
    writeCourseJSON(data, course['course_code'])

course_list = {'courses': []}
for course in courses:
    row = {}
    row['code'] = course['course_code'];
    row['name'] = course['course_name']
    row['desc'] = course['course_desc']
    course_list['courses'].append(row)
json.dump(course_list, open("{}/{}.json".format(dest_path, 'math_courses'), 'w'))


courses = {}
data = {}
#hopefully garbage collected? I don't know python internals

profs:dict = db.getProfsTeachCounts(conn, cur)
profs_list:dict = {'profs': []}
for prof in profs: #I know this is ridiculous but too lazy to change front end
    prof = {
        'name': prof['prof_name'],
        'num': prof['count']
    }
    profs_list['profs'].append(prof)
json.dump(profs_list, open("{}/{}.json".format(dest_path, 'profs'), 'w'))

for prof in profs:
    data = generate_prof_json(conn, cur, prof)
    json.dump(data, open("{}/prof/{}.json".format(dest_path, prof['prof_hash']), 'w'))


