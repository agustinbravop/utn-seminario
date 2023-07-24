import TopMenu from "../../components/TopMenu/TopMenu";
import EstablecimientoCardList from "../../components/EstablecimientoCardList/EstablecimientoCardList";
import { Navigate, useNavigate } from "react-router";
import { Box, Button, HStack, Heading, Icon, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientosByAdminID } from "../../utils/api/establecimientos";
import { GrAddCircle } from "react-icons/gr";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

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

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
    console.log(filtro);
  };

  const { data, isLoading, isError } = useQuery<Establecimiento[]>(
    ["establecimientos", currentAdmin?.id],
    () => getEstablecimientosByAdminID(Number(currentAdmin?.id))
  );

  if (!currentAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <TopMenu />
      <Heading textAlign="left" marginLeft="25%" paddingBottom="2" mt="40px">
        Mis Establecimientos
      </Heading>
      <HStack marginRight="auto" marginLeft="18%" marginBottom="50px" marginTop="20px" >
      <InputGroup width="18%">
            <InputRightElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputRightElement>
            <Input
          focusBorderColor="lightblue"
          placeholder="Nombre del establecimiento"
          size="md"
          width="100%"
          onChange={handleChange}
        />
        </InputGroup>
        <HStack marginLeft="auto" marginRight="10%" display="flex" alignContent="column" spacing={5} align="center" >
          <Text mb="0"> 
            {data?.length} / {currentAdmin.suscripcion.limiteEstablecimientos}{" "}
            establecimientos
          </Text>
          <Button
            onClick={() => navigate("nuevoEstablecimiento")}
            leftIcon={<Icon as={GrAddCircle} />}
          >
            Agregar Establecimiento
          </Button>
        </HStack>
      </HStack>
      <HStack marginLeft="18%">
        <EstablecimientosList
          data={data}
          isLoading={isLoading}
          isError={isError}
        />
      </HStack>
    </>
  );
}
