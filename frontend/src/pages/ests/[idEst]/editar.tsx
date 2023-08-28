import { useNavigate, useParams } from "@/router";
import {
  Alert,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ModificarEstablecimientoReq,
  useEstablecimientoByID,
  useModificarEstablecimiento,
} from "@/utils/api/establecimientos";
import * as Yup from "yup";
import { FormProvider } from "react-hook-form";
import { InputControl, SubmitButton } from "@/components/forms";
import { useYupForm } from "@/hooks/useYupForm";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

type FormState = ModificarEstablecimientoReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  id: Yup.number().required("Obligatorio"),
  nombre: Yup.string().required("Obligatorio"),
  telefono: Yup.string().required("Obligatorio"),
  direccion: Yup.string().required("Obligatorio"),
  localidad: Yup.string().required("Obligatorio"),
  provincia: Yup.string().required("Obligatorio"),
  correo: Yup.string()
    .email("Formato de correo inválido")
    .required("Obligatorio"),
  idAdministrador: Yup.number().required(),
  horariosDeAtencion: Yup.string().optional(),
  imagen: Yup.mixed<File>().optional(),
});

export default function EditEstabPage() {
  const navigate = useNavigate();
  const { idEst } = useParams("/ests/:idEst");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading } = useEstablecimientoByID(Number(idEst));

  const methods = useYupForm<FormState>({
    validationSchema,
    resetValues: data,
  });

  const { mutate, isError } = useModificarEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento modificado",
        description: `Establecimiento modificado exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar el establecimiento",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <div>
       
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Editar Establecimiento
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          // onSubmit={methods.handleSubmit((values) => mutate(values))}
          onSubmit={methods.handleSubmit(onOpen)}
          spacing="4"
          width="400px"
          m="auto"
        >
          <InputControl
            name="nombre"
            label="Nombre del establecimiento"
            placeholder="Nombre"
            isRequired
          />
          <InputControl
            name="correo"
            type="email"
            label="Correo del establecimiento"
            placeholder="abc@ejemplo.com"
            isRequired
          />
          <InputControl
            name="direccion"
            label="Dirección"
            placeholder="Dirección"
            isRequired
          />
          <HStack>
            <InputControl
              name="localidad"
              label="Localidad"
              placeholder="Localidad"
              isRequired
            />
            <InputControl
              name="provincia"
              label="Provincia"
              placeholder="Provincia"
              isRequired
            />
          </HStack>
          <InputControl
            name="telefono"
            label="Teléfono"
            placeholder="0..."
            type="tel"
            isRequired
          />
          <InputControl
            name="horariosDeAtencion"
            label="Horarios de Atención"
            placeholder="8:00-12:00"
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

          <HStack justifyContent="flex-end" spacing={30}>
            <Button onClick={() => navigate(-1)}>Cancelar</Button>
            <SubmitButton isLoading={isLoading}>Guardar</SubmitButton>
          </HStack>

          {isError && (
            <Alert status="error">
              Error al intentar guardar los cambios. Intente de nuevo
            </Alert>
          )}

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modificar establecimiento</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                ¿Está seguro de modificar la información del establecimiento?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="brand"
                  backgroundColor="black"
                  onClick={methods.handleSubmit((values) => mutate(values))}
                >
                  Aceptar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </FormProvider>
    </div>
  );
}
