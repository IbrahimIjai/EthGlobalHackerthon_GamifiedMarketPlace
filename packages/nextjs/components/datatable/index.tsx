

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '.table';
  import { useState } from 'react';
  
  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyView?: React.ReactNode;
  }
  
  export function DataTable<TData, TValue>({
    columns,
    data,
    emptyView,
  }: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
  
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onRowSelectionChange: setRowSelection,
      state: {
        rowSelection,
      },
    });
  
    return (
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  // className="cursor-pointer"
                  // onClick={() => row.toggleSelected()}
                  key={row.id}
                  data-state={
                    row.getIsSelected() && 'selected'
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center"
                >
                  {emptyView ? emptyView : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  