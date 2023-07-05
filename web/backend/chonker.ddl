DROP SCHEMA IF EXISTS CHONKER CASCADE;

CREATE SCHEMA CHONKER;

SET
    search_path TO CHONKER;

DROP TABLE IF EXISTS PROF CASCADE;

DROP TABLE IF EXISTS COURSE CASCADE;

DROP TABLE IF EXISTS COURSE_RECORD CASCADE;

-- PROF contains any information regarding the prof 
-- 'prof_id' 
-- 'name' is the full name of the professor (more fields may be created to distinguish first and last name)
-- 'md5sum of the name of the prof (may get collision if there are two profs with the same name but unfortunately OIRP will not gives us distinction in their data so we will ignore this case)
CREATE TABLE PROF(
    prof_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    name_sum VARCHAR(32) NOT NULL CHECK (name_sum ~ '[0-9a-f]{32}')
);

-- COURSE contains any information regarding about the course
-- 'course_id' 
-- 'course_name' is the name of the course
-- 'course_code' is the course code
CREATE TABLE COURSE(
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR NOT NULL,
    course_code VARCHAR(8) NOT NULL CHECK (course_code ~ 'MATH[0-4]\d\d\d'),
    credit NUMERIC(2, 1) NOT NULL CHECK (
        credit >= 0
        AND credit <= 1
    ),
    additional VARCHAR(500) NOT NULL,
    description VARCHAR(500) NOT NULL
);

-- The course_record details the course offering at a specific point of time
-- 'cname' is the name of the customer.
-- 'lid' is the location id of the customer.
CREATE TABLE COURSE_RECORD(
    sem CHAR NOT NULL CHECK (sem ~ '[SFW]'),
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <2050),
    type VARCHAR NOT NULL,
    crn INTEGER NOT NULL,
    prof_id INTEGER REFERENCES PROF(prof_id) ON DELETE RESTRICT,
    enrol INTEGER NOT NULL,
    source DATE NOT NULL,
    course_id INTEGER REFERENCES COURSE(course_id) ON DELETE RESTRICT,
    epoch INTEGER NOT NULL,
    PRIMARY KEY (crn, course_id)
);