import TopMenu from "../../components/TopMenu/TopMenu";
import EstablecimientoCardList from "../../components/EstablecimientoCardList/EstablecimientoCardList";
import { Navigate, useNavigate } from "react-router";
import "./EstablecimientosPage.scss";
import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientosByAdminID } from "../../utils/api/establecimientos";
import { GrAddCircle } from "react-icons/gr";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";

interface EstablecimientosListProps {
  data?: Establecimiento[];
  isLoading: boolean;
  isError: boolean;
}

function EstablecimientosList({ data }: EstablecimientosListProps) {
  return <EstablecimientoCardList establecimientos={data || []} />;
}

export default function EstablecimientosPage() {
  const navigate = useNavigate();
  const { currentAdmin } = useCurrentAdmin();

  const { data, isLoading, isError } = useQuery<Establecimiento[]>(
    ["establecimientos", currentAdmin?.id],
    () => getEstablecimientosByAdminID(Number(currentAdmin?.id))
  );

  if (!currentAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <TopMenu />
      <HStack align="center">
        <Button
          className="btn-agregarestablecimiento"
          onClick={() => navigate("nuevoEstablecimiento")}
          variant="outline"
          leftIcon={<Icon as={GrAddCircle} />}
        >
          Establecimiento
        </Button>
        <Text mb="0" mt="15px">
          {data?.length} / {currentAdmin.suscripcion.limiteEstablecimientos}{" "}
          establecimientos
        </Text>
        <Button
          className="btn-agregarestablecimiento"
          onClick={() => navigate("perfil")}
          leftIcon={<SettingsIcon />}
          variant="outline"
        >
          Perfil
        </Button>
      </HStack>

      <EstablecimientosList
        data={data}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
