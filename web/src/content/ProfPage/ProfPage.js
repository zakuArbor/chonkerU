import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DataTableSkeleton,
  SkeletonText,
  Pagination,
  InlineNotification,
  Accordion,
  AccordionItem
} from "@carbon/react";
import ProfTable from "./ProfTable";
import ProfGraphs from "./ProfPageGraphs";
import { semester_sort2 as semester_sort } from "../utility";
import Test from "./Test";

const headers = [
  {
    key: "course_name",
    header: "Course Name",
  },
  {
    key: "enrollment",
    header: "Enrollment",
  },
  {
    key: "semester",
    header: "Semester",
  },
  {
    key: "year",
    header: "Year",
  },
  {
    key: "type",
    header: "Type",
  },
];

const parseData = (data) => {
  let obj = { rows: [], courses: {} };
  for (const course in data.courses) {
    console.log(data.courses[course].history);
    const rows = getRowItems(
      data.courses[course].history,
      data.courses[course].name
    );
    console.log(rows);
    obj.rows = obj.rows.concat(rows);
    obj.courses[course] = rows.length;
  }
  return obj;
};

const getRowItems = (rows) =>
  rows.map((row, index) => ({
    ...row,
    key: row.course, 
    id: row.course,
    course_name: <Link to={"/course/" + row.course}>{row.course}</Link>,
    enrollment: row.enrol,
    semester: row.sem.toUpperCase() == 'F' ? "Fall" : row.sem.toUpperCase() == 'W' ? 'Winter' : '?',
    year: row.year,
    type: row.type,
  }));

const ProfPage = () => {
  const { prof } = useParams();
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);
  const [data, setData] = useState({ isLoaded: false });
  const [profData, setProfData] = useState({ isLoaded: false });

  const getData = (prof) => {
        fetch("prof/" + prof + ".json", {
//    fetch("http://68.233.123.145/api/prof/" + prof, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status != 200) {
          setError(true);
          setLoading(false);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        //const data = parseData(res);
        setRows(getRowItems(res.history));
        setTotalItems(res.history.length);
        setError(false);
        setProfData({ isLoaded: true, latest: res.latest, name: res.prof });
        setData({ isLoaded: true, data: res.history});
        //setGraphData({ isLoaded: true, bar: data.courses, scatter: res.stats });
        setLoading(false);
      });
  };
  useEffect(() => {
    getData(prof);
  }, [prof]);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter course-page">
      {profData.isLoaded ? (
        <>
          <div className="bx--row repo-page__r1">
            <h1 className="course_heading">{profData.name}</h1>
          </div>
          <div className="bx--row course-page__r2">
            <h4 className="source">
              <span>Latest Source:</span>{" "}
              {new Date(profData.latest * 1000).toDateString()}
            </h4>
            <br />
            <h4 className="website">
              <span>Website:</span> Not Implemented
            </h4>
            <br />
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
        {loading ? (
          <DataTableSkeleton
            columnCount={headers.length + 1}
            rowCount={10}
            headers={headers}
          />
        ) : error ? (
          <>
            <InlineNotification
              title="Error"
              subtitle="Failed to retrieve Data"
              hideCloseButton={true}
            />
          </>
        ) : (
          <div className="course">
            {<ProfGraphs data={data} />}
            {console.log(rows)}

            <AccordionItem title={"Data Table"} open>
              <ProfTable
                headers={headers}
                rows={rows.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
              />
              <Pagination
                totalItems={totalItems}
                backwardText="Previous page"
                forwardText="Next page"
                pageSize={currentPageSize}
                pageSizes={[10, 15, 25, 50, 100]}
                itemsPerPageText="Items per page"
                onChange={({ page, pageSize }) => {
                  if (pageSize !== currentPageSize) {
                    setCurrentPageSize(pageSize);
                  }
                  setFirstRowIndex(pageSize * (page - 1));
                }}
              />
            </AccordionItem>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default ProfPage;
