import { Icon, Image } from "@chakra-ui/react";
import { BsBuildings, BsRocket, BsShop } from "react-icons/bs";
import { FALLBACK_IMAGE_SRC } from ".";

export const ICONOS_SUSCRIPCIONES = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

export const FALLBACK_IMAGE = <Image fallbackSrc={FALLBACK_IMAGE_SRC} />;
