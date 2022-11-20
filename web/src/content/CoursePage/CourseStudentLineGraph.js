import React, { useState } from "react";
import "@carbon/charts/styles.css";
import { LineChart } from "@carbon/charts-react";
/*
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);*/

const CourseStudentLineGraph = ({ data, options }) => {
  /*  return (
    <>
      {console.log(data)}
      <div className="line">
        <Line data={data} options={option} />
      </div>
    </>
  );*/
  return <LineChart data={data} options={options} />;
};

export default CourseStudentLineGraph;
