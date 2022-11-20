import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DataTableSkeleton,
  Pagination,
  InlineNotification,
} from "@carbon/react";
import CoursesTable from "./CoursesTable";

const LinkList = ({ url, homepageUrl }) => (
  <ul style={{ display: "flex" }}>
    <li>
      <Link href={url}>GitHub</Link>
    </li>
    {homepageUrl && (
      <li>
        <span>&nbsp;|&nbsp;</span>
        <Link href={homepageUrl}>Homepage</Link>
      </li>
    )}
  </ul>
);
const getRowItems = (rows) =>
  rows.map((row) => ({
    ...row,
    key: row.code,
    id: row.code,
    course_code: (
      <Link to={"/course/" + row.code} state={{ code: row.code }}>
        {row.code}
      </Link>
    ),
    course_name: row.name,
    course_desc: row.desc,
  }));

const headers = [
  {
    key: "course_code",
    header: "Course Code",
  },
  {
    key: "course_name",
    header: "Course Name",
  },
];

const CoursesPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);

  const getData = () => {
    fetch("math_courses.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        //console.log(res);
        setLoading(false);
        setTotalItems(res["total"]);
        setRows(getRowItems(res["courses"]));
      })
      .catch((err) => {
        setError(true);
      });
  };
  useEffect(() => {
    console.log("CoursesPage useEffect fired");
    getData();
  }, []);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
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
              <CoursesTable
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
