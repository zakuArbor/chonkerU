import React from "react";
import "@carbon/charts/styles.css";
import { SimpleBarChart } from "@carbon/charts-react";


const Test = () => {
  const state = {
    data: [
      {
        group: "Qty",
        value: 65000,
      },
      {
        group: "More",
        value: 29123,
      },
      {
        group: "Sold",
        value: 35213,
      },
      {
        group: "Restocking",
        value: 51213,
      },
      {
        group: "Misc",
        value: 16932,
      },
    ],
    options: {
      title: "Vertical simple bar (discrete)",
      axes: {
        left: {
          mapsTo: "value",
        },
        bottom: {
          mapsTo: "group",
          scaleType: "labels",
        },
      },
      height: "400px",
    },
  };

  return (
    <SimpleBarChart
      data={state.data}
      options={state.options}
    ></SimpleBarChart>
  );
};

export default Test;
