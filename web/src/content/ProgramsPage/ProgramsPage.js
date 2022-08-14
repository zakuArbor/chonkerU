import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DataTableSkeleton,
  Pagination,
  InlineNotification,
} from "@carbon/react";
import TableComp from "../../components/Table";

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
    id: row.id,
    program: (
      <Link to={"/program/" + row.id} state={{ code: row.code }}>
        {row.program}
      </Link>
    ),
    included: row.included_credits,
    discluded: row.discluded_credits,
    link: "/program/" + row.id,
  }));

const headers = [
  {
    key: "program",
    header: "Program",
  },
  {
    key: "included",
    header: "Major Credits",
  },
  {
    key: "discluded",
    header: "Non-major Credits"
  }
];

const ProgramsPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);

  const getData = () => {
    fetch("programs-list.json", {
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
        setTotalItems(res["programs"].length);
        setRows(getRowItems(res["programs"]));
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };
  useEffect(() => {
    console.log("ProgramsPage useEffect fired");
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
              <TableComp
                headers={headers}
                rows={rows.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
                title={"List of Programs"}
                desc={""}
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

export default ProgramsPage;
