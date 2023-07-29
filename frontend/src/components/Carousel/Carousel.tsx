import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const CarouselImg = styled.img`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: 0.5s;
  border-radius: 12px;
  object-fit: cover;
  &.loaded {
    transition: 0.5s;
    opacity: 1;
  }
`;

const CarouselImageContainer = styled.div`
  max-width: 800px;
  width: 800px;
  max-height: 500px;
  height: 500px;
  border-radius: 12px;
  position: relative;
`;

const CarouselButton = styled.button`
  display: flex;
  position: absolute;
  top: 50%;
  font-size: 1.5rem;
  background-color: transparent;
  border-radius: 50%;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;
  color: rgb(253, 253, 253);
  transform: translate(0, -50%);
`;

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
    (images: string[], offset: number) => {
      setLoaded(false);
      setTimeout(() => {
        let nextIndex = (selectedIndex + offset) % images.length;
        setSelectedIndex(nextIndex);
      }, 500);
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        selectNewImage(images, +1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, images, selectNewImage]);

  const previous = () => {
    selectNewImage(images, -1);
  };

  const next = () => {
    selectNewImage(images, +1);
  };

  return (
    <CarouselImageContainer>
      <CarouselImg
        src={images[selectedIndex]}
        alt="Imagen del carousel"
        className={loaded ? "loaded" : ""}
        onLoad={() => setLoaded(true)}
      />
      {showButtons && (
        <>
          <CarouselButton onClick={previous} style={{ left: "10px" }}>
            {"<"}
          </CarouselButton>
          <CarouselButton onClick={next} style={{ right: "10px" }}>
            {">"}
          </CarouselButton>
        </>
      )}
    </CarouselImageContainer>
  );
}
