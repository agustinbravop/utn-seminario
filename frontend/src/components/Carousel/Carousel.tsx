import { useEffect, useState } from "react";
import styled from "styled-components";

const CarouselImg = styled.img`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: 1s;
  border-radius: 12px;
  object-fit: cover;
  &.loaded {
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
    transition: .5s ease;
`;

interface Props {
  images: string[];
  autoPlay?: boolean;
  showButtons?: boolean;
}

export default function Carousel(props: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(props.images[0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (props.autoPlay || !props.showButtons) {
      const interval = setInterval(() => {
        selectNewImage(selectedIndex, props.images);
      }, 2500);
      return () => clearInterval(interval);
    }
  });

  const selectNewImage = (index: number, images: string[], next = true) => {
    setLoaded(false);
    setTimeout(() => {
      const condition = next ? selectedIndex < images.length - 1 : selectedIndex > 0;
      const nextIndex = next ? (condition ? selectedIndex + 1 : 0) : condition ? selectedIndex - 1 : images.length - 1;
      setSelectedImage(images[nextIndex]);
      setSelectedIndex(nextIndex);
    }, 500);
  };

  const previous = () => {
    selectNewImage(selectedIndex, props.images, false);
  };

  const next = () => {
    selectNewImage(selectedIndex, props.images);
  };
  return (
    <>
    <CarouselImageContainer>
        <CarouselImg
            src={selectedImage}
            alt="ImagenCarousel"
            className={loaded ? "loaded" : ""}
            onLoad={() => setLoaded(true)}
        />
            {props.showButtons ? (
            <>
                <CarouselButton onClick={previous} style={{left:"10px",}}>{"<"}</CarouselButton>
                <CarouselButton onClick={next} style={{right:"10px",}}>{">"}</CarouselButton>
            </>
            ) : (
            <></>
            )}
    
    </CarouselImageContainer>
      
    </>
  );
}