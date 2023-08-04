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
  };

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
          <HStack>
            <CheckboxGroupControl name="disciplinas">
              <HStack>
                <Checkbox value="Futbol">Futbol</Checkbox>
                <Checkbox value="Voley">Voley</Checkbox>
              </HStack>
            </CheckboxGroupControl>
          </HStack>
          <div className="margen">
            <h3>Disponibilidad horaria</h3>
            <p>
              {" "}
              En qué rangos horarios la cancha estará disponible y para qué
              disciplinas.
            </p>
            <Button onClick={agregarHorario}> Agregar disponibilidad + </Button>
          </div>
          <br />

          {fields.map((_h, index) => (
            <>
              <HStack width="600px">
                <SelectControl
                  placeholder="Elegir horario"
                  label="Horario de Inicio"
                  name={`disponibilidades[${index}].horaInicio`}
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
                  name={`disponibilidades[${index}].horaFin`}
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
                  name={`disponibilidades[${index}].disciplina`}
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
                  name={`disponibilidades[${index}].minutosReserva`}
                  type="number"
                  label="Duración de la reserva"
                ></InputControl>
              </HStack>
              <HStack width="600px">
                <InputControl
                  placeholder=" "
                  name={`disponibilidades[${index}].precioReserva`}
                  type="number"
                  label="Precio de reserva"
                  isRequired
                ></InputControl>
                <InputControl
                  placeholder=" "
                  name={`disponibilidades[${index}].precioSena`}
                  type="number"
                  label="Seña de reserva"
                ></InputControl>
              </HStack>
              <div>
                <p> Seleccionar los días para la disponibilidad.</p>
              </div>
              <br />
              <HStack>
                <CheckboxGroupControl name={`disponibilidades[${index}].dias`}>
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
          ))}

          <br />
          <SubmitButton type="submit">Crear</SubmitButton>
        </VStack>
      </FormProvider>
    </div>
  );
}

export default NewCourt;
