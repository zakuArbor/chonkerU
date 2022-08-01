import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "@carbon/charts/styles.css";
import { SimpleBarChart } from "@carbon/charts-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ProfCourseBarGraph = ({ data, options }) => {
  return (
    <SimpleBarChart
      data={data}
      options={options}
    ></SimpleBarChart>
  );
  /*return (
    <>
      {console.log(data)}
      <div className="bar">
        <Bar data={data} options={option}/>
      </div>
    </>
  );*/
};

export default ProfCourseBarGraph;
