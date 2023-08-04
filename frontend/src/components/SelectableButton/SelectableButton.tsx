import { Button } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

interface SelectableButtonProps {
  children?: ReactNode;
  onButtonClick: Function;
}

function SelectableButton({ children, onButtonClick }: SelectableButtonProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleButtonClick = () => {
    setIsChecked(!isChecked);
    onButtonClick(children as string);
  };

  return (
    <Button
      colorScheme={isChecked ? "blue" : "gray"}
      variant={isChecked ? "solid" : "outline"}
      onClick={handleButtonClick}
    >
      <span> {children} </span>
    </Button>
  );
}

export default SelectableButton;
