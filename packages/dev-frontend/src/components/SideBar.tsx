import { Menu } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LiquityLogo } from "./LiquityLogo";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";

export const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="flex md:hidden"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[75vw] p-0">
          <SheetHeader className="flex flex-row items-center justify-between p-4 pb-0 space-y-0">
            <LiquityLogo />
          </SheetHeader>
          <div className="flex h-full flex-col p-4 pt-4">
            <nav className="flex flex-col" onClick={() => setIsOpen(false)}>
              <NavLink
                to="/"
                exact
                className="rounded-md px-3 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/risky-troves"
                className="rounded-md px-3 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Risky Vaults
              </NavLink>
              <NavLink
                to="/faucet"
                className="rounded-md px-3 py-2 text-xl font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Faucet
              </NavLink>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
