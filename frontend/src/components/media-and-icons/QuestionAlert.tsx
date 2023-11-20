import { QuestionImage } from "@/utils/constants";
import { StackProps, Text, VStack } from "@chakra-ui/react";

interface QuestionAlertProps extends StackProps {
  children?: React.ReactNode;
}

export default function QuestionAlert({
  children,
  ...props
}: QuestionAlertProps) {
  return (
    <VStack {...props}>
      <QuestionImage />
      {typeof children === "string" ? (
        <Text align="center">{children}</Text>
      ) : (
        children
      )}
    </VStack>
  );
}
