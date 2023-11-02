import InputControl, { InputControlProps } from "./InputControl";

/**
 * Personaliza un `InputControl` para seleccionar una fecha de manera amigable.
 */
export default function DateControl(props: InputControlProps) {
  return <InputControl type="date" {...props} />;
}
