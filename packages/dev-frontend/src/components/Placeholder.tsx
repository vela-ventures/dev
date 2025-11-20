import type { ThemeUIStyleObject } from "theme-ui";
import { keyframes } from "@emotion/react";

const loading = keyframes`
  from {
    left: -25%;
  }
  to {
    left: 100%;
  }
`;

type PlaceholderProps = { style?: ThemeUIStyleObject };

export const Placeholder: React.FC<PlaceholderProps> = ({ style }) => {
  return (
    <div
      className="flex relative overflow-hidden rounded h-full w-full"
      style={{
        backgroundColor: "rgb(225, 230, 230)",
        ...(style as React.CSSProperties)
      }}
    >
      <div
        className="absolute h-full"
        style={{
          left: "-25%",
          width: "45%",
          backgroundImage:
            "linear-gradient(to left, rgba(251,251,251, .05), rgba(251,251,251, .3), rgba(251,251,251, .6), rgba(251,251,251, .3), rgba(251,251,251, .05))",
          animation: `${loading} 1s infinite`
        }}
      />
      &nbsp;
    </div>
  );
};
