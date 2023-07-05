import { Spinner } from "@chakra-ui/react";
import "./LoadingSpinner.scss";

export default function LoadingSpinner() {
  return (
    <div className="loading">
      <Spinner size="lg" />
      <h5>Cargando...</h5>
    </div>
  );
}
