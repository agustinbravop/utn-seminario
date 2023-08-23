import React, { useEffect, useState } from "react";
import { Dia, Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CrearCanchaReq, useCrearCancha } from "@/utils/api/canchas";
import {
  CheckboxGroupControl,
  InputControl,
  SelectControl,
  SubmitButton,
} from "@/components/forms";
import { FormProvider, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { GrAddCircle } from "react-icons/gr";
import { useYupForm } from "@/hooks";

type FormState = CrearCanchaReq & {
  imagen: File | undefined;
};
const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  habilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  imagen: Yup.mixed<File>().optional(),
  disponibilidades: Yup.array(
    Yup.object().shape({
      horaInicio: Yup.string().required("Obligatorio"),
      horaFin: Yup.string().required("Obligatorio"),
      minutosReserva: Yup.number()
        .typeError("Debe ingresar un numero")
        .required("Obligatorio"),
      precioReserva: Yup.number()
        .typeError("Debe ingresar un numero")
        .required("Obligatorio"),
      precioSenia: Yup.number().typeError("Debe ingresar un numero").optional(),
      disciplina: Yup.string().required("Obligatorio"),
      dias: Yup.array(Yup.string<Dia>().required())
        .min(1, "Mínimo 1")
        .required("Obligatorio"),
    })
  ).required(),
});

const disciplinas = [
  "Basket",
  "Futbol",
  "Tenis",
  "Padel",
  "Hokey",
  "Ping-Pong",
];

const duracionReserva = [30, 60];

const horas = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const defaultDisponibilidad: Omit<Disponibilidad, "id"> = {
  horaFin: "",
  horaInicio: "",
  dias: [],
  disciplina: "",
  precioReserva: NaN,
  precioSenia: undefined,
  minutosReserva: NaN,
};

