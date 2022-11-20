import React, { useState } from 'react';
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
} from '@carbon/react';

const action = (param) => {
  return () => alert(param);
}

const CoursesTable = ({rows, headers}) => {
    const getRowDesc = (code) => {
      let row = rows.find(item => item.code == code);
      if (row === undefined || !('desc' in row)) {
        return "No Description Available";
      }
      return row.desc;
    }
    return (
    <DataTable
      rows={rows}
      headers={headers}
      render={({
        rows,
        headers,
        getHeaderProps,
        getExpandHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        onInputChange
      }) => (
        <TableContainer
          title="Courses"
          description=""
        >
          <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
          <TableToolbarContent>
            <TableToolbarSearch onChange={onInputChange} />
            <TableToolbarMenu>
              <TableToolbarAction onClick={action('Action 1 Click')}>
                Action 1
              </TableToolbarAction>
              <TableToolbarAction onClick={action('Action 2 Click')}>
                Action 2
              </TableToolbarAction>
              <TableToolbarAction onClick={action('Action 3 Click')}>
                Action 3
              </TableToolbarAction>
            </TableToolbarMenu>
            <Button onClick={action('Button click')}>Primary Button</Button>
          </TableToolbarContent>
        </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader enableToggle={true} {...getExpandHeaderProps()}/>
                {headers.map((header) => (
                  //need to override default sorting algorithm because usually backend deals with it but we do everything in front end unfortunately
                  <TableHeader {...getHeaderProps({ header }) } isSortable={true}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow expandHeader="expand" {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow colSpan={headers.length + 1}>
                    <p className={'desc'}>{getRowDesc(row.id)}</p>
                  </TableExpandedRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};


export default CoursesTable;
