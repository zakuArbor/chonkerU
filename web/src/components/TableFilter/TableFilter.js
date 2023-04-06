import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
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

const TableFilter = ({ rows, headers, title, desc, onInputChange }) => {
  const navigate = useNavigate();
  const getRowLink = (id) => {
    let row = rows.find((item) => item.id == id);
    if (row === undefined || !("link" in row)) {
      return "";
    }
    console.log(row.link);
    return row.link;
  };

  return (
    <DataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
      }) => (
        <TableContainer title={title} description={desc}>
          <TableToolbar>
            <TableToolbarContent>
              {/* pass in `onInputChange` change here to make filtering work */}
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
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  {...getRowProps({ row })}
                  onClick={() => navigate(getRowLink(row.id))}
                >
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default TableFilter;
