import { Menu, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Box, Container, Flex } from "theme-ui";
import { Link } from "./Link";
import { LiquityLogo } from "./LiquityLogo";
import { Button } from "./ui/button";

const logoHeight = "32px";

export const SideNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);

  if (!isVisible) {
    return (
      <Button className="flex md:hidden" variant="ghost" size="icon" onClick={() => setIsVisible(true)}>
        <Menu/>
      </Button>
    );
  }
  return (
    <Container
      variant="infoOverlay"
      ref={overlay}
      onClick={e => {
        if (e.target === overlay.current) {
          setIsVisible(false);
        }
      }}
    >
      <Flex variant="layout.sidenav">
        <Button
          className="fixed right-[25vw] m-2"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
        >
          <XIcon/>
        </Button>
        <LiquityLogo height={logoHeight} p={2} />
        <Box as="nav" sx={{ m: 3, mt: 1, p: 0 }} onClick={() => setIsVisible(false)}>
          <Link to="/">Dashboard</Link>
          <Link to="/risky-troves">Risky Vaults</Link>
          <Link to="/faucet">Faucet</Link>
        </Box>
      </Flex>
    </Container>
  );
};
