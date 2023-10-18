import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonProps, Image, keyframes } from "@chakra-ui/react";

function CarouselButton(props: ButtonProps) {
  return (
    <Button
      display="flex"
      position="absolute"
      top="50%"
      fontSize="1.5rem"
      backgroundColor="transparent"
      borderRadius="15px"
      padding="5px"
      fontWeight="600"
      cursor="pointer"
      color="rgb(253, 253, 253)"
      transform="translate(0, -50%)"
      _active={{ backgroundColor: "brand.400" }}
      _hover={{ backgroundColor: "brand.400" }}
      {...props}
    />
  );
}

interface CarouselProps {
  images: string[];
  /**
   * Determina si mover las imágenes automáticamente.
   * Si `showButtons` es false, a `autoPlay` se le asigna true.
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Determina si mostrar botones para mover a izquierda o derecha.
   * @default true
   */
  showButtons?: boolean;
}

const fadeIn = `${keyframes({
  "0%": {
    opacity: "50%",
  },
  "100%": {
    opacity: "100%",
  },
})} 500ms ease-out`;

export default function Carousel({
  images,
  autoPlay = true,
  showButtons = true,
}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!showButtons) {
    autoPlay = true;
  }

  const selectNewImage = useCallback(
    (offset: number) => {
      let nextIndex = (selectedIndex + offset) % images.length;
      setSelectedIndex(nextIndex);
    },
    [selectedIndex, images.length]
  );

  const isImageVisible = (imgSrc: string) => images[selectedIndex] === imgSrc;

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        selectNewImage(+1);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, images, selectNewImage]);

  return (
    <Box
      position={"relative" /* para position="absolute" en CarouselButton */}
      width={{ base: "90vw", md: "60vw" }}
    >
      {images.map((imgSrc, idx) => (
        <Image
          key={idx}
          height="420px"
          width="100%"
          borderRadius="12px"
          objectFit="cover"
          src={imgSrc}
          alt="Cancha de deportes"
          display={isImageVisible(imgSrc) ? "block" : "none"}
          animation={fadeIn}
        />
      ))}
      {showButtons && (
        <>
          <CarouselButton onClick={() => selectNewImage(-1)} left="10px">
            <ChevronLeftIcon boxSize={10} />
          </CarouselButton>
          <CarouselButton onClick={() => selectNewImage(+1)} right="10px">
            <ChevronRightIcon boxSize={10} />
          </CarouselButton>
        </>
      )}
    </Box>
  );
}
