import React, { useEffect } from "react";
import { Cancha } from "@/models";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/utils/api";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
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
import {
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
Text,
  TableContainer,
} from '@chakra-ui/react'

type FormState = CrearCanchaReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  estaHabilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
  imagen: Yup.mixed<File>().optional(),
  disponibilidades: Yup.array(
    Yup.object({
      horaInicio: Yup.string().required(),
      horaFin: Yup.string().required(),
      minutosReserva: Yup.number().required(),
      precioReserva: Yup.number().required(),
      precioSena: Yup.number().optional(),
      disciplina: Yup.string().required(),
      dias: Yup.array(Yup.string().required()).required(),
    })
  ).required(),
});

function NewCourt() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Aca dejo hardcodeadas algunas disciplinas :|
  const disciplinas = [
    "Basket",
    "Futbol",
    "Tenis",
    "Padel",
    "Hokey",
    "Ping-Pong",
  ];

  //Horarios hardcodeados, no se si seria lo mejor
  //Si igual lo dejamos asi, mejor armar un for
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

  const { mutate } = useMutation<Cancha, ApiError, FormState>({
    mutationFn: ({ imagen, ...cancha }) => crearCancha(cancha, imagen),
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

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      estaHabilitada: true,
      idEstablecimiento: Number(idEst),
      disciplinas: [],
      imagen: undefined,
      disponibilidades: [
        {
          horaInicio: " ",
          horaFin: " ",
          minutosReserva: 0,
          precioReserva: 0,
          precioSena: 0,
          disciplina: " ",
          dias: [],
        },
      ],
    },
    mode: "onTouched",
  });

  //VER VALORES DEL FORM
  /*
  const values = useWatch({ control: methods.control });
  console.log(values);
   */ 
  const {control} = methods

  useEffect(() => {

  }, [control]);
 
  const { fields, append } = useFieldArray({
    name: "disponibilidades",
    control,
  });

  const agregarHorario = () => {
    append({
      horaInicio: "",
      horaFin: "",
      disciplina: "",
      minutosReserva: 0,
      precioReserva: 0,
      precioSena: 0,
      dias: [],
    });
    console.log(data2)
    console.log(lastFieldIndex)
  };


  const data2 = methods.getValues("disponibilidades")
  const lastFieldIndex = fields.length - 1;



  return (
    <div>
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Nueva cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => mutate(values))}
          spacing="24px"
          width="800px"
          m="auto"
        >
          <VStack  width="400px" >
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

          <VStack width="800px">
          <div className="margen">
            <Text as='b' > Disponibilidad horaria </Text>
            <p>
              {" "}
              En qué rangos horarios la cancha estará disponible y para qué
              disciplinas.
            </p>
            
            <TableContainer paddingTop="20px" paddingBottom="20px">
              <Table variant='simple' size='sm'>
                <Thead backgroundColor="lightgray">
                  <Tr>
                    <Th>disciplina</Th>
                    <Th>hora inicio</Th>
                    <Th>hora fin</Th>
                    <Th>reserva (minutos)</Th>
                    <Th>precio reserva/seña</Th>
                    <Th>  dias </Th>
                  </Tr>
                </Thead>
                <Tbody>
                {data2.map((d) => (
                     <Tr>
                     <Td> {d.disciplina} </Td>
                     <Td> {d.horaInicio} </Td>
                     <Td> {d.horaFin} </Td>
                     <Td> {d.minutosReserva} </Td>
                     <Td> {d.precioReserva}/{d.precioSena} </Td>
                     <Td>  {d.dias.map((dia) => (<>{dia+" - "}</>))} </Td>
                   </Tr>
                  ) )
                  }
                </Tbody>
              </Table>
            </TableContainer>
            <Button onClick={agregarHorario}> Agregar disponibilidad + </Button>
          </div>
          <br />
          </VStack>

          {fields.length > 0 && (
            <>
              <HStack width="600px">
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
              <HStack width="600px">
                <SelectControl
                  placeholder="Seleccionar disciplina"
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
                  placeholder=" "
                  name={`disponibilidades[${lastFieldIndex}].minutosReserva`}
                  type="number"
                  label="Duración de la reserva"
                ></InputControl>
              </HStack>
              <HStack width="600px">
                <InputControl
                  placeholder=" "
                  name={`disponibilidades[${lastFieldIndex}].precioReserva`}
                  type="number"
                  label="Precio de reserva"
                  isRequired
                ></InputControl>
                <InputControl
                  placeholder=" "
                  name={`disponibilidades[${lastFieldIndex}].precioSena`}
                  type="number"
                  label="Seña de reserva"
                ></InputControl>
              </HStack>
              <HStack>
                <CheckboxGroupControl name={`disponibilidades[${lastFieldIndex}].dias`}>
                  <HStack>
                    <Checkbox value="Lunes">Lunes</Checkbox>
                    <Checkbox value="Martes">Martes</Checkbox>
                    <Checkbox value="Miercoles">Miercoles</Checkbox>
                    <Checkbox value="Jueves">Jueves</Checkbox>
                    <Checkbox value="Viernes">Viernes</Checkbox>
                    <Checkbox value="Sabado">Sabado</Checkbox>
                    <Checkbox value="Domingo">Domingo</Checkbox>
                  </HStack>
                </CheckboxGroupControl>
              </HStack>
            </>
          )}

          <br />
          <SubmitButton type="submit">Crear</SubmitButton>
        </VStack>
      </FormProvider>
    </div>
  );
}

export default NewCourt;
