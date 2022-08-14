import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DataTableSkeleton,
  SkeletonText,
  Pagination,
  InlineNotification,
  Accordion,
  AccordionItem,
  AccordionSkeleton,
} from "@carbon/react";
import { semester_sort } from "../utility";

const ProgPage = () => {
  const { prog } = useParams();
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);
  const [graphData, setGraphData] = useState({ isLoaded: false });
  const [progData, setProgData] = useState({ isLoaded: false });

  const getData = (prog) => {
    fetch("prog/" + prog + ".json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setProgData({isLoaded: true, data: res})
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };
  useEffect(() => {
    console.log("progPage: useEffect fired");
    getData(prog);
  }, [prog]);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter course-page">
      {progData.isLoaded ? (
        <>
          <div className="bx--row repo-page__r1">
            <h1 className="prog_heading">{progData.data.program_name} ({progData.data.credits.toFixed(1)} Credits)</h1>
          </div>
          <div className="bx--row course-page__r2">
            <h4><span className="label">Credits Included in the Major:</span> {progData.data.included.credits.toFixed(1)}</h4>
            <h4><span className="label">Credits NOT Included in the Major:</span> {progData.data['not-included'].credits.toFixed(1)}</h4>
            <h4><span className="label">Credits NOT Included in the Major:</span> <a href = "https://calendar.carleton.ca/undergrad/undergradprograms/mathematicsandstatistics/" alt = "link to math academic calendar">https://calendar.carleton.ca/undergrad/undergradprograms/mathematicsandstatistics/</a></h4>
          </div>
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
        <SkeletonText />
      )}
      <Accordion>
        {!progData.isLoaded ? (
          <AccordionSkeleton/>
        ) : error ? (
          <>
            <InlineNotification
              title="Error"
              subtitle="Failed to retrieve Data"
              hideCloseButton={true}
            />
          </>
        ) : (
          <div className="requirements">
            <AccordionItem title={"Program Requirements"} open>
              <Accordion>
                {
                progData.data.included.items.forEach((item, index) => {
                  console.log(item);
                  return <AccordionItem title={(index + 1) + ". " + item.credits.toFixed(1) + " credits in:" } open>
                    <p>Lorem Ipsum</p>
                    </AccordionItem>
                })
                }
              </Accordion>
            </AccordionItem>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default ProgPage;
