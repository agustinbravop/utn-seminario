import { Icon, Image, ImageProps } from "@chakra-ui/react";
import { BsBuildings, BsRocket, BsShop } from "react-icons/bs";
import { FALLBACK_IMAGE_SRC, LOGO_IMAGE_SRC } from ".";

/** Los iconos SVG de las suscripciones. */
export const ICONOS_SUSCRIPCIONES = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

/** Imagen a mostrar cuando la imagen original falla o no carga. */
export function FallbackImage(props: ImageProps) {
  return <Image fallbackSrc={FALLBACK_IMAGE_SRC} {...props} />;
}

/** El logo de la app. */
export function LogoImage(props: ImageProps) {
  return (
    <Image src={LOGO_IMAGE_SRC} alt="Play Finder" width={177} {...props} />
  );
}
