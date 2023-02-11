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
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
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
                  level={index % 2 == 1 ? 2 : 2}
                >
                    {"courses" in item ? (
                      <div>
                      <ExpandableTile id={"exp-tile-" + index + "-" + included} className="tile" expanded={true} tileCollapsedIconText="Interact to Expand tile"
                      tileExpandedIconText="Interact to Collapse tile">
                        <TileAboveTheFoldContent>
                          <b className="req-label">
                            {"<" +
                              (index + 1) +
                              "> " +
                              item.credits.toFixed(1) +
                              " credits in:"}
                          </b>
                        </TileAboveTheFoldContent>
                        <TileBelowTheFoldContent>
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
                        </TileBelowTheFoldContent>
                      </ExpandableTile></div>
                    ) : (
                      <Tile className={"tile"}>
                      <b className="req-label">
                        {"<" +
                          (index + 1) +
                          "> " +
                          item.credits.toFixed(1) +
                          " credits from/in " +
                          item.req}
                      </b>
                      </Tile>
                    )}
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
