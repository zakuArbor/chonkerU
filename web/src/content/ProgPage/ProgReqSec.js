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
  ExpandableTile,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Tile,
  Layer,
} from "@carbon/react";

const ProgReqSec = ({ data, included }) => {
  const [isLoaded, setLoading] = useState(false);
  useEffect(() => {
    console.log("ProgReqSec: useEffect fired");
    if (typeof data !== "undefined") {
      setLoading(true);
      console.log(data);
    }
  }, [data]);

  return (
    <>
      {isLoaded ? (
        <AccordionItem
          title={
            "Credits " +
            (included ? "" : "Not ") +
            "Included in the Major CGPA (" +
            data.credits +
            ")"
          }
          key={data.credits + "-" + included}
          open
        >
          <Layer className={"req-layer"} key={included}>
            {data.items.map((item, index) => {
              return (
                <Layer
                  key={"req-layer-" + index + "-" + included}
                  as="section"
                  level={index % 2 == 0 ? 0 : 0}
                >
                  <ExpandableTile key={"req-tile-" + index} className="req-box">
                    {"courses" in item ? (
                      <>
                        <b className="req-label">
                          {"<" +
                            (index + 1) +
                            "> " +
                            item.credits.toFixed(1) +
                            " credits in:"}
                        </b>
                        <Table
                          size="lg"
                          useZebraStyles={true}
                          useStaticWidth={true}
                          className="req-table"
                          key={"data-table-" + included}
                        >
                          <TableBody key={"tbody-" + included}>
                            {item.courses.map((row, index) => (
                              <TableRow key={index}>
                                {
                                  <>
                                    <TableCell
                                      key={"course_code"}
                                      className="td-code"
                                    >
                                      <Link to={"/course/" + row.course_code}>
                                        {row["course_code"] +
                                          " [" +
                                          ("credit" in row
                                            ? row["credit"].toFixed(1)
                                            : "0.5") +
                                          "]"}
                                      </Link>
                                    </TableCell>
                                    <TableCell
                                      key={"course_name"}
                                      className="td-name"
                                    >
                                      {row["course_name"]}
                                    </TableCell>
                                  </>
                                }
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    ) : (
                      <b className="req-label">
                        {"<" +
                          (index + 1) +
                          "> " +
                          item.credits.toFixed(1) +
                          " credits from/in " +
                          item.req}
                      </b>
                    )}
                  </ExpandableTile>
                </Layer>
              );
            })}
          </Layer>
        </AccordionItem>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProgReqSec;
