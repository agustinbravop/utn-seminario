import React, { useEffect, useState } from "react";
import { Dia, Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import {
  Alert,
  Checkbox,
  Container,
  HStack,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  ModificarCanchaReq,
  useCanchaByID,
  useModificarCancha,
} from "@/utils/api/canchas";
import {
  CheckboxGroupControl,
  InputControl,
  SelectControl,
  SubmitButton,
  SwitchControl,
} from "@/components/forms";
import { FormProvider, useFieldArray } from "react-hook-form";
import { GrAddCircle } from "react-icons/gr";
import { DeleteIcon } from "@chakra-ui/icons";
import { useYupForm } from "@/hooks";
import * as Yup from "yup";

type FormState = ModificarCanchaReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  id: Yup.number().positive().required("Obligatorio"),
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  habilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  imagen: Yup.mixed<File>().optional(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
  disponibilidades: Yup.array(Yup.mixed<Disponibilidad>().required()).default(
    []
  ),
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

const defaultDisponibilidad: Omit<Disponibilidad, "id"> & {
  id?: number | undefined;
} = {
  horaFin: "",
  horaInicio: "",
  dias: [],
  disciplina: "",
  precioReserva: NaN,
  precioSenia: undefined,
  minutosReserva: NaN,
};

export default function EditCourtPage() {
  const {
    isOpen: confirmIsOpen,
    onOpen: confirmOnOpen,
    onClose: confirmOnClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { idEst, idCancha } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [disp, setDisp] = useState(defaultDisponibilidad);

  const handleDispChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("handleDispChange");
    setDisp({ ...disp, [name]: value });
  };

  const { data } = useCanchaByID(Number(idEst), Number(idCancha));

  const { mutate, isLoading, isError } = useModificarCancha({
    onSuccess: () => {
      toast({
        title: "Cancha modificada.",
        description: `Cancha modificada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const methods = useYupForm<FormState>({
    validationSchema,
    resetValues: data,
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

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

  const handleAgregarDisponibilidad = () => {
    const validationRules = {
      disciplina: disp.disciplina !== "",
      horaFin: disp.horaFin !== "",
      horaInicio: disp.horaInicio !== "",
      dias: disp.dias.length !== 0,
      precioReserva: !Number.isNaN(disp.precioReserva),
      minutosReserva: !Number.isNaN(disp.minutosReserva),
    };

    const allValid = Object.values(validationRules).every((isValid) => isValid);

    if (allValid) {
      append(disp);
      setDisp(defaultDisponibilidad);
      Object.keys(defaultDisponibilidad).forEach((name) =>
        methods.resetField(name as keyof FormState)
      );
      onClose();
    } else {
      console.log("Alguna validación ha fallado");
      toast({
        title: "Datos faltantes",
        description: `Verifique todos los datos ingresados y vuelva a intentar.`,
        status: "warning",
        isClosable: true,
      });
    }
  };

  const handleDeleteDisponibilidad = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Heading m="40px" textAlign="center">
        Editar Cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit(confirmOnOpen)}
          spacing="24px"
          width="400px"
          m="auto"
        >
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
          <FormControl>
            <SwitchControl
              name="habilitada"
              label="¿Esta habilitada?"
            ></SwitchControl>
          </FormControl>

          <VStack width="1100px" align="center">
            <VStack marginTop="20px" align="start" width="100%" px="281px">
              <Text fontWeight="bold">Disponibilidad horaria</Text>
              <Text>
                En qué rangos horarios la cancha estará disponible y para qué
                disciplinas.
              </Text>
              <VStack>
                <Button leftIcon={<Icon as={GrAddCircle} />} onClick={onOpen}>
                  Agregar disponibilidad
                </Button>
              </VStack>
            </VStack>
            <>
              <TableContainer paddingTop="20px" paddingBottom="5px">
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
                    {methods.getValues("disponibilidades").map((d, index) => (
                      <Tr key={index}>
                        <Td> {d.disciplina} </Td>
                        <Td> {d.horaInicio} </Td>
                        <Td> {d.horaFin} </Td>
                        <Td> {d.minutosReserva} </Td>
                        <Td>
                          {d.precioReserva}/{d.precioSenia}
                        </Td>
                        <Td>
                          {d.dias.map((dia, index) => (
                            <React.Fragment key={index}>
                              {dia}
                              {index !== d.dias.length - 1 && " - "}
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
            </>
          </VStack>

          <Container centerContent mt="10px">
            <HStack justifyContent="flex-end" spacing={30}>
              <Button onClick={() => navigate(-1)}>Cancelar</Button>
              <SubmitButton isLoading={isLoading}>Modificar</SubmitButton>
            </HStack>
            {isError && (
              <Alert status="error">
                Error al intentar registrar el establecimiento. Intente de nuevo
              </Alert>
            )}
          </Container>

          <Modal isOpen={confirmIsOpen} onClose={confirmOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modificar cancha</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                ¿Está seguro de modificar la información de la cancha?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={confirmOnClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  backgroundColor="black"
                  onClick={methods.handleSubmit((values) => mutate(values))}
                >
                  Aceptar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>

        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agregar disponibilidad</ModalHeader>
            <ModalBody>
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
                  isRequired
                  onChange={handleDispChange}
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
                  placeholder="Seleccionar disciplina "
                  label=""
                  name="disciplina"
                  isRequired
                  onChange={handleDispChange}
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
                  isRequired
                  onChange={handleDispChange}
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
                  isRequired
                  onChange={handleDispChange}
                ></InputControl>
                <InputControl
                  placeholder=""
                  name="precioSenia"
                  type="number"
                  label="Seña de reserva"
                  onChange={handleDispChange}
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
