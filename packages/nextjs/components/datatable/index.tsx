import { useRouter } from "next/router";

import {
  Cell,
  Row,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

// import Pagination from "./Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import React, { useState } from "react";
type Anchor = "right";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyView?: React.ReactNode;
  drawerState?: { [key in Anchor]: boolean };
  onClickRow?: (
    cell: Cell<any, unknown>,
    row: Row<any>
  ) => void | ((orderId: string) => void);
  onNavigateToDynamicPage?: (row: Row<any>) => void;
  setDrawerState?: React.Dispatch<
    React.SetStateAction<{ [key in Anchor]: boolean }>
  >;
}

export function DataTable<TData, TValue>({
  //   columns,
  //   data,
  //   emptyView,
  //   drawerState,
  //   onNavigateToDynamicPage,
  //   // openRowDetails,
  //   setDrawerState,

  columns,
  data,
  emptyView,
  drawerState,
  setDrawerState,
  onNavigateToDynamicPage,
  onClickRow,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    debugTable: true,
  });

  const handleRowClick = (row: any) => {
    console.log(row);
    if (setDrawerState) {
      setDrawerState({ right: true });
    } else {
      return;
    }
  };

  const determineRowClickHandler = (row: any) => {
    if (onNavigateToDynamicPage) {
      return onNavigateToDynamicPage(row);
    } else if (onClickRow) {
      return () => onClickRow(row, row);
    } else if (setDrawerState) {
      return handleRowClick(row);
    }
    return null;
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => determineRowClickHandler(row)}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyView ? emptyView : "No Data found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
