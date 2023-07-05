import { useQuery } from "@tanstack/react-query";
import { Cancha } from "../../models";
import { useNavigate, useParams } from "react-router";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import Courts from "../../components/Courts/Courts";
import ErrorPage from "../ErrorPage/ErrorPage";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";

export default function CourtPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();
  const { data, isLoading, isError } = useQuery<Cancha[]>(
    ["canchas", idEst],
    () => getCanchasByEstablecimientoID(Number(idEst))
  );
  console.log(data);

  return (
    <div>
      <TopMenu />
      <HStack>
        <Button
          className="btn-agregarestablecimiento"
          onClick={() => navigate("nuevaCancha")}
          variant="outline"
          leftIcon={<Icon as={GrAddCircle} />}
        >
          Cancha
        </Button>
        <Text mb="0" mt="15px">
          {data?.length} canchas
        </Text>
        <Button
          className="btn-agregarestablecimiento"
          onClick={() => navigate("perfil")}
          variant="outline"
        >
          Perfil
        </Button>
      </HStack>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorPage />
      ) : (
        <Courts canchas={data || []} />
      )}
    </div>
  );
}
