# ChonkerU

### Status: Abandoned

CarletonU data makes no sense at all. After looking at some of the data, it made no sense. Fall term and winter term data are mixed in between causing faulty data reporting.

**Update (Aug 9 2022):** I talked with OIRP and my teacher and confirmed the data isn't accurate. OIRP reached back and here's some highlights
> These tables are not meant to be a statistical record of courses or enrolments
and
> For the labels of fall and winter on the title of the overall table, this indicates when the data was captured, not necessarily that the data is only for the fall or winter terms.  Again, this is as designed for their intended purpose.

Therefore the project will be abandoned as no real statistical data can be gathered from this

### Main Features
* View data from 2018 to 2022 data on course enrolment and the number of times a prof taught the course
* Only Math and Maybe Physics course will be displayed

### Optional Features
A list of features that are not actively worked on and probably won't be worked on (have higher priorities such as studying ...)
* World Clhoropleth map to show where students are from (by province for Canada and countries for international students)
* Room Capacities
* Campus Map (with building floor maps)

**Carbon Design System:**
* https://charts.carbondesignsystem.com/?path=/story/*
* https://react.carbondesignsystem.com/?path=/story/getting-started-welcome--welcome

**Public Data Sources:**
* https://oirp.carleton.ca/university_stats/html/university_stats.htm
* https://oirp.carleton.ca/specialized_reports/html/specialized_reports.htm
* https://oirp.carleton.ca/course-inst/notes/MATH0005A.html
    * course room capacity
* https://calendar.carleton.ca/search/?P=BIT%201000
    * course information and description
## Dependencies
* **html5lib:** `pip3 install html5lib`
* Mojo Dependecies:
	* **Dumpvalue:** `sudo dnf install 'perl(Dumpvalue)'`
	* **ExtUtils::Manifest** `sudo dnf install 'perl(ExtUtils::Manifest)'`
	* **ExtUtils::MakeMaker:** `sudo dnf install 'perl(ExtUtils::MakeMaker)'`
	* `curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n Mojolicious`
