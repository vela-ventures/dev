import React from "react";

type AbbreviationProps = React.HTMLAttributes<HTMLSpanElement> & {
  short: React.ReactNode;
};

export const Abbreviation: React.FC<AbbreviationProps> = ({ children, short, className, ...props }) => (
  <span className={className} {...props}>
    <span className="hidden md:inline">
      {children}
    </span>

    <span className="inline md:hidden">
      {short}
    </span>
  </span>
);
