import { AddressZero } from "@ethersproject/constants";
import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React from "react";
import { useLiquity } from "../hooks/LiquityContext";
import { LiquityLogo } from "./LiquityLogo";

import { Nav } from "./Nav";
import { SideBar } from "./SideBar";

const select = ({ frontend }: LiquityStoreState) => ({
  frontend
});

export const Header: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    config: { frontendTag }
  } = useLiquity();
  const { frontend } = useLiquitySelector(select);
  const isFrontendRegistered = frontendTag === AddressZero || frontend.status === "registered";

  return (
    <header className="fixed top-4 left-4 right-4 z-10 mx-auto max-w-[1280px] md:px-4 lg:px-8 md:left-0 md:right-0">
      <div className="bg-card text-card-foreground rounded-full border shadow-sm flex justify-between items-stretch px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center flex-1">
          <LiquityLogo />

          <div className="hidden md:block w-0 h-full border-l border-border mx-2 md:mx-4" />
          {isFrontendRegistered && (
            <>
              <SideBar />
              <Nav />
            </>
          )}
        </div>

        <div className="flex items-center">
          {children}
        </div>
      </div>
    </header>
  );
};
