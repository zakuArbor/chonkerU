import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTableSkeleton, Pagination, InlineNotification } from "@carbon/react";
import TableComp from "../../components/Table";
import MD5 from "crypto-js/md5";

const getRowItems = (rows) =>
  rows.map((row) => {
    const hash = MD5(row.prof).toString();
    return {
      ...row,
      key: hash,
      id: hash,
      prof: (
        <Link to={"/prof/" + hash} state={{ code: row.prof }}>
          {row.prof}
        </Link>
      ),
      num: row.num,
      link: "/prof/" + hash,
    };
  });

const headers = [
  {
    key: "prof",
    header: "Professor",
  },
  {
    key: "num",
    header: "# of Courses Collected",
  },
];

const ProfsPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(false);

  const getData = () => {
    fetch("profs.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200) {
          setError(true);
          setLoading(false);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setTotalItems(res["total"]);
        setRows(getRowItems(res["prof"]));
      });
  };
  useEffect(() => {
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
                title={"List of Professors"}
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

export default ProfsPage;