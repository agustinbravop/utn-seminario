import React from "react";
import { Cancha, Dia } from "@/models";
import { useNavigate, useParams } from "react-router";
import { ApiError } from "@/utils/api";
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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CrearCanchaReq, crearCancha } from "@/utils/api/canchas";
import {
  CheckboxGroupControl,
  InputControl,
  SelectControl,
  SubmitButton,
} from "@/components/forms";
import { FormProvider, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { useMutationForm } from "@/hooks/useMutationForm";
import { GrAddCircle } from "react-icons/gr";

type FormState = CrearCanchaReq & {
  imagen: File | undefined;
};
const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  habilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
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
        .min(1, "Obligatorio")
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

function NuevaCancha() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const { methods, mutate, isLoading } = useMutationForm<
    Cancha,
    ApiError,
    FormState
  >({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      habilitada: true,
      idEstablecimiento: Number(idEst),
      disciplinas: [],
      imagen: undefined,
      disponibilidades: [
        {
          horaInicio: "-",
          horaFin: "-",
          disciplina: "-",
          dias: [],
        },
      ],
    },
    mutationFn: ({ imagen, ...cancha }) => {
      return crearCancha(
        {
          ...cancha,
          disponibilidades: cancha.disponibilidades
            .slice(0, -1) // Obtener todos los elementos excepto el último
            .map((d) => ({
              ...d,
              precioSenia: d.precioSenia && Number(d.precioSenia),
              precioReserva: Number(d.precioReserva),
              minutosReserva: Number(d.minutosReserva),
            })),
        },
        imagen
      );
    },
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
    mode: "onTouched",
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
      minutosReserva: undefined,
      precioReserva: null,
      precioSenia: null,
      dias: [],
    });
    //methods.reset();
    onClose(); 
  };

  const handleDelete = (index: number) => {
    const disponibilidades = methods.getValues("disponibilidades");
    disponibilidades.splice(index, 1); 
    methods.setValue("disponibilidades", disponibilidades); 
  };
  const last = methods.getValues("disponibilidades").length - 1;
  const lastFieldIndex = fields.length - 1;
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <div>
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Nueva cancha 
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => {
            console.log(values);
            mutate(values);
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

          <VStack width="1100px" align="center" >
            <VStack marginTop="20px" align="start" width="100%" px="281px">
              <Text fontWeight="bold">
                Disponibilidad horaria 
              </Text>
              <Text>
                En qué rangos horarios la cancha estará disponible y para qué disciplinas.
              </Text>
              <VStack >
                <Button leftIcon={<Icon as={GrAddCircle}/> } onClick={onOpen} > Agregar disponibilidad </Button>
              </VStack>
            </VStack>
 
            <>
              {methods.getValues("disponibilidades").length > 1 && (
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
                     {methods.getValues("disponibilidades").map((d, index) =>
                       // Verificar si el índice es mayor o igual a numeroDado
                       index < last ? (
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
          <SubmitButton isLoading={isLoading}>Crear</SubmitButton>
        </VStack>

        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar disponibilidad</ModalHeader>
              <ModalBody>
                {fields.length > 0 && (
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
                <Button colorScheme="gray" mr={3} onClick={onClose}>
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
    </div>
  );
}
export default NuevaCancha;
