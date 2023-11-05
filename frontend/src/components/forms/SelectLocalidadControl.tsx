import { useLocalidadesByProvincia } from "@/utils/api";
import { SelectControl } from ".";
import { SelectControlProps } from "./SelectControl";

export default function SelectLocalidadControl({
  provincia,
  ...props
}: SelectControlProps & { provincia?: string }) {
  const { data: localidades } = useLocalidadesByProvincia(provincia);

  return (
    <SelectControl
      placeholder="Localidad"
      label="Localidad"
      variant="floating"
      {...props}
    >
      {localidades.sort().map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
      <option key="Otra" value="Otra">
        Otra
      </option>
    </SelectControl>
  );
}
