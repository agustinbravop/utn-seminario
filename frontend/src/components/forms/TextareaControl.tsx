import { Textarea, TextareaProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

interface TextareaControlProps
  extends NoVariantBaseFormControlProps,
    Omit<TextareaProps, keyof NoVariantBaseFormControlProps> {}

/**
 * Renderiza un Chakra `Textarea` dentro de un `FormControl` integrado a react-hook-form, con las propiedades 'name', 'id', 'resize' y 'variant' recibidas.
 *
 * https://chakra-ui.com/docs/components/textarea
 */
export default function TextareaControl(props: TextareaControlProps) {
  const { name, control, resize, variant, ...rest } = props;

  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <Textarea {...field} id={name} variant={variant} resize={resize} />
    </BaseFormControl>
  );
}
