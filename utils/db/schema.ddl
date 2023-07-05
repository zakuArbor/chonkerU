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

CREATE TABLE chonkeru.course_records (
	record_id serial4 NOT NULL,
	prof_id int4 NOT NULL,
	course_id int4 NOT NULL,
	term bpchar(1) NOT NULL,
	crn int4 NOT NULL,
	enrollment int4 NOT NULL,
	"type" varchar(20) NULL,
	source_date date NULL,
	source_term bpchar(1) NULL,
	source_year int4 NULL DEFAULT 2999,
	CONSTRAINT course_records_pkey PRIMARY KEY (record_id),
	CONSTRAINT course_records_term_check CHECK ((term = ANY (ARRAY['W'::bpchar, 'F'::bpchar, 'S'::bpchar]))),
	CONSTRAINT course_records_un UNIQUE (course_id, crn, term, enrollment, source_date),
	CONSTRAINT source_term CHECK ((term = ANY (ARRAY['W'::bpchar, 'F'::bpchar, 'S'::bpchar]))),
	CONSTRAINT course_records_course_id_fkey FOREIGN KEY (course_id) REFERENCES chonkeru.courses(course_id),
	CONSTRAINT course_records_prof_id_fkey FOREIGN KEY (prof_id) REFERENCES chonkeru.profs(prof_id)
);

ALTER TABLE chonkeru.courses ADD CONSTRAINT courses_un UNIQUE (course_code);

