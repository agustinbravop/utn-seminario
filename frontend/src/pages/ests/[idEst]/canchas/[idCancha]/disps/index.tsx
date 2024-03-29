import { Heading, Text, useToast } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  chakra,
} from "@chakra-ui/react";
import { useParams } from "@/router";
import FormDisp from "./_FormDisp";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import {
  useCrearDisponibilidad,
  useDisponibilidadesByCanchaID,
  useModificarDisponibilidad,
} from "@/utils/api";
import FormEliminarDisp from "./_FormEliminarDisp";
import { Disponibilidad, DisponibilidadForm } from "@/models";
import { decimalAHora, horaADecimal } from "@/utils/dates";
import { CanchaMenu } from "@/components/navigation";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ordenarDias } from "@/utils/dias";

/**
 * Deriva el valor del campo 'minutosReserva' del DisponibilidadForm
 * en base a la horaInicio y horaFin de una Disponibilidad.
 * Esto es necesario porque el back end no tiene 'minutosReserva'.
 */
function calcularMinutosReserva(disp: Disponibilidad) {
  const diff = horaADecimal(disp.horaFin) - horaADecimal(disp.horaInicio);
  return diff * 60;
}

export default function CanchaInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");
  const { data: disponibilidades, isLoading } = useDisponibilidadesByCanchaID(
    Number(idEst),
    Number(idCancha)
  );

  const columnHelper = createColumnHelper<Disponibilidad>();
  //Columnas que se van a poder ordenar
  const columns = [
    columnHelper.accessor("horaInicio", {
      cell: (info) => info.getValue(),
      header: "Inicio",
    }),
    columnHelper.accessor("horaFin", {
      cell: (info) => info.getValue(),
      header: "Fin",
    }),
    columnHelper.accessor("disciplina", {
      cell: (info) => info.getValue(),
      header: "Disciplina",
    }),
    columnHelper.accessor("precioReserva", {
      cell: (info) => "$" + info.getValue(),
      header: "Precio",
    }),
    columnHelper.accessor("precioSenia", {
      cell: (info) => (info.getValue() ? "$" + info.getValue() : "-"),
      header: "Seña",
    }),
    columnHelper.accessor("dias", {
      cell: (info) => ordenarDias(info.getValue()).join(", "),
      header: "Días",
    }),
  ];

  //Para la tabla ordenada
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns: columns,
    data: disponibilidades.sort(
      (a, b) => horaADecimal(a.horaInicio) - horaADecimal(b.horaInicio)
    ),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const toast = useToast();

  const { mutate: mutateCrear, isLoading: crearLoading } =
    useCrearDisponibilidad({
      onSuccess: (_, form) => {
        if (!toast.isActive("idSuccess")) {
          toast({
            id: "idSuccess",
            title: `Disponibilidades de ${form.horaInicio} a ${form.horaFin} creadas.`,
            description: "Cada disponibilidad es una reserva posible.",
            status: "success",
          });
        }
      },
      onError: (e, vars) => {
        if (!toast.isActive("idError")) {
          toast({
            id: "idError",
            title: e.conflictMsg(
              `Error al crear disponibilidades de ${vars.horaInicio} a ${vars.horaFin}.`
            ),
            description: "Intente de nuevo.",
            status: "error",
          });
        }
      },
    });

  const { mutate: mutateModificar, isLoading: modificarLoading } =
    useModificarDisponibilidad({
      onSuccess: () => {
        toast({
          title: "Disponibilidad modificada.",
          description: "El cambio se guardó exitosamente.",
          status: "success",
        });
      },
      onError: (e) => {
        toast({
          title: e.conflictMsg("Error al modificar la disponibilidad."),
          description: "Intente de nuevo.",
          status: "error",
        });
      },
    });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCrearDisponibilidad = (disp: DisponibilidadForm) => {
    const fin = horaADecimal(disp.horaFin);
    const horasReserva = disp.minutosReserva / 60;
    const inicio = horaADecimal(disp.horaInicio);

    let dispInicio = inicio;
    while (dispInicio + horasReserva <= fin) {
      mutateCrear({
        ...disp,
        horaInicio: decimalAHora(dispInicio),
        horaFin: decimalAHora(dispInicio + horasReserva),
        idEst: Number(idEst),
        idCancha: Number(idCancha),
      });
      dispInicio += horasReserva;
    }
  };

  return (
    <>
      <CanchaMenu />
      <Heading size="md">Disponibilidades de la cancha</Heading>
      <Text>
        Las disponibilidades determinan los horarios en los que se pueden hacer
        reservas y el precio de una reserva. Las reservas que los clientes del
        establecimiento realizen ocuparán una disponibilidad en la fecha
        reservada.
      </Text>
      <FormDisp
        variant="crear"
        onSubmit={handleCrearDisponibilidad}
        resetValues={{ idCancha: Number(idCancha) }}
        isLoading={crearLoading}
      />
      <TableContainer pt="15px" pb="20px" mr="100px">
        <Table size="sm">
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
                <Th>Acciones</Th>
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
                <Td display="flex" gap="10px" p="0.2em">
                  <FormDisp
                    variant="modificar"
                    onSubmit={(disp) =>
                      mutateModificar({
                        ...disp,
                        idEst: Number(idEst),
                        id: row.original.id,
                      })
                    }
                    resetValues={{
                      ...row.original,
                      minutosReserva: calcularMinutosReserva(row.original),
                    }}
                    isLoading={modificarLoading}
                  />
                  <FormEliminarDisp idDisp={row.original.id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