export default function NuevaCanchaPage() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [disp, setDisp] = useState(defaultDisponibilidad);

  const handleDispChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("handleDispChange");
    setDisp({ ...disp, [name]: value });
  };

  const methods = useYupForm<FormState>({
    validationSchema,
    defaultValues: {
      nombre: "",
      descripcion: "",
      habilitada: true,
      idEstablecimiento: Number(idEst),
      imagen: undefined,
      disponibilidades: [],
    },
  });

  const {
    fields: disponibilidades,
    append,
    remove,
  } = useFieldArray({
    name: "disponibilidades",
    control: methods.control,
  });

  useEffect(() => {
    console.log(disponibilidades);
    console.log(methods.formState);
    console.log(disp);
  }, [disp, disponibilidades, methods]);

  const { mutate, isLoading } = useCrearCancha({
    onSuccess: () => {
      toast({
        title: "Cancha creada",
        description: `Cancha creada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleAgregarDisponibilidad = () => {
    if (disp.dias.length > 0 && disp.disciplina && disp.horaFin && disp.horaInicio && disp.minutosReserva && disp.precioReserva) {
    append(disp);
    setDisp(defaultDisponibilidad);
    onClose();
  }};

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const handleDeleteDisponibilidad = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Nueva cancha
      </Heading>

      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => {
            mutate({
              ...values,
              disponibilidades: values.disponibilidades.map((d) => ({
                ...d,
                precioSenia: d.precioSenia && Number(d.precioSenia),
                precioReserva: Number(d.precioReserva),
                minutosReserva: Number(d.minutosReserva),
              })),
            });
          })}
          spacing="24px"
          width="800px"
          m="auto"
        >
          <VStack width="400px">
            <InputControl
              name="nombre"
              label="Nombre de la cancha"
              placeholder="Nombre"
              isRequired
            />
            <InputControl
              name="descripcion"
              label="Descripción"
              placeholder="Descripción"
              isRequired
            />
            <FormControl>
              <FormLabel marginTop="10px" marginLeft="10px">
                Imagen
              </FormLabel>
              <Input
                type="file"
                name="imagen"
                onChange={handleImagenChange}
                accept="image/*"
                sx={{
                  "::file-selector-button": {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: "none",
                    border: "none",
                    fontWeight: "bold",
                  },
                }}
              />
            </FormControl>
          </VStack>

          <VStack width="1100px" align="center">
            <VStack marginTop="20px" align="start" width="100%" px="281px">
              <Text fontWeight="bold">Disponibilidades horarias</Text>
              <Text>
                Cada disponibilidad indica a qué hora la cancha estará
                disponible, para qué disciplina, y cuánto cuesta reservarla.
              </Text>
              <VStack>
                <Button leftIcon={<Icon as={GrAddCircle} />} onClick={onOpen}>
                  Agregar disponibilidad
                </Button>
              </VStack>
            </VStack>

            <>
              {disponibilidades.length > 0 && (
                <TableContainer paddingTop="20px" paddingBottom="20px">
                  <Table variant="simple" size="sm">
                    <Thead backgroundColor="lightgray">
                      <Tr>
                        <Th>disciplina</Th>
                        <Th>hora inicio</Th>
                        <Th>hora fin</Th>
                        <Th>reserva (min.)</Th>
                        <Th>p. reserva/seña</Th>
                        <Th> dias </Th>
                        <Th> Eliminar </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {disponibilidades.map((d, index) => (
                        <Tr key={`${d.horaInicio}-${d.horaFin}`}>
                          <Td> {d.disciplina} </Td>
                          <Td> {d.horaInicio} </Td>
                          <Td> {d.horaFin} </Td>
                          <Td> {d.minutosReserva} </Td>
                          <Td>
                            {d.precioReserva}/{d.precioSenia}
                          </Td>
                          <Td>
                            {d.dias.map((dia, idx) => (
                              <React.Fragment key={idx}>
                                {dia}
                                {idx !== d.dias.length - 1 && " - "}
                              </React.Fragment>
                            ))}
                          </Td>
                          <Td>
                            <Button
                              type="button"
                              onClick={() => handleDeleteDisponibilidad(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </>
          </VStack>
          <HStack justifyContent="flex-end" spacing={30}>
            <Button onClick={() => navigate(-1)}>Cancelar</Button>
            <SubmitButton isLoading={isLoading}>Crear</SubmitButton>
          </HStack>
        </VStack>

        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agregar disponibilidad</ModalHeader>
            <ModalBody>
              <>
                <HStack width="600px" py="10px">
                  <SelectControl
                    placeholder="Elegir horario"
                    label="Horario de Inicio"
                    name="horaInicio"
                    isRequired
                    onChange={handleDispChange}
                  >
                    {horas.map((hora, i) => (
                      <option key={i} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </SelectControl>
                  <SelectControl
                    placeholder="Elegir horario"
                    label="Horario de Fin"
                    name="horaFin"
                    onChange={handleDispChange}
                    isRequired
                  >
                    {horas.map((hora, i) => (
                      <option key={i} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </SelectControl>
                </HStack>
                <HStack width="600px" py="10px">
                  <SelectControl
                    placeholder="Seleccionar disciplina"
                    label=""
                    name="disciplina"
                    onChange={handleDispChange}
                    isRequired
                  >
                    {disciplinas.map((disciplina, i) => (
                      <option key={i} value={disciplina}>
                        {disciplina}
                      </option>
                    ))}
                  </SelectControl>
                  <SelectControl
                    placeholder="Seleccionar duración (min)"
                    label=""
                    name="minutosReserva"
                    onChange={handleDispChange}
                    isRequired
                  >
                    {duracionReserva.map((duracion, i) => (
                      <option key={i} value={duracion}>
                        {duracion}
                      </option>
                    ))}
                  </SelectControl>
                </HStack>
                <HStack width="600px" py="10px">
                  <InputControl
                    placeholder=""
                    name="precioReserva"
                    type="number"
                    label="Precio de reserva"
                    onChange={handleDispChange}
                    isRequired
                  ></InputControl>
                  <InputControl
                    placeholder=""
                    onChange={handleDispChange}
                    name="precioSenia"
                    type="number"
                    label="Seña de reserva"
                  ></InputControl>
                </HStack>
                <HStack py="10px">
                  <CheckboxGroupControl
                    name="dias"
                    onValueChange={(values) =>
                      setDisp({
                        ...disp,
                        dias: values as Dia[],
                      })
                    }
                  >
                    <HStack>
                      <Checkbox value="Lunes">Lunes</Checkbox>
                      <Checkbox value="Martes">Martes</Checkbox>
                      <Checkbox value="Miércoles">Miércoles</Checkbox>
                      <Checkbox value="Jueves">Jueves</Checkbox>
                      <Checkbox value="Viernes">Viernes</Checkbox>
                      <Checkbox value="Sábado">Sábado</Checkbox>
                      <Checkbox value="Domingo">Domingo</Checkbox>
                    </HStack>
                  </CheckboxGroupControl>
                </HStack>
              </>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blackAlpha"
                backgroundColor="black"
                onClick={handleAgregarDisponibilidad}
              >
                Aceptar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  );
}
