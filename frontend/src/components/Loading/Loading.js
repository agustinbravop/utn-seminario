import { Spinner } from "@chakra-ui/react";
import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <Spinner size="lg" />
      <h5>Cargando...</h5>
    </div>
  );
}
