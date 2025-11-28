import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";

import { InfoIcon } from "lucide-react";
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
        variant="link"
        className="relative block md:hidden"
      >
        {total.collateralRatioIsBelowCritical(price) ? <InfoIcon color="red"/> : <InfoIcon/> }
      </Button>

      {systemStatsOpen && (
        <div
          ref={systemStatsOverlayRef}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={e => {
            if (e.target === systemStatsOverlayRef.current) {
              setSystemStatsOpen(false);
            }
          }}
        >
          <SystemStats variant="infoPopup" showBalances />
        </div>
      )}
    </>
  );
};
