import { FC, CSSProperties, ReactNode } from "react";

import "./style.css";

type Prop = {
  contents: ReactNode;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  bgColor?: string;
  padding?: string;
};

export const Box: FC<Prop> = ({
  contents,
  borderColor,
  borderWidth,
  borderRadius,
  bgColor,
  padding,
}) => (
  <div
    className="box default-vars"
    style={
      {
        "--border-color": borderColor,
        "--border-width": borderWidth,
        "--border-radius": borderRadius,
        "--bg-color": bgColor,
        "--padding": padding,
      } as CSSProperties
    }
  >
    {contents.map((content) => (
      <div className="row">
        <div className="inner">{content}</div>
      </div>
    ))}
  </div>
);
