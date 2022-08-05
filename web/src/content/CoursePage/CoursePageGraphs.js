import React, { useEffect, useState } from "react";
import { ProgressBar, InlineNotification, AccordionItem } from "@carbon/react";
import CourseLineGraph from "./CourseStudentLineGraph";
import CourseProfBarGraph from "./CourseProfBarGraph";

const getEmptyData = (length) => {
  return {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ].slice(0, length),
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ].slice(0, length),
        pointHitRadius: 20,
        pointHoverRadius: 10,
      },
    ],
    labels: [],
  };
};

const getProfBarData = (profs) => {
  /*chartJS Code
  let data = getEmptyData(profs.length);
  for (let i = 0; i < profs.length; i++) {
    data.datasets[0].data.push(profs[i].count);
    data.labels.push(profs[i]["prof"]);
  }*/
  let data = [];
  for (let i = 0; i < profs.length; i++) {
    data.push({
      'group': profs[i].prof,
      'value': profs[i].count,
    });
  }

  return data;
};
/*
const getStudentLineData = (courses) => {
  let data = getEmptyData(courses.length);
  let sem = {};
  for (let i = 0; i < courses.length; i++) {
    let key = courses[i].year + "-" + courses[i].sem;
    if (!(key in sem)) {
      sem[key] = 0;
    }
    sem[key] += parseInt(courses[i].enrol);
  }
  console.log("test");
  console.log(sem);

  for (const key in sem) {
    data.datasets[0].data.push(sem[key]);
    data.labels.push(key);
  }
  console.log(data);
  return data;
};*/
const getStudentLineData = (courses) => {
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
      "group": "main",
      "key": key,
      "value": sem[key],
    });
  }
  console.log(data);
  return data;
}

/*const profBarOption = {
  plugins: {
    title: {
      display: true,
      text: "Number of Times A Prof Taught the Course",
    },
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  },
  maintainAspectRatio: false, //to resize using width or height
};*/

const profBarOption = {
  "title": "# of Times Taught",
  "axes": {
    "left": {
      "mapsTo": "value",
      "title": "# of Semesters"
    },
    "bottom": {
      "title": "Professor",
      "mapsTo": "group",
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

/*
const StudentLineOption = {
  plugins: {
    title: {
      display: true,
      text: "Number of Students Enrolled in the course",
    },
    subtitle: {
      display: true,
      text: "Average Number: ",
    },
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false, //to resize using width or height
};*/

const CourseGraphs = ({ data: { history, profs, isLoaded } }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profBarData, setProfBarData] = useState({});
  const [studentLineData, setStudentLineData] = useState({});

  useEffect(() => {
    console.log(profs);
    console.log(isLoaded);
    if (isLoaded) {
      console.log(profs);
      setProfBarData({ isLoaded: true, data: getProfBarData(profs) });
      setStudentLineData({ isLoaded: true, data: getStudentLineData(history) });
      setLoading(false);
    }
  }, [profs, history, isLoaded]);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter graphs">
      <div className="bx--row graphs-page__r1">
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
