import React from "react";

type ButtonProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function Button({ style, children }: ButtonProps) {
  return <button style={style}>{children}</button>;
}
export default Button;
