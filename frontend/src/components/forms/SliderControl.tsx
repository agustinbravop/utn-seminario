import {
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { BaseFormControl, BaseFormControlProps } from "./BaseFormControl";

interface SliderControlProps
  extends BaseFormControlProps,
    Omit<SliderProps, keyof BaseFormControlProps> {}

/**
 * Renderiza un Chakra `Slider` dentro de un `FormControl` integrado a react-hook-form, con las propiedades 'name', 'id', 'max', 'min', 'step', 'direction' recibidas.
 *
 * Dentro del Slider se renderiza por defecto un `SliderTrack` (con su `SliderFilledTrack`) y un `SliderThumb`. Si se los quiere personalizar, conviene pasarlos como children para sobreescribir el por defecto.
 *
 * https://chakra-ui.com/docs/components/slider
 */
export function SliderControl(props: SliderControlProps) {
  const { name, control, direction, max, min, step, children, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <Slider
        {...field}
        id={name}
        max={max}
        min={min}
        step={step}
        direction={direction}
      >
        {children ?? (
          <>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </>
        )}
      </Slider>
    </BaseFormControl>
  );
}
