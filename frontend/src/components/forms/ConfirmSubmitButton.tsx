import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { SubmitButton } from ".";
import { SubmitButtonProps } from "./SubmitButton";
import { useCallback } from "react";

interface ConfirmSubmitButtonProps extends SubmitButtonProps {
  /** Contenido del `ModalHeader`. */
  header?: React.ReactNode;
  /** Contenido del `ModalBody`. */
  body?: React.ReactNode;
  /** Contenido del `Button` que cancela la acción.
   * @default "Cancelar"
   */
  cancel?: React.ReactNode;
  /** Contenido del `SubmitButton` que confirma la acción y submitea el form.
   * @default "Aceptar"
   */
  confirm?: React.ReactNode;
}

/**
 * Integra un `SubmitButton` con un `Modal` de Chakra para pedir confirmación del usuario.
 * Si confirma, se ejecuta el callback `onSubmit`.
 * Si cancela, el callback no tiene efecto y se cierra el modal.
 *
 * Nota: al usar este botón para enviar un form, el handler del submit
 * debe ir en el `onSubmit` de este botón, no del `onSubmit` del form contenedor.
 * Esto se debe a que el Modal de Chakra se renderiza fuera del árbol HTML,
 * y por ende hacer click en el `<button type=submit />` del Modal no
 * submitea el form porque no es un hijo del elemento `<form />`.
 *
 * Ref: https://chakra-ui.com/docs/components/modal
 */
export default function ConfirmSubmitButton(props: ConfirmSubmitButtonProps) {
  const {
    header,
    body,
    cancel,
    confirm,
    isLoading,
    onSubmit,
    onClick,
    children,
    ...rest
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      onOpen();
    },
    [onOpen]
  );

  return (
    <>
      <SubmitButton isLoading={isLoading} {...rest} onClick={handleClick}>
        {children}
      </SubmitButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{body}</ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              {cancel ?? "Cancelar"}
            </Button>
            <SubmitButton isLoading={isLoading} {...rest} onClick={onSubmit}>
              {confirm ?? children ?? "Aceptar"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
