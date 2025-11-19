import React from "react";

export const Badge: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="flex">{children}</div>;
};
