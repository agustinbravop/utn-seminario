import { useLocation, useNavigate } from "react-router";
import { Heading } from "@chakra-ui/react";
import { useGoogleLogin } from "@/utils/api";
import { Alerta, LoadingSpinner } from "@/components/feedback";
import { useState } from "react";

// Google redirige a esta página luego de la pantalla de consentimiento de OAuth.
export default function GoogleRedirectPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // El parámetro `code` tiene un código de Google que le sirve al back para loguear al usuario.
  const googleCode = searchParams.get("code");

  const { mutate, error } = useGoogleLogin({
    onSuccess: (user) => {
      // Al terminar el login del back, si fue exitoso nos devuelve el JWT.
      if (user.admin) {
        navigate(`/ests`);
      } else {
        navigate(`/search`);
      }
    },
  });

  // Para evitar un ciclo infinito de llamar a `mutate()`.
  const [intentado, setIntentado] = useState(false);

  if (googleCode && !intentado) {
    // Se le pasa el `code` una sola vez al back end para que continúe con el login.
    mutate({ code: googleCode });
    setIntentado(true);
  }

  return (
    <>
      <Heading
        textAlign="center"
        size="2xl"
        fontSize="40px"
        mt="60px"
        mb="60px"
      >
        Espere un momento mientras lo redirigimos...
      </Heading>
      {error ? (
        <Alerta mensaje={error.message} status="error" />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
