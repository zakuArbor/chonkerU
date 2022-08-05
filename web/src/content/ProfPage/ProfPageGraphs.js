import React, { useEffect, useState } from "react";
import { ProgressBar, InlineNotification, AccordionItem } from "@carbon/react";
import ProfLineGraph from "./ProfStudentLineGraph";
import ProfCourseBarGraph from "./ProfCourseBarGraph";
import { semester_sort } from "../utility";

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

const getBarData = (dataObj) => {
  const courses = Object.keys(dataObj).sort();
  let data = [];
  for (let i = 0; i < courses.length; i++) {
    data.push({
      group: courses[i],
      value: dataObj[courses[i]],
    });
  }
  return data;
};

const getLineData = (dataObj) => {
  let data = [];
  let semesters = Object.keys(dataObj).sort(semester_sort);
  for (let i = 0; i < semesters.length; i++) {
    data.push({
      sem: semesters[i],
      value: dataObj[semesters[i]],
    });
  }
  console.log(data);
  return data;
};

const barOption = {
  title: "# of Times Taught",
  axes: {
    left: {
      mapsTo: "value",
      title: "# of Times",
    },
    bottom: {
      title: "Course",
      mapsTo: "group",
      scaleType: "labels",
    },
  },
  height: "600px",
};

const lineOption = {
  title: "# of Students Enrolled in Each Semester",
  axes: {
    bottom: {
      title: "Semester-Year",
      mapsTo: "sem",
      scaleType: "labels",
    },
    left: {
      mapsTo: "value",
      title: "#of Students",
      scaleType: "linear",
    },
  },
  height: "400px",
  points: {
    radius: 5,
  },
  legend: {
    enabled: false,
  },
};

const ProfGraphs = ({ data: { bar, scatter, isLoaded } }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [barData, setBarData] = useState({});
  const [lineData, setLineData] = useState({});

  useEffect(() => {
    if (isLoaded) {
      setBarData({ isLoaded: true, data: getBarData(bar) });
      setLineData({ isLoaded: true, data: getLineData(scatter) });
      setLoading(false);
    }
  }, [bar, scatter, isLoaded]);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter graphs">
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
          <AccordionItem title="Figure 1: Number of Times Taught Each Course" open>
          <ProfCourseBarGraph data={barData.data} options={barOption} />
          </AccordionItem>
          <AccordionItem title="Figure 2: Number of Students Taught In Each Semester" open>
          <ProfLineGraph data={lineData.data} options={lineOption} />
          </AccordionItem>
        </div>
      )}
    </div>
  );
};

export default ProfGraphs;
