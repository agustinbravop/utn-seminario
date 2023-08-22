import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    Icon,
    Text,
    Image
} from "@chakra-ui/react";
import { BsRocket, BsShop, BsBuildings } from "react-icons/bs";
import { getSuscripciones } from "@/utils/api/auth";
import { Suscripcion } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";

const iconos = [
    <Icon as={BsShop} fill="brand.500" fontSize={90} />,
    <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
    <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

export default function mejorarSuscripcion() {
    const { currentAdmin } = useCurrentAdmin();

    const suscripcion = currentAdmin?.suscripcion;

    return (
        <>
            <Box marginLeft="12%">
                <Heading size="lg">Mejore su suscripción</Heading>
                <br />
                <Text>
                    A alcanzado el límite de establecimientos para su suscripción actual. Le recomendamos mejorar su suscripción.
                </Text>
            </Box>
            <HStack marginLeft="12%"  gap="7%" my="50px">

                <Image borderRadius='10' src='https://bedsttest.dk/wp-content/uploads/2022/02/Padel-tennis-bat-test.webp' width='53%' />
                <Box>
                    <Heading size="md">Beneficios a los que podrá acceder</Heading>
                    <br />
                    <Text mb='3'>
                        ◉ Aumentar el límite de establecimientos.
                    </Text>
                    <Text mb='3'>
                        ◉ Aumentar la cantidad de canchas.
                    </Text>
                    <Text mb='3'>
                        ◉ Acceder a estadisticas más personalizadas.
                    </Text>
                    <Text mb='3'>
                        ◉ Mejorar el posicionamiento de sus canchas en su zona.
                    </Text>
                    <Link to={`cambiarSuscripcion`}>
                        <Button
                            mt="5"
                            type="button"
                            colorScheme="brand"
                            onClick={() => alert('Ir a cambio de suscipción')}
                        >
                            Mejorar suscripción
                        </Button>
                    </Link>
                </Box>
            </HStack>
        </>
    );
}
