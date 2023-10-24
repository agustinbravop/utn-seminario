import { QuestionImage } from "@/utils/constants";
import { StackProps, VStack } from "@chakra-ui/react";

interface QuestionAlertProps extends StackProps {
  children?: React.ReactNode;
}

export default function QuestionAlert({ children, ...props }: QuestionAlertProps) {
  return (
    <VStack {...props}>
      <QuestionImage />
      {children}
    </VStack>
  );
}
