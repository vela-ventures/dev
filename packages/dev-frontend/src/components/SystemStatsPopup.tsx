import React, { useState, useRef } from "react";
import { Container } from "theme-ui";
import { Button } from "@/components/ui/button";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { Icon } from "./Icon";
import { SystemStats } from "./SystemStats";

const select = ({ total, price }: LiquityStoreState) => ({ total, price });

export const SystemStatsPopup: React.FC = () => {
  const { price, total } = useLiquitySelector(select);

  const [systemStatsOpen, setSystemStatsOpen] = useState(false);
  const systemStatsOverlayRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Button
        onClick={() => setSystemStatsOpen(!systemStatsOpen)}
        variant="icon"
        sx={{
          position: "relative",
          display: ["block", "none"]
        }}
      >
        <Icon name="info-circle" size="2x" />

        {total.collateralRatioIsBelowCritical(price) && (
          <div
            className="flex items-start justify-end"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "100%",
              height: "100%",
              paddingTop: "2px",
              color: "var(--theme-ui-colors-danger)"
            }}
          >
            <Icon name="exclamation-circle" size="xs" />
          </div>
        )}
      </Button>

      {systemStatsOpen && (
        <Container
          variant="infoOverlay"
          ref={systemStatsOverlayRef}
          onClick={e => {
            if (e.target === systemStatsOverlayRef.current) {
              setSystemStatsOpen(false);
            }
          }}
        >
          <SystemStats variant="infoPopup" showBalances />
        </Container>
      )}
    </>
  );
};
