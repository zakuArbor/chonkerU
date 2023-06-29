DROP SCHEMA IF EXISTS CHONKERU CASCADE;

CREATE SCHEMA CHONKERU;
SET SEARCH PATH chonkeru;

DROP TABLE IF EXISTS Prof CASCADE;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Teaching;

CREATE TYPE credit_t AS ENUM ('0.0', '0.25', '0.5', '1.0');

CREATE TABLE profs (
  prof_id SERIAL PRIMARY KEY,
  prof_name VARCHAR(50) NOT NULL,
  prof_hash VARCHAR(32) NOT NULL
);

CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_code CHAR(8) NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  course_desc VARCHAR(500) NOT NULL,
  course_credit credit_t NOT NULL,
  additional VARCHAR(500) NOT NULL
);

CREATE TABLE course_records (
  record_id SERIAL PRIMARY KEY,
  prof_id INT NOT NULL,
  course_id INT NOT NULL,
  term CHAR(1) NOT NULL CHECK (term IN ('W', 'F', 'S')),
  crn INTEGER NOT NULL,
  enrollment INT NOT NULL,
  type VARCHAR(20),
  FOREIGN KEY (prof_id) REFERENCES Prof (prof_id),
  FOREIGN KEY (course_id) REFERENCES Course (course_id)
);

ALTER TABLE chonkeru.courses ADD CONSTRAINT courses_un UNIQUE (course_code);
ALTER TABLE chonkeru.course_records ADD CONSTRAINT course_records_un UNIQUE (course_id, crn, term, enrollment);

