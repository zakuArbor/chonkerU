import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DataTableSkeleton,
  Pagination,
  InlineNotification,
  Accordion,
  AccordionItem,
} from "@carbon/react";
import CourseTable from "./CourseTable";
import CourseGraphs from "./CoursePageGraphs";
import { semester_sort2 as semester_sort, get_sem } from "../utility";
import MD5 from "crypto-js/md5";
import Test from "./Test";

const headers = [
  {
    key: "prof",
    header: "Professor",
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

const getRowItems = (rows) =>
  rows.map((row, index) => ({
    ...row,
    key: index,
    id: index,
    prof: (
      <Link to={"/prof/" + MD5(row.prof).toString()} state={{ code: row.prof}}>
        {row.prof}
      </Link>
    ),
    enrollment: row.enrol,
    semester: row.sem.toUpperCase() == 'F' ? 'Fall' : row.sem.toUpperCase() == 'W' ? 'Winter' : '?',
    year: row.year,
    type: row.type,
  }));

const CoursePage = () => {
  const { code } = useParams();
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);
  const [data, setData] = useState({ isLoaded: false });

  const getData = (code) => {
    //    fetch("course/" + code + ".json", {
    fetch("course/" + code + ".json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        setLoading(true);
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        console.log("CoursePage: useEffect fired");
        res['latest'] = res.history[0].source_date;
        console.log(res);
        setTotalItems(res.history.length);
        setData({ isLoaded: true, ...res });
        console.log(res.history)
        setRows(getRowItems(res.history)); //want to display latest semester first when displaying in a table
        setError(false);
        //setProfBarData({ isLoaded: true, data: getProfBarData(res.profs) });
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };
  useEffect(() => {
    const path = window.location.pathname;
    getData(code);
  }, [code]);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter course-page">
      <div className="bx--row repo-page__r1">
        <h1 className="course_heading">
          {code} - {"info" in data ? data.info.course_name : "TBD"} - [
          {"info" in data ? data.info.course_credit : "?"} Credits]{" "}
        </h1>
      </div>
      <div className="bx--row course-page__r2">
        <h4 className="source">
          <span>Latest Source:</span>{" "}
          {data.latest}
        </h4>
        <br />
          {data && "sem_avg" in data ? data.sem_avg.map((sem_data) => {
            return <h4 className="avg"><span id = {"avg-" + sem_data._id}>{get_sem(sem_data._id)} Average Enrollment:</span> {Math.round(sem_data.avg)} students</h4>
          }): <>test</>}
        <br />
      </div>
      <Accordion align={"start"}>
        <AccordionItem title={"Description"} open>
          <p className="desc">
            {"info" in data ? data.info.course_desc : "No Description Available"}
          </p>
        </AccordionItem>
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
          <>
            <CourseGraphs
              data={data}
              isYearCredit={
                "info" in data &&
                data.info.course_credit !== undefined &&
                data.info.course_credit[0] !== '0'
                  ? true
                  : false
              }
            />

            <AccordionItem title={"Data Table"} open>
              <CourseTable
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
                pageSizes={[5, 10, 15, 25]}
                itemsPerPageText="Items per page"
                onChange={({ page, pageSize }) => {
                  if (pageSize !== currentPageSize) {
                    setCurrentPageSize(pageSize);
                  }
                  setFirstRowIndex(pageSize * (page - 1));
                }}
              />
            </AccordionItem>
          </>
        )}
      </Accordion>
    </div>
  );
};

export default CoursePage;
