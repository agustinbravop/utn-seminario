import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import FormReservarDisponibilidad from "@/pages/jugador/[idJugador]/est/[idEst]/canchas/[idCancha]/_formReservar";
import { BuscarDisponibilidadResult } from "@/utils/api";

export type TablaDisponibilidadesReservablesProps = {
  data: BuscarDisponibilidadResult[];
  columns: ColumnDef<BuscarDisponibilidadResult, any>[];
};

export function TablaDisponibilidadesReservables({
  data,
  columns,
}: TablaDisponibilidadesReservablesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table variant="striped" size="sm">
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id}>
                {cell.id !== "reserva" &&
                  flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
            <Td>
              <FormReservarDisponibilidad disp={row.original} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
