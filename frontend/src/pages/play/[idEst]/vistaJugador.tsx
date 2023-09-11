import { useParams } from "react-router";
import { Box, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import DetailEstablecimiento from "@/components/DetailEstablecimiento/DetailEstablecimiento";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import ReservaForm from "@/components/ReservaForm/ReservaForm";

export default function VistaJugador() {
  const { idEst } = useParams();

  const [activeIndex, setActiveIndex] = useState(1);

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  const { data } = useEstablecimientoByID(Number(idEst));
  const canchas = useCanchasByEstablecimientoID(Number(idEst));

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>

      <Box>
        <HStack justifyContent="center">
          <Tabs
            position="relative"
            variant="unstyled"
            index={activeIndex}
            onChange={handleChangeIndex}
            pb="10px"
          ></Tabs>
        </HStack>
        <SwipeableViews index={activeIndex} onChangeIndex={handleChangeIndex}>
          <DetailEstablecimiento />
          <>
            <Heading textAlign="center">¡Reservá ahora!</Heading>
            <ReservaForm />
          </>
          <>
            <Heading>Canchas</Heading>
            <HStack display="flex" flexWrap="wrap" justifyContent="left">
            
            </HStack>
          </>
        </SwipeableViews>
      </Box>
    </>
  );
}

/*
<>
      <Box display="flex" justifyContent="left">
        <Card
          boxSize="10rem"
          justifyContent="center"
          display="flex"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          height="75%"
          width="100%"
        >
        <CardHeader>
        <Box ml='0px'>
                <Image
                  src={!(data?.urlImagen === null) ? data?.urlImagen : defImage}
                  width="1800px"
                  height="200px"
                  objectFit="cover"
                  borderRadius="10px"
                />
              </Box>
        </CardHeader>
          <CardBody height="100%" marginTop="0px">
            <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%" width="100%">

              <Box marginTop="55px" marginLeft=" 50px" height="100%" >
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Dirección
                    </Heading>
                    <Text fontSize="sm">{data?.direccion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Horario atencion
                    </Heading>
                    <Text fontSize="sm">{data?.horariosDeAtencion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Correo de contacto
                    </Heading>
                    <Text fontSize="sm">{data?.correo}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Numero de teléfono
                    </Heading>
                    <Text fontSize="sm">{data?.telefono}</Text>
                  </Box>
                  <Box height="100%">
                    <Heading size="xs" textTransform="uppercase">
                      Localidad
                    </Heading>
                    <Text fontSize="sm">
                      {data?.localidad}, {data?.provincia}
                    </Text>
                          
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardBody>
        </Card>
        
      </Box>
    </>
*/
