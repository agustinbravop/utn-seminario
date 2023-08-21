import React, { useEffect } from "react";
import { Cancha, Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  getCanchaByID,
  modificarCancha,
  deleteCanchaByID,
} from "@/utils/api/canchas";
import { CheckboxGroupControl, InputControl, SelectControl, SubmitButton, SwitchControl } from "@/components/forms";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ApiError } from "@/utils/api";
import { GrAddCircle } from "react-icons/gr";
import { DeleteIcon } from "@chakra-ui/icons";

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

export default function EditCourtPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { idEst, idCancha } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useQuery<Cancha>({
    queryKey: ["canchas", idCancha],
    queryFn: () => getCanchaByID(Number(idEst), Number(idCancha)),
    enabled: true,
  });

  const { mutate, isLoading, isError } = useMutation<
    Cancha,
    ApiError,
    FormState
  >({
    mutationFn: ({ imagen, ...cancha }) => modificarCancha(cancha, imagen),
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

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: async () => {
      return Promise.resolve({ ...(data as Cancha), imagen: undefined });
    },
    mode: "onTouched",
  });

  useEffect(() => {
    // Precargar el formulario con los datos actuales.
    methods.reset(data);
  }, [methods, data]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const { mutate: mutateDelete } = useMutation<void, ApiError>({
    mutationFn: () => deleteCanchaByID(data?.idEstablecimiento, data?.id),
    onSuccess: () => {
      toast({
        title: "Cancha Eliminada.",
        description: `Cancha Eliminada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-2);
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const { fields, append } = useFieldArray({
    name: "disponibilidades",
    control: methods.control,
  });

  const agregarHorario = () => {
    append({
      disciplina: "-",
      horaInicio: "-",
      horaFin: "",
      minutosReserva: 0, 
      precioReserva: 0,
      precioSenia: undefined,
      dias: [],
    });
    //methods.reset();
    onClose();  
  };

  const disponibilidadesArray = methods.getValues("disponibilidades") || [];

  const handleDelete = (index: number) => {
    const disponibilidades = methods.getValues("disponibilidades");
    disponibilidades.splice(index, 1);
    methods.setValue("disponibilidades", disponibilidades);
  };

  useEffect(() => {
    console.log('Nuevo valor del array:', disponibilidadesArray);
    console.log('Longitud actual:', disponibilidadesArray.length)
  }, [disponibilidadesArray]);


  useEffect(() => {
    append({
      disciplina: "-",
      horaInicio: "-",
      horaFin: "",
      minutosReserva: 0,
      precioReserva: 0,
      precioSenia: undefined,
      dias: [],
    });
  }, [methods, data]);

  const last = disponibilidadesArray.length -1;
  const lastFieldIndex = fields.length-1;
  const {
    isOpen: formIsOpen,
    onOpen: formOnOpen,
    onClose: formOnClose,
  } = useDisclosure();


  return (
    <>
      <Heading m="40px" textAlign="center">
        Editar Cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit(onOpen)}
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
                <Button
                  leftIcon={<Icon as={GrAddCircle} />}
                  onClick={formOnOpen}
                >
                  {" "}
                  Agregar disponibilidad{" "}
                </Button>
              </VStack>
            </VStack>
            <>
              {disponibilidadesArray.length > 0 && (
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
                      {methods.getValues("disponibilidades").map((d, index) =>
                        index < disponibilidadesArray.length -1 ? (
                          <Tr>
                            <Td> {d.disciplina} </Td>
                            <Td> {d.horaInicio} </Td>
                            <Td> {d.horaFin} </Td>
                            <Td> {d.minutosReserva} </Td>
                            <Td>
                              {" "}
                              {d.precioReserva}/{d.precioSenia}{" "}
                            </Td>
                            <Td>
                              {" "}
                              {d.dias.map((dia, index) => (
                                <React.Fragment key={index}>
                                  {dia}
                                  {index !== d.dias.length - 1 && " - "}
                                </React.Fragment>
                              ))}{" "}
                            </Td>
                            <Td>
                              {" "}
                              <Button
                                type="button"
                                onClick={() => handleDelete(index)}
                              >
                                {" "}
                                <DeleteIcon />{" "}
                              </Button>{" "}
                            </Td>
                          </Tr>
                        ) : null
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </>
          </VStack>

          <Container centerContent mt="10px">
          <HStack justifyContent="flex-end" spacing={30}>
              <Button onClick={() => navigate(-1) } >Cancelar</Button>
              <SubmitButton isLoading={isLoading}>Modificar</SubmitButton>
          </HStack>
            {isError && (
              <Alert status="error">
                Error al intentar registrar el establecimiento. Intente de nuevo
              </Alert>
            )}
          </Container>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modificar cancha</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                ¿Está seguro de modificar la información de la cancha?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
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

        <Modal size="2xl" isOpen={formIsOpen} onClose={formOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar disponibilidad</ModalHeader>
              <ModalBody>
                
                {(
            <>
              <HStack width="600px" py="10px">

                <SelectControl
                  placeholder="Elegir horario"
                  label="Horario de Inicio"
                  name={`disponibilidades[${lastFieldIndex}].horaInicio`}
                  isRequired
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
                  name={`disponibilidades[${lastFieldIndex}].horaFin`}
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
                  placeholder="Seleccionar disciplina "
                  label=""
                  name={`disponibilidades[${lastFieldIndex}].disciplina`}
                  isRequired
                >
                  {disciplinas.map((disciplina, i) => (
                    <option key={i} value={disciplina}>
                      {disciplina}
                    </option>
                  ))}
                </SelectControl>
                <InputControl
                  isRequired
                  placeholder=""
                  name={`disponibilidades[${lastFieldIndex}].minutosReserva`}
                  type="number"
                  label="Duración de la reserva (minutos)"
                ></InputControl>
              </HStack>
              <HStack width="600px" py="10px">
                <InputControl
                  placeholder=""
                  name={`disponibilidades[${lastFieldIndex}].precioReserva`}
                  type="number"
                  label="Precio de reserva"
                  isRequired
                ></InputControl>
                <InputControl
                  placeholder=""
                  name={`disponibilidades[${lastFieldIndex}].precioSenia`}
                  type="number"
                  label="Seña de reserva"
                ></InputControl>
              </HStack>
              <HStack py="10px" >
                <CheckboxGroupControl
                  name={`disponibilidades[${lastFieldIndex}].dias`}
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
          )}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={formOnClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  backgroundColor="black"
                  onClick={agregarHorario}
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
