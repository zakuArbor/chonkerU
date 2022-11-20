import React, { useEffect, useState } from "react";
import { ProgressBar, InlineNotification, AccordionItem } from "@carbon/react";
import CourseLineGraph from "./CourseStudentLineGraph";
import CourseProfBarGraph from "./CourseProfBarGraph";
import { group_sem } from "../utility";

const getProfBarData = (profs) => {
  let data = [];
  for (let i = 0; i < profs.length; i++) {
    data.push({
      'group': profs[i].prof,
      'prof': profs[i].prof,
      'value': profs[i].count,
    });
  }

  return data;
};

const getStudentLineData = (courses, isYearCredit) => {
  let data = []
  let sem = {};
  for (let i = 0; i < courses.length; i++) {
    let key = courses[i].year + "-" + courses[i].sem;
    if (!(key in sem)) {
      sem[key] = 0;
    }
    sem[key] += parseInt(courses[i].enrol);
  }

  for (const key in sem) {
    data.push({
      "group": isYearCredit ? group_sem(key): 'main',
      "key": key,
      "value": sem[key],
    });
  }
  console.log(data);
  return data;
}

const profBarOption = {
  "title": "# of Times Taught",
  "axes": {
    "left": {
      "mapsTo": "value",
      "title": "# of Semesters"
    },
    "bottom": {
      "title": "Professor",
      "mapsTo": "prof",
      "scaleType": "labels"
    }
  },
  "height": "600px"
}

const studentLineOption = {
	"title": "# of Students Enrolled in the Course",
	"axes": {
		"bottom": {
			"title": "Semester-Year",
			"mapsTo": "key",
			"scaleType": "labels"
		},
		"left": {
			"mapsTo": "value",
			"title": "#of Students",
			"scaleType": "linear"
		}
	},
  "height": "400px",
  "points": {
    "radius": 5,
  },
  "legend": {
    "enabled": false,
  }
};

const CourseGraphs = ({ data: { history, profs, isLoaded }, isYearCredit}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profBarData, setProfBarData] = useState({});
  const [studentLineData, setStudentLineData] = useState({});

  useEffect(() => {
    console.log('CoursePageGraphs: useEffect fired');
    if (isLoaded) {
      console.log(profs);
      setProfBarData({ isLoaded: true, data: getProfBarData(profs) });
      setStudentLineData({ isLoaded: true, data: getStudentLineData(history, isYearCredit) });
      setLoading(false);
    }
  }, []);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter graphs">
      <div>
        <div className="bx--col-lg-16">
          {loading ? (
            <>
              <ProgressBar label="Generating Charts" />
            </>
          ) : error ? (
            <>
              <InlineNotification
                title="Error"
                subtitle="Failed to retrieve Data"
                hideCloseButton={true}
              />
            </>
          ) : (
            <div className="graphs">
              <AccordionItem title = "Figure 1: Number of Times Each Professor Taught the Course" open>
              <CourseProfBarGraph
                data={profBarData.data}
                options={profBarOption}
              />
              </AccordionItem>
              <AccordionItem title = "Figure 2: Enrollment By Semester" open>
              <CourseLineGraph
                data={studentLineData.data}
                options={studentLineOption}
              />
              </AccordionItem>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseGraphs;
