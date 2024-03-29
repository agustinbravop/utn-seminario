import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableContainer,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import FormReservarDisponibilidad from "@/pages/search/est/[idEst]/canchas/[idCancha]/_formReservar";
import { BuscarDisponibilidadResult } from "@/utils/api";
import { ordenarDias } from "@/utils/dias";
import { DIAS_ABBR } from "@/utils/constants";

export type TablaDisponibilidadesReservablesProps = {
  data: BuscarDisponibilidadResult[];
};

// Función para filtrar tabla
const columnHelper = createColumnHelper<BuscarDisponibilidadResult>();

// Columnas que se van a poder ordenar
const columns = [
  columnHelper.accessor("horaInicio", {
    cell: (info) => info.getValue(),
    header: "Inicio",
  }),
  columnHelper.accessor("horaFin", {
    cell: (info) => info.getValue(),
    header: "Fin",
  }),
  columnHelper.accessor("dias", {
    cell: (info) =>
      ordenarDias(info.getValue())
        .map((dia) => DIAS_ABBR[dia])
        .join(", "),
    header: "Días",
  }),
  columnHelper.accessor("disciplina", {
    cell: (info) => info.getValue(),
    header: "Disciplina",
  }),
  columnHelper.accessor("cancha.nombre", {
    cell: (info) => info.getValue(),
    header: "Cancha",
  }),
  columnHelper.accessor("precioReserva", {
    cell: (info) => "$" + info.getValue(),
    header: "Precio",
  }),
  columnHelper.accessor("precioSenia", {
    cell: (info) => (info.getValue() ? "$" + info.getValue() : "Sin seña"),
    header: "Seña",
  }),
];

export default function TablaDisponibilidadesReservables({
  data,
}: TablaDisponibilidadesReservablesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <TableContainer pt="15px" pb="20px" mx="auto" maxW="1000px">
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

                    <chakra.span pl="1">
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
            <Tr key={row.original.id}>
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
    </TableContainer>
  );
}
