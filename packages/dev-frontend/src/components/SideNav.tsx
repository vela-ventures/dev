import React, { useRef, useState } from "react";
import { Box, Container } from "theme-ui";
import { Button } from "@/components/ui/button";
import { Icon } from "./Icon";
import { Link } from "./Link";
import { LiquityLogo } from "./LiquityLogo";

const logoHeight = "32px";

export const SideNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);

  if (!isVisible) {
    return (
      <Button sx={{ display: ["flex", "none"] }} variant="icon" onClick={() => setIsVisible(true)}>
        <Icon name="bars" size="lg" />
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
      <div className="flex flex-col" style={{ width: "75vw", height: "100vh", background: "white" }}>
        <Button
          sx={{ position: "fixed", right: "25vw", m: 2 }}
          variant="icon"
          onClick={() => setIsVisible(false)}
        >
          <Icon name="times" size="2x" />
        </Button>
        <LiquityLogo height={logoHeight} p={2} />
        <Box as="nav" sx={{ m: 3, mt: 1, p: 0 }} onClick={() => setIsVisible(false)}>
          <Link to="/">Dashboard</Link>
          <Link to="/bonds">Bonds</Link>
          <Link to="/risky-troves">Risky Vaults</Link>
        </Box>
      </div>
    </Container>
  );
};
