import {
  Button,
  Container,
  FormHelperText,
  Icon,
  Image,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";
import { useDropzone } from "react-dropzone";
import { LiaFileUploadSolid } from "react-icons/lia";

interface ImageControlProps extends NoVariantBaseFormControlProps {
  /** La URL de una imagen. Sirve para mostrar un archivo ya existente en
   *  el sistema, que no requiere ser cargado por el usuario. */
  defaultImg?: string | undefined;
}

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderWidth: 2,
  borderRadius: 2,
  padding: 0,
  borderColor: "gray.300",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  cursor: "pointer",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "green",
};

const rejectStyle = {
  borderColor: "red",
};

/**
 * Envuelve un <input /> con type=file dentro de un `FormControl` integrado a react-hook-form.
 * Previsualiza el archivo cargado, o una URL si se setea `defaultImg` (opcional).
 * Utiliza la librería 'react-dropzone' para el drag-and-drop.
 */
export default function ImageControl(props: ImageControlProps) {
  const { name, control, children, defaultImg, ...rest } = props;

  const {
    field: { value, onChange, ...restField },
  } = useController({
    name,
    control,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      maxFiles: 1,
      accept: {
        "image/jpeg": [".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/heic": [".heic"],
        "image/jfif": [".jfif"],
        "image/gif": [".gif"],
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ":hover": focusedStyle,
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <>
      <BaseFormControl name={name} control={control} {...rest}>
        <Container sx={style} {...getRootProps()} centerContent>
          <input {...restField} {...getInputProps()} />
          <Preview src={value || defaultImg} />
        </Container>
        <FormHelperText>
          {value?.path}
          {value?.path && (
            <>
              {". "}
              <Button variant="link" size="xs" onClick={() => onChange(null)}>
                Eliminar
              </Button>
            </>
          )}
        </FormHelperText>
      </BaseFormControl>
    </>
  );
}

/**
 * Previsualiza el archivo cargado por el usuario, o la URL de una imágen pre-existente.
 */
function Preview({ src }: { src: string | File }) {
  if (!src) {
    return (
      <Container width="100px" centerContent>
        <Icon
          as={LiaFileUploadSolid}
          fontSize="50px"
          my="10px"
          color="gray.300"
        />
      </Container>
    );
  }
  if (typeof src === "string") {
    return <Image src={src} opacity="70%" borderRadius="2" />;
  } else {
    const url = URL.createObjectURL(src);
    return (
      <Image
        src={url}
        onLoad={() => URL.revokeObjectURL(url)}
        opacity="70%"
        borderRadius="2"
      />
    );
  }
}
