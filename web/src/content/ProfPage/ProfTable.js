import React, { useState } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarSearch,
  TableToolbarContent,
  TableToolbarMenu,
  Button,
} from "@carbon/react";

const action = (param) => {
  return () => alert(param);
};

const CourseTable = ({ rows, headers }) => {
  { console.log(rows) }
  return (
    <DataTable
      rows={rows}
      headers={headers}

      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        onInputChange,
        sortBy,
      }) => (
        <TableContainer>
          <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange} />
              <TableToolbarMenu>
                <TableToolbarAction onClick={action("Action 1 Click")}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={action("Action 2 Click")}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={action("Action 3 Click")}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={action("Button click")}>Primary Button</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}> 
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  //need to override default sorting algorithm because usually backend deals with it but we do everything in front end unfortunately
                  <TableHeader
                    {...getHeaderProps({ header })}
                    isSortable={true} 
                  >
                    {header.header}
                    {console.log(sortBy)}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                )
              }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

export default CourseTable;
