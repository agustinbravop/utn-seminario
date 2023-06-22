import React from "react";

type TitleProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function Title({ style, children }: TitleProps) {
  return <h1 style={style}>{children}</h1>;
}
export default Title;
