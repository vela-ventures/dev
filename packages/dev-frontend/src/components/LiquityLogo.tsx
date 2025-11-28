import React from "react";

type LiquityLogoProps = React.HTMLAttributes<HTMLDivElement>;

export const LiquityLogo: React.FC<LiquityLogoProps> = () => (
  <img src="./favicon.png" className="h-8" alt="Liquity" />
);
