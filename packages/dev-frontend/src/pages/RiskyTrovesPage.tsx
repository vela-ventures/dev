import React from "react";
import { InfoMessage } from "../components/InfoMessage";
import { LiquidationManager } from "../components/LiquidationManager";
import { RiskyTroves } from "../components/RiskyTroves";
import { SystemStats } from "../components/SystemStats";

export const RiskyTrovesPage: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full items-start">
    <div className="mx-4 md:mx-0 md:col-span-3">
      <InfoMessage title="Bot functionality" margin={8}>
        <p>Liquidation is expected to be carried out by bots.</p>
        <p>
          Early on you may be able to manually liquidate Vaults, but as the system matures this
          will become less likely.
        </p>
      </InfoMessage>
      <LiquidationManager />
    </div>

    <div className="hidden md:block md:col-span-2">
      <SystemStats />
    </div>

    <div className="mx-4 md:mx-0 md:col-span-5">
      <RiskyTroves pageSize={10} />
    </div>
  </div>
);
