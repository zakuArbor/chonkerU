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
import { semester_sort } from "../utility";
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
  rows.map((row) => ({
    ...row,
    key: row.crn + row.sem,
    id: row.crn + row.sem,
    prof: (
      <Link to={"/prof/" + MD5(row.prof).toString()} state={{ code: row.code }}>
        {row.prof}
      </Link>
    ),
    enrollment: row.enrol,
    semester: row.sem,
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
    fetch("course/" + code + ".json", {
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
        res.history = res.history.sort(semester_sort);
        setData({ isLoaded: true, ...res });
        setTotalItems(res["history"].length);
        setRows(getRowItems(res["history"]).sort(semester_sort).reverse()); //want to display latest semester first when displaying in a table
        setError(false);
        //setProfBarData({ isLoaded: true, data: getProfBarData(res.profs) });
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
          {code} - {"info" in data ? data.info.name : "TBD"} - [
          {"info" in data ? data.info.credit : "?"} Credits]{" "}
        </h1>
      </div>
      <div className="bx--row course-page__r2">
        <h4 className="source">
          <span>Latest Source:</span>{" "}
          {new Date(data.latest * 1000).toDateString()}
        </h4>
        <br />
        <h4 className="avg">
          <span>Average:</span> {Math.ceil(data.enrol_avg)} Students Per
          Semester
        </h4>{" "}
        <br />
      </div>
      <Accordion align={'start'}>
        <AccordionItem title={"Description"} open>
        <p className="desc">
          {"info" in data ? data.info.desc : "No Description Available"}
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
                <CourseGraphs data={data} />
                
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
