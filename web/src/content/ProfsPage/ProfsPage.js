import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTableSkeleton, Pagination, InlineNotification } from "@carbon/react";
import TableFilter from "../../components/TableFilter";
import MD5 from "crypto-js/md5";

const getRowItems = (rows) =>
  rows.map((row) => {
    const hash = MD5(row.name).toString();
    return {
      ...row,
      key: hash,
      id: hash,
      prof: (
        <Link to={"/prof/" + hash} state={{ code: row.name}}>
          {row.name}
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
  const [filter, setFilter] = useState(() => {});

  const filterProf = (rows_unfiltered, rowsObj, query) => {
    console.log(query.target.value)
    console.log("pika on filter prof");
    console.log(rows_unfiltered);
    let keyword = query.target.value.toLowerCase();
    let results = [];
    if (keyword.length > 0) {
      results = rows_unfiltered.filter(function(obj) {
        return obj['name'].toLowerCase().includes(keyword);
      });
    }
    else {
      results = [...rows_unfiltered];
    }
    rowsObj.setRows(results);
    rowsObj.setTotalItems(results.length);
  }

  const getData = (query) => {
    fetch("profs.json", {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => {
        if (res.status != 200) {
          setError(true);
          setLoading(false);
        }
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setTotalItems(res["profs"].length);
        setRows(getRowItems(res["profs"]));
        setFilter(()=>(query) => {filterProf(getRowItems(res['profs']), {'setRows': setRows, 'setTotalItems': setTotalItems, 'rows': rows}, query)});
      });
  };
  useEffect(() => {
    getData('');
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
              <TableFilter
                headers={headers}
                rows={rows.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
                title={"List of Professors"}
                desc={""}
                onInputChange={filter}
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
