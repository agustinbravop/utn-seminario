import "./SelectableButton.css";

import { Button, Checkbox } from "@chakra-ui/react";
import { useState } from "react";

function SelectableButton({ children }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleButtonClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Button
      colorScheme={isChecked ? "blue" : "gray"}
      variant={isChecked ? "solid" : "outline"}
      onClick={handleButtonClick}
    >
      <span> {children} </span>
      <Checkbox isChecked={isChecked} size="0" />
    </Button>
  );
}

export default SelectableButton;
