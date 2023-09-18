import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonProps, Image, SlideFade } from "@chakra-ui/react";

function CarouselButton(props: ButtonProps) {
  return (
    <Button
      display="flex"
      position="absolute"
      top="50%"
      fontSize="1.5rem"
      backgroundColor="transparent"
      borderRadius="50%"
      padding="5px"
      fontWeight="600"
      cursor="pointer"
      color="rgb(253, 253, 253)"
      transform="translate(0, -50%)"
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

export default function Carousel({
  images,
  autoPlay = true,
  showButtons = true,
}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (!showButtons) {
    autoPlay = true;
  }

  const selectNewImage = useCallback(
    (offset: number) => {
      setLoaded(false);
      let nextIndex = (selectedIndex + offset) % images.length;
      setSelectedIndex(nextIndex);
    },
    [selectedIndex, images.length]
  );

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        selectNewImage(+1);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, images, selectNewImage]);

  return (
    <Box position={"relative" /* para position="absolute" en CarouselButton */}>
      <SlideFade in={loaded}>
        <Image
          height="500px"
          width="70vw"
          borderRadius="12px"
          objectFit="cover"
          src={images[selectedIndex]}
          alt="Cancha de deportes"
          onLoad={() => setLoaded(true)}
        />
      </SlideFade>
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
