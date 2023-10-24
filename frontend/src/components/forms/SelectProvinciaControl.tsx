import { useProvincias } from "@/utils/api";
import { SelectControl } from ".";
import { SelectControlProps } from "./SelectControl";

export default function SelectProvinciaControl({
  ...props
}: SelectControlProps) {
  const { data: provincias } = useProvincias();

  return (
    <SelectControl placeholder="Provincia" {...props}>
      {provincias.sort().map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </SelectControl>
  );
}
