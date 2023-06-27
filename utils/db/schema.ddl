DROP SCHEMA IF EXISTS CHONKERU CASCADE;

CREATE SCHEMA CHONKERU;
SET search_path TO CHONKERU;

DROP TABLE IF EXISTS Prof CASCADE;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Teaching;

CREATE TYPE credit_t AS ENUM ('0.0', '0.25', '0.5', '1.0');

CREATE TABLE Prof (
  prof_id SERIAL PRIMARY KEY,
  prof_name VARCHAR(50) NOT NULL,
  prof_hash VARCHAR(32) NOT NULL
);

CREATE TABLE Course (
  course_id SERIAL PRIMARY KEY,
  course_code CHAR(8) NOT NULL CHECK (course_code ~ '^[A-Za-z]{4}[A-Za-z]{4}$'),
  course_name VARCHAR(100) NOT NULL,
  course_desc VARCHAR(500) NOT NULL,
  course_credit credit_t NOT NULL
);

CREATE TABLE Teaching (
  teaching_id SERIAL PRIMARY KEY,
  prof_id INT NOT NULL,
  course_id INT NOT NULL,
  teaching_date DATE NOT NULL,
  term CHAR(1) NOT NULL CHECK (term IN ('w', 'f', 's')),
  crn INTEGER NOT NULL,
  enrollment INT NOT NULL,
  type VARCHAR(10),
  FOREIGN KEY (prof_id) REFERENCES Prof (prof_id),
  FOREIGN KEY (course_id) REFERENCES Course (course_id)
);

