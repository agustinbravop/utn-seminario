import InputControl, { InputControlProps } from "./InputControl";

/**
 * Personaliza un `InputControl` para seleccionar una fecha de manera amigable.
 */
export default function DateControl(props: InputControlProps) {
  // TODO: usar un react-datepicker o algo similar.
  return <InputControl type="date" {...props} />;
}
